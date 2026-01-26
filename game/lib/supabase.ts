/**
 * Supabase Client for AlmaNEO Kindness Game
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a dummy client for build time when env vars are not set
let supabaseClient: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey) {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn('⚠️ Supabase environment variables not set - using mock client');
}

// Export a proxy that handles the case when client is not initialized
export const supabase = new Proxy({} as SupabaseClient, {
  get: (_target, prop) => {
    if (!supabaseClient) {
      // Return a mock function that returns empty data during build
      if (prop === 'from') {
        return () => ({
          select: () => ({
            eq: () => ({
              maybeSingle: () => Promise.resolve({ data: null, error: null }),
              single: () => Promise.resolve({ data: null, error: null }),
              limit: () => Promise.resolve({ data: [], error: null }),
              order: () => ({ limit: () => Promise.resolve({ data: [], error: null }) }),
            }),
            order: () => ({ limit: () => Promise.resolve({ data: [], error: null }) }),
            limit: () => Promise.resolve({ data: [], error: null }),
          }),
          insert: () => Promise.resolve({ data: null, error: null }),
          update: () => ({ eq: () => Promise.resolve({ data: null, error: null }) }),
          upsert: () => Promise.resolve({ data: null, error: null }),
        });
      }
      if (prop === 'channel') {
        return () => ({
          on: () => ({ subscribe: () => ({}) }),
        });
      }
      if (prop === 'removeChannel') {
        return () => Promise.resolve();
      }
      return () => {};
    }
    return (supabaseClient as unknown as Record<string | symbol, unknown>)[prop];
  },
});

// Database types
export interface GameState {
  id: string;
  wallet_address: string;
  points: number;
  total_points: number;
  energy: number;
  max_energy: number;
  level: number;
  upgrades: UserUpgrades;
  daily_quests: DailyQuest[];
  daily_quest_stats: DailyQuestStats;
  achievements: Achievement[];
  achievement_stats: AchievementStats;
  last_claimed_points: number;
  total_claimed_tokens: number;
  last_claim_time: number;
  last_active_time: string;
  created_at: string;
  updated_at: string;
  // World Travel state
  travel_state?: TravelSaveData | null;
}

export interface UserUpgrades {
  tapPower: number;
  autoFarm: number;
  energyCapacity: number;
  energyRegen: number;
}

export interface DailyQuestStats {
  tapsToday: number;
  pointsToday: number;
  upgradesToday: number;
  travelQuestsToday: number;
}

export interface DailyQuest {
  id: string;
  type: 'tap' | 'points' | 'upgrade' | 'travel';
  title: string;
  description: string;
  target: number;
  current: number;
  reward: number;
  completed: boolean;
  createdAt: string;
}

export interface AchievementStats {
  totalTaps: number;
  totalPoints: number;
  totalQuests: number;
  playTime: number;
  loginStreak: number;
  lastLoginDate: string;
  firstLoginDate: string;
  // Travel stats
  countriesVisited: number;
  travelQuestsCompleted: number;
  totalStars: number;
  perfectCountries: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'tap' | 'points' | 'upgrade' | 'level' | 'special' | 'travel';
  target: number;
  reward: number;
  completed: boolean;
  completedAt?: Date;
  hidden: boolean;
}

// Travel system save data (stored as JSONB in game_states)
// Uses plain strings for JSON serialization compatibility
export interface TravelSaveData {
  countryProgress: Record<string, {
    countryId: string;
    questResults: Record<string, {
      questId: string;
      completed: boolean;
      correct: boolean;
      completedAt?: string;
      attempts: number;
    }>;
    stars: number;
    firstVisitedAt?: string;
    completedAt?: string;
  }>;
  startingRegion: string;
  totalStars: number;
}

export interface LeaderboardEntry {
  wallet_address: string;
  nickname: string;
  total_points: number;
  level: number;
  rank?: number;
  updated_at: string;
}
