/**
 * Firebase Firestore Database Functions
 * MiMiG Carbon Farm Game
 */

import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  onSnapshot,
  collection,
  query,
  orderBy,
  limit,
  Timestamp,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';
import {
  UserDocument,
  SaveGameInput,
  LoadGameOutput,
  LeaderboardEntry,
  FirestoreDailyQuest,
  FirestoreAchievement,
} from '@/types/firestore';

// ===========================
// Helper Functions
// ===========================

/**
 * Unix timestamp를 Firestore Timestamp로 변환
 */
function toFirestoreTimestamp(unixTime: number): Timestamp {
  return Timestamp.fromMillis(unixTime);
}

/**
 * Firestore Timestamp를 Unix timestamp로 변환
 */
function toUnixTimestamp(timestamp: Timestamp): number {
  return timestamp.toMillis();
}

// ===========================
// User Management
// ===========================

/**
 * 신규 사용자 생성
 * @param userId - 지갑 주소
 */
export async function createUser(userId: string): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);
    
    // 이미 존재하는지 확인
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      console.log('User already exists:', userId);
      return;
    }

    // 초기 사용자 문서 생성
    const now = Timestamp.now();
    const initialData: UserDocument = {
      userId,
      username: userId.substring(0, 8) + '...', // 기본 닉네임
      
      points: 0,
      totalPoints: 0,
      energy: 100,
      maxEnergy: 100,
      level: 1,
      
      upgrades: {
        tapPower: 1,
        autoFarm: 0,
        energyCapacity: 1,
        energyRegen: 1,
      },
      
      dailyQuests: [],
      dailyQuestStats: {
        tapsToday: 0,
        pointsToday: 0,
        upgradesToday: 0,
      },
      
      achievements: [],
      achievementStats: {
        totalTaps: 0,
        totalPoints: 0,
        totalQuests: 0,
        playTime: 0,
        loginStreak: 0,
        lastLoginDate: new Date().toISOString().split('T')[0],
        firstLoginDate: new Date().toISOString().split('T')[0],
      },
      
      lastClaimedPoints: 0,
      totalClaimedTokens: 0,
      lastClaimTime: 0,
      
      lastActiveTime: now,
      createdAt: now,
      updatedAt: now,
    };

    await setDoc(userRef, initialData);
    console.log('✅ User created successfully:', userId);
  } catch (error) {
    console.error('❌ Failed to create user:', error);
    throw error;
  }
}

/**
 * 사용자 데이터 조회
 * @param userId - 지갑 주소
 * @returns UserDocument or null
 */
export async function getUser(userId: string): Promise<UserDocument | null> {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      return null;
    }
    
    return userSnap.data() as UserDocument;
  } catch (error) {
    console.error('❌ Failed to get user:', error);
    throw error;
  }
}

// ===========================
// Game State Management
// ===========================

/**
 * 게임 상태 저장
 * @param gameState - 저장할 게임 데이터
 */
export async function saveGameState(gameState: SaveGameInput): Promise<void> {
  try {
    const userRef = doc(db, 'users', gameState.userId);
    
    // SaveGameInput → UserDocument 변환
    // undefined 필드 제거
    const firestoreData: Partial<UserDocument> = {
      userId: gameState.userId,
      points: gameState.points,
      totalPoints: gameState.totalPoints,
      energy: gameState.energy,
      maxEnergy: gameState.maxEnergy,
      level: gameState.level,
      upgrades: gameState.upgrades,
      dailyQuests: gameState.dailyQuests,
      dailyQuestStats: gameState.dailyQuestStats,
      achievements: gameState.achievements,
      achievementStats: gameState.achievementStats,
      lastActiveTime: toFirestoreTimestamp(gameState.lastActiveTime),
      updatedAt: Timestamp.now(),
      lastClaimedPoints: gameState.lastClaimedPoints,
      totalClaimedTokens: gameState.totalClaimedTokens,
      lastClaimTime: gameState.lastClaimTime,
    };

    // merge: true로 부분 업데이트
    await setDoc(userRef, firestoreData, { merge: true });
    
    console.log('✅ Game state saved:', gameState.userId);
  } catch (error) {
    console.error('❌ Failed to save game state:', error);
    throw error;
  }
}

/**
 * 게임 상태 로드
 * @param userId - 지갑 주소
 * @returns LoadGameOutput or null
 */
export async function loadGameState(
  userId: string
): Promise<LoadGameOutput | null> {
  try {
    const userDoc = await getUser(userId);
    
    if (!userDoc) {
      return null;
    }
    
    // UserDocument → LoadGameOutput 변환
    const gameState: LoadGameOutput = {
      userId: userDoc.userId,
      points: userDoc.points,
      totalPoints: userDoc.totalPoints,
      energy: userDoc.energy,
      maxEnergy: userDoc.maxEnergy,
      level: userDoc.level,
      upgrades: userDoc.upgrades,
      dailyQuests: userDoc.dailyQuests,
      dailyQuestStats: userDoc.dailyQuestStats,
      achievements: userDoc.achievements,
      achievementStats: userDoc.achievementStats,
      lastActiveTime: toUnixTimestamp(userDoc.lastActiveTime),
      createdAt: toUnixTimestamp(userDoc.createdAt),
      updatedAt: toUnixTimestamp(userDoc.updatedAt),
      lastClaimedPoints: userDoc.lastClaimedPoints,
      totalClaimedTokens: userDoc.totalClaimedTokens,
      lastClaimTime: userDoc.lastClaimTime,
    };
    
    console.log('✅ Game state loaded:', userId);
    return gameState;
  } catch (error) {
    console.error('❌ Failed to load game state:', error);
    throw error;
  }
}

// ===========================
// Real-time Synchronization
// ===========================

/**
 * 사용자 데이터 실시간 구독
 * @param userId - 지갑 주소
 * @param callback - 데이터 변경 시 호출될 콜백
 * @returns Unsubscribe 함수
 */
export function subscribeToUser(
  userId: string,
  callback: (data: UserDocument | null) => void
): Unsubscribe {
  const userRef = doc(db, 'users', userId);
  
  const unsubscribe = onSnapshot(
    userRef,
    (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.data() as UserDocument);
      } else {
        callback(null);
      }
    },
    (error) => {
      console.error('❌ Real-time sync error:', error);
      callback(null);
    }
  );
  
  return unsubscribe;
}

// ===========================
// Leaderboard
// ===========================

/**
 * 리더보드 조회 (상위 N명)
 * @param limitCount - 조회할 인원 수 (기본: 10)
 * @returns LeaderboardEntry 배열
 */
export async function getLeaderboard(
  limitCount: number = 10
): Promise<LeaderboardEntry[]> {
  try {
    const leaderboardRef = collection(db, 'leaderboard');
    const q = query(
      leaderboardRef,
      orderBy('totalPoints', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    
    const leaderboard: LeaderboardEntry[] = [];
    let rank = 1;
    snapshot.forEach((doc) => {
      const data = doc.data() as LeaderboardEntry;
      leaderboard.push({
        ...data,
        rank: rank++, // 순위 추가
      });
    });
    
    console.log('✅ Leaderboard loaded:', leaderboard.length, 'entries');
    return leaderboard;
  } catch (error) {
    console.error('❌ Failed to load leaderboard:', error);
    throw error;
  }
}

/**
 * 리더보드 업데이트 (사용자 순위 갱신)
 * @param userId - 지갑 주소
 * @param username - 표시명
 * @param totalPoints - 누적 포인트
 * @param level - 레벨
 */
export async function updateLeaderboard(
  userId: string,
  username: string,
  totalPoints: number,
  level: number
): Promise<void> {
  try {
    const leaderboardRef = doc(db, 'leaderboard', userId);
    
    const data: Omit<LeaderboardEntry, 'rank'> = {
      userId,
      username,
      totalPoints,
      level,
      updatedAt: Timestamp.now(),
    };
    
    await setDoc(leaderboardRef, data, { merge: true });
    console.log('✅ Leaderboard updated:', userId);
  } catch (error) {
    console.error('❌ Failed to update leaderboard:', error);
    throw error;
  }
}
