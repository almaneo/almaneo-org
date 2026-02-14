/**
 * AlmaChat Translation Cache
 *
 * Uses Supabase PostgreSQL with SHA256 hash for deduplication.
 * Expected 30-50% cost savings from cache hits.
 *
 * Table: translation_cache
 * Key: (source_lang, target_lang, source_hash)
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let supabase: SupabaseClient | null = null;

function getSupabase(): SupabaseClient {
  if (!supabase) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY;
    if (!url || !key) {
      throw new Error('SUPABASE_URL and SUPABASE_SERVICE_KEY are required');
    }
    supabase = createClient(url, key);
  }
  return supabase;
}

/**
 * Generate SHA256 hash of text for cache key
 */
async function sha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Check cache for existing translation
 * Returns translated text if found, null if cache miss
 */
export async function checkCache(
  sourceText: string,
  sourceLang: string,
  targetLang: string,
): Promise<string | null> {
  try {
    const db = getSupabase();
    const hash = await sha256(sourceText.trim().toLowerCase());

    const { data, error } = await db
      .from('translation_cache')
      .select('translated_text')
      .eq('source_lang', sourceLang)
      .eq('target_lang', targetLang)
      .eq('source_hash', hash)
      .maybeSingle();

    if (error) {
      console.error('[Cache] Lookup error:', error.message);
      return null;
    }

    if (data) {
      // Increment hit count atomically via RPC (fire and forget)
      db.rpc('increment_cache_hit', {
        p_source_lang: sourceLang,
        p_target_lang: targetLang,
        p_source_hash: hash,
      }).then(({ error: rpcError }) => {
        if (rpcError) {
          console.warn('[Cache] RPC increment failed:', rpcError.message);
        }
      });

      return data.translated_text;
    }

    return null;
  } catch (err) {
    console.error('[Cache] Error:', err);
    return null;
  }
}

/**
 * Save translation to cache
 */
export async function saveCache(
  sourceText: string,
  sourceLang: string,
  targetLang: string,
  translatedText: string,
  modelUsed?: string,
): Promise<void> {
  try {
    const db = getSupabase();
    const hash = await sha256(sourceText.trim().toLowerCase());

    const { error } = await db.from('translation_cache').upsert(
      {
        source_lang: sourceLang,
        target_lang: targetLang,
        source_hash: hash,
        source_text: sourceText,
        translated_text: translatedText,
        model_used: modelUsed || 'unknown',
        hit_count: 1,
      },
      {
        onConflict: 'source_lang,target_lang,source_hash',
      },
    );

    if (error) {
      console.error('[Cache] Save error:', error.message);
    }
  } catch (err) {
    console.error('[Cache] Error:', err);
  }
}

/**
 * Get cache statistics
 */
export async function getCacheStats(): Promise<{
  totalEntries: number;
  totalHits: number;
  topLanguagePairs: Array<{ pair: string; count: number }>;
}> {
  try {
    const db = getSupabase();

    const { count } = await db
      .from('translation_cache')
      .select('*', { count: 'exact', head: true });

    const { data: hitData } = await db
      .from('translation_cache')
      .select('hit_count')
      .order('hit_count', { ascending: false })
      .limit(100);

    const totalHits = hitData?.reduce((sum, row) => sum + (row.hit_count || 0), 0) || 0;

    return {
      totalEntries: count || 0,
      totalHits,
      topLanguagePairs: [],
    };
  } catch {
    return { totalEntries: 0, totalHits: 0, topLanguagePairs: [] };
  }
}
