/**
 * World Travel System - Type Definitions
 * 세계문화여행 게임 타입 정의
 */

// ============ Region & Country ============

export type RegionId =
  | 'east_asia'
  | 'southeast_asia'
  | 'south_asia'
  | 'middle_east'
  | 'europe'
  | 'africa'
  | 'americas'
  | 'oceania';

export interface Region {
  id: RegionId;
  name: string;
  emoji: string;
  color: string; // theme color for the region card
  unlockRequirement: number; // total stars needed to unlock
  countries: string[]; // country ids
}

export type CountryId = string; // e.g. 'kr', 'jp', 'us'

export interface Country {
  id: CountryId;
  name: string;
  localName: string; // native name e.g. 대한민국
  flag: string; // emoji flag
  region: RegionId;
  greeting: string; // local greeting
  culturalValue: string; // main cultural value
  description: string; // short description
  quests: Quest[];
}

// ============ Quest Types ============

export type QuestType =
  | 'cultural_scenario' // left/right choice (kindness)
  | 'trivia_quiz'       // multiple choice knowledge
  | 'cultural_practice' // learn & do (tap-based)
  | 'history_lesson';   // read & answer

export type QuestDifficulty = 'easy' | 'medium' | 'hard';

export interface Quest {
  id: string; // e.g. 'kr-q1'
  countryId: CountryId;
  type: QuestType;
  difficulty: QuestDifficulty;
  title: string;
  points: number; // base points reward
  data: QuestData;
}

// Union type for quest data
export type QuestData =
  | CulturalScenarioData
  | TriviaQuizData
  | CulturalPracticeData
  | HistoryLessonData;

// --- Cultural Scenario (left/right choice) ---
export interface CulturalScenarioData {
  type: 'cultural_scenario';
  culturalValue: string;
  situation: string;
  options: {
    left: { text: string; isKind: boolean };
    right: { text: string; isKind: boolean };
  };
  explanation: string;
}

// --- Trivia Quiz (multiple choice) ---
export interface TriviaQuizData {
  type: 'trivia_quiz';
  question: string;
  choices: string[]; // 4 choices
  correctIndex: number; // 0-3
  explanation: string;
}

// --- Cultural Practice (tap-based mini interaction) ---
export interface CulturalPracticeData {
  type: 'cultural_practice';
  instruction: string;
  steps: string[];
  tapsRequired: number;
  completionMessage: string;
}

// --- History Lesson (read & answer) ---
export interface HistoryLessonData {
  type: 'history_lesson';
  story: string;
  question: string;
  choices: string[];
  correctIndex: number;
  funFact: string;
}

// ============ Progress Tracking ============

export interface CountryProgress {
  countryId: CountryId;
  questResults: Record<string, QuestResult>; // questId -> result
  stars: number; // 0-3
  firstVisitedAt?: string;
  completedAt?: string;
}

export interface QuestResult {
  questId: string;
  completed: boolean;
  correct: boolean; // first attempt correct
  completedAt?: string;
  attempts: number;
}

export type StarRating = 0 | 1 | 2 | 3;

// Star calculation:
// 0 stars: < 50% quests completed
// 1 star:  >= 50% quests completed
// 2 stars: 100% quests completed
// 3 stars: 100% + all correct on first attempt

export interface RegionProgress {
  regionId: RegionId;
  unlocked: boolean;
  totalStars: number;
}

// ============ Travel State (Store) ============

export interface TravelState {
  // Current view
  currentView: 'world_map' | 'country' | 'quest';
  selectedCountryId: CountryId | null;
  selectedQuestId: string | null;

  // Progress
  countryProgress: Record<CountryId, CountryProgress>;
  regionProgress: Record<RegionId, RegionProgress>;

  // Stats
  totalStars: number;
  totalQuestsCompleted: number;
  countriesVisited: number;
  perfectCountries: number; // 3-star countries

  // Starting region (based on browser locale)
  startingRegion: RegionId;
}

// ============ Helpers ============

export function calculateStars(country: Country, progress: CountryProgress): StarRating {
  const totalQuests = country.quests.length;
  if (totalQuests === 0) return 0;

  const completedQuests = Object.values(progress.questResults).filter(r => r.completed).length;
  const allCorrectFirstTry = Object.values(progress.questResults).every(r => r.completed && r.correct);

  const completionRate = completedQuests / totalQuests;

  if (completionRate >= 1 && allCorrectFirstTry) return 3;
  if (completionRate >= 1) return 2;
  if (completionRate >= 0.5) return 1;
  return 0;
}

export function getRegionForLocale(locale: string): RegionId {
  const lang = locale.split('-')[0].toLowerCase();
  const regionMap: Record<string, RegionId> = {
    ko: 'east_asia',
    ja: 'east_asia',
    zh: 'east_asia',
    th: 'southeast_asia',
    vi: 'southeast_asia',
    id: 'southeast_asia',
    ms: 'southeast_asia',
    km: 'southeast_asia',
    hi: 'south_asia',
    bn: 'south_asia',
    ar: 'middle_east',
    tr: 'middle_east',
    fr: 'europe',
    de: 'europe',
    es: 'americas',
    pt: 'americas',
    en: 'americas',
    sw: 'africa',
  };
  return regionMap[lang] || 'east_asia';
}
