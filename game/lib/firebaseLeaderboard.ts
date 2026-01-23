/**
 * Firebase Leaderboard Functions
 * 
 * Firestore 기반 리더보드 CRUD 작업
 */

import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { LeaderboardEntry, getWeekId, getMonthId } from './leaderboard';

// ============================================================================
// Constants
// ============================================================================

const LEADERBOARD_COLLECTION = 'leaderboard';
const WEEKLY_LEADERBOARD_COLLECTION = 'weeklyLeaderboard';
const MONTHLY_LEADERBOARD_COLLECTION = 'monthlyLeaderboard';

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
    const userRef = doc(db, LEADERBOARD_COLLECTION, userId);
    
    await setDoc(userRef, {
      userId,
      username: data.username,
      totalPoints: data.totalPoints,
      level: data.level,
      lastUpdated: serverTimestamp(),
    }, { merge: true });
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
    const q = query(
      collection(db, LEADERBOARD_COLLECTION),
      orderBy('totalPoints', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    
    const entries: LeaderboardEntry[] = snapshot.docs.map((doc, index) => {
      const data = doc.data();
      return {
        userId: data.userId,
        username: data.username,
        totalPoints: data.totalPoints,
        level: data.level,
        rank: index + 1,
        lastUpdated: data.lastUpdated?.toDate() || new Date(),
      };
    });
    
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
    const userDoc = await getDoc(doc(db, LEADERBOARD_COLLECTION, userId));
    
    if (!userDoc.exists()) {
      return null;
    }
    
    const userData = userDoc.data();
    
    // 나보다 포인트가 높은 유저 수 계산
    const q = query(
      collection(db, LEADERBOARD_COLLECTION),
      where('totalPoints', '>', userData.totalPoints)
    );
    
    const snapshot = await getDocs(q);
    const rank = snapshot.size + 1;
    
    return rank;
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
    const userDoc = await getDoc(doc(db, LEADERBOARD_COLLECTION, userId));
    
    if (!userDoc.exists()) {
      return null;
    }
    
    const data = userDoc.data();
    const rank = await getMyRank(userId);
    
    return {
      userId: data.userId,
      username: data.username,
      totalPoints: data.totalPoints,
      level: data.level,
      rank: rank || 0,
      lastUpdated: data.lastUpdated?.toDate() || new Date(),
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
    const weekRef = doc(db, WEEKLY_LEADERBOARD_COLLECTION, weekId, 'users', userId);

    await setDoc(weekRef, {
      userId,
      username: data.username,
      weeklyPoints: data.weeklyPoints,
      level: data.level,
      weekId,
      lastUpdated: serverTimestamp(),
    }, { merge: true });
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
    const q = query(
      collection(db, WEEKLY_LEADERBOARD_COLLECTION, weekId, 'users'),
      orderBy('weeklyPoints', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    
    const entries: LeaderboardEntry[] = snapshot.docs.map((doc, index) => {
      const data = doc.data();
      return {
        userId: data.userId,
        username: data.username,
        totalPoints: data.weeklyPoints, // weeklyPoints를 totalPoints로 매핑
        level: data.level,
        rank: index + 1,
        lastUpdated: data.lastUpdated?.toDate() || new Date(),
      };
    });
    
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
    const monthRef = doc(db, MONTHLY_LEADERBOARD_COLLECTION, monthId, 'users', userId);
    
    await setDoc(monthRef, {
      userId,
      username: data.username,
      monthlyPoints: data.monthlyPoints,
      level: data.level,
      monthId,
      lastUpdated: serverTimestamp(),
    }, { merge: true });
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
    const q = query(
      collection(db, MONTHLY_LEADERBOARD_COLLECTION, monthId, 'users'),
      orderBy('monthlyPoints', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);

    const entries: LeaderboardEntry[] = snapshot.docs.map((doc, index) => {
      const data = doc.data();
      return {
        userId: data.userId,
        username: data.username,
        totalPoints: data.monthlyPoints, // monthlyPoints를 totalPoints로 매핑
        level: data.level,
        rank: index + 1,
        lastUpdated: data.lastUpdated?.toDate() || new Date(),
      };
    });
    
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
    const snapshot = await getDocs(collection(db, LEADERBOARD_COLLECTION));
    const totalPlayers = snapshot.size;
    
    let totalPoints = 0;
    let topPlayer = '';
    let maxPoints = 0;
    
    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      totalPoints += data.totalPoints || 0;
      
      if (data.totalPoints > maxPoints) {
        maxPoints = data.totalPoints;
        topPlayer = data.username;
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
