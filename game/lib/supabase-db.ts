/**
 * Supabase Database Functions for AlmaNEO Kindness Game
 */

import {
  supabase,
  GameState,
  UserUpgrades,
  DailyQuest,
  DailyQuestStats,
  Achievement,
  AchievementStats,
  LeaderboardEntry,
  TravelSaveData,
} from './supabase';

// ===========================
// Types for Input/Output
// ===========================

export interface SaveGameInput {
  userId: string;
  points: number;
  totalPoints: number;
  energy: number;
  maxEnergy: number;
  level: number;
  upgrades: UserUpgrades;
  dailyQuests: DailyQuest[];
  dailyQuestStats: DailyQuestStats;
  achievements: Achievement[];
  achievementStats: AchievementStats;
  lastActiveTime: number;
  lastClaimedPoints?: number;
  totalClaimedTokens?: number;
  lastClaimTime?: number;
  travelState?: TravelSaveData | null;
}

export interface LoadGameOutput {
  userId: string;
  points: number;
  totalPoints: number;
  energy: number;
  maxEnergy: number;
  level: number;
  upgrades: UserUpgrades;
  dailyQuests: DailyQuest[];
  dailyQuestStats: DailyQuestStats;
  achievements: Achievement[];
  achievementStats: AchievementStats;
  lastActiveTime: number;
  createdAt: number;
  updatedAt: number;
  lastClaimedPoints?: number;
  totalClaimedTokens?: number;
  lastClaimTime?: number;
  travelState?: TravelSaveData | null;
}

// ===========================
// User Management
// ===========================

/**
 * Create a new user
 */
export async function createUser(userId: string): Promise<void> {
  try {
    // Check if user already exists
    const { data: existing } = await supabase
      .from('game_states')
      .select('wallet_address')
      .eq('wallet_address', userId)
      .maybeSingle();

    if (existing) {
      console.log('User already exists:', userId);
      return;
    }

    const now = new Date().toISOString();
    const initialData = {
      wallet_address: userId,
      points: 0,
      total_points: 0,
      energy: 100,
      max_energy: 100,
      level: 1,
      upgrades: {
        tapPower: 1,
        autoFarm: 0,
        energyCapacity: 1,
        energyRegen: 1,
      },
      daily_quests: [],
      daily_quest_stats: {
        tapsToday: 0,
        pointsToday: 0,
        upgradesToday: 0,
        travelQuestsToday: 0,
      },
      achievements: [],
      achievement_stats: {
        totalTaps: 0,
        totalPoints: 0,
        totalQuests: 0,
        playTime: 0,
        loginStreak: 0,
        lastLoginDate: now.split('T')[0],
        firstLoginDate: now.split('T')[0],
        countriesVisited: 0,
        travelQuestsCompleted: 0,
        totalStars: 0,
        perfectCountries: 0,
      },
      last_claimed_points: 0,
      total_claimed_tokens: 0,
      last_claim_time: 0,
      last_active_time: now,
      travel_state: null,
    };

    const { error } = await supabase.from('game_states').insert(initialData);

    if (error) throw error;
    console.log('✅ User created successfully:', userId);
  } catch (error) {
    console.error('❌ Failed to create user:', error);
    throw error;
  }
}

/**
 * Get user data
 */
export async function getUser(userId: string): Promise<GameState | null> {
  try {
    const { data, error } = await supabase
      .from('game_states')
      .select('*')
      .eq('wallet_address', userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('❌ Failed to get user:', error);
    throw error;
  }
}

// ===========================
// Game State Management
// ===========================

/**
 * Save game state
 */
export async function saveGameState(gameState: SaveGameInput): Promise<void> {
  try {
    const now = new Date().toISOString();

    const updateData = {
      points: gameState.points,
      total_points: gameState.totalPoints,
      energy: gameState.energy,
      max_energy: gameState.maxEnergy,
      level: gameState.level,
      upgrades: gameState.upgrades,
      daily_quests: gameState.dailyQuests,
      daily_quest_stats: gameState.dailyQuestStats,
      achievements: gameState.achievements,
      achievement_stats: gameState.achievementStats,
      last_active_time: new Date(gameState.lastActiveTime).toISOString(),
      last_claimed_points: gameState.lastClaimedPoints ?? 0,
      total_claimed_tokens: gameState.totalClaimedTokens ?? 0,
      last_claim_time: gameState.lastClaimTime ?? 0,
      travel_state: gameState.travelState ?? null,
      updated_at: now,
    };

    const { error } = await supabase
      .from('game_states')
      .update(updateData)
      .eq('wallet_address', gameState.userId);

    if (error) throw error;
    console.log('✅ Game state saved:', gameState.userId);
  } catch (error) {
    console.error('❌ Failed to save game state:', error);
    throw error;
  }
}

/**
 * Load game state
 */
export async function loadGameState(userId: string): Promise<LoadGameOutput | null> {
  try {
    const gameState = await getUser(userId);

    if (!gameState) {
      return null;
    }

    const output: LoadGameOutput = {
      userId: gameState.wallet_address,
      points: gameState.points,
      totalPoints: gameState.total_points,
      energy: gameState.energy,
      maxEnergy: gameState.max_energy,
      level: gameState.level,
      upgrades: gameState.upgrades,
      dailyQuests: gameState.daily_quests,
      dailyQuestStats: gameState.daily_quest_stats,
      achievements: gameState.achievements,
      achievementStats: gameState.achievement_stats,
      lastActiveTime: new Date(gameState.last_active_time).getTime(),
      createdAt: new Date(gameState.created_at).getTime(),
      updatedAt: new Date(gameState.updated_at).getTime(),
      lastClaimedPoints: gameState.last_claimed_points,
      totalClaimedTokens: gameState.total_claimed_tokens,
      lastClaimTime: gameState.last_claim_time,
      travelState: gameState.travel_state ?? null,
    };

    console.log('✅ Game state loaded:', userId);
    return output;
  } catch (error) {
    console.error('❌ Failed to load game state:', error);
    throw error;
  }
}

// ===========================
// Real-time Synchronization
// ===========================

/**
 * Subscribe to user data changes
 */
export function subscribeToUser(
  userId: string,
  callback: (data: GameState | null) => void
): () => void {
  const channel = supabase
    .channel(`game_state:${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'game_states',
        filter: `wallet_address=eq.${userId}`,
      },
      (payload) => {
        if (payload.eventType === 'DELETE') {
          callback(null);
        } else {
          callback(payload.new as GameState);
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

// ===========================
// Leaderboard
// ===========================

/**
 * Get leaderboard (top N players)
 */
export async function getLeaderboard(limitCount: number = 10): Promise<LeaderboardEntry[]> {
  try {
    const { data, error } = await supabase
      .from('game_states')
      .select('wallet_address, total_points, level, updated_at')
      .order('total_points', { ascending: false })
      .limit(limitCount);

    if (error) throw error;

    const leaderboard: LeaderboardEntry[] = (data || []).map((entry, index) => ({
      wallet_address: entry.wallet_address,
      nickname: `${entry.wallet_address.slice(0, 6)}...${entry.wallet_address.slice(-4)}`,
      total_points: entry.total_points,
      level: entry.level,
      rank: index + 1,
      updated_at: entry.updated_at,
    }));

    console.log('✅ Leaderboard loaded:', leaderboard.length, 'entries');
    return leaderboard;
  } catch (error) {
    console.error('❌ Failed to load leaderboard:', error);
    throw error;
  }
}

/**
 * Update leaderboard entry
 */
export async function updateLeaderboard(
  userId: string,
  username: string,
  totalPoints: number,
  level: number
): Promise<void> {
  // Leaderboard is now derived from game_states table
  // This function updates the user's game state which affects leaderboard
  try {
    const { error } = await supabase
      .from('game_states')
      .update({
        total_points: totalPoints,
        level: level,
        updated_at: new Date().toISOString(),
      })
      .eq('wallet_address', userId);

    if (error) throw error;
    console.log('✅ Leaderboard updated:', userId);
  } catch (error) {
    console.error('❌ Failed to update leaderboard:', error);
    throw error;
  }
}

// Re-export types for compatibility
export type {
  GameState,
  UserUpgrades,
  DailyQuest,
  DailyQuestStats,
  Achievement,
  AchievementStats,
  LeaderboardEntry,
  TravelSaveData,
};
