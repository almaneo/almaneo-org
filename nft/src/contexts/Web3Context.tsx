/**
 * AlmaNEO NFT Web3Auth Context
 * Web3Auth 기반 통합 인증 및 지갑 연결
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Web3Auth } from '@web3auth/modal';
import { WEB3AUTH_NETWORK, CHAIN_NAMESPACES, type IProvider } from '@web3auth/base';
import { BrowserProvider, JsonRpcSigner, formatEther } from 'ethers';
import { CHAIN_CONFIG } from '../contracts/addresses';

// Web3Auth Client ID
const WEB3AUTH_CLIENT_ID = import.meta.env.VITE_WEB3AUTH_CLIENT_ID || '';

// Polygon Amoy Chain Config for Web3Auth
const POLYGON_AMOY_CONFIG = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: `0x${CHAIN_CONFIG.chainId.toString(16)}`, // 0x13882
  rpcTarget: CHAIN_CONFIG.rpcUrls[0],
  displayName: CHAIN_CONFIG.chainName,
  blockExplorerUrl: CHAIN_CONFIG.blockExplorerUrls[0],
  ticker: CHAIN_CONFIG.nativeCurrency.symbol,
  tickerName: CHAIN_CONFIG.nativeCurrency.name,
  logo: 'https://images.web3auth.io/chains/80002.png',
};

// User info type
export interface UserInfo {
  email?: string;
  name?: string;
  profileImage?: string;
  verifier?: string;
  verifierId?: string;
  typeOfLogin?: string;
}

interface Web3ContextType {
  // Ethers compatibility (기존 hooks와 호환)
  provider: BrowserProvider | null;
  signer: JsonRpcSigner | null;
  address: string | null;
  chainId: number | null;
  isConnecting: boolean;
  isConnected: boolean;
  balance: string;

  // Web3Auth specific
  web3auth: Web3Auth | null;
  userInfo: UserInfo | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  refreshBalance: () => Promise<void>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

// Web3Auth 싱글톤 인스턴스
let web3authInstance: Web3Auth | null = null;

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

interface Web3ProviderProps {
  children: React.ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [balance, setBalance] = useState('0');
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isConnected = !!address;

  // 잔액 업데이트
  const updateBalance = useCallback(async (addr: string, prov: BrowserProvider) => {
    try {
      const bal = await prov.getBalance(addr);
      setBalance(formatEther(bal));
    } catch (err) {
      console.error('Error fetching balance:', err);
      setBalance('0');
    }
  }, []);

  // 잔액 새로고침
  const refreshBalance = useCallback(async () => {
    if (provider && address) {
      await updateBalance(address, provider);
    }
  }, [provider, address, updateBalance]);

  // 연결 처리
  const handleConnected = useCallback(async (web3Provider: IProvider) => {
    try {
      // Ethers Provider 생성
      const ethersProvider = new BrowserProvider(web3Provider);
      setProvider(ethersProvider);

      // Signer 가져오기
      const ethersSigner = await ethersProvider.getSigner();
      setSigner(ethersSigner);

      // 주소 가져오기
      const accounts = await web3Provider.request({
        method: 'eth_accounts',
      }) as string[] | null;

      if (accounts && accounts.length > 0) {
        setAddress(accounts[0]);
        await updateBalance(accounts[0], ethersProvider);
      }

      // Chain ID 가져오기
      const chainIdHex = await web3Provider.request({
        method: 'eth_chainId',
      }) as string | null;

      if (chainIdHex) {
        setChainId(parseInt(chainIdHex, 16));
      }

      // 사용자 정보 가져오기
      if (web3authInstance) {
        try {
          const user = await web3authInstance.getUserInfo();
          setUserInfo(user as UserInfo);
        } catch {
          console.log('[AlmaNEO NFT] 사용자 정보 없음 (외부 지갑 연결)');
        }
      }
    } catch (err) {
      console.error('[AlmaNEO NFT] 연결 처리 오류:', err);
      throw err;
    }
  }, [updateBalance]);

  // Web3Auth 초기화
  useEffect(() => {
    const initWeb3Auth = async () => {
      try {
        console.log('[AlmaNEO NFT] Web3Auth 초기화 시작...');

        if (!WEB3AUTH_CLIENT_ID) {
          console.error('[AlmaNEO NFT] Web3Auth Client ID가 설정되지 않았습니다.');
          setError('Web3Auth Client ID가 설정되지 않았습니다.');
          setIsLoading(false);
          return;
        }

        if (!web3authInstance) {
          web3authInstance = new Web3Auth({
            clientId: WEB3AUTH_CLIENT_ID,
            web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
            chains: [POLYGON_AMOY_CONFIG],
            defaultChainId: POLYGON_AMOY_CONFIG.chainId,
            uiConfig: {
              appName: 'AlmaNEO NFT',
              appUrl: 'https://almaneo.org',
              theme: {
                primary: '#0052FF',
                onPrimary: '#FFFFFF',
              },
              mode: 'dark',
              defaultLanguage: 'ko',
              loginMethodsOrder: ['google', 'facebook', 'twitter', 'discord'],
              primaryButton: 'socialLogin',
            },
          });

          await web3authInstance.init();
          console.log('[AlmaNEO NFT] Web3Auth 초기화 완료');
        }

        // 이미 연결된 세션이 있는 경우
        if (web3authInstance.connected && web3authInstance.provider) {
          console.log('[AlmaNEO NFT] 기존 세션 복원 중...');
          await handleConnected(web3authInstance.provider);
        }
      } catch (err) {
        console.error('[AlmaNEO NFT] Web3Auth 초기화 오류:', err);
        setError('Web3Auth 초기화에 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    initWeb3Auth();
  }, [handleConnected]);

  // 로그인
  const connect = useCallback(async () => {
    if (!web3authInstance) {
      setError('Web3Auth가 초기화되지 않았습니다.');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      console.log('[AlmaNEO NFT] 로그인 시도 중...');
      const web3Provider = await web3authInstance.connect();

      if (web3Provider) {
        await handleConnected(web3Provider);
        console.log('[AlmaNEO NFT] 로그인 성공');
      }
    } catch (err: unknown) {
      console.error('[AlmaNEO NFT] 로그인 오류:', err);

      // 사용자가 취소한 경우 에러 메시지 표시하지 않음
      if (err instanceof Error && err.message?.includes('User closed')) {
        return;
      }
      setError('로그인에 실패했습니다.');
    } finally {
      setIsConnecting(false);
    }
  }, [handleConnected]);

  // 로그아웃
  const disconnect = useCallback(async () => {
    if (!web3authInstance) {
      return;
    }

    try {
      console.log('[AlmaNEO NFT] 로그아웃 중...');
      await web3authInstance.logout();

      setProvider(null);
      setSigner(null);
      setAddress(null);
      setChainId(null);
      setBalance('0');
      setUserInfo(null);
      setError(null);

      console.log('[AlmaNEO NFT] 로그아웃 완료');
    } catch (err) {
      console.error('[AlmaNEO NFT] 로그아웃 오류:', err);
    }
  }, []);

  return (
    <Web3Context.Provider
      value={{
        provider,
        signer,
        address,
        chainId,
        isConnecting,
        isConnected,
        balance,
        web3auth: web3authInstance,
        userInfo,
        isLoading,
        error,
        connect,
        disconnect,
        refreshBalance,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
