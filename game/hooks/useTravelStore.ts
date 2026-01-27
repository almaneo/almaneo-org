import { create } from 'zustand';
import type {
  TravelState,
  RegionId,
  CountryId,
  CountryProgress,
  RegionProgress,
  StarRating,
  Country,
  Region,
} from '@/lib/worldTravel/types';
import { getRegionForLocale, calculateStars } from '@/lib/worldTravel/types';
import { REGIONS } from '@/lib/worldTravel/regions';
import { ALL_COUNTRIES } from '@/lib/worldTravel/countries';
import {
  getUnlockedRegions,
  calculateTravelStats,
  createEmptyCountryProgress,
  recordQuestResult,
  QUEST_POINTS,
} from '@/lib/worldTravel/progression';
import { contentService } from '@/lib/contentService';

// --- Dynamic content (module-level to avoid re-renders) ---

let dynamicCountries: Country[] | null = null;
let dynamicRegions: Region[] | null = null;

/** Returns DB-loaded countries if available, else static fallback */
function getActiveCountries(): Country[] {
  return dynamicCountries || ALL_COUNTRIES;
}

/** Returns DB-loaded regions if available, else static fallback */
function getActiveRegions(): Region[] {
  return dynamicRegions || REGIONS;
}

// ---

interface TravelStore extends TravelState {
  // Navigation
  openWorldMap: () => void;
  selectCountry: (countryId: CountryId) => void;
  selectQuest: (questId: string) => void;
  goBack: () => void;

  // Quest completion
  completeQuest: (questId: string, correct: boolean) => number; // returns points earned

  // Data access
  getCountry: (countryId: CountryId) => Country | undefined;
  getCountryProgress: (countryId: CountryId) => CountryProgress;
  isRegionUnlocked: (regionId: RegionId) => boolean;
  getCountryStars: (countryId: CountryId) => StarRating;

  // Persistence
  loadTravelState: (saved: Partial<TravelState>) => void;
  exportTravelState: () => Partial<TravelState>;

  // Init
  initialize: () => void;

  // Dynamic content loading
  contentLoaded: boolean;
  initializeContent: (lang: string) => Promise<void>;
}

function detectStartingRegion(): RegionId {
  if (typeof navigator !== 'undefined') {
    const locale = navigator.language || 'en';
    return getRegionForLocale(locale);
  }
  return 'east_asia';
}

function buildRegionProgress(
  countryProgress: Record<CountryId, CountryProgress>,
  startingRegion: RegionId
): Record<RegionId, RegionProgress> {
  const totalStars = Object.values(countryProgress).reduce(
    (sum, cp) => sum + cp.stars,
    0
  );
  const unlocked = getUnlockedRegions(totalStars, startingRegion);

  const result: Record<string, RegionProgress> = {};
  for (const region of getActiveRegions()) {
    const regionCountryStars = region.countries.reduce((sum, cId) => {
      return sum + (countryProgress[cId]?.stars || 0);
    }, 0);

    result[region.id] = {
      regionId: region.id as RegionId,
      unlocked: unlocked[region.id as RegionId],
      totalStars: regionCountryStars,
    };
  }

  return result as Record<RegionId, RegionProgress>;
}

export const useTravelStore = create<TravelStore>((set, get) => ({
  // Initial state
  currentView: 'world_map',
  selectedCountryId: null,
  selectedQuestId: null,
  countryProgress: {},
  regionProgress: {} as Record<RegionId, RegionProgress>,
  totalStars: 0,
  totalQuestsCompleted: 0,
  countriesVisited: 0,
  perfectCountries: 0,
  startingRegion: 'east_asia',
  contentLoaded: false,

  // --- Navigation ---

  openWorldMap: () => {
    set({
      currentView: 'world_map',
      selectedCountryId: null,
      selectedQuestId: null,
    });
  },

  selectCountry: (countryId: CountryId) => {
    const state = get();
    // Ensure country progress exists
    if (!state.countryProgress[countryId]) {
      const updated = {
        ...state.countryProgress,
        [countryId]: createEmptyCountryProgress(countryId),
      };
      const stats = calculateTravelStats(updated);
      set({
        currentView: 'country',
        selectedCountryId: countryId,
        selectedQuestId: null,
        countryProgress: updated,
        ...stats,
        regionProgress: buildRegionProgress(updated, state.startingRegion),
      });
    } else {
      set({
        currentView: 'country',
        selectedCountryId: countryId,
        selectedQuestId: null,
      });
    }
  },

  selectQuest: (questId: string) => {
    set({
      currentView: 'quest',
      selectedQuestId: questId,
    });
  },

  goBack: () => {
    const { currentView } = get();
    if (currentView === 'quest') {
      set({ currentView: 'country', selectedQuestId: null });
    } else if (currentView === 'country') {
      set({ currentView: 'world_map', selectedCountryId: null });
    }
  },

  // --- Quest Completion ---

  completeQuest: (questId: string, correct: boolean): number => {
    const state = get();
    const { selectedCountryId, countryProgress } = state;
    if (!selectedCountryId) return 0;

    const country = getActiveCountries().find(c => c.id === selectedCountryId);
    if (!country) return 0;

    const progress =
      countryProgress[selectedCountryId] ||
      createEmptyCountryProgress(selectedCountryId);

    const result = recordQuestResult(country, progress, questId, correct);

    const updatedCountryProgress = {
      ...countryProgress,
      [selectedCountryId]: result.updatedProgress,
    };

    const stats = calculateTravelStats(updatedCountryProgress);

    set({
      countryProgress: updatedCountryProgress,
      ...stats,
      regionProgress: buildRegionProgress(
        updatedCountryProgress,
        state.startingRegion
      ),
    });

    return result.pointsEarned;
  },

  // --- Data Access ---

  getCountry: (countryId: CountryId) => {
    return getActiveCountries().find(c => c.id === countryId);
  },

  getCountryProgress: (countryId: CountryId) => {
    return (
      get().countryProgress[countryId] || {
        countryId,
        questResults: {},
        stars: 0 as StarRating,
      }
    );
  },

  isRegionUnlocked: (regionId: RegionId) => {
    const { regionProgress } = get();
    return regionProgress[regionId]?.unlocked ?? false;
  },

  getCountryStars: (countryId: CountryId): StarRating => {
    return (get().countryProgress[countryId]?.stars || 0) as StarRating;
  },

  // --- Persistence ---

  loadTravelState: (saved: Partial<TravelState>) => {
    const startingRegion = saved.startingRegion || detectStartingRegion();
    const countryProgress = saved.countryProgress || {};
    const stats = calculateTravelStats(countryProgress);

    set({
      countryProgress,
      startingRegion,
      ...stats,
      regionProgress: buildRegionProgress(countryProgress, startingRegion),
      // Reset navigation
      currentView: 'world_map',
      selectedCountryId: null,
      selectedQuestId: null,
    });
  },

  exportTravelState: () => {
    const { countryProgress, startingRegion } = get();
    return { countryProgress, startingRegion };
  },

  // --- Init ---

  initialize: () => {
    const startingRegion = detectStartingRegion();
    const regionProgress = buildRegionProgress({}, startingRegion);

    set({
      startingRegion,
      regionProgress,
      currentView: 'world_map',
      selectedCountryId: null,
      selectedQuestId: null,
      countryProgress: {},
      totalStars: 0,
      totalQuestsCompleted: 0,
      countriesVisited: 0,
      perfectCountries: 0,
    });
  },

  // --- Dynamic Content Loading ---

  initializeContent: async (lang: string) => {
    try {
      const { regions, countries } = await contentService.fetchAllContent(lang);

      if (regions.length > 0) dynamicRegions = regions;
      if (countries.length > 0) dynamicCountries = countries;

      // Rebuild region progress with potentially updated region data
      const state = get();
      const regionProgress = buildRegionProgress(
        state.countryProgress,
        state.startingRegion
      );

      set({ contentLoaded: true, regionProgress });
    } catch (err) {
      console.warn('Failed to load dynamic content, using static fallback:', err);
      // Static data is still available, so the app works without DB
      set({ contentLoaded: false });
    }
  },
}));
