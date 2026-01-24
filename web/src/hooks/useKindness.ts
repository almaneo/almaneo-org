/**
 * useKindness Hook
 * Kindness Score 및 활동 관련 데이터를 관리하는 커스텀 훅
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase, type DbKindnessActivity } from '../supabase';
import { useWallet } from '../components/wallet';
import type { AmbassadorTier, KindnessActivityType } from '../../../shared/types/user';
import {
  getUserKindnessScore,
  getUserActivities,
  getUserActivityStats,
  addKindnessActivity,
  getKindnessLeaderboard,
  AMBASSADOR_TIERS,
} from '../services/kindness';

export interface KindnessStats {
  score: number;
  tier: AmbassadorTier;
  tierLabel: string;
  nextTier: AmbassadorTier | null;
  nextTierLabel: string | null;
  pointsToNextTier: number;
  progress: number; // 다음 티어까지 진행률 (0-100)
}

export interface ActivityStats {
  totalActivities: number;
  verifiedActivities: number;
  pendingActivities: number;
  meetupsAttended: number;
  meetupsHosted: number;
}

export interface LeaderboardEntry {
  rank: number;
  walletAddress: string;
  nickname: string | null;
  kindnessScore: number;
  tier: AmbassadorTier;
}

interface UseKindnessReturn {
  // 데이터
  kindnessStats: KindnessStats | null;
  activities: DbKindnessActivity[];
  activityStats: ActivityStats | null;
  leaderboard: LeaderboardEntry[];

  // 상태
  isLoading: boolean;
  error: string | null;

  // 액션
  refreshKindnessData: () => Promise<void>;
  loadLeaderboard: () => Promise<void>;
  recordActivity: (type: KindnessActivityType, description?: string) => Promise<boolean>;
}

export function useKindness(): UseKindnessReturn {
  const { address, isConnected } = useWallet();
  const [kindnessStats, setKindnessStats] = useState<KindnessStats | null>(null);
  const [activities, setActivities] = useState<DbKindnessActivity[]>([]);
  const [activityStats, setActivityStats] = useState<ActivityStats | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Kindness 데이터 로드
  const refreshKindnessData = useCallback(async () => {
    if (!address) return;

    setIsLoading(true);
    setError(null);

    try {
      const walletAddress = address.toLowerCase();

      // 병렬로 데이터 로드
      const [scoreData, activitiesData, statsData] = await Promise.all([
        getUserKindnessScore(walletAddress),
        getUserActivities(walletAddress, { limit: 20 }),
        getUserActivityStats(walletAddress),
      ]);

      // 티어 정보 가공
      const tierInfo = AMBASSADOR_TIERS[scoreData.tier];
      const nextTierInfo = scoreData.nextTier
        ? AMBASSADOR_TIERS[scoreData.nextTier]
        : null;

      // 진행률 계산
      let progress = 0;
      if (scoreData.nextTier) {
        const currentMin = AMBASSADOR_TIERS[scoreData.tier].minScore;
        const nextMin = AMBASSADOR_TIERS[scoreData.nextTier].minScore;
        const range = nextMin - currentMin;
        const current = scoreData.score - currentMin;
        progress = Math.min(100, Math.floor((current / range) * 100));
      } else {
        progress = 100; // 최고 티어
      }

      setKindnessStats({
        score: scoreData.score,
        tier: scoreData.tier,
        tierLabel: tierInfo.label,
        nextTier: scoreData.nextTier,
        nextTierLabel: nextTierInfo?.label || null,
        pointsToNextTier: scoreData.pointsToNextTier,
        progress,
      });

      setActivities(activitiesData);
      setActivityStats(statsData);
    } catch (err) {
      console.error('[useKindness] 데이터 로드 실패:', err);
      setError('Kindness 데이터를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  // 리더보드 로드
  const loadLeaderboard = useCallback(async () => {
    setIsLoading(true);

    try {
      const data = await getKindnessLeaderboard(100);
      setLeaderboard(data);
    } catch (err) {
      console.error('[useKindness] 리더보드 로드 실패:', err);
      setError('리더보드를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 활동 기록
  const recordActivity = useCallback(async (
    type: KindnessActivityType,
    description?: string
  ): Promise<boolean> => {
    if (!isConnected || !address) {
      setError('지갑을 먼저 연결해주세요.');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const activity = await addKindnessActivity({
        userAddress: address.toLowerCase(),
        type,
        description,
        verified: false, // 기본적으로 미인증 상태
      });

      if (activity) {
        // 데이터 새로고침
        await refreshKindnessData();
        return true;
      }

      return false;
    } catch (err) {
      console.error('[useKindness] 활동 기록 실패:', err);
      setError('활동 기록에 실패했습니다.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, address, refreshKindnessData]);

  // 연결 시 데이터 로드 및 실시간 구독
  useEffect(() => {
    if (!isConnected || !address) {
      setKindnessStats(null);
      setActivities([]);
      setActivityStats(null);
      return;
    }

    const walletAddress = address.toLowerCase();

    // 초기 데이터 로드
    refreshKindnessData();

    // 실시간 구독 (활동 변경 시)
    const activitiesChannel = supabase
      .channel(`activities:${walletAddress}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'kindness_activities',
          filter: `user_address=eq.${walletAddress}`,
        },
        () => {
          // 활동 변경 시 데이터 새로고침
          refreshKindnessData();
        }
      )
      .subscribe();

    // 사용자 점수 변경 구독
    const userChannel = supabase
      .channel(`user-score:${walletAddress}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'users',
          filter: `wallet_address=eq.${walletAddress}`,
        },
        () => {
          // 점수 변경 시 데이터 새로고침
          refreshKindnessData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(activitiesChannel);
      supabase.removeChannel(userChannel);
    };
  }, [isConnected, address, refreshKindnessData]);

  return {
    kindnessStats,
    activities,
    activityStats,
    leaderboard,
    isLoading,
    error,
    refreshKindnessData,
    loadLeaderboard,
    recordActivity,
  };
}

// 티어 색상 헬퍼
export function getTierColor(tier: AmbassadorTier): string {
  switch (tier) {
    case 'guardian':
      return 'text-purple-400';
    case 'ambassador':
      return 'text-yellow-400';
    case 'host':
      return 'text-blue-400';
    case 'friend':
    default:
      return 'text-green-400';
  }
}

// 티어 배경색 헬퍼
export function getTierBgColor(tier: AmbassadorTier): string {
  switch (tier) {
    case 'guardian':
      return 'bg-purple-500/20';
    case 'ambassador':
      return 'bg-yellow-500/20';
    case 'host':
      return 'bg-blue-500/20';
    case 'friend':
    default:
      return 'bg-green-500/20';
  }
}

// 티어 아이콘 헬퍼
export function getTierIcon(tier: AmbassadorTier): string {
  switch (tier) {
    case 'guardian':
      return '🛡️';
    case 'ambassador':
      return '🌟';
    case 'host':
      return '🏠';
    case 'friend':
    default:
      return '🤝';
  }
}
