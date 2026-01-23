/**
 * AlmaNEO Contract Addresses
 * Deployed: 2026-01-20
 */

export const CONTRACT_ADDRESSES = {
  // Polygon Amoy Testnet (80002)
  amoy: {
    ALMANToken: '0x261d686c9ea66a8404fBAC978d270a47eFa764bA',
    JeongSBT: '0x8d8eECb2072Df7547C22e12C898cB9e2326f827D',
    ALMANStaking: '0x86777d1834c07E1B08E22FE3E8Ec0AD25a5451ce',
    ALMANGovernor: '0xA42A1386a84b146D36a8AF431D5E1d6e845268b8',
    ALMANTimelock: '0xB73532c01CCCE4Ad6e8816fa4CB0E2aeDfe9C8C2',
    KindnessAirdrop: '0xadB3e6Ef342E3aDa2e31a2638d5D9566c26fb538',
  },
  // Polygon Mainnet (137)
  polygon: {
    ALMANToken: '',
    JeongSBT: '',
    ALMANStaking: '',
    ALMANGovernor: '',
    ALMANTimelock: '',
    KindnessAirdrop: '',
  },
} as const;

// 현재 네트워크에 맞는 주소 가져오기
export function getContractAddress(
  contractName: keyof typeof CONTRACT_ADDRESSES.amoy,
  chainId?: number
): string {
  const network = chainId === 137 ? 'polygon' : 'amoy';
  return CONTRACT_ADDRESSES[network][contractName];
}

// 컨트랙트 주소가 설정되었는지 확인
export function isContractDeployed(
  contractName: keyof typeof CONTRACT_ADDRESSES.amoy,
  chainId?: number
): boolean {
  const address = getContractAddress(contractName, chainId);
  return address !== '' && address.startsWith('0x');
}
