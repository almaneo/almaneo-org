/**
 * useUserData Hook
 * Firebase에서 사용자 데이터를 관리하는 커스텀 훅
 */

import { useState, useEffect, useCallback } from 'react';
import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import { useWallet } from '../components/wallet';

// 사용자 타입 정의 (shared 타입과 동일)
export interface UserProfile {
  nickname: string;
  avatar: string | null;
  bio?: string;
}

export interface UserSettings {
  language: string;
  notifications: boolean;
  theme?: 'light' | 'dark' | 'system';
}

export interface User {
  walletAddress: string;
  profile: UserProfile;
  kindnessScore: number;
  totalPoints: number;
  level: number;
  settings: UserSettings;
  jeongSbtTokenId?: string;
  jeongTier?: 'bronze' | 'silver' | 'gold' | 'diamond';
  stakedAmount?: number;
  stakingTier?: 'bronze' | 'silver' | 'gold' | 'diamond';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastLoginAt?: Timestamp;
}

// 스테이킹 티어별 정보
export const STAKING_TIERS = {
  bronze: { minAmount: 0, maxAmount: 999, apy: 5, weight: 1.0 },
  silver: { minAmount: 1000, maxAmount: 9999, apy: 8, weight: 1.1 },
  gold: { minAmount: 10000, maxAmount: 99999, apy: 12, weight: 1.25 },
  diamond: { minAmount: 100000, maxAmount: Infinity, apy: 18, weight: 1.5 },
} as const;

// 티어 결정 함수
export function calculateStakingTier(stakedAmount: number): 'bronze' | 'silver' | 'gold' | 'diamond' {
  if (stakedAmount >= STAKING_TIERS.diamond.minAmount) return 'diamond';
  if (stakedAmount >= STAKING_TIERS.gold.minAmount) return 'gold';
  if (stakedAmount >= STAKING_TIERS.silver.minAmount) return 'silver';
  return 'bronze';
}

interface UseUserDataReturn {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  createOrUpdateUser: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export function useUserData(): UseUserDataReturn {
  const { address, isConnected, userInfo } = useWallet();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 사용자 생성 또는 업데이트
  const createOrUpdateUser = useCallback(async () => {
    if (!address) return;

    setIsLoading(true);
    setError(null);

    try {
      const userRef = doc(db, 'users', address.toLowerCase());
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        // 기존 사용자 - lastLoginAt 업데이트
        await setDoc(userRef, {
          lastLoginAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }, { merge: true });
      } else {
        // 새 사용자 생성
        const newUser = {
          walletAddress: address.toLowerCase(),
          profile: {
            nickname: userInfo?.name || `NEOS_${address.slice(0, 6)}`,
            avatar: userInfo?.profileImage || null,
            bio: '',
          },
          kindnessScore: 0,
          totalPoints: 0,
          level: 1,
          settings: {
            language: 'ko',
            notifications: true,
            theme: 'dark',
          },
          stakedAmount: 0,
          stakingTier: 'bronze',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
        };

        await setDoc(userRef, newUser);
      }
    } catch (err) {
      console.error('[useUserData] 사용자 생성/업데이트 실패:', err);
      setError('사용자 데이터 저장에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [address, userInfo]);

  // 사용자 데이터 새로고침
  const refreshUser = useCallback(async () => {
    if (!address) return;

    setIsLoading(true);
    try {
      const userRef = doc(db, 'users', address.toLowerCase());
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setUser(userSnap.data() as User);
      }
    } catch (err) {
      console.error('[useUserData] 사용자 조회 실패:', err);
      setError('사용자 데이터 로드에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  // 연결 시 사용자 생성/업데이트 및 실시간 구독
  useEffect(() => {
    if (!isConnected || !address) {
      setUser(null);
      return;
    }

    // 사용자 생성/업데이트
    createOrUpdateUser();

    // 실시간 구독
    const userRef = doc(db, 'users', address.toLowerCase());
    const unsubscribe = onSnapshot(
      userRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setUser(snapshot.data() as User);
        } else {
          setUser(null);
        }
      },
      (err) => {
        console.error('[useUserData] 실시간 구독 오류:', err);
        setError('실시간 데이터 동기화에 실패했습니다.');
      }
    );

    return () => unsubscribe();
  }, [isConnected, address, createOrUpdateUser]);

  return {
    user,
    isLoading,
    error,
    createOrUpdateUser,
    refreshUser,
  };
}
