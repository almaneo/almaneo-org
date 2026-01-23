/**
 * NEOS Web3Auth Configuration
 * 통합 인증을 위한 Web3Auth 설정
 */

import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from '@web3auth/base';

// 환경 변수에서 Client ID 가져오기 (Vite / Next.js 호환)
const getClientId = () => {
  if (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID) {
    return process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID;
  }
  if (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_WEB3AUTH_CLIENT_ID) {
    return (import.meta as any).env.VITE_WEB3AUTH_CLIENT_ID;
  }
  return 'YOUR_WEB3AUTH_CLIENT_ID'; // Placeholder
};

// 네트워크 설정
export const POLYGON_MAINNET = {
  chainId: '0x89', // 137
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  rpcTarget: 'https://polygon-rpc.com',
  displayName: 'Polygon Mainnet',
  blockExplorerUrl: 'https://polygonscan.com',
  ticker: 'POL',
  tickerName: 'Polygon',
};

export const POLYGON_AMOY = {
  chainId: '0x13882', // 80002
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  rpcTarget: 'https://rpc-amoy.polygon.technology',
  displayName: 'Polygon Amoy Testnet',
  blockExplorerUrl: 'https://amoy.polygonscan.com',
  ticker: 'POL',
  tickerName: 'Polygon',
};

// 현재 사용할 체인 (개발: Amoy, 프로덕션: Mainnet)
export const CURRENT_CHAIN = process.env.NODE_ENV === 'production'
  ? POLYGON_MAINNET
  : POLYGON_AMOY;

// Web3Auth 메인 설정
export const WEB3AUTH_CONFIG = {
  clientId: getClientId(),
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
  chainConfig: CURRENT_CHAIN,
  uiConfig: {
    appName: 'NEOS',
    appUrl: 'https://neos.io',
    logoLight: '/images/neos-logo-light.png',
    logoDark: '/images/neos-logo-dark.png',
    theme: {
      primary: '#0052FF', // neos-blue
      onPrimary: '#FFFFFF',
    },
    mode: 'dark' as const,
    defaultLanguage: 'ko',
    loginMethodsOrder: ['google', 'facebook', 'twitter', 'discord'],
    primaryButton: 'socialLogin',
  },
  privateKeyProvider: null, // Provider는 런타임에 설정
};

// 소셜 로그인 설정 (OpenLogin Adapter)
export const OPENLOGIN_CONFIG = {
  adapterSettings: {
    uxMode: 'popup' as const,
    whiteLabel: {
      appName: 'NEOS - Cold Code, Warm Soul',
      logoLight: '/images/neos-logo-light.png',
      logoDark: '/images/neos-logo-dark.png',
      defaultLanguage: 'ko',
      mode: 'dark' as const,
    },
  },
  loginSettings: {
    mfaLevel: 'optional' as const,
  },
};

// 지원하는 로그인 방법
export const LOGIN_METHODS = [
  { name: 'google', displayName: 'Google', icon: 'google' },
  { name: 'facebook', displayName: 'Facebook', icon: 'facebook' },
  { name: 'twitter', displayName: 'X (Twitter)', icon: 'twitter' },
  { name: 'discord', displayName: 'Discord', icon: 'discord' },
  { name: 'apple', displayName: 'Apple', icon: 'apple' },
] as const;

export type LoginMethod = typeof LOGIN_METHODS[number]['name'];
