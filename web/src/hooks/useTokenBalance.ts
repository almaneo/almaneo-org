/**
 * useTokenBalance Hook
 * ALMAN 토큰 잔액 조회
 */

import { useState, useEffect, useCallback } from 'react';
import { Contract, formatUnits } from 'ethers';
import { useWallet } from '../components/wallet';
import { getContractAddress, isContractDeployed } from '../contracts/addresses';
import { ALMANTokenABI } from '../contracts/abis';

interface TokenBalanceState {
  balance: string;
  rawBalance: bigint;
  isLoading: boolean;
  error: string | null;
}

interface UseTokenBalanceReturn extends TokenBalanceState {
  refresh: () => Promise<void>;
  formattedBalance: string;
}

export function useTokenBalance(): UseTokenBalanceReturn {
  const { provider, address, chainId, isConnected } = useWallet();

  const [state, setState] = useState<TokenBalanceState>({
    balance: '0',
    rawBalance: BigInt(0),
    isLoading: false,
    error: null,
  });

  const fetchBalance = useCallback(async () => {
    if (!provider || !address || !isConnected) {
      setState(prev => ({ ...prev, balance: '0', rawBalance: BigInt(0) }));
      return;
    }

    // 컨트랙트 배포 여부 확인
    if (!isContractDeployed('ALMANToken', chainId ?? undefined)) {
      setState(prev => ({
        ...prev,
        balance: '0',
        rawBalance: BigInt(0),
        error: 'Contract not deployed on this network',
      }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const tokenAddress = getContractAddress('ALMANToken', chainId ?? undefined);
      const tokenContract = new Contract(tokenAddress, ALMANTokenABI, provider);

      const rawBalance = await tokenContract.balanceOf(address);
      const formattedBalance = formatUnits(rawBalance, 18);

      setState({
        balance: formattedBalance,
        rawBalance: rawBalance,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      console.error('[useTokenBalance] Error fetching balance:', err);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch balance',
      }));
    }
  }, [provider, address, chainId, isConnected]);

  // 초기 로드 및 주소 변경 시 새로고침
  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  // 포맷된 잔액 (천 단위 구분자)
  const formattedBalance = parseFloat(state.balance).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return {
    ...state,
    refresh: fetchBalance,
    formattedBalance,
  };
}
