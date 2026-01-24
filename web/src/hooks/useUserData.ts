/**
 * useUserData Hook
 * Supabase에서 사용자 데이터를 관리하는 커스텀 훅
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase, type DbUser } from '../supabase';
import { useWallet } from '../components/wallet';

// 사용자 타입 정의
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
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
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

// DB 데이터를 User 타입으로 변환
function dbUserToUser(dbUser: DbUser): User {
  return {
    walletAddress: dbUser.wallet_address,
    profile: {
      nickname: dbUser.nickname || `ALMAN_${dbUser.wallet_address.slice(0, 6)}`,
      avatar: dbUser.avatar_url,
    },
    kindnessScore: dbUser.kindness_score,
    totalPoints: dbUser.total_points,
    level: dbUser.level,
    settings: {
      language: dbUser.language,
      notifications: dbUser.notifications_enabled,
      theme: 'dark',
    },
    stakingTier: 'bronze',
    createdAt: new Date(dbUser.created_at),
    updatedAt: new Date(dbUser.updated_at),
  };
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
      const walletAddress = address.toLowerCase();

      // 기존 사용자 확인
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('wallet_address', walletAddress)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        // PGRST116 = 결과 없음 (새 사용자)
        throw fetchError;
      }

      if (existingUser) {
        // 기존 사용자 - updated_at 업데이트
        const { error: updateError } = await supabase
          .from('users')
          .update({ updated_at: new Date().toISOString() })
          .eq('wallet_address', walletAddress);

        if (updateError) throw updateError;
      } else {
        // 새 사용자 생성
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            wallet_address: walletAddress,
            nickname: userInfo?.name || `ALMAN_${walletAddress.slice(0, 6)}`,
            avatar_url: userInfo?.profileImage || null,
            kindness_score: 0,
            total_points: 0,
            level: 1,
            language: 'ko',
            notifications_enabled: true,
          });

        if (insertError) throw insertError;
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
      const { data, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('wallet_address', address.toLowerCase())
        .single();

      if (fetchError) throw fetchError;

      if (data) {
        setUser(dbUserToUser(data));
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

    const walletAddress = address.toLowerCase();

    // 사용자 생성/업데이트
    createOrUpdateUser();

    // 초기 데이터 로드
    refreshUser();

    // 실시간 구독 (Supabase Realtime)
    const channel = supabase
      .channel(`user:${walletAddress}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'users',
          filter: `wallet_address=eq.${walletAddress}`,
        },
        (payload) => {
          if (payload.new) {
            setUser(dbUserToUser(payload.new as DbUser));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isConnected, address, createOrUpdateUser, refreshUser]);

  return {
    user,
    isLoading,
    error,
    createOrUpdateUser,
    refreshUser,
  };
}
