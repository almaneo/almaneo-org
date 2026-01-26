/**
 * World Travel Progression System
 * 지역 언락, 별 계산, 진행도 관리
 */

import { REGIONS } from './regions';
import { calculateStars } from './types';
import type {
  RegionId,
  CountryId,
  Country,
  CountryProgress,
  RegionProgress,
  StarRating,
  QuestResult,
} from './types';

// Points awarded for quest completion
export const QUEST_POINTS = {
  easy: 50,
  medium: 80,
  hard: 120,
  // Bonus for first-attempt correct answer
  firstAttemptBonus: 20,
  // Bonus for completing all quests in a country
  countryCompleteBonus: 100,
  // Bonus for 3-star country
  perfectCountryBonus: 200,
} as const;

/**
 * Check which regions are unlocked based on total stars
 */
export function getUnlockedRegions(
  totalStars: number,
  startingRegion: RegionId
): Record<RegionId, boolean> {
  const result: Record<string, boolean> = {};

  for (const region of REGIONS) {
    if (region.id === startingRegion) {
      // Starting region is always unlocked
      result[region.id] = true;
    } else {
      result[region.id] = totalStars >= region.unlockRequirement;
    }
  }

  return result as Record<RegionId, boolean>;
}

/**
 * Get the next region to unlock and stars needed
 */
export function getNextRegionToUnlock(
  totalStars: number,
  startingRegion: RegionId
): { region: typeof REGIONS[number]; starsNeeded: number } | null {
  const sorted = [...REGIONS]
    .filter(r => r.id !== startingRegion)
    .sort((a, b) => a.unlockRequirement - b.unlockRequirement);

  for (const region of sorted) {
    if (totalStars < region.unlockRequirement) {
      return {
        region,
        starsNeeded: region.unlockRequirement - totalStars,
      };
    }
  }

  return null; // All regions unlocked
}

/**
 * Calculate total stars from country progress
 */
export function calculateTotalStars(
  countryProgress: Record<CountryId, CountryProgress>
): number {
  return Object.values(countryProgress).reduce(
    (sum, cp) => sum + cp.stars,
    0
  );
}

/**
 * Calculate stats from country progress
 */
export function calculateTravelStats(
  countryProgress: Record<CountryId, CountryProgress>
) {
  const entries = Object.values(countryProgress);

  return {
    totalStars: entries.reduce((sum, cp) => sum + cp.stars, 0),
    totalQuestsCompleted: entries.reduce(
      (sum, cp) =>
        sum + Object.values(cp.questResults).filter(r => r.completed).length,
      0
    ),
    countriesVisited: entries.filter(cp => cp.firstVisitedAt).length,
    perfectCountries: entries.filter(cp => cp.stars === 3).length,
  };
}

/**
 * Create initial empty progress for a country
 */
export function createEmptyCountryProgress(countryId: CountryId): CountryProgress {
  return {
    countryId,
    questResults: {},
    stars: 0,
    firstVisitedAt: new Date().toISOString(),
  };
}

/**
 * Record a quest result and recalculate stars
 */
export function recordQuestResult(
  country: Country,
  progress: CountryProgress,
  questId: string,
  correct: boolean
): {
  updatedProgress: CountryProgress;
  pointsEarned: number;
  newStars: StarRating;
  countryJustCompleted: boolean;
  countryJustPerfected: boolean;
} {
  const quest = country.quests.find(q => q.id === questId);
  if (!quest) throw new Error(`Quest ${questId} not found in country ${country.id}`);

  const existingResult = progress.questResults[questId];
  const isFirstAttempt = !existingResult || existingResult.attempts === 0;

  // Create or update quest result
  const questResult: QuestResult = {
    questId,
    completed: true,
    correct: isFirstAttempt ? correct : (existingResult?.correct || false),
    completedAt: new Date().toISOString(),
    attempts: (existingResult?.attempts || 0) + 1,
  };

  // Update progress
  const updatedResults = {
    ...progress.questResults,
    [questId]: questResult,
  };

  const updatedProgress: CountryProgress = {
    ...progress,
    questResults: updatedResults,
  };

  // Calculate new stars
  const newStars: StarRating = calculateStars(country, updatedProgress);
  updatedProgress.stars = newStars;

  // Check if country just completed (all quests done)
  const allCompleted = country.quests.every(
    q => updatedResults[q.id]?.completed
  );
  const wasAlreadyCompleted = country.quests.every(
    q => progress.questResults[q.id]?.completed
  );
  const countryJustCompleted = allCompleted && !wasAlreadyCompleted;

  if (allCompleted && !updatedProgress.completedAt) {
    updatedProgress.completedAt = new Date().toISOString();
  }

  // Check if country just perfected (3 stars)
  const countryJustPerfected = newStars === 3 && progress.stars < 3;

  // Calculate points earned
  let pointsEarned = quest.points;
  if (correct && isFirstAttempt) {
    pointsEarned += QUEST_POINTS.firstAttemptBonus;
  }
  if (countryJustCompleted) {
    pointsEarned += QUEST_POINTS.countryCompleteBonus;
  }
  if (countryJustPerfected) {
    pointsEarned += QUEST_POINTS.perfectCountryBonus;
  }

  return {
    updatedProgress,
    pointsEarned,
    newStars,
    countryJustCompleted,
    countryJustPerfected,
  };
}
