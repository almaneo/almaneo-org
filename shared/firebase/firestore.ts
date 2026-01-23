/**
 * NEOS Firestore Utilities
 * Firestore 컬렉션 및 데이터 조작 함수
 */

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  DocumentReference,
  QueryConstraint,
} from 'firebase/firestore';
import { getFirebaseDB } from './config';
import type { User, GameState, LeaderboardEntry, KindnessActivity } from '../types';

// 컬렉션 이름 상수
export const COLLECTIONS = {
  USERS: 'users',
  GAME_STATES: 'gameStates',
  LEADERBOARD: 'leaderboard',
  KINDNESS_ACTIVITIES: 'kindnessActivities',
  NFT_LISTINGS: 'nftListings',
  GLOBAL_STATS: 'globalStats',
} as const;

// ==================== User 관련 ====================

/**
 * 사용자 생성 또는 업데이트
 */
export const upsertUser = async (walletAddress: string, userData: Partial<User>): Promise<void> => {
  const db = getFirebaseDB();
  const userRef = doc(db, COLLECTIONS.USERS, walletAddress.toLowerCase());

  const existingUser = await getDoc(userRef);

  if (existingUser.exists()) {
    await updateDoc(userRef, {
      ...userData,
      updatedAt: serverTimestamp(),
    });
  } else {
    await setDoc(userRef, {
      walletAddress: walletAddress.toLowerCase(),
      profile: {
        nickname: `NEOS_${walletAddress.slice(0, 6)}`,
        avatar: null,
      },
      kindnessScore: 0,
      totalPoints: 0,
      level: 1,
      settings: {
        language: 'ko',
        notifications: true,
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      ...userData,
    });
  }
};

/**
 * 사용자 조회
 */
export const getUser = async (walletAddress: string): Promise<User | null> => {
  const db = getFirebaseDB();
  const userRef = doc(db, COLLECTIONS.USERS, walletAddress.toLowerCase());
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data() as User;
  }
  return null;
};

/**
 * 사용자 실시간 구독
 */
export const subscribeToUser = (
  walletAddress: string,
  callback: (user: User | null) => void
): (() => void) => {
  const db = getFirebaseDB();
  const userRef = doc(db, COLLECTIONS.USERS, walletAddress.toLowerCase());

  return onSnapshot(userRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data() as User);
    } else {
      callback(null);
    }
  });
};

// ==================== GameState 관련 ====================

/**
 * 게임 상태 저장
 */
export const saveGameState = async (walletAddress: string, gameState: Partial<GameState>): Promise<void> => {
  const db = getFirebaseDB();
  const gameRef = doc(db, COLLECTIONS.GAME_STATES, walletAddress.toLowerCase());

  await setDoc(gameRef, {
    ...gameState,
    lastSaved: serverTimestamp(),
  }, { merge: true });
};

/**
 * 게임 상태 로드
 */
export const loadGameState = async (walletAddress: string): Promise<GameState | null> => {
  const db = getFirebaseDB();
  const gameRef = doc(db, COLLECTIONS.GAME_STATES, walletAddress.toLowerCase());
  const gameSnap = await getDoc(gameRef);

  if (gameSnap.exists()) {
    return gameSnap.data() as GameState;
  }
  return null;
};

// ==================== Leaderboard 관련 ====================

/**
 * 리더보드 업데이트
 */
export const updateLeaderboard = async (
  walletAddress: string,
  data: { nickname: string; totalPoints: number; level: number }
): Promise<void> => {
  const db = getFirebaseDB();
  const leaderRef = doc(db, COLLECTIONS.LEADERBOARD, walletAddress.toLowerCase());

  await setDoc(leaderRef, {
    ...data,
    walletAddress: walletAddress.toLowerCase(),
    updatedAt: serverTimestamp(),
  });
};

/**
 * 리더보드 조회 (상위 N명)
 */
export const getLeaderboard = async (limitCount: number = 100): Promise<LeaderboardEntry[]> => {
  const db = getFirebaseDB();
  const leaderRef = collection(db, COLLECTIONS.LEADERBOARD);
  const q = query(leaderRef, orderBy('totalPoints', 'desc'), limit(limitCount));

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc, index) => ({
    rank: index + 1,
    ...doc.data(),
  })) as LeaderboardEntry[];
};

// ==================== Kindness Activities 관련 ====================

/**
 * 친절 활동 기록
 */
export const recordKindnessActivity = async (activity: Omit<KindnessActivity, 'id' | 'createdAt'>): Promise<string> => {
  const db = getFirebaseDB();
  const activitiesRef = collection(db, COLLECTIONS.KINDNESS_ACTIVITIES);
  const newActivityRef = doc(activitiesRef);

  await setDoc(newActivityRef, {
    ...activity,
    createdAt: serverTimestamp(),
  });

  return newActivityRef.id;
};

/**
 * 사용자의 친절 활동 조회
 */
export const getUserKindnessActivities = async (
  walletAddress: string,
  limitCount: number = 50
): Promise<KindnessActivity[]> => {
  const db = getFirebaseDB();
  const activitiesRef = collection(db, COLLECTIONS.KINDNESS_ACTIVITIES);
  const q = query(
    activitiesRef,
    where('userId', '==', walletAddress.toLowerCase()),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as KindnessActivity[];
};

// ==================== Global Stats 관련 ====================

/**
 * 글로벌 통계 조회 (토큰 채굴량 등)
 */
export const getGlobalStats = async (): Promise<Record<string, any> | null> => {
  const db = getFirebaseDB();
  const statsRef = doc(db, COLLECTIONS.GLOBAL_STATS, 'mining');
  const statsSnap = await getDoc(statsRef);

  if (statsSnap.exists()) {
    return statsSnap.data();
  }
  return null;
};
