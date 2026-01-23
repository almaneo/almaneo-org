/**
 * NEOS Web3Auth Provider
 * 통합 인증 및 지갑 연결을 위한 Context Provider
 * NFT 사이트와 동일한 구현 방식 사용
 */

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Web3Auth } from '@web3auth/modal';
import { WEB3AUTH_NETWORK, CHAIN_NAMESPACES, type IProvider } from '@web3auth/base';
import { BrowserProvider, formatEther } from 'ethers';

// Web3Auth Client ID
const WEB3AUTH_CLIENT_ID = import.meta.env.VITE_WEB3AUTH_CLIENT_ID || '';

// Polygon Amoy Chain Config for Web3Auth
const POLYGON_AMOY_CONFIG = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: '0x13882', // 80002 in hex
  rpcTarget: import.meta.env.VITE_RPC_URL || 'https://rpc-amoy.polygon.technology',
  displayName: 'Polygon Amoy Testnet',
  blockExplorerUrl: import.meta.env.VITE_BLOCK_EXPLORER || 'https://amoy.polygonscan.com',
  ticker: 'POL',
  tickerName: 'POL',
  logo: 'https://images.web3auth.io/chains/80002.png',
};

// 현재 체인 설정 export
export const CURRENT_CHAIN = POLYGON_AMOY_CONFIG;

// Web3Auth 인스턴스 (싱글톤)
let web3authInstance: Web3Auth | null = null;

// 사용자 정보 타입
export interface UserInfo {
  email?: string;
  name?: string;
  profileImage?: string;
  verifier?: string;
  verifierId?: string;
  typeOfLogin?: string;
}

// Context 타입 정의
interface Web3AuthContextType {
  // 상태
  web3auth: Web3Auth | null;
  provider: IProvider | null;
  address: string | null;
  balance: string | null;
  chainId: string | null;
  userInfo: UserInfo | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;

  // 액션
  login: () => Promise<void>;
  logout: () => Promise<void>;
  refreshBalance: () => Promise<void>;
  getEthersProvider: () => BrowserProvider | null;
}

// 기본값
const defaultContext: Web3AuthContextType = {
  web3auth: null,
  provider: null,
  address: null,
  balance: null,
  chainId: null,
  userInfo: null,
  isConnected: false,
  isLoading: true,
  error: null,
  login: async () => { },
  logout: async () => { },
  refreshBalance: async () => { },
  getEthersProvider: () => null,
};

const Web3AuthContext = createContext<Web3AuthContextType>(defaultContext);

// Custom Hook
export const useWeb3Auth = () => {
  const context = useContext(Web3AuthContext);
  if (!context) {
    throw new Error('useWeb3Auth must be used within a Web3AuthProvider');
  }
  return context;
};

// Provider Props
interface Web3AuthProviderProps {
  children: React.ReactNode;
}

export function Web3AuthProvider({ children }: Web3AuthProviderProps) {
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ethers Provider 가져오기
  const getEthersProvider = useCallback(() => {
    if (!provider) return null;
    return new BrowserProvider(provider);
  }, [provider]);

  // 지갑 주소 가져오기
  const getAddress = useCallback(async (web3Provider: IProvider) => {
    try {
      const accounts = await web3Provider.request({
        method: 'eth_accounts',
      }) as string[] | null;

      if (accounts && accounts.length > 0) {
        setAddress(accounts[0]);
        return accounts[0];
      }
      return null;
    } catch (err) {
      console.error('Failed to get address:', err);
      return null;
    }
  }, []);

  // 잔액 가져오기
  const getBalance = useCallback(async (web3Provider: IProvider, walletAddress: string) => {
    try {
      const ethersProvider = new BrowserProvider(web3Provider);
      const balanceWei = await ethersProvider.getBalance(walletAddress);
      const balanceEth = formatEther(balanceWei);
      setBalance(parseFloat(balanceEth).toFixed(4));
    } catch (err) {
      console.error('Failed to get balance:', err);
      setBalance('0');
    }
  }, []);

  // 체인 ID 가져오기
  const getChainId = useCallback(async (web3Provider: IProvider) => {
    try {
      const chain = await web3Provider.request({
        method: 'eth_chainId',
      }) as string | null;
      setChainId(chain || null);
    } catch (err) {
      console.error('Failed to get chain ID:', err);
    }
  }, []);

  // 사용자 정보 가져오기
  const getUserInfo = useCallback(async () => {
    if (!web3authInstance) return;
    try {
      const user = await web3authInstance.getUserInfo();
      setUserInfo(user as UserInfo);
    } catch (err) {
      console.error('Failed to get user info:', err);
    }
  }, []);

  // 잔액 새로고침
  const refreshBalance = useCallback(async () => {
    if (provider && address) {
      await getBalance(provider, address);
    }
  }, [provider, address, getBalance]);

  // 초기화
  useEffect(() => {
    const init = async () => {
      console.log('[NEOS] Web3Auth 초기화 시작...');
      try {
        if (!WEB3AUTH_CLIENT_ID) {
          console.error('[NEOS] Web3Auth Client ID가 설정되지 않았습니다.');
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
              appName: 'AlmaNEO',
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
          console.log('[NEOS] Web3Auth 초기화 완료');
        }

        // 이미 연결된 세션이 있는 경우
        if (web3authInstance.connected && web3authInstance.provider) {
          console.log('[NEOS] 기존 세션 복원 중...');
          setProvider(web3authInstance.provider);
          setIsConnected(true);

          const walletAddress = await getAddress(web3authInstance.provider);
          if (walletAddress) {
            await getBalance(web3authInstance.provider, walletAddress);
          }
          await getChainId(web3authInstance.provider);
          await getUserInfo();
        }
      } catch (err) {
        console.error('[NEOS] Web3Auth 초기화 오류:', err);
        setError('Web3Auth 초기화에 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, [getAddress, getBalance, getChainId, getUserInfo]);

  // 로그인
  const login = useCallback(async () => {
    if (!web3authInstance) {
      setError('Web3Auth가 초기화되지 않았습니다.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      console.log('[NEOS] 로그인 시도 중...');
      const web3authProvider = await web3authInstance.connect();

      if (web3authProvider) {
        setProvider(web3authProvider);
        setIsConnected(true);

        const walletAddress = await getAddress(web3authProvider);
        if (walletAddress) {
          await getBalance(web3authProvider, walletAddress);
        }
        await getChainId(web3authProvider);
        await getUserInfo();

        console.log('[NEOS] 로그인 성공:', walletAddress);
      }
    } catch (err: unknown) {
      console.error('[NEOS] 로그인 오류:', err);
      // 사용자가 취소한 경우 에러 메시지 표시하지 않음
      if (err instanceof Error && err.message?.includes('User closed')) {
        return;
      }
      setError('로그인에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [getAddress, getBalance, getChainId, getUserInfo]);

  // 로그아웃
  const logout = useCallback(async () => {
    if (!web3authInstance) {
      setError('Web3Auth가 초기화되지 않았습니다.');
      return;
    }

    try {
      setIsLoading(true);
      console.log('[NEOS] 로그아웃 중...');

      await web3authInstance.logout();

      setProvider(null);
      setAddress(null);
      setBalance(null);
      setChainId(null);
      setUserInfo(null);
      setIsConnected(false);
      setError(null);

      console.log('[NEOS] 로그아웃 완료');
    } catch (err) {
      console.error('[NEOS] 로그아웃 오류:', err);
      setError('로그아웃에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value: Web3AuthContextType = {
    web3auth: web3authInstance,
    provider,
    address,
    balance,
    chainId,
    userInfo,
    isConnected,
    isLoading,
    error,
    login,
    logout,
    refreshBalance,
    getEthersProvider,
  };

  return (
    <Web3AuthContext.Provider value={value}>
      {children}
    </Web3AuthContext.Provider>
  );
}
