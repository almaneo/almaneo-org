/**
 * Mining Statistics Firestore Integration
 * 
 * Session 93: globalTotalMined 실제 구현
 * 글로벌 채굴 통계 관리
 */

import { db } from './firebase';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  runTransaction,
  Timestamp,
} from 'firebase/firestore';
import type {
  GlobalMiningStats,
  DailyMiningStats,
  UserMiningHistory,
  ClaimRecord,
} from '@/types/miningFirestore';
import { INITIAL_GLOBAL_STATS } from '@/types/miningFirestore';

// ========================================
// 캐싱 시스템
// ========================================

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const statsCache = new Map<string, CacheEntry<GlobalMiningStats>>();
const CACHE_TTL = 30000; // 30초

/**
 * 캐시 초기화
 */
function clearCache(key: string = 'global'): void {
  statsCache.delete(key);
}

// ========================================
// 글로벌 통계 조회
// ========================================

/**
 * 글로벌 채굴 통계 조회
 * 30초 캐싱 적용
 * 
 * @returns GlobalMiningStats
 * @throws Error if stats not found or initialized
 */
export async function getGlobalMiningStats(): Promise<GlobalMiningStats> {
  // 캐시 확인
  const cached = statsCache.get('global');
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log('📦 [Mining] Using cached global stats');
    return cached.data;
  }

  console.log('🔍 [Mining] Fetching global stats from Firestore...');

  try {
    const docRef = doc(db, 'miningStats', 'global');
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.warn('⚠️ [Mining] Global stats not found, initializing...');
      await initializeGlobalStats();
      
      // 재조회
      const newSnap = await getDoc(docRef);
      if (!newSnap.exists()) {
        throw new Error('Failed to initialize global stats');
      }
      
      const data = newSnap.data() as GlobalMiningStats;
      statsCache.set('global', { data, timestamp: Date.now() });
      return data;
    }

    const data = docSnap.data() as GlobalMiningStats;
    
    // 캐시 저장
    statsCache.set('global', { data, timestamp: Date.now() });
    
    console.log('✅ [Mining] Global stats loaded:', {
      totalMined: data.totalMined,
      totalUsers: data.totalUsers,
      totalClaims: data.totalClaims,
    });

    return data;
  } catch (error) {
    console.error('❌ [Mining] Error fetching global stats:', error);
    throw error;
  }
}

// ========================================
// 글로벌 통계 업데이트
// ========================================

/**
 * 글로벌 채굴 통계 업데이트 (트랜잭션)
 *
 * @param amount - 청구 금액 (MiMiG)
 * @param userId - 사용자 ID
 * @throws Error if transaction fails
 */
export async function updateGlobalMiningStats(
  amount: number,
  userId: string
): Promise<void> {
  console.log('🔄 [Mining] Updating global stats:', { amount, userId });

  try {
    const globalRef = doc(db, 'miningStats', 'global');

    await runTransaction(db, async (transaction) => {
      const globalDoc = await transaction.get(globalRef);

      if (!globalDoc.exists()) {
        // 초기화되지 않은 경우
        console.warn('⚠️ [Mining] Global stats not initialized in transaction');
        transaction.set(globalRef, {
          ...INITIAL_GLOBAL_STATS,
          totalMined: amount,
          totalUsers: 1,
          totalClaims: 1,
          averageClaimSize: amount,
          lastUpdated: Timestamp.now(),
        });
        return;
      }

      const current = globalDoc.data() as GlobalMiningStats;
      const newTotalClaims = current.totalClaims + 1;
      const newAverageClaimSize =
        (current.averageClaimSize * current.totalClaims + amount) / newTotalClaims;

      transaction.update(globalRef, {
        totalMined: current.totalMined + amount,
        totalClaims: newTotalClaims,
        averageClaimSize: newAverageClaimSize,
        lastUpdated: Timestamp.now(),
      });
    });

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

/**
 * 일일 채굴 통계 업데이트
 *
 * @param amount - 청구 금액 (MiMiG)
 * @param userId - 사용자 ID
 */
export async function updateDailyStats(
  amount: number,
  userId: string
): Promise<void> {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const dailyRef = doc(db, 'miningStats-daily', today); // ✅ 수정: 별도 컬렉션

  try {
    const dailySnap = await getDoc(dailyRef);

    if (!dailySnap.exists()) {
      // 새로운 날짜
      await setDoc(dailyRef, {
        date: today,
        dailyMined: amount,
        dailyUsers: 1,
        dailyClaims: 1,
        timestamp: Timestamp.now(),
      } as DailyMiningStats);
      
      console.log('✅ [Mining] Daily stats created:', today);
    } else {
      // 기존 날짜 업데이트
      const current = dailySnap.data() as DailyMiningStats;
      await updateDoc(dailyRef, {
        dailyMined: current.dailyMined + amount,
        dailyClaims: current.dailyClaims + 1,
        timestamp: Timestamp.now(),
      });
      
      console.log('✅ [Mining] Daily stats updated:', today);
    }
  } catch (error) {
    console.error('❌ [Mining] Error updating daily stats:', error);
    // 일일 통계 실패는 치명적이지 않음 (로그만)
  }
}

// ========================================
// 사용자 통계 업데이트
// ========================================

/**
 * 사용자 마이닝 이력 업데이트
 * 
 * @param userId - 사용자 ID
 * @param claimRecord - 청구 기록
 */
export async function updateUserMiningHistory(
  userId: string,
  claimRecord: ClaimRecord
): Promise<void> {
  const userRef = doc(db, 'miningStats-users', userId); // ✅ 수정: 별도 컬렉션

  try {
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // 신규 사용자
      await setDoc(userRef, {
        userId,
        totalMined: claimRecord.amount,
        totalClaims: 1,
        firstClaimAt: claimRecord.timestamp,
        lastClaimAt: claimRecord.timestamp,
        recentClaims: [claimRecord],
      } as UserMiningHistory);
      
      console.log('✅ [Mining] User history created:', userId);
    } else {
      // 기존 사용자
      const current = userSnap.data() as UserMiningHistory;
      const recentClaims = [claimRecord, ...current.recentClaims].slice(0, 10);

      await updateDoc(userRef, {
        totalMined: current.totalMined + claimRecord.amount,
        totalClaims: current.totalClaims + 1,
        lastClaimAt: claimRecord.timestamp,
        recentClaims,
      });
      
      console.log('✅ [Mining] User history updated:', userId);
    }
  } catch (error) {
    console.error('❌ [Mining] Error updating user history:', error);
    // 사용자 이력 실패는 치명적이지 않음 (로그만)
  }
}

// ========================================
// 초기화 및 유틸리티
// ========================================

/**
 * 글로벌 통계 초기화
 * 앱 시작 시 또는 데이터 없을 때 호출
 */
export async function initializeGlobalStats(): Promise<void> {
  console.log('🔧 [Mining] Initializing global stats...');

  try {
    const globalRef = doc(db, 'miningStats', 'global');
    
    await setDoc(globalRef, {
      ...INITIAL_GLOBAL_STATS,
      lastUpdated: Timestamp.now(),
    });

    console.log('✅ [Mining] Global stats initialized');
  } catch (error) {
    console.error('❌ [Mining] Error initializing global stats:', error);
    throw error;
  }
}

/**
 * 글로벌 통계 존재 확인 및 초기화
 */
export async function ensureGlobalStatsExists(): Promise<void> {
  try {
    const globalRef = doc(db, 'miningStats', 'global');
    const snap = await getDoc(globalRef);

    if (!snap.exists()) {
      console.warn('⚠️ [Mining] Global stats not found, initializing...');
      await initializeGlobalStats();
    } else {
      console.log('✅ [Mining] Global stats already exists');
    }
  } catch (error) {
    console.error('❌ [Mining] Error checking global stats:', error);
    throw error;
  }
}

// ========================================
// 재시도 로직
// ========================================

/**
 * 재시도를 포함한 작업 실행
 * 
 * @param operation - 실행할 작업
 * @param maxRetries - 최대 재시도 횟수
 * @returns 작업 결과
 */
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
      
      const delay = 1000 * (i + 1); // 1초, 2초, 3초
      console.warn(`⚠️ [Mining] Retry ${i + 1}/${maxRetries} after ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw new Error('Max retries exceeded');
}

/**
 * 재시도를 포함한 글로벌 통계 업데이트
 *
 * @param amount - 청구 금액 (MiMiG)
 * @param userId - 사용자 ID
 */
export async function updateGlobalMiningStatsSafe(
  amount: number,
  userId: string
): Promise<void> {
  await retryOperation(() => updateGlobalMiningStats(amount, userId));
}

/**
 * 모든 통계 업데이트 (통합 함수)
 *
 * @param amount - 청구 금액 (MiMiG)
 * @param userId - 사용자 ID
 * @param claimRecord - 청구 기록
 */
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
