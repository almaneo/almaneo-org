import { WEB3AUTH_NETWORK } from '@web3auth/modal';
import { CHAIN_NAMESPACES } from '@web3auth/base';
import type { Web3AuthContextConfig } from '@web3auth/modal/react';

const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || '';

// Polygon Amoy Testnet Configuration
export const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: '0x13882', // 80002 in hex (Polygon Amoy)
  rpcTarget: 'https://rpc-amoy.polygon.technology',
  displayName: 'Polygon Amoy Testnet',
  blockExplorer: 'https://amoy.polygonscan.com',
  ticker: 'MATIC',
  tickerName: 'Polygon',
};

// Web3Auth Context Config
const web3AuthContextConfig: Web3AuthContextConfig = {
  web3AuthOptions: {
    clientId,
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
    // 세션 유지 설정 (7일)
    sessionTime: 604800, // 7 days in seconds (7 * 24 * 60 * 60)
  },
};

export default web3AuthContextConfig;
