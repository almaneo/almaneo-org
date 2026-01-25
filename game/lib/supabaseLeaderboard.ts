/**
 * Supabase Leaderboard Functions
 *
 * 리더보드 CRUD 작업 (Firebase 대체)
 */

import { supabase } from './supabase';

// ============================================================================
// Types
// ============================================================================

export interface LeaderboardEntry {
  userId: string;
  username: string;
  totalPoints: number;
  level: number;
  rank: number;
  lastUpdated: Date;
}

// ============================================================================
// Helper Functions
// ============================================================================

export function getWeekId(): string {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const days = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
  const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${weekNumber.toString().padStart(2, '0')}`;
}

export function getMonthId(): string {
  const now = new Date();
  return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
}

// ============================================================================
// Global Leaderboard
// ============================================================================

/**
 * 유저 랭킹 업데이트
 */
export async function updateUserRank(
  userId: string,
  data: {
    username: string;
    totalPoints: number;
    level: number;
  }
): Promise<void> {
  try {
    const { error } = await supabase
      .from('game_states')
      .update({
        total_points: data.totalPoints,
        level: data.level,
        updated_at: new Date().toISOString(),
      })
      .eq('wallet_address', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating user rank:', error);
    throw error;
  }
}

/**
 * Top N 플레이어 가져오기
 */
export async function getTopPlayers(limitCount: number = 100): Promise<LeaderboardEntry[]> {
  try {
    const { data, error } = await supabase
      .from('game_states')
      .select('wallet_address, total_points, level, updated_at')
      .order('total_points', { ascending: false })
      .limit(limitCount);

    if (error) throw error;

    const entries: LeaderboardEntry[] = (data || []).map((doc, index) => ({
      userId: doc.wallet_address,
      username: `${doc.wallet_address.slice(0, 6)}...${doc.wallet_address.slice(-4)}`,
      totalPoints: doc.total_points,
      level: doc.level,
      rank: index + 1,
      lastUpdated: new Date(doc.updated_at),
    }));

    return entries;
  } catch (error) {
    console.error('Error getting top players:', error);
    return [];
  }
}

/**
 * 내 순위 조회
 */
export async function getMyRank(userId: string): Promise<number | null> {
  try {
    // 내 포인트 조회
    const { data: userData, error: userError } = await supabase
      .from('game_states')
      .select('total_points')
      .eq('wallet_address', userId)
      .maybeSingle();

    if (userError || !userData) {
      return null;
    }

    // 나보다 포인트가 높은 유저 수 계산
    const { count, error: countError } = await supabase
      .from('game_states')
      .select('*', { count: 'exact', head: true })
      .gt('total_points', userData.total_points);

    if (countError) throw countError;

    return (count || 0) + 1;
  } catch (error) {
    console.error('Error getting my rank:', error);
    return null;
  }
}

/**
 * 유저 랭킹 정보 가져오기
 */
export async function getUserRank(userId: string): Promise<LeaderboardEntry | null> {
  try {
    const { data, error } = await supabase
      .from('game_states')
      .select('wallet_address, total_points, level, updated_at')
      .eq('wallet_address', userId)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    const rank = await getMyRank(userId);

    return {
      userId: data.wallet_address,
      username: `${data.wallet_address.slice(0, 6)}...${data.wallet_address.slice(-4)}`,
      totalPoints: data.total_points,
      level: data.level,
      rank: rank || 0,
      lastUpdated: new Date(data.updated_at),
    };
  } catch (error) {
    console.error('Error getting user rank:', error);
    return null;
  }
}

// ============================================================================
// Weekly Leaderboard
// ============================================================================

/**
 * 주간 랭킹 업데이트
 */
export async function updateWeeklyRank(
  userId: string,
  data: {
    username: string;
    weeklyPoints: number;
    level: number;
  }
): Promise<void> {
  try {
    const weekId = getWeekId();

    const { error } = await supabase
      .from('weekly_leaderboard')
      .upsert({
        user_id: userId,
        week_id: weekId,
        username: data.username,
        weekly_points: data.weeklyPoints,
        level: data.level,
        updated_at: new Date().toISOString(),
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error updating weekly rank:', error);
    throw error;
  }
}

/**
 * 주간 Top N 플레이어 가져오기
 */
export async function getWeeklyTopPlayers(limitCount: number = 100): Promise<LeaderboardEntry[]> {
  try {
    const weekId = getWeekId();

    const { data, error } = await supabase
      .from('weekly_leaderboard')
      .select('user_id, username, weekly_points, level, updated_at')
      .eq('week_id', weekId)
      .order('weekly_points', { ascending: false })
      .limit(limitCount);

    if (error) throw error;

    const entries: LeaderboardEntry[] = (data || []).map((doc, index) => ({
      userId: doc.user_id,
      username: doc.username,
      totalPoints: doc.weekly_points,
      level: doc.level,
      rank: index + 1,
      lastUpdated: new Date(doc.updated_at),
    }));

    return entries;
  } catch (error) {
    console.error('Error getting weekly top players:', error);
    return [];
  }
}

// ============================================================================
// Monthly Leaderboard
// ============================================================================

/**
 * 월간 랭킹 업데이트
 */
export async function updateMonthlyRank(
  userId: string,
  data: {
    username: string;
    monthlyPoints: number;
    level: number;
  }
): Promise<void> {
  try {
    const monthId = getMonthId();

    const { error } = await supabase
      .from('monthly_leaderboard')
      .upsert({
        user_id: userId,
        month_id: monthId,
        username: data.username,
        monthly_points: data.monthlyPoints,
        level: data.level,
        updated_at: new Date().toISOString(),
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error updating monthly rank:', error);
    throw error;
  }
}

/**
 * 월간 Top N 플레이어 가져오기
 */
export async function getMonthlyTopPlayers(limitCount: number = 100): Promise<LeaderboardEntry[]> {
  try {
    const monthId = getMonthId();

    const { data, error } = await supabase
      .from('monthly_leaderboard')
      .select('user_id, username, monthly_points, level, updated_at')
      .eq('month_id', monthId)
      .order('monthly_points', { ascending: false })
      .limit(limitCount);

    if (error) throw error;

    const entries: LeaderboardEntry[] = (data || []).map((doc, index) => ({
      userId: doc.user_id,
      username: doc.username,
      totalPoints: doc.monthly_points,
      level: doc.level,
      rank: index + 1,
      lastUpdated: new Date(doc.updated_at),
    }));

    return entries;
  } catch (error) {
    console.error('Error getting monthly top players:', error);
    return [];
  }
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * 전체 통계 가져오기
 */
export async function getLeaderboardStats() {
  try {
    const { data, error, count } = await supabase
      .from('game_states')
      .select('total_points', { count: 'exact' });

    if (error) throw error;

    const totalPlayers = count || 0;
    let totalPoints = 0;
    let topPlayer = '';
    let maxPoints = 0;

    (data || []).forEach((doc) => {
      totalPoints += doc.total_points || 0;

      if (doc.total_points > maxPoints) {
        maxPoints = doc.total_points;
      }
    });

    const averagePoints = totalPlayers > 0 ? Math.round(totalPoints / totalPlayers) : 0;

    return {
      totalPlayers,
      averagePoints,
      topPlayer,
      lastUpdated: new Date(),
    };
  } catch (error) {
    console.error('Error getting leaderboard stats:', error);
    return {
      totalPlayers: 0,
      averagePoints: 0,
      topPlayer: '',
      lastUpdated: new Date(),
    };
  }
}
