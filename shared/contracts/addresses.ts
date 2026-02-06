/**
 * AlmaNEO Contract Addresses
 * 배포된 스마트 컨트랙트 주소
 */

import type { ContractAddresses, ContractAddress, SupportedChainId } from '../types';

/**
 * Polygon Amoy Testnet (80002) 컨트랙트 주소
 * TGE Deployed: 2026-02-06
 */
const AMOY_ADDRESSES: ContractAddresses = {
  // 토큰
  ALMANToken: '0x2B52bD2daFd82683Dcf0A994eb24427afb9C1c63' as ContractAddress,

  // 거버넌스
  ALMANGovernor: '0x30E0FDEb1A730B517bF8851b7485107D7bc9dE33' as ContractAddress,
  ALMANTimelock: '0x464bca66C5B53b2163A89088213B1f832F0dF7c0' as ContractAddress,

  // 스테이킹 & 에어드롭
  ALMANStaking: '0xB691a0DF657A06209A3a4EF1A06a139B843b945B' as ContractAddress,
  KindnessAirdrop: '0xfb89843F5a36A5E7E48A727225334E7b68fE22ac' as ContractAddress,

  // Kindness Protocol
  JeongSBT: '0x41588D71373A6cf9E6f848250Ff7322d67Bb393c' as ContractAddress,
  AmbassadorSBT: '0xf368d239a0b756533ff5688021A04Bc62Ab3c27B' as ContractAddress,

  // TGE
  TokenVesting: '0x02fB6851B6cDc6B9176B42065bC9e0E0F6cf8F0E' as ContractAddress,
  MiningPool: '0xD447078530b6Ec3a2B8fe0ceb5A2a994d4e464b9' as ContractAddress,

  // NFT
  AlmaNFT721: '0xbFbE2b1eDB0f7F0675D5E449E508adE3697B8dfa' as ContractAddress,
  AlmaNFT1155: '0x50FC5Ecaa9517CCD24b86874b0E87ab6225E9cfF' as ContractAddress,
  AlmaMarketplace: '0x27EDe449fF2367aB00B5b04A1A1BcCdE03F8E76b' as ContractAddress,
  AlmaCollectionManager: '0x1Ad2176A1181CFF2d82289f5cc5d143d9B3AFE1D' as ContractAddress,
  AlmaPaymentManager: '0x2410Fa2958f2966DB85eF98aCbA4b9e360257E4e' as ContractAddress,
};

/**
 * Polygon Mainnet (137) 컨트랙트 주소
 * 메인넷 배포 후 업데이트 필요
 */
const MAINNET_ADDRESSES: ContractAddresses = {
  // 토큰
  ALMANToken: '0x0000000000000000000000000000000000000000' as ContractAddress,

  // 거버넌스
  ALMANGovernor: '0x0000000000000000000000000000000000000000' as ContractAddress,
  ALMANTimelock: '0x0000000000000000000000000000000000000000' as ContractAddress,

  // 스테이킹 & 에어드롭
  ALMANStaking: '0x0000000000000000000000000000000000000000' as ContractAddress,
  KindnessAirdrop: '0x0000000000000000000000000000000000000000' as ContractAddress,

  // Kindness Protocol
  JeongSBT: '0x0000000000000000000000000000000000000000' as ContractAddress,
  AmbassadorSBT: '0x0000000000000000000000000000000000000000' as ContractAddress,

  // TGE
  TokenVesting: '0x0000000000000000000000000000000000000000' as ContractAddress,
  MiningPool: '0x0000000000000000000000000000000000000000' as ContractAddress,

  // NFT
  AlmaNFT721: '0x0000000000000000000000000000000000000000' as ContractAddress,
  AlmaNFT1155: '0x0000000000000000000000000000000000000000' as ContractAddress,
  AlmaMarketplace: '0x0000000000000000000000000000000000000000' as ContractAddress,
  AlmaCollectionManager: '0x0000000000000000000000000000000000000000' as ContractAddress,
  AlmaPaymentManager: '0x0000000000000000000000000000000000000000' as ContractAddress,
};

/**
 * 체인 ID별 컨트랙트 주소 맵
 */
const CONTRACT_ADDRESSES: Record<SupportedChainId, ContractAddresses> = {
  80002: AMOY_ADDRESSES,
  137: MAINNET_ADDRESSES,
};

/**
 * 현재 체인의 컨트랙트 주소 가져오기
 */
export const getContractAddresses = (chainId: SupportedChainId): ContractAddresses => {
  return CONTRACT_ADDRESSES[chainId];
};

/**
 * 특정 컨트랙트 주소 가져오기
 */
export const getContractAddress = (
  chainId: SupportedChainId,
  contractName: keyof ContractAddresses
): ContractAddress => {
  return CONTRACT_ADDRESSES[chainId][contractName];
};

/**
 * 컨트랙트가 배포되었는지 확인
 */
export const isContractDeployed = (address: ContractAddress): boolean => {
  return address !== '0x0000000000000000000000000000000000000000';
};

/**
 * 체인 설정
 */
export const CHAIN_CONFIG = {
  80002: {
    name: 'Polygon Amoy Testnet',
    rpcUrl: 'https://rpc-amoy.polygon.technology',
    blockExplorer: 'https://amoy.polygonscan.com',
    nativeCurrency: { name: 'POL', symbol: 'POL', decimals: 18 },
  },
  137: {
    name: 'Polygon Mainnet',
    rpcUrl: 'https://polygon-rpc.com',
    blockExplorer: 'https://polygonscan.com',
    nativeCurrency: { name: 'POL', symbol: 'POL', decimals: 18 },
  },
} as const;

export { AMOY_ADDRESSES, MAINNET_ADDRESSES, CONTRACT_ADDRESSES };
