/**
 * useAirdrop Hook
 * KindnessAirdrop 컨트랙트 연동
 */

import { useState, useEffect, useCallback } from 'react';
import { Contract, formatUnits } from 'ethers';
import { useWallet } from '../components/wallet';
import { getContractAddress, isContractDeployed } from '../contracts/addresses';
import { KindnessAirdropABI, type AirdropCampaign } from '../contracts/abis';

interface AirdropStats {
  totalClaimed: string;
  dailyClaimed: string;
  remainingDailyLimit: string;
  lastClaimTime: Date | null;
}

interface UseAirdropState {
  campaigns: AirdropCampaign[];
  userStats: AirdropStats | null;
  claimedCampaigns: Set<number>;
  isLoading: boolean;
  error: string | null;
  isContractAvailable: boolean;
}

interface UseAirdropReturn extends UseAirdropState {
  refresh: () => Promise<void>;
  claim: (campaignId: number, amount: bigint, merkleProof: string[]) => Promise<boolean>;
  hasClaimedCampaign: (campaignId: number) => boolean;
  getActiveCampaigns: () => AirdropCampaign[];
  formatAmount: (amount: bigint) => string;
}

export function useAirdrop(): UseAirdropReturn {
  const { provider, signer, address, chainId, isConnected } = useWallet();

  const [state, setState] = useState<UseAirdropState>({
    campaigns: [],
    userStats: null,
    claimedCampaigns: new Set(),
    isLoading: false,
    error: null,
    isContractAvailable: false,
  });

  // 컨트랙트 인스턴스 생성
  const getContract = useCallback((withSigner = false) => {
    if (!provider) return null;
    if (!isContractDeployed('KindnessAirdrop', chainId ?? undefined)) return null;

    const contractAddress = getContractAddress('KindnessAirdrop', chainId ?? undefined);
    return new Contract(
      contractAddress,
      KindnessAirdropABI,
      withSigner && signer ? signer : provider
    );
  }, [provider, signer, chainId]);

  // 금액 포맷
  const formatAmount = useCallback((amount: bigint): string => {
    const formatted = parseFloat(formatUnits(amount, 18));
    return formatted.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  }, []);

  // 데이터 로드
  const fetchData = useCallback(async () => {
    const contract = getContract();
    if (!contract) {
      setState(prev => ({ ...prev, isContractAvailable: false, isLoading: false }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null, isContractAvailable: true }));

    try {
      // 캠페인 수 조회
      const campaignCount = await contract.campaignCount();
      const count = Number(campaignCount);

      // 모든 캠페인 정보 로드
      const campaignPromises: Promise<AirdropCampaign>[] = [];
      for (let i = 1; i <= count; i++) {
        campaignPromises.push(
          contract.getCampaignInfo(i).then((info: [string, bigint, bigint, bigint, bigint, bigint, boolean, string]) => ({
            id: i,
            merkleRoot: info[0],
            totalAmount: info[1],
            claimedAmount: info[2],
            startTime: Number(info[3]),
            endTime: Number(info[4]),
            maxClaimPerUser: info[5],
            active: info[6],
            description: info[7],
          }))
        );
      }

      const campaigns = await Promise.all(campaignPromises);

      // 사용자 정보 조회 (연결된 경우)
      let userStats: AirdropStats | null = null;
      const claimedCampaigns = new Set<number>();

      if (address && isConnected) {
        // 사용자 클레임 정보
        const userInfo = await contract.getUserInfo(address) as [bigint, bigint, bigint, bigint];
        userStats = {
          totalClaimed: formatAmount(userInfo[0]),
          lastClaimTime: userInfo[1] > 0 ? new Date(Number(userInfo[1]) * 1000) : null,
          dailyClaimed: formatAmount(userInfo[2]),
          remainingDailyLimit: formatAmount(userInfo[3]),
        };

        // 각 캠페인별 클레임 여부 확인
        for (const campaign of campaigns) {
          if (campaign.active) {
            const hasClaimed = await contract.hasClaimed(campaign.id, address);
            if (hasClaimed) {
              claimedCampaigns.add(campaign.id);
            }
          }
        }
      }

      setState({
        campaigns,
        userStats,
        claimedCampaigns,
        isLoading: false,
        error: null,
        isContractAvailable: true,
      });
    } catch (err) {
      console.error('[useAirdrop] Error fetching data:', err);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch airdrop data',
      }));
    }
  }, [getContract, address, isConnected, formatAmount]);

  // 클레임 실행
  const claim = useCallback(async (
    campaignId: number,
    amount: bigint,
    merkleProof: string[]
  ): Promise<boolean> => {
    const contract = getContract(true);
    if (!contract || !signer) {
      setState(prev => ({ ...prev, error: 'Wallet not connected' }));
      return false;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const tx = await contract.claim(campaignId, amount, merkleProof);
      await tx.wait();

      // 데이터 새로고침
      await fetchData();

      return true;
    } catch (err) {
      console.error('[useAirdrop] Claim error:', err);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to claim airdrop',
      }));
      return false;
    }
  }, [getContract, signer, fetchData]);

  // 캠페인 클레임 여부 확인
  const hasClaimedCampaign = useCallback((campaignId: number): boolean => {
    return state.claimedCampaigns.has(campaignId);
  }, [state.claimedCampaigns]);

  // 활성 캠페인 필터
  const getActiveCampaigns = useCallback((): AirdropCampaign[] => {
    const now = Math.floor(Date.now() / 1000);
    return state.campaigns.filter(c =>
      c.active &&
      c.startTime <= now &&
      c.endTime >= now &&
      c.claimedAmount < c.totalAmount
    );
  }, [state.campaigns]);

  // 초기 로드 및 주소 변경 시 새로고침
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    ...state,
    refresh: fetchData,
    claim,
    hasClaimedCampaign,
    getActiveCampaigns,
    formatAmount,
  };
}
