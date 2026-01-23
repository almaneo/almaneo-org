/**
 * useStaking Hook
 * AlmaNEO Staking 컨트랙트 연동 (ALMAN)
 */

import { useState, useEffect, useCallback } from 'react';
import { Contract, formatUnits, parseUnits } from 'ethers';
import { useWallet } from '../components/wallet';
import { getContractAddress, isContractDeployed } from '../contracts/addresses';
import { ALMANStakingABI, ALMANTokenABI, StakingTier, TIER_NAMES } from '../contracts/abis';

export interface StakeInfo {
  amount: string;
  pendingReward: string;
  tier: StakingTier;
  tierName: string;
  lastStakedAt: Date | null;
  lockEndTime: Date | null;
  isLocked: boolean;
}

export interface TierInfo {
  name: string;
  minAmount: string;
  apyPercent: number;
  kindnessMultiplier: number;
  lockPeriodDays: number;
}

export interface StakingStats {
  totalStaked: string;
  rewardPool: string;
  earlyWithdrawPenaltyPercent: number;
}

export function useStaking() {
  const { provider, address, isConnected } = useWallet();

  const [stakeInfo, setStakeInfo] = useState<StakeInfo | null>(null);
  const [tokenBalance, setTokenBalance] = useState<string>('0');
  const [tokenAllowance, setTokenAllowance] = useState<string>('0');
  const [stakingStats, setStakingStats] = useState<StakingStats | null>(null);
  const [tierInfos, setTierInfos] = useState<TierInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 컨트랙트 배포 여부
  const isDeployed = isContractDeployed('ALMANStaking');
  const stakingAddress = getContractAddress('ALMANStaking');
  const tokenAddress = getContractAddress('ALMANToken');

  // 컨트랙트 인스턴스 가져오기
  const getContracts = useCallback(() => {
    if (!provider || !isDeployed) return null;

    const stakingContract = new Contract(stakingAddress, ALMANStakingABI, provider);
    const tokenContract = new Contract(tokenAddress, ALMANTokenABI, provider);

    return { stakingContract, tokenContract, provider };
  }, [provider, isDeployed, stakingAddress, tokenAddress]);

  // 스테이킹 정보 로드
  const loadStakeInfo = useCallback(async () => {
    if (!address || !isDeployed) return;

    const contracts = getContracts();
    if (!contracts) return;

    try {
      const [amount, pendingReward, tier, lastStakedAt, lockEndTime] =
        await contracts.stakingContract.getStakeInfo(address);

      const now = Date.now();
      const lockEndMs = Number(lockEndTime) * 1000;

      setStakeInfo({
        amount: formatUnits(amount, 18),
        pendingReward: formatUnits(pendingReward, 18),
        tier: Number(tier) as StakingTier,
        tierName: TIER_NAMES[Number(tier)],
        lastStakedAt: Number(lastStakedAt) > 0 ? new Date(Number(lastStakedAt) * 1000) : null,
        lockEndTime: Number(lockEndTime) > 0 ? new Date(lockEndMs) : null,
        isLocked: lockEndMs > now,
      });
    } catch (err) {
      console.error('Failed to load stake info:', err);
    }
  }, [address, isDeployed, getContracts]);

  // 토큰 잔액 및 허용량 로드
  const loadTokenInfo = useCallback(async () => {
    if (!address || !isDeployed) return;

    const contracts = getContracts();
    if (!contracts) return;

    try {
      const [balance, allowance] = await Promise.all([
        contracts.tokenContract.balanceOf(address),
        contracts.tokenContract.allowance(address, stakingAddress),
      ]);

      setTokenBalance(formatUnits(balance, 18));
      setTokenAllowance(formatUnits(allowance, 18));
    } catch (err) {
      console.error('Failed to load token info:', err);
    }
  }, [address, isDeployed, getContracts, stakingAddress]);

  // 스테이킹 통계 로드
  const loadStakingStats = useCallback(async () => {
    if (!isDeployed) return;

    const contracts = getContracts();
    if (!contracts) return;

    try {
      const [totalStaked, rewardPool, penaltyBps] = await Promise.all([
        contracts.stakingContract.totalStaked(),
        contracts.stakingContract.rewardPool(),
        contracts.stakingContract.earlyWithdrawPenaltyBps(),
      ]);

      setStakingStats({
        totalStaked: formatUnits(totalStaked, 18),
        rewardPool: formatUnits(rewardPool, 18),
        earlyWithdrawPenaltyPercent: Number(penaltyBps) / 100,
      });
    } catch (err) {
      console.error('Failed to load staking stats:', err);
    }
  }, [isDeployed, getContracts]);

  // 티어 정보 로드
  const loadTierInfos = useCallback(async () => {
    if (!isDeployed) return;

    const contracts = getContracts();
    if (!contracts) return;

    try {
      const tiers: TierInfo[] = [];

      for (let i = 0; i < 4; i++) {
        const [minAmount, apyBps, kindnessWeight, lockPeriod] =
          await contracts.stakingContract.getTierInfo(i);

        tiers.push({
          name: TIER_NAMES[i],
          minAmount: formatUnits(minAmount, 18),
          apyPercent: Number(apyBps) / 100,
          kindnessMultiplier: Number(kindnessWeight) / 100,
          lockPeriodDays: Number(lockPeriod) / 86400,
        });
      }

      setTierInfos(tiers);
    } catch (err) {
      console.error('Failed to load tier infos:', err);
    }
  }, [isDeployed, getContracts]);

  // 토큰 승인
  const approveToken = useCallback(async (amount: string) => {
    if (!address || !isDeployed) {
      setError('Wallet not connected or contract not deployed');
      return false;
    }

    const contracts = getContracts();
    if (!contracts) return false;

    try {
      setIsLoading(true);
      setError(null);

      const signer = await contracts.provider.getSigner();
      const tokenWithSigner = contracts.tokenContract.connect(signer) as Contract;

      const amountWei = parseUnits(amount, 18);
      const tx = await tokenWithSigner.approve(stakingAddress, amountWei);
      await tx.wait();

      await loadTokenInfo();
      return true;
    } catch (err: unknown) {
      console.error('Approve failed:', err);
      setError(err instanceof Error ? err.message : 'Approval failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [address, isDeployed, getContracts, stakingAddress, loadTokenInfo]);

  // 스테이킹
  const stake = useCallback(async (amount: string) => {
    if (!address || !isDeployed) {
      setError('Wallet not connected or contract not deployed');
      return false;
    }

    const contracts = getContracts();
    if (!contracts) return false;

    try {
      setIsLoading(true);
      setError(null);

      const amountWei = parseUnits(amount, 18);

      // 허용량 확인
      const currentAllowance = await contracts.tokenContract.allowance(address, stakingAddress);
      if (currentAllowance < amountWei) {
        // 먼저 승인
        const signer = await contracts.provider.getSigner();
        const tokenWithSigner = contracts.tokenContract.connect(signer) as Contract;
        const approveTx = await tokenWithSigner.approve(stakingAddress, amountWei);
        await approveTx.wait();
      }

      // 스테이킹
      const signer = await contracts.provider.getSigner();
      const stakingWithSigner = contracts.stakingContract.connect(signer) as Contract;
      const tx = await stakingWithSigner.stake(amountWei);
      await tx.wait();

      // 정보 새로고침
      await Promise.all([loadStakeInfo(), loadTokenInfo(), loadStakingStats()]);

      return true;
    } catch (err: unknown) {
      console.error('Stake failed:', err);
      setError(err instanceof Error ? err.message : 'Staking failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [address, isDeployed, getContracts, stakingAddress, loadStakeInfo, loadTokenInfo, loadStakingStats]);

  // 언스테이킹
  const unstake = useCallback(async (amount: string) => {
    if (!address || !isDeployed) {
      setError('Wallet not connected or contract not deployed');
      return false;
    }

    const contracts = getContracts();
    if (!contracts) return false;

    try {
      setIsLoading(true);
      setError(null);

      const signer = await contracts.provider.getSigner();
      const stakingWithSigner = contracts.stakingContract.connect(signer) as Contract;

      const amountWei = parseUnits(amount, 18);
      const tx = await stakingWithSigner.unstake(amountWei);
      await tx.wait();

      // 정보 새로고침
      await Promise.all([loadStakeInfo(), loadTokenInfo(), loadStakingStats()]);

      return true;
    } catch (err: unknown) {
      console.error('Unstake failed:', err);
      setError(err instanceof Error ? err.message : 'Unstaking failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [address, isDeployed, getContracts, loadStakeInfo, loadTokenInfo, loadStakingStats]);

  // 보상 클레임
  const claimReward = useCallback(async () => {
    if (!address || !isDeployed) {
      setError('Wallet not connected or contract not deployed');
      return false;
    }

    const contracts = getContracts();
    if (!contracts) return false;

    try {
      setIsLoading(true);
      setError(null);

      const signer = await contracts.provider.getSigner();
      const stakingWithSigner = contracts.stakingContract.connect(signer) as Contract;

      const tx = await stakingWithSigner.claimReward();
      await tx.wait();

      // 정보 새로고침
      await Promise.all([loadStakeInfo(), loadTokenInfo()]);

      return true;
    } catch (err: unknown) {
      console.error('Claim failed:', err);
      setError(err instanceof Error ? err.message : 'Claim failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [address, isDeployed, getContracts, loadStakeInfo, loadTokenInfo]);

  // 모든 데이터 새로고침
  const refresh = useCallback(async () => {
    setIsLoading(true);
    await Promise.all([
      loadStakeInfo(),
      loadTokenInfo(),
      loadStakingStats(),
      loadTierInfos(),
    ]);
    setIsLoading(false);
  }, [loadStakeInfo, loadTokenInfo, loadStakingStats, loadTierInfos]);

  // 초기 로드
  useEffect(() => {
    if (isConnected && provider && isDeployed) {
      refresh();
    }
  }, [isConnected, provider, isDeployed, refresh]);

  return {
    // State
    stakeInfo,
    tokenBalance,
    tokenAllowance,
    stakingStats,
    tierInfos,
    isLoading,
    error,
    isDeployed,

    // Actions
    approveToken,
    stake,
    unstake,
    claimReward,
    refresh,
  };
}
