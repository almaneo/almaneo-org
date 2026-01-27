/**
 * Content Service - Client-side cache layer for DB-driven content
 *
 * Queries Supabase directly (no API route needed).
 * Uses localStorage persistence and stale-while-revalidate pattern.
 */

import { supabase } from './supabase';
import type { Region, Country, Quest, QuestData, RegionId } from './worldTravel/types';

// --- DB Row Types ---

interface DBRegion {
  id: string;
  emoji: string;
  color: string;
  unlock_requirement: number;
  sort_order: number;
  is_active: boolean;
}

interface DBCountry {
  id: string;
  region_id: string;
  flag: string;
  sort_order: number;
  is_active: boolean;
}

interface DBQuest {
  id: string;
  country_id: string;
  type: string;
  difficulty: string;
  points: number;
  quest_data: QuestData;
  sort_order: number;
  is_active: boolean;
}

interface TranslationRow {
  content_type: string;
  content_id: string;
  translations: Record<string, unknown>;
}

// --- Cache ---

interface CachedContent {
  language: string;
  regions: Region[];
  countries: Country[];
  fetchedAt: number;
}

const CACHE_KEY = 'almaneo-content-cache';
const CACHE_MAX_AGE = 60 * 60 * 1000; // 1 hour

// --- Service ---

class ContentService {
  private cache: CachedContent | null = null;
  private fetchPromise: Promise<CachedContent> | null = null;

  /**
   * Get all content for a language.
   * Returns cached data if fresh, otherwise fetches from DB.
   */
  async fetchAllContent(lang: string): Promise<{ regions: Region[]; countries: Country[] }> {
    // Return memory cache if fresh and same language
    if (this.cache && this.cache.language === lang && !this.isStale(this.cache)) {
      return { regions: this.cache.regions, countries: this.cache.countries };
    }

    // Try localStorage cache
    const stored = this.loadFromStorage(lang);
    if (stored && !this.isStale(stored)) {
      this.cache = stored;
      return { regions: stored.regions, countries: stored.countries };
    }

    // If stale cache exists, return it immediately and refresh in background
    if (stored || (this.cache && this.cache.language === lang)) {
      const stale = stored || this.cache!;
      this.cache = stale;
      this.refreshInBackground(lang);
      return { regions: stale.regions, countries: stale.countries };
    }

    // No cache at all - must fetch
    return this.fetchFresh(lang);
  }

  /**
   * Get cached countries (synchronous, returns empty if not loaded)
   */
  getCountries(): Country[] {
    return this.cache?.countries || [];
  }

  /**
   * Get cached regions (synchronous, returns empty if not loaded)
   */
  getRegions(): Region[] {
    return this.cache?.regions || [];
  }

  /**
   * Get quests for a specific country
   */
  getQuests(countryId: string): Quest[] {
    const country = this.cache?.countries.find(c => c.id === countryId);
    return country?.quests || [];
  }

  /**
   * Get a specific country by ID
   */
  getCountry(countryId: string): Country | undefined {
    return this.cache?.countries.find(c => c.id === countryId);
  }

  /**
   * Check if content has been loaded
   */
  isLoaded(): boolean {
    return this.cache !== null && this.cache.countries.length > 0;
  }

  /**
   * Get current cached language
   */
  getCurrentLanguage(): string | null {
    return this.cache?.language || null;
  }

  /**
   * Force invalidate cache and refetch
   */
  async invalidateCache(lang?: string): Promise<void> {
    this.cache = null;
    this.fetchPromise = null;
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(CACHE_KEY);
      }
    } catch {
      // ignore localStorage errors
    }
    if (lang) {
      await this.fetchFresh(lang);
    }
  }

  // --- Internal ---

  private isStale(cached: CachedContent): boolean {
    return Date.now() - cached.fetchedAt > CACHE_MAX_AGE;
  }

  private async fetchFresh(lang: string): Promise<{ regions: Region[]; countries: Country[] }> {
    // Deduplicate concurrent requests
    if (this.fetchPromise) {
      const result = await this.fetchPromise;
      return { regions: result.regions, countries: result.countries };
    }

    this.fetchPromise = this.doFetch(lang);
    try {
      const result = await this.fetchPromise;
      this.cache = result;
      this.saveToStorage(result);
      return { regions: result.regions, countries: result.countries };
    } finally {
      this.fetchPromise = null;
    }
  }

  private refreshInBackground(lang: string): void {
    this.doFetch(lang)
      .then(result => {
        this.cache = result;
        this.saveToStorage(result);
      })
      .catch(err => {
        console.warn('Background content refresh failed:', err);
      });
  }

  /**
   * Fetch content directly from Supabase (no API route).
   * Mirrors the logic from the old /api/content route.
   */
  private async doFetch(lang: string): Promise<CachedContent> {
    // Fetch all data in parallel
    const [regionsRes, countriesRes, questsRes, translationsEnRes, translationsLangRes] =
      await Promise.all([
        supabase
          .from('regions')
          .select('*')
          .eq('is_active', true)
          .order('sort_order'),
        supabase
          .from('countries')
          .select('*')
          .eq('is_active', true)
          .order('sort_order'),
        supabase
          .from('quests')
          .select('*')
          .eq('is_active', true)
          .order('sort_order'),
        // Always fetch English translations as fallback
        supabase
          .from('content_translations')
          .select('content_type, content_id, translations')
          .eq('language', 'en'),
        // Fetch requested language translations (if different from en)
        lang !== 'en'
          ? supabase
              .from('content_translations')
              .select('content_type, content_id, translations')
              .eq('language', lang)
          : Promise.resolve({ data: [] as TranslationRow[], error: null }),
      ]);

    // Check for errors
    for (const res of [regionsRes, countriesRes, questsRes, translationsEnRes]) {
      if (res.error) {
        console.error('Supabase query error:', res.error);
        throw new Error('Failed to fetch content from database');
      }
    }

    const dbRegions = (regionsRes.data || []) as DBRegion[];
    const dbCountries = (countriesRes.data || []) as DBCountry[];
    const dbQuests = (questsRes.data || []) as DBQuest[];

    // Build translation lookup maps
    const enMap = this.buildTranslationMap((translationsEnRes.data || []) as TranslationRow[]);
    const langMap = this.buildTranslationMap((translationsLangRes.data || []) as TranslationRow[]);

    // Merge translations into regions
    const regions: Region[] = dbRegions.map(r => ({
      id: r.id as RegionId,
      name: this.getTranslation(langMap, enMap, 'region', r.id, 'name') || r.id,
      emoji: r.emoji,
      color: r.color,
      unlockRequirement: r.unlock_requirement,
      countries: dbCountries
        .filter(c => c.region_id === r.id)
        .map(c => c.id),
    }));

    // Merge translations into countries + quests
    const countries: Country[] = dbCountries.map(c => {
      const enTrans = (enMap[`country:${c.id}`]?.translations || {}) as Record<string, string>;
      const langTrans = (langMap[`country:${c.id}`]?.translations || {}) as Record<string, string>;
      const merged = { ...enTrans, ...langTrans };

      const countryQuests: Quest[] = dbQuests
        .filter(q => q.country_id === c.id)
        .map(q => {
          const qEnTrans = (enMap[`quest:${q.id}`]?.translations || {}) as Record<string, unknown>;
          const qLangTrans = (langMap[`quest:${q.id}`]?.translations || {}) as Record<string, unknown>;

          return {
            id: q.id,
            countryId: q.country_id,
            type: q.type as Quest['type'],
            difficulty: q.difficulty as Quest['difficulty'],
            title: (qLangTrans.title || qEnTrans.title || q.id) as string,
            points: q.points,
            data: (qLangTrans.quest_data || qEnTrans.quest_data || q.quest_data) as QuestData,
          };
        });

      return {
        id: c.id,
        name: merged.name || c.id,
        localName: merged.localName || merged.name || c.id,
        flag: c.flag,
        region: c.region_id as RegionId,
        greeting: merged.greeting || '',
        culturalValue: merged.culturalValue || '',
        description: merged.description || '',
        quests: countryQuests,
      };
    });

    return {
      language: lang,
      regions,
      countries,
      fetchedAt: Date.now(),
    };
  }

  private buildTranslationMap(
    rows: TranslationRow[]
  ): Record<string, TranslationRow> {
    const map: Record<string, TranslationRow> = {};
    for (const row of rows) {
      map[`${row.content_type}:${row.content_id}`] = row;
    }
    return map;
  }

  private getTranslation(
    langMap: Record<string, TranslationRow>,
    enMap: Record<string, TranslationRow>,
    type: string,
    id: string,
    field: string
  ): string | undefined {
    const key = `${type}:${id}`;
    const langVal = langMap[key]?.translations?.[field];
    if (langVal) return String(langVal);
    const enVal = enMap[key]?.translations?.[field];
    if (enVal) return String(enVal);
    return undefined;
  }

  private loadFromStorage(lang: string): CachedContent | null {
    try {
      if (typeof localStorage === 'undefined') return null;
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as CachedContent;
      if (parsed.language !== lang) return null;
      return parsed;
    } catch {
      return null;
    }
  }

  private saveToStorage(content: CachedContent): void {
    try {
      if (typeof localStorage === 'undefined') return;
      localStorage.setItem(CACHE_KEY, JSON.stringify(content));
    } catch {
      // ignore quota errors
    }
  }
}

// Singleton instance
export const contentService = new ContentService();
