/**
 * AlmaNEO NFT Biconomy Smart Account Context
 * Gasless 트랜잭션을 위한 Smart Account 관리 (Biconomy SDK v4)
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  createSmartAccountClient,
  type BiconomySmartAccountV2,
  PaymasterMode,
} from '@biconomy/account';
import { useWeb3 } from './Web3Context';
import { CHAIN_CONFIG } from '../contracts/addresses';

// Biconomy 설정
const BICONOMY_BUNDLER_URL = import.meta.env.VITE_BICONOMY_BUNDLER_URL || '';
const BICONOMY_PAYMASTER_URL = import.meta.env.VITE_BICONOMY_PAYMASTER_URL || '';

interface BiconomyContextType {
  smartAccount: BiconomySmartAccountV2 | null;
  smartAccountAddress: string | null;
  isInitialized: boolean;
  isInitializing: boolean;
  error: string | null;
  sendGaslessTransaction: (tx: TransactionRequest) => Promise<string>;
  sendBatchGaslessTransactions: (txs: TransactionRequest[]) => Promise<string>;
}

interface TransactionRequest {
  to: string;
  data: string;
  value?: string;
}

const BiconomyContext = createContext<BiconomyContextType | undefined>(undefined);

export const useBiconomy = () => {
  const context = useContext(BiconomyContext);
  if (!context) {
    throw new Error('useBiconomy must be used within a BiconomyProvider');
  }
  return context;
};

interface BiconomyProviderProps {
  children: React.ReactNode;
}

export const BiconomyProvider: React.FC<BiconomyProviderProps> = ({ children }) => {
  const { signer, isConnected, address } = useWeb3();
  const [smartAccount, setSmartAccount] = useState<BiconomySmartAccountV2 | null>(null);
  const [smartAccountAddress, setSmartAccountAddress] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Smart Account 초기화
  const initSmartAccount = useCallback(async () => {
    if (!signer || !isConnected || !address) {
      console.log('[Biconomy] 지갑 연결 필요');
      return;
    }

    if (!BICONOMY_BUNDLER_URL) {
      console.warn('[Biconomy] Bundler URL이 설정되지 않았습니다. Gasless 기능 비활성화');
      return;
    }

    setIsInitializing(true);
    setError(null);

    try {
      console.log('[Biconomy] Smart Account 초기화 시작...');

      // Biconomy SDK v4 방식으로 Smart Account 생성
      const smartAccountClient = await createSmartAccountClient({
        signer: signer,
        chainId: CHAIN_CONFIG.chainId,
        bundlerUrl: BICONOMY_BUNDLER_URL,
        paymasterUrl: BICONOMY_PAYMASTER_URL || undefined,
      });

      const saAddress = await smartAccountClient.getAccountAddress();

      setSmartAccount(smartAccountClient);
      setSmartAccountAddress(saAddress);
      setIsInitialized(true);

      console.log('[Biconomy] Smart Account 초기화 완료');
      console.log('[Biconomy] EOA 주소:', address);
      console.log('[Biconomy] Smart Account 주소:', saAddress);

    } catch (err) {
      console.error('[Biconomy] Smart Account 초기화 오류:', err);
      setError(err instanceof Error ? err.message : 'Smart Account 초기화 실패');
    } finally {
      setIsInitializing(false);
    }
  }, [signer, isConnected, address]);

  // 지갑 연결 시 Smart Account 초기화
  useEffect(() => {
    if (isConnected && signer && !smartAccount && !isInitializing) {
      initSmartAccount();
    }

    // 지갑 연결 해제 시 초기화
    if (!isConnected) {
      setSmartAccount(null);
      setSmartAccountAddress(null);
      setIsInitialized(false);
    }
  }, [isConnected, signer, smartAccount, isInitializing, initSmartAccount]);

  // Gasless 트랜잭션 전송
  const sendGaslessTransaction = useCallback(async (tx: TransactionRequest): Promise<string> => {
    if (!smartAccount) {
      throw new Error('Smart Account가 초기화되지 않았습니다.');
    }

    try {
      console.log('[Biconomy] Gasless 트랜잭션 전송 중...');
      console.log('[Biconomy] To:', tx.to);
      console.log('[Biconomy] Data:', tx.data?.slice(0, 66) + '...');

      // Biconomy SDK v4 방식
      const userOpResponse = await smartAccount.sendTransaction(
        {
          to: tx.to as `0x${string}`,
          data: tx.data as `0x${string}`,
          value: tx.value ? BigInt(tx.value) : BigInt(0),
        },
        {
          paymasterServiceData: { mode: PaymasterMode.SPONSORED },
        }
      );

      const { transactionHash } = await userOpResponse.waitForTxHash();
      console.log('[Biconomy] 트랜잭션 해시:', transactionHash);

      // 트랜잭션 완료 대기
      const userOpReceipt = await userOpResponse.wait();
      console.log('[Biconomy] 트랜잭션 성공:', userOpReceipt.receipt.transactionHash);

      return userOpReceipt.receipt.transactionHash;

    } catch (err) {
      console.error('[Biconomy] 트랜잭션 오류:', err);
      throw err;
    }
  }, [smartAccount]);

  // 배치 Gasless 트랜잭션 전송
  const sendBatchGaslessTransactions = useCallback(async (txs: TransactionRequest[]): Promise<string> => {
    if (!smartAccount) {
      throw new Error('Smart Account가 초기화되지 않았습니다.');
    }

    try {
      console.log('[Biconomy] 배치 Gasless 트랜잭션 전송 중...');
      console.log('[Biconomy] 트랜잭션 개수:', txs.length);

      // Biconomy SDK v4 방식 - 배치 트랜잭션
      const userOpResponse = await smartAccount.sendTransaction(
        txs.map(tx => ({
          to: tx.to as `0x${string}`,
          data: tx.data as `0x${string}`,
          value: tx.value ? BigInt(tx.value) : BigInt(0),
        })),
        {
          paymasterServiceData: { mode: PaymasterMode.SPONSORED },
        }
      );

      const { transactionHash } = await userOpResponse.waitForTxHash();
      console.log('[Biconomy] 배치 트랜잭션 해시:', transactionHash);

      const userOpReceipt = await userOpResponse.wait();
      console.log('[Biconomy] 배치 트랜잭션 성공:', userOpReceipt.receipt.transactionHash);

      return userOpReceipt.receipt.transactionHash;

    } catch (err) {
      console.error('[Biconomy] 배치 트랜잭션 오류:', err);
      throw err;
    }
  }, [smartAccount]);

  return (
    <BiconomyContext.Provider
      value={{
        smartAccount,
        smartAccountAddress,
        isInitialized,
        isInitializing,
        error,
        sendGaslessTransaction,
        sendBatchGaslessTransactions,
      }}
    >
      {children}
    </BiconomyContext.Provider>
  );
};
