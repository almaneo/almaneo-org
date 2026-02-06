/**
 * AlmaNEO Contract Addresses
 * TGE Deployed: 2026-02-06 (Amoy)
 */

export const CONTRACT_ADDRESSES = {
  // Polygon Amoy Testnet (80002)
  amoy: {
    ALMANToken: '0x2B52bD2daFd82683Dcf0A994eb24427afb9C1c63',
    JeongSBT: '0x41588D71373A6cf9E6f848250Ff7322d67Bb393c',
    ALMANStaking: '0xB691a0DF657A06209A3a4EF1A06a139B843b945B',
    ALMANGovernor: '0x30E0FDEb1A730B517bF8851b7485107D7bc9dE33',
    ALMANTimelock: '0x464bca66C5B53b2163A89088213B1f832F0dF7c0',
    KindnessAirdrop: '0xfb89843F5a36A5E7E48A727225334E7b68fE22ac',
    AmbassadorSBT: '0xf368d239a0b756533ff5688021A04Bc62Ab3c27B',
    TokenVesting: '0x02fB6851B6cDc6B9176B42065bC9e0E0F6cf8F0E',
    MiningPool: '0xD447078530b6Ec3a2B8fe0ceb5A2a994d4e464b9',
  },
  // Polygon Mainnet (137)
  polygon: {
    ALMANToken: '',
    JeongSBT: '',
    ALMANStaking: '',
    ALMANGovernor: '',
    ALMANTimelock: '',
    KindnessAirdrop: '',
    AmbassadorSBT: '',
    TokenVesting: '',
    MiningPool: '',
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
