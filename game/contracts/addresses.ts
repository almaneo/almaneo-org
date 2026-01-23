/**
 * Smart Contract Addresses
 * AlmaNEO Kindness Game - Polygon Amoy Testnet
 */

export const CONTRACT_ADDRESSES = {
  TOKEN: process.env.NEXT_PUBLIC_TOKEN_ADDRESS as string,
  GOVERNOR: process.env.NEXT_PUBLIC_GOVERNOR_ADDRESS as string,
  TIMELOCK: process.env.NEXT_PUBLIC_TIMELOCK_ADDRESS as string,
  STAKING: process.env.NEXT_PUBLIC_STAKING_ADDRESS as string,
  AIRDROP: process.env.NEXT_PUBLIC_AIRDROP_ADDRESS as string,
} as const;

export const NETWORK_CONFIG = {
  CHAIN_ID: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '80002'),
  RPC_URL: process.env.NEXT_PUBLIC_RPC_URL as string,
  BLOCK_EXPLORER: process.env.NEXT_PUBLIC_BLOCK_EXPLORER as string,
  NETWORK_NAME: 'Polygon Amoy Testnet',
} as const;

/**
 * Validate contract addresses
 */
export function validateAddresses(): boolean {
  const addresses = Object.values(CONTRACT_ADDRESSES);
  return addresses.every(addr => addr && addr.startsWith('0x') && addr.length === 42);
}

/**
 * Get explorer URL for address
 */
export function getExplorerUrl(address: string): string {
  return `${NETWORK_CONFIG.BLOCK_EXPLORER}/address/${address}`;
}

/**
 * Get explorer URL for transaction
 */
export function getTxExplorerUrl(txHash: string): string {
  return `${NETWORK_CONFIG.BLOCK_EXPLORER}/tx/${txHash}`;
}
