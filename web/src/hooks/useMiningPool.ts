/**
 * useMiningPool Hook
 * MiningPool 컨트랙트 온체인 데이터 조회
 */

import { useState, useEffect, useCallback } from 'react';
import { Contract, formatEther } from 'ethers';
import { useWallet } from '../components/wallet';
import { getContractAddress, isContractDeployed } from '../contracts/addresses';
import { MiningPoolABI } from '../contracts/abis';

export interface MiningPoolState {
  currentEpoch: number;
  remainingPool: string;
  totalClaimed: string;
  miningProgress: number; // 0-100%
  contractBalance: string;
  dailyRemaining: string;
  userDailyRemaining: string;
  dailyClaimLimit: string;
  userDailyClaimLimit: string;
  miningPoolTotal: string;
  isLoading: boolean;
  error: string | null;
}

export function useMiningPool() {
  const { provider, address, chainId, isConnected } = useWallet();

  const [state, setState] = useState<MiningPoolState>({
    currentEpoch: 0,
    remainingPool: '0',
    totalClaimed: '0',
    miningProgress: 0,
    contractBalance: '0',
    dailyRemaining: '0',
    userDailyRemaining: '0',
    dailyClaimLimit: '0',
    userDailyClaimLimit: '0',
    miningPoolTotal: '800000000',
    isLoading: false,
    error: null,
  });

  const fetchData = useCallback(async () => {
    if (!provider) return;
    if (!isContractDeployed('MiningPool', chainId ?? undefined)) {
      setState(prev => ({ ...prev, error: 'Contract not deployed' }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const contractAddress = getContractAddress('MiningPool', chainId ?? undefined);
      const contract = new Contract(contractAddress, MiningPoolABI, provider);

      const queries: Promise<unknown>[] = [
        contract.getCurrentEpoch(),
        contract.remainingPool(),
        contract.totalClaimed(),
        contract.miningProgress(),
        contract.getContractBalance(),
        contract.getDailyRemaining(),
        contract.dailyClaimLimit(),
        contract.userDailyClaimLimit(),
        contract.MINING_POOL_TOTAL(),
      ];

      if (isConnected && address) {
        queries.push(contract.getUserDailyRemaining(address));
      }

      const results = await Promise.all(queries);

      setState({
        currentEpoch: Number(results[0]),
        remainingPool: formatEther(results[1] as bigint),
        totalClaimed: formatEther(results[2] as bigint),
        miningProgress: Number(results[3]) / 100,
        contractBalance: formatEther(results[4] as bigint),
        dailyRemaining: formatEther(results[5] as bigint),
        dailyClaimLimit: formatEther(results[6] as bigint),
        userDailyClaimLimit: formatEther(results[7] as bigint),
        miningPoolTotal: formatEther(results[8] as bigint),
        userDailyRemaining: results.length > 9 ? formatEther(results[9] as bigint) : '0',
        isLoading: false,
        error: null,
      });
    } catch (err) {
      console.error('[useMiningPool] Error:', err);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch mining data',
      }));
    }
  }, [provider, address, chainId, isConnected]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, refresh: fetchData };
}
