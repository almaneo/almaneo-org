/**
 * Mining Statistics Supabase Integration
 *
 * 글로벌 채굴 통계 관리 (Firebase 대체)
 */

import { supabase } from './supabase';

// ========================================
// Types
// ========================================

export interface GlobalMiningStats {
  id: string;
  total_mined: number;
  total_users: number;
  total_claims: number;
  average_claim_size: number;
  last_updated: string;
}

export interface DailyMiningStats {
  date: string;
  daily_mined: number;
  daily_users: number;
  daily_claims: number;
  created_at: string;
}

export interface UserMiningHistory {
  user_id: string;
  total_mined: number;
  total_claims: number;
  first_claim_at: string;
  last_claim_at: string;
  recent_claims: ClaimRecord[];
}

export interface ClaimRecord {
  amount: number;
  points: number;
  timestamp: string;
  txHash?: string;
  conversionRate: number;
  epoch: number;
}

export const INITIAL_GLOBAL_STATS: Omit<GlobalMiningStats, 'id' | 'last_updated'> = {
  total_mined: 0,
  total_users: 0,
  total_claims: 0,
  average_claim_size: 0,
};

// ========================================
// 캐싱 시스템
// ========================================

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const statsCache = new Map<string, CacheEntry<GlobalMiningStats>>();
const CACHE_TTL = 30000; // 30초

function clearCache(key: string = 'global'): void {
  statsCache.delete(key);
}

// ========================================
// 글로벌 통계 조회
// ========================================

export async function getGlobalMiningStats(): Promise<GlobalMiningStats> {
  // 캐시 확인
  const cached = statsCache.get('global');
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log('📦 [Mining] Using cached global stats');
    return cached.data;
  }

  console.log('🔍 [Mining] Fetching global stats from Supabase...');

  try {
    const { data, error } = await supabase
      .from('mining_stats')
      .select('*')
      .eq('id', 'global')
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      console.warn('⚠️ [Mining] Global stats not found, initializing...');
      await initializeGlobalStats();

      // 재조회
      const { data: newData, error: newError } = await supabase
        .from('mining_stats')
        .select('*')
        .eq('id', 'global')
        .single();

      if (newError || !newData) {
        throw new Error('Failed to initialize global stats');
      }

      statsCache.set('global', { data: newData, timestamp: Date.now() });
      return newData;
    }

    // 캐시 저장
    statsCache.set('global', { data, timestamp: Date.now() });

    console.log('✅ [Mining] Global stats loaded:', {
      totalMined: data.total_mined,
      totalUsers: data.total_users,
      totalClaims: data.total_claims,
    });

    return data;
  } catch (error) {
    console.error('❌ [Mining] Error fetching global stats:', error);
    // 에러 시 기본값 반환
    return {
      id: 'global',
      ...INITIAL_GLOBAL_STATS,
      last_updated: new Date().toISOString(),
    };
  }
}

// ========================================
// 글로벌 통계 업데이트
// ========================================

export async function updateGlobalMiningStats(
  amount: number,
  userId: string
): Promise<void> {
  console.log('🔄 [Mining] Updating global stats:', { amount, userId });

  try {
    const { data: current, error: fetchError } = await supabase
      .from('mining_stats')
      .select('*')
      .eq('id', 'global')
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (!current) {
      // 초기화되지 않은 경우
      console.warn('⚠️ [Mining] Global stats not initialized');
      const { error: insertError } = await supabase
        .from('mining_stats')
        .insert({
          id: 'global',
          total_mined: amount,
          total_users: 1,
          total_claims: 1,
          average_claim_size: amount,
          last_updated: new Date().toISOString(),
        });

      if (insertError) throw insertError;
    } else {
      const newTotalClaims = current.total_claims + 1;
      const newAverageClaimSize =
        (current.average_claim_size * current.total_claims + amount) / newTotalClaims;

      const { error: updateError } = await supabase
        .from('mining_stats')
        .update({
          total_mined: current.total_mined + amount,
          total_claims: newTotalClaims,
          average_claim_size: newAverageClaimSize,
          last_updated: new Date().toISOString(),
        })
        .eq('id', 'global');

      if (updateError) throw updateError;
    }

    // 캐시 무효화
    clearCache('global');

    console.log('✅ [Mining] Global stats updated successfully');
  } catch (error) {
    console.error('❌ [Mining] Error updating global stats:', error);
    throw error;
  }
}

// ========================================
// 일일 통계 업데이트
// ========================================

export async function updateDailyStats(
  amount: number,
  userId: string
): Promise<void> {
  const today = new Date().toISOString().split('T')[0];

  try {
    const { data: existing, error: fetchError } = await supabase
      .from('mining_daily_stats')
      .select('*')
      .eq('date', today)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (!existing) {
      // 새로운 날짜
      const { error: insertError } = await supabase
        .from('mining_daily_stats')
        .insert({
          date: today,
          daily_mined: amount,
          daily_users: 1,
          daily_claims: 1,
        });

      if (insertError) throw insertError;
      console.log('✅ [Mining] Daily stats created:', today);
    } else {
      // 기존 날짜 업데이트
      const { error: updateError } = await supabase
        .from('mining_daily_stats')
        .update({
          daily_mined: existing.daily_mined + amount,
          daily_claims: existing.daily_claims + 1,
        })
        .eq('date', today);

      if (updateError) throw updateError;
      console.log('✅ [Mining] Daily stats updated:', today);
    }
  } catch (error) {
    console.error('❌ [Mining] Error updating daily stats:', error);
  }
}

// ========================================
// 사용자 통계 업데이트
// ========================================

export async function updateUserMiningHistory(
  userId: string,
  claimRecord: ClaimRecord
): Promise<void> {
  try {
    const { data: existing, error: fetchError } = await supabase
      .from('mining_user_history')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (!existing) {
      // 신규 사용자
      const { error: insertError } = await supabase
        .from('mining_user_history')
        .insert({
          user_id: userId,
          total_mined: claimRecord.amount,
          total_claims: 1,
          first_claim_at: claimRecord.timestamp,
          last_claim_at: claimRecord.timestamp,
          recent_claims: [claimRecord],
        });

      if (insertError) throw insertError;
      console.log('✅ [Mining] User history created:', userId);
    } else {
      // 기존 사용자
      const recentClaims = [claimRecord, ...(existing.recent_claims || [])].slice(0, 10);

      const { error: updateError } = await supabase
        .from('mining_user_history')
        .update({
          total_mined: existing.total_mined + claimRecord.amount,
          total_claims: existing.total_claims + 1,
          last_claim_at: claimRecord.timestamp,
          recent_claims: recentClaims,
        })
        .eq('user_id', userId);

      if (updateError) throw updateError;
      console.log('✅ [Mining] User history updated:', userId);
    }
  } catch (error) {
    console.error('❌ [Mining] Error updating user history:', error);
  }
}

// ========================================
// 초기화 및 유틸리티
// ========================================

export async function initializeGlobalStats(): Promise<void> {
  console.log('🔧 [Mining] Initializing global stats...');

  try {
    const { error } = await supabase
      .from('mining_stats')
      .upsert({
        id: 'global',
        ...INITIAL_GLOBAL_STATS,
        last_updated: new Date().toISOString(),
      });

    if (error) throw error;
    console.log('✅ [Mining] Global stats initialized');
  } catch (error) {
    console.error('❌ [Mining] Error initializing global stats:', error);
    throw error;
  }
}

export async function ensureGlobalStatsExists(): Promise<void> {
  try {
    const { data, error } = await supabase
      .from('mining_stats')
      .select('id')
      .eq('id', 'global')
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      console.warn('⚠️ [Mining] Global stats not found, initializing...');
      await initializeGlobalStats();
    } else {
      console.log('✅ [Mining] Global stats already exists');
    }
  } catch (error) {
    console.error('❌ [Mining] Error checking global stats:', error);
    // 에러 무시 - 게임은 계속 실행 가능
  }
}

// ========================================
// 재시도 로직
// ========================================

async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (i === maxRetries - 1) {
        throw error;
      }

      const delay = 1000 * (i + 1);
      console.warn(`⚠️ [Mining] Retry ${i + 1}/${maxRetries} after ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw new Error('Max retries exceeded');
}

export async function updateGlobalMiningStatsSafe(
  amount: number,
  userId: string
): Promise<void> {
  await retryOperation(() => updateGlobalMiningStats(amount, userId));
}

export async function updateAllMiningStats(
  amount: number,
  userId: string,
  claimRecord: ClaimRecord
): Promise<void> {
  console.log('🔄 [Mining] Updating all stats...');

  try {
    // 1. 글로벌 통계 (중요 - 재시도)
    await updateGlobalMiningStatsSafe(amount, userId);

    // 2. 일일 통계 (선택)
    await updateDailyStats(amount, userId);

    // 3. 사용자 이력 (선택)
    await updateUserMiningHistory(userId, claimRecord);

    console.log('✅ [Mining] All stats updated successfully');
  } catch (error) {
    console.error('❌ [Mining] Error updating all stats:', error);
    throw error;
  }
}
