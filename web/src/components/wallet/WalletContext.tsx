/**
 * NEOS Unified Wallet Context
 * 통합 지갑 상태 관리 Context
 *
 * 모든 서버(web, nft, game)에서 동일한 지갑 상태를 공유
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Web3Auth } from '@web3auth/modal';
import { WEB3AUTH_NETWORK, CHAIN_NAMESPACES, type IProvider } from '@web3auth/base';
import { BrowserProvider, JsonRpcSigner, formatEther } from 'ethers';
import i18n from 'i18next';

// Web3Auth 지원 언어 매핑 (사이트 언어 → Web3Auth 언어)
const WEB3AUTH_LANGUAGES = ['en', 'de', 'ja', 'ko', 'zh', 'es', 'fr', 'pt', 'nl', 'tr'] as const;
type Web3AuthLang = (typeof WEB3AUTH_LANGUAGES)[number];
function getWeb3AuthLanguage(): Web3AuthLang {
  const lang = i18n.language?.split('-')[0] || 'en';
  return (WEB3AUTH_LANGUAGES as readonly string[]).includes(lang) ? lang as Web3AuthLang : 'en';
}
import type {
  WalletState,
  UserInfo,
  TokenBalance,
  NFTSummary,
  GameSummary,
  StakingSummary,
  GovernanceSummary,
} from './types';

// 환경 변수
const WEB3AUTH_CLIENT_ID = import.meta.env.VITE_WEB3AUTH_CLIENT_ID || '';
const CHAIN_ID = parseInt(import.meta.env.VITE_CHAIN_ID || '80002');
const RPC_URL = import.meta.env.VITE_RPC_URL || 'https://rpc-amoy.polygon.technology';
const BLOCK_EXPLORER = import.meta.env.VITE_BLOCK_EXPLORER || 'https://amoy.polygonscan.com';

// Chain Config
const CHAIN_CONFIG = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: `0x${CHAIN_ID.toString(16)}`,
  rpcTarget: RPC_URL,
  displayName: CHAIN_ID === 137 ? 'Polygon Mainnet' : 'Polygon Amoy Testnet',
  blockExplorerUrl: BLOCK_EXPLORER,
  ticker: 'POL',
  tickerName: 'POL',
  logo: `https://images.web3auth.io/chains/${CHAIN_ID}.png`,
};

// Context 타입
interface WalletContextType extends WalletState {
  // Ethers 호환
  provider: BrowserProvider | null;
  signer: JsonRpcSigner | null;

  // 액션
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  refreshBalance: () => Promise<void>;
  refreshAll: () => Promise<void>;

  // 데이터 로더 (각 서버에서 구현)
  setNFTSummary: (summary: NFTSummary | null) => void;
  setGameSummary: (summary: GameSummary | null) => void;
  setStakingSummary: (summary: StakingSummary | null) => void;
  setGovernanceSummary: (summary: GovernanceSummary | null) => void;
  setTokens: (tokens: TokenBalance[]) => void;

  // 유틸리티
  truncateAddress: (address: string) => string;
  getExplorerUrl: (type: 'address' | 'tx', value: string) => string;
  copyAddress: () => Promise<boolean>;
}

// 기본값
const defaultState: WalletState = {
  isConnected: false,
  isConnecting: false,
  isLoading: true,
  address: null,
  chainId: null,
  balance: '0',
  userInfo: null,
  tokens: [],
  nftSummary: null,
  gameSummary: null,
  stakingSummary: null,
  governanceSummary: null,
  error: null,
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Web3Auth 싱글톤
let web3authInstance: Web3Auth | null = null;

// Hook
export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

// Provider Props
interface WalletProviderProps {
  children: React.ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  // 상태
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [state, setState] = useState<WalletState>(defaultState);

  // 상태 업데이트 헬퍼
  const updateState = useCallback((updates: Partial<WalletState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // 유틸리티 함수
  const truncateAddress = useCallback((address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, []);

  const getExplorerUrl = useCallback((type: 'address' | 'tx', value: string) => {
    return `${BLOCK_EXPLORER}/${type}/${value}`;
  }, []);

  const copyAddress = useCallback(async () => {
    if (state.address) {
      await navigator.clipboard.writeText(state.address);
      return true;
    }
    return false;
  }, [state.address]);

  // 잔액 업데이트
  const updateBalance = useCallback(async (addr: string, prov: BrowserProvider) => {
    try {
      const bal = await prov.getBalance(addr);
      updateState({ balance: formatEther(bal) });
    } catch (err) {
      console.error('[Wallet] Balance fetch error:', err);
      updateState({ balance: '0' });
    }
  }, [updateState]);

  // 잔액 새로고침
  const refreshBalance = useCallback(async () => {
    if (provider && state.address) {
      await updateBalance(state.address, provider);
    }
  }, [provider, state.address, updateBalance]);

  // 전체 새로고침
  const refreshAll = useCallback(async () => {
    await refreshBalance();
    // 각 서버에서 추가 데이터 로드 트리거
  }, [refreshBalance]);

  // 연결 처리
  const handleConnected = useCallback(async (web3Provider: IProvider) => {
    try {
      const ethersProvider = new BrowserProvider(web3Provider);
      setProvider(ethersProvider);

      const ethersSigner = await ethersProvider.getSigner();
      setSigner(ethersSigner);

      // 주소
      const accounts = await web3Provider.request({
        method: 'eth_accounts',
      }) as string[] | null;

      let walletAddress: string | null = null;
      if (accounts && accounts.length > 0) {
        walletAddress = accounts[0];
        await updateBalance(accounts[0], ethersProvider);
      }

      // Chain ID
      const chainIdHex = await web3Provider.request({
        method: 'eth_chainId',
      }) as string | null;

      // 사용자 정보
      let userInfo: UserInfo | null = null;
      if (web3authInstance) {
        try {
          const user = await web3authInstance.getUserInfo();
          userInfo = user as UserInfo;
        } catch {
          // 외부 지갑 연결 시 사용자 정보 없음
        }
      }

      updateState({
        isConnected: true,
        address: walletAddress,
        chainId: chainIdHex ? parseInt(chainIdHex, 16) : null,
        userInfo,
        error: null,
      });

    } catch (err) {
      console.error('[Wallet] Connection handling error:', err);
      throw err;
    }
  }, [updateBalance, updateState]);

  // Web3Auth 초기화
  useEffect(() => {
    const init = async () => {
      try {
        console.log('[Wallet] Initializing Web3Auth...');

        if (!WEB3AUTH_CLIENT_ID) {
          console.error('[Wallet] Web3Auth Client ID not set');
          updateState({ isLoading: false, error: 'Web3Auth Client ID가 설정되지 않았습니다.' });
          return;
        }

        if (!web3authInstance) {
          web3authInstance = new Web3Auth({
            clientId: WEB3AUTH_CLIENT_ID,
            web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
            chains: [CHAIN_CONFIG],
            defaultChainId: CHAIN_CONFIG.chainId,
            uiConfig: {
              appName: 'AlmaNEO',
              appUrl: 'https://almaneo.org',
              theme: {
                primary: '#0052FF',
                onPrimary: '#FFFFFF',
              },
              mode: 'dark',
              defaultLanguage: getWeb3AuthLanguage(),
              loginMethodsOrder: ['google', 'facebook', 'twitter', 'discord'],
              primaryButton: 'socialLogin',
            },
          });

          await web3authInstance.init();
          console.log('[Wallet] Web3Auth initialized');
        }

        // 기존 세션 복원
        if (web3authInstance.connected && web3authInstance.provider) {
          console.log('[Wallet] Restoring session...');
          await handleConnected(web3authInstance.provider);
        }

      } catch (err) {
        console.error('[Wallet] Initialization error:', err);
        updateState({ error: 'Web3Auth 초기화에 실패했습니다.' });
      } finally {
        updateState({ isLoading: false });
      }
    };

    init();
  }, [handleConnected, updateState]);

  // 로그인
  const connect = useCallback(async () => {
    if (!web3authInstance) {
      updateState({ error: 'Web3Auth가 초기화되지 않았습니다.' });
      return;
    }

    updateState({ isConnecting: true, error: null });

    try {
      console.log('[Wallet] Connecting...');
      const web3Provider = await web3authInstance.connect();

      if (web3Provider) {
        await handleConnected(web3Provider);
        console.log('[Wallet] Connected successfully');
      }
    } catch (err: unknown) {
      console.error('[Wallet] Connection error:', err);

      if (err instanceof Error && err.message?.includes('User closed')) {
        updateState({ isConnecting: false });
        return;
      }
      updateState({ error: '로그인에 실패했습니다.' });
    } finally {
      updateState({ isConnecting: false });
    }
  }, [handleConnected, updateState]);

  // 로그아웃
  const disconnect = useCallback(async () => {
    if (!web3authInstance) return;

    try {
      console.log('[Wallet] Disconnecting...');
      await web3authInstance.logout();

      setProvider(null);
      setSigner(null);
      setState(defaultState);
      updateState({ isLoading: false });

      console.log('[Wallet] Disconnected');
    } catch (err) {
      console.error('[Wallet] Disconnect error:', err);
    }
  }, [updateState]);

  // 데이터 세터
  const setNFTSummary = useCallback((summary: NFTSummary | null) => {
    updateState({ nftSummary: summary });
  }, [updateState]);

  const setGameSummary = useCallback((summary: GameSummary | null) => {
    updateState({ gameSummary: summary });
  }, [updateState]);

  const setStakingSummary = useCallback((summary: StakingSummary | null) => {
    updateState({ stakingSummary: summary });
  }, [updateState]);

  const setGovernanceSummary = useCallback((summary: GovernanceSummary | null) => {
    updateState({ governanceSummary: summary });
  }, [updateState]);

  const setTokens = useCallback((tokens: TokenBalance[]) => {
    updateState({ tokens });
  }, [updateState]);

  const value: WalletContextType = {
    ...state,
    provider,
    signer,
    connect,
    disconnect,
    refreshBalance,
    refreshAll,
    setNFTSummary,
    setGameSummary,
    setStakingSummary,
    setGovernanceSummary,
    setTokens,
    truncateAddress,
    getExplorerUrl,
    copyAddress,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

export default WalletProvider;
