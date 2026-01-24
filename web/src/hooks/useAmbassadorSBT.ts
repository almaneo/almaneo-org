/**
 * useAmbassadorSBT Hook
 * AmbassadorSBT 스마트 컨트랙트에서 온체인 데이터를 읽어오는 커스텀 훅
 */

import { useState, useEffect, useCallback } from 'react';
import { Contract } from 'ethers';
import { useWallet } from '../components/wallet';
import { getContractAddress, isContractDeployed } from '../contracts/addresses';
import {
  AmbassadorSBTABI,
  AmbassadorTier,
  TIER_NAMES,
} from '../contracts/abis/AmbassadorSBT';

// 온체인 Ambassador 데이터 타입
export interface OnchainAmbassadorData {
  tokenId: bigint;
  tier: AmbassadorTier;
  tierName: string;
  meetupsAttended: number;
  meetupsHosted: number;
  kindnessScore: number;
  referralCount: number;
  mintedAt: Date | null;
  hasSBT: boolean;
}

// 다음 티어 요구사항 타입
export interface NextTierRequirements {
  nextTier: AmbassadorTier;
  nextTierName: string;
  meetupsNeeded: number;
  hostingsNeeded: number;
  scoreNeeded: number;
  referralsNeeded: number;
}

// 컨트랙트 상수
export interface ContractConstants {
  friendMeetups: number;
  hostMeetups: number;
  ambassadorScore: number;
  guardianScore: number;
  guardianReferrals: number;
  totalSupply: number;
}

interface UseAmbassadorSBTReturn {
  // 데이터
  ambassadorData: OnchainAmbassadorData | null;
  nextTierRequirements: NextTierRequirements | null;
  contractConstants: ContractConstants | null;
  referrals: string[];

  // 상태
  isLoading: boolean;
  isContractAvailable: boolean;
  error: string | null;

  // 액션
  refresh: () => Promise<void>;
}

export function useAmbassadorSBT(): UseAmbassadorSBTReturn {
  const { address, isConnected, provider, chainId } = useWallet();

  const [ambassadorData, setAmbassadorData] = useState<OnchainAmbassadorData | null>(null);
  const [nextTierRequirements, setNextTierRequirements] = useState<NextTierRequirements | null>(null);
  const [contractConstants, setContractConstants] = useState<ContractConstants | null>(null);
  const [referrals, setReferrals] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 컨트랙트 사용 가능 여부
  const isContractAvailable = isContractDeployed('AmbassadorSBT', chainId ?? undefined);

  // 컨트랙트 인스턴스 생성
  const getContract = useCallback(() => {
    if (!provider || !isContractAvailable) return null;

    const contractAddress = getContractAddress('AmbassadorSBT', chainId ?? undefined);
    if (!contractAddress) return null;

    return new Contract(contractAddress, AmbassadorSBTABI, provider);
  }, [provider, isContractAvailable, chainId]);

  // Ambassador 데이터 로드
  const loadAmbassadorData = useCallback(async () => {
    const contract = getContract();
    if (!contract || !address) return;

    try {
      // SBT 보유 여부 확인
      const hasSBT = await contract.hasAmbassadorSBT(address);

      if (!hasSBT) {
        setAmbassadorData({
          tokenId: BigInt(0),
          tier: AmbassadorTier.None,
          tierName: TIER_NAMES[AmbassadorTier.None],
          meetupsAttended: 0,
          meetupsHosted: 0,
          kindnessScore: 0,
          referralCount: 0,
          mintedAt: null,
          hasSBT: false,
        });
        return;
      }

      // 전체 Ambassador 데이터 조회
      const data = await contract.getAmbassadorByAddress(address);

      const tier = Number(data.tier) as AmbassadorTier;
      const mintedAtTimestamp = Number(data.mintedAt);

      setAmbassadorData({
        tokenId: data.tokenId,
        tier,
        tierName: TIER_NAMES[tier],
        meetupsAttended: Number(data.meetupsAttended),
        meetupsHosted: Number(data.meetupsHosted),
        kindnessScore: Number(data.kindnessScore),
        referralCount: Number(data.referralCount),
        mintedAt: mintedAtTimestamp > 0 ? new Date(mintedAtTimestamp * 1000) : null,
        hasSBT: true,
      });
    } catch (err) {
      console.error('[useAmbassadorSBT] Ambassador 데이터 로드 실패:', err);
      throw err;
    }
  }, [getContract, address]);

  // 다음 티어 요구사항 로드
  const loadNextTierRequirements = useCallback(async () => {
    const contract = getContract();
    if (!contract || !address) return;

    try {
      const reqs = await contract.getNextTierRequirements(address);
      const nextTier = Number(reqs.nextTier) as AmbassadorTier;

      // 이미 최고 티어인 경우
      if (nextTier === AmbassadorTier.None) {
        setNextTierRequirements(null);
        return;
      }

      setNextTierRequirements({
        nextTier,
        nextTierName: TIER_NAMES[nextTier],
        meetupsNeeded: Number(reqs.meetupsNeeded),
        hostingsNeeded: Number(reqs.hostingsNeeded),
        scoreNeeded: Number(reqs.scoreNeeded),
        referralsNeeded: Number(reqs.referralsNeeded),
      });
    } catch (err) {
      console.error('[useAmbassadorSBT] 다음 티어 요구사항 로드 실패:', err);
      // 에러가 발생해도 계속 진행 (선택적 데이터)
    }
  }, [getContract, address]);

  // 컨트랙트 상수 로드
  const loadContractConstants = useCallback(async () => {
    const contract = getContract();
    if (!contract) return;

    try {
      const [
        friendMeetups,
        hostMeetups,
        ambassadorScore,
        guardianScore,
        guardianReferrals,
        totalSupply,
      ] = await Promise.all([
        contract.FRIEND_MEETUPS(),
        contract.HOST_MEETUPS(),
        contract.AMBASSADOR_SCORE(),
        contract.GUARDIAN_SCORE(),
        contract.GUARDIAN_REFERRALS(),
        contract.totalSupply(),
      ]);

      setContractConstants({
        friendMeetups: Number(friendMeetups),
        hostMeetups: Number(hostMeetups),
        ambassadorScore: Number(ambassadorScore),
        guardianScore: Number(guardianScore),
        guardianReferrals: Number(guardianReferrals),
        totalSupply: Number(totalSupply),
      });
    } catch (err) {
      console.error('[useAmbassadorSBT] 컨트랙트 상수 로드 실패:', err);
      // 에러가 발생해도 계속 진행 (선택적 데이터)
    }
  }, [getContract]);

  // 추천인 목록 로드
  const loadReferrals = useCallback(async () => {
    const contract = getContract();
    if (!contract || !address) return;

    try {
      const hasSBT = await contract.hasAmbassadorSBT(address);
      if (!hasSBT) {
        setReferrals([]);
        return;
      }

      const refs = await contract.getReferrals(address);
      setReferrals(refs as string[]);
    } catch (err) {
      console.error('[useAmbassadorSBT] 추천인 목록 로드 실패:', err);
      // 에러가 발생해도 계속 진행 (선택적 데이터)
    }
  }, [getContract, address]);

  // 전체 데이터 새로고침
  const refresh = useCallback(async () => {
    if (!isConnected || !address || !provider || !isContractAvailable) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await Promise.all([
        loadAmbassadorData(),
        loadNextTierRequirements(),
        loadContractConstants(),
        loadReferrals(),
      ]);
    } catch (err) {
      console.error('[useAmbassadorSBT] 데이터 로드 실패:', err);
      setError('온체인 데이터를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [
    isConnected,
    address,
    provider,
    isContractAvailable,
    loadAmbassadorData,
    loadNextTierRequirements,
    loadContractConstants,
    loadReferrals,
  ]);

  // 연결 시 자동 로드
  useEffect(() => {
    if (isConnected && address && provider && isContractAvailable) {
      refresh();
    } else {
      // 연결 해제 시 상태 초기화
      setAmbassadorData(null);
      setNextTierRequirements(null);
      setReferrals([]);
    }
  }, [isConnected, address, provider, isContractAvailable, refresh]);

  return {
    ambassadorData,
    nextTierRequirements,
    contractConstants,
    referrals,
    isLoading,
    isContractAvailable,
    error,
    refresh,
  };
}

// 티어 색상 헬퍼 (온체인 티어용)
export function getOnchainTierColor(tier: AmbassadorTier): string {
  switch (tier) {
    case AmbassadorTier.Guardian:
      return 'text-purple-400';
    case AmbassadorTier.Ambassador:
      return 'text-yellow-400';
    case AmbassadorTier.Host:
      return 'text-blue-400';
    case AmbassadorTier.Friend:
      return 'text-green-400';
    default:
      return 'text-slate-400';
  }
}

// 티어 배경색 헬퍼 (온체인 티어용)
export function getOnchainTierBgColor(tier: AmbassadorTier): string {
  switch (tier) {
    case AmbassadorTier.Guardian:
      return 'bg-purple-500/20';
    case AmbassadorTier.Ambassador:
      return 'bg-yellow-500/20';
    case AmbassadorTier.Host:
      return 'bg-blue-500/20';
    case AmbassadorTier.Friend:
      return 'bg-green-500/20';
    default:
      return 'bg-slate-500/20';
  }
}

// 티어 아이콘 헬퍼 (온체인 티어용)
export function getOnchainTierIcon(tier: AmbassadorTier): string {
  switch (tier) {
    case AmbassadorTier.Guardian:
      return '🛡️';
    case AmbassadorTier.Ambassador:
      return '🌟';
    case AmbassadorTier.Host:
      return '🏠';
    case AmbassadorTier.Friend:
      return '🤝';
    default:
      return '👤';
  }
}
