/**
 * useTokenVesting Hook
 * TokenVesting 컨트랙트 온체인 데이터 조회
 */

import { useState, useEffect, useCallback } from 'react';
import { Contract, formatEther } from 'ethers';
import { useWallet } from '../components/wallet';
import { getContractAddress, isContractDeployed } from '../contracts/addresses';
import { TokenVestingABI } from '../contracts/abis';

export interface VestingInfo {
  totalAllocated: string;
  totalReleased: string;
  contractBalance: string;
  beneficiaryCount: number;
  isLoading: boolean;
  error: string | null;
}

export interface BeneficiaryVesting {
  totalAmount: string;
  releasedAmount: string;
  startTime: number;
  cliffDuration: number;
  vestingDuration: number;
  revoked: boolean;
  vestedAmount: string;
  releasableAmount: string;
  progress: number; // 0-100%
}

export function useTokenVesting() {
  const { provider, chainId } = useWallet();

  const [state, setState] = useState<VestingInfo>({
    totalAllocated: '0',
    totalReleased: '0',
    contractBalance: '0',
    beneficiaryCount: 0,
    isLoading: false,
    error: null,
  });

  const fetchData = useCallback(async () => {
    if (!provider) return;
    if (!isContractDeployed('TokenVesting', chainId ?? undefined)) {
      setState(prev => ({ ...prev, error: 'Contract not deployed' }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const contractAddress = getContractAddress('TokenVesting', chainId ?? undefined);
      const contract = new Contract(contractAddress, TokenVestingABI, provider);

      const [totalAllocated, totalReleased, contractBalance, beneficiaryCount] = await Promise.all([
        contract.totalAllocated(),
        contract.totalReleased(),
        contract.getContractBalance(),
        contract.getBeneficiaryCount(),
      ]);

      setState({
        totalAllocated: formatEther(totalAllocated),
        totalReleased: formatEther(totalReleased),
        contractBalance: formatEther(contractBalance),
        beneficiaryCount: Number(beneficiaryCount),
        isLoading: false,
        error: null,
      });
    } catch (err) {
      console.error('[useTokenVesting] Error:', err);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch vesting data',
      }));
    }
  }, [provider, chainId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, refresh: fetchData };
}
