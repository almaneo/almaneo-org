// AlmaNEO Contract Addresses - Polygon Amoy Testnet
// Deployed: 2026-01-20

export const CONTRACTS = {
  // Core Contracts
  ALMANToken: '0x261d686c9ea66a8404fBAC978d270a47eFa764bA',
  JeongSBT: '0x8d8eECb2072Df7547C22e12C898cB9e2326f827D',
  ALMANStaking: '0x86777d1834c07E1B08E22FE3E8Ec0AD25a5451ce',
  ALMANTimelock: '0xB73532c01CCCE4Ad6e8816fa4CB0E2aeDfe9C8C2',
  ALMANGovernor: '0xA42A1386a84b146D36a8AF431D5E1d6e845268b8',
  KindnessAirdrop: '0xadB3e6Ef342E3aDa2e31a2638d5D9566c26fb538',

  // NFT Marketplace Contracts (with Trusted Forwarder for gasless)
  AlmaNFT721: '0xbFbE2b1eDB0f7F0675D5E449E508adE3697B8dfa',
  AlmaNFT1155: '0x50FC5Ecaa9517CCD24b86874b0E87ab6225E9cfF',
  AlmaPaymentManager: '0x2410Fa2958f2966DB85eF98aCbA4b9e360257E4e',
  AlmaCollectionManager: '0x1Ad2176A1181CFF2d82289f5cc5d143d9B3AFE1D',
  AlmaMarketplace: '0x27EDe449fF2367aB00B5b04A1A1BcCdE03F8E76b',
} as const;

// Chain Configuration
export const CHAIN_CONFIG = {
  chainId: 80002,
  chainName: 'Polygon Amoy Testnet',
  nativeCurrency: {
    name: 'POL',
    symbol: 'POL',
    decimals: 18,
  },
  rpcUrls: ['https://rpc-amoy.polygon.technology'],
  blockExplorerUrls: ['https://amoy.polygonscan.com/'],
};

// Native Token Address (for POL payments)
export const NATIVE_TOKEN_ADDRESS = '0x0000000000000000000000000000000000000000';

// Biconomy Trusted Forwarder (for gasless transactions)
export const TRUSTED_FORWARDER = '0xd240234dacd7ffdca7e4effcf6c7190885d7e2f0';

// IPFS Gateway
export const IPFS_GATEWAY = 'https://ipfs.io/ipfs/';

// Default Royalty (5%)
export const DEFAULT_ROYALTY_BPS = 500;

// Fee Configuration
export const FEE_CONFIG = {
  platformFeeBps: 250, // 2.5%
  maxFeeBps: 500, // 5%
};
