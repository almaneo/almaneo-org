'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Web3Auth } from '@web3auth/modal';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { polygonAmoy } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import web3AuthContextConfig from './web3authContext';

// Web3Auth 인스턴스
let web3auth: Web3Auth | null = null;

// Wagmi 설정
const config = createConfig({
  chains: [polygonAmoy],
  transports: {
    [polygonAmoy.id]: http('https://rpc-amoy.polygon.technology'),
  },
});

// React Query 클라이언트
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

// Context 타입
interface Web3AuthContextType {
  web3auth: Web3Auth | null;
  provider: any;
  address: string | null;
  isConnected: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const Web3AuthContext = createContext<Web3AuthContextType>({
  web3auth: null,
  provider: null,
  address: null,
  isConnected: false,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
});

export const useWeb3Auth = () => useContext(Web3AuthContext);

interface Web3AuthProviderProps {
  children: React.ReactNode;
}

export function Web3AuthProvider({ children }: Web3AuthProviderProps) {
  const [provider, setProvider] = useState<any>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      console.log('🚀 Web3AuthProvider init started');
      try {
        console.log('📦 Creating Web3Auth instance...');
        web3auth = new Web3Auth(web3AuthContextConfig.web3AuthOptions);

        console.log('🔄 Initializing Web3Auth...');
        await web3auth.init();
        console.log('✅ Web3Auth initialized');

        if (web3auth.connected && web3auth.provider) {
          setProvider(web3auth.provider);
          setIsConnected(true);
          await getAddress(web3auth.provider);
        }
      } catch (error) {
        console.error('❌ Web3Auth initialization error:', error);
      } finally {
        setIsLoading(false);
        console.log('✅ Web3AuthProvider init completed');
      }
    };

    init();
  }, []);

  const getAddress = async (web3Provider: any) => {
    try {
      const accounts = await web3Provider.request({
        method: 'eth_accounts',
      });
      
      if (accounts && accounts.length > 0) {
        setAddress(accounts[0]);
      }
    } catch (error) {
      console.error('Failed to get address:', error);
    }
  };

  const login = async () => {
    if (!web3auth) {
      console.error('Web3Auth not initialized');
      return;
    }

    try {
      const web3authProvider = await web3auth.connect();
      
      if (web3authProvider) {
        setProvider(web3authProvider);
        setIsConnected(true);
        await getAddress(web3authProvider);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const logout = async () => {
    if (!web3auth) {
      console.error('Web3Auth not initialized');
      return;
    }

    try {
      await web3auth.logout();
      setProvider(null);
      setAddress(null);
      setIsConnected(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    web3auth,
    provider,
    address,
    isConnected,
    isLoading,
    login,
    logout,
  };

  return (
    <Web3AuthContext.Provider value={value}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </WagmiProvider>
    </Web3AuthContext.Provider>
  );
}
