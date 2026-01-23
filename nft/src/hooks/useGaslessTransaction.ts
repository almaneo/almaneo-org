/**
 * AlmaNEO NFT Gasless Transaction Hook
 * Biconomy Smart Account를 통한 가스비 없는 트랜잭션
 */

import { useState, useCallback } from 'react';
import { Contract, Interface } from 'ethers';
import { useBiconomy } from '../contexts/BiconomyContext';
import { useWeb3 } from '../contexts/Web3Context';

interface GaslessTransactionOptions {
  onSuccess?: (txHash: string) => void;
  onError?: (error: Error) => void;
  fallbackToRegular?: boolean; // Gasless 실패 시 일반 트랜잭션으로 폴백
}

interface TransactionState {
  isLoading: boolean;
  isGasless: boolean;
  txHash: string | null;
  error: string | null;
}

export const useGaslessTransaction = () => {
  const { smartAccount, isInitialized, sendGaslessTransaction, sendBatchGaslessTransactions } = useBiconomy();
  const { signer } = useWeb3();
  const [state, setState] = useState<TransactionState>({
    isLoading: false,
    isGasless: false,
    txHash: null,
    error: null,
  });

  /**
   * 단일 Gasless 트랜잭션 실행
   */
  const executeGasless = useCallback(async (
    contract: Contract,
    method: string,
    args: unknown[],
    options?: GaslessTransactionOptions
  ): Promise<string | null> => {
    setState({ isLoading: true, isGasless: true, txHash: null, error: null });

    try {
      // Smart Account가 초기화되지 않은 경우
      if (!isInitialized || !smartAccount) {
        if (options?.fallbackToRegular && signer) {
          console.log('[Gasless] Smart Account 없음, 일반 트랜잭션으로 폴백');
          setState(prev => ({ ...prev, isGasless: false }));

          const tx = await contract[method](...args);
          const receipt = await tx.wait();

          setState({ isLoading: false, isGasless: false, txHash: receipt.hash, error: null });
          options?.onSuccess?.(receipt.hash);
          return receipt.hash;
        }
        throw new Error('Smart Account가 초기화되지 않았습니다. 지갑을 연결해주세요.');
      }

      // 트랜잭션 데이터 인코딩
      const iface = contract.interface as Interface;
      const data = iface.encodeFunctionData(method, args);
      const contractAddress = await contract.getAddress();

      // Gasless 트랜잭션 전송
      const txHash = await sendGaslessTransaction({
        to: contractAddress,
        data,
      });

      setState({ isLoading: false, isGasless: true, txHash, error: null });
      options?.onSuccess?.(txHash);
      return txHash;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '트랜잭션 실패';
      console.error('[Gasless] 트랜잭션 오류:', err);

      // 폴백 옵션이 있으면 일반 트랜잭션 시도
      if (options?.fallbackToRegular && signer) {
        console.log('[Gasless] 폴백: 일반 트랜잭션으로 재시도');
        try {
          setState(prev => ({ ...prev, isGasless: false }));
          const tx = await contract[method](...args);
          const receipt = await tx.wait();

          setState({ isLoading: false, isGasless: false, txHash: receipt.hash, error: null });
          options?.onSuccess?.(receipt.hash);
          return receipt.hash;
        } catch (fallbackErr) {
          const fallbackError = fallbackErr instanceof Error ? fallbackErr.message : '폴백 트랜잭션 실패';
          setState({ isLoading: false, isGasless: false, txHash: null, error: fallbackError });
          options?.onError?.(new Error(fallbackError));
          return null;
        }
      }

      setState({ isLoading: false, isGasless: true, txHash: null, error: errorMessage });
      options?.onError?.(new Error(errorMessage));
      return null;
    }
  }, [isInitialized, smartAccount, signer, sendGaslessTransaction]);

  /**
   * 배치 Gasless 트랜잭션 실행 (여러 트랜잭션을 하나로 묶어서 실행)
   */
  const executeBatchGasless = useCallback(async (
    transactions: { contract: Contract; method: string; args: unknown[] }[],
    options?: GaslessTransactionOptions
  ): Promise<string | null> => {
    setState({ isLoading: true, isGasless: true, txHash: null, error: null });

    try {
      if (!isInitialized || !smartAccount) {
        throw new Error('Smart Account가 초기화되지 않았습니다.');
      }

      // 모든 트랜잭션 데이터 인코딩
      const txRequests = await Promise.all(
        transactions.map(async ({ contract, method, args }) => {
          const iface = contract.interface as Interface;
          const data = iface.encodeFunctionData(method, args);
          const contractAddress = await contract.getAddress();
          return { to: contractAddress, data };
        })
      );

      // 배치 Gasless 트랜잭션 전송
      const txHash = await sendBatchGaslessTransactions(txRequests);

      setState({ isLoading: false, isGasless: true, txHash, error: null });
      options?.onSuccess?.(txHash);
      return txHash;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '배치 트랜잭션 실패';
      console.error('[Gasless] 배치 트랜잭션 오류:', err);

      setState({ isLoading: false, isGasless: true, txHash: null, error: errorMessage });
      options?.onError?.(new Error(errorMessage));
      return null;
    }
  }, [isInitialized, smartAccount, sendBatchGaslessTransactions]);

  /**
   * 상태 초기화
   */
  const reset = useCallback(() => {
    setState({ isLoading: false, isGasless: false, txHash: null, error: null });
  }, []);

  return {
    // 상태
    isLoading: state.isLoading,
    isGasless: state.isGasless,
    txHash: state.txHash,
    error: state.error,
    isGaslessAvailable: isInitialized,

    // 함수
    executeGasless,
    executeBatchGasless,
    reset,
  };
};
