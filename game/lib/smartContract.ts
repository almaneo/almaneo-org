/**
 * Smart Contract Integration
 * AlmaNEO Kindness Game - ALMAN Token Claim System
 *
 * Token claims go through the web API (/api/mining-claim) which uses
 * a server-side CLAIMER_ROLE key. Users do NOT need MINTER_ROLE.
 */

import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, NETWORK_CONFIG } from '@/contracts/addresses';
import ALMANTokenABI from '../contracts/abis/ALMANToken.json';

// ============================================================================
// Constants
// ============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://almaneo.org';

// ============================================================================
// Types
// ============================================================================

export interface TokenClaimResult {
  success: boolean;
  transactionHash?: string;
  amount?: number;
  error?: string;
}

export interface TokenBalance {
  balance: string;
  formatted: string;
}

export interface MiningPoolStatus {
  currentEpoch: number;
  remainingPool: string;
  totalClaimed: string;
  miningProgress: number;
  dailyRemaining: string;
  contractBalance: string;
  dailyClaimLimit: string;
  userDailyClaimLimit: string;
  userDailyRemaining?: string;
}

// ============================================================================
// Contract Instance
// ============================================================================

/**
 * Get ALMANToken contract instance
 * @param signerOrProvider - Signer or Provider
 */
export function getALMANTokenContract(
  signerOrProvider: ethers.Signer | ethers.Provider
): ethers.Contract {
  return new ethers.Contract(
    CONTRACT_ADDRESSES.TOKEN,
    ALMANTokenABI,
    signerOrProvider
  );
}

// ============================================================================
// Read Functions (View)
// ============================================================================

/**
 * Get user's ALMAN token balance
 * @param address - User wallet address
 * @param provider - Provider instance
 */
export async function getTokenBalance(
  address: string,
  provider: ethers.Provider
): Promise<TokenBalance> {
  try {
    const contract = getALMANTokenContract(provider);
    const balance = await contract.balanceOf(address);
    const decimals = await contract.decimals();

    const formatted = ethers.formatUnits(balance, decimals);

    return {
      balance: balance.toString(),
      formatted,
    };
  } catch (error) {
    console.error('Error getting token balance:', error);
    throw new Error('Failed to get token balance');
  }
}

/**
 * Get token info (name, symbol, decimals)
 */
export async function getTokenInfo(provider: ethers.Provider) {
  try {
    const contract = getALMANTokenContract(provider);

    const [name, symbol, decimals] = await Promise.all([
      contract.name(),
      contract.symbol(),
      contract.decimals(),
    ]);

    return { name, symbol, decimals };
  } catch (error) {
    console.error('Error getting token info:', error);
    throw new Error('Failed to get token info');
  }
}

// ============================================================================
// Mining Pool API Functions
// ============================================================================

/**
 * Claim token reward via backend API (MiningPool contract)
 * The server signs the transaction with CLAIMER_ROLE — no user signing needed.
 *
 * @param amount - Token amount to claim (in token units, e.g., 1.5)
 * @param userAddress - Recipient wallet address
 * @param gamePoints - Optional game points for logging
 */
export async function claimTokenReward(
  amount: number,
  userAddress: string,
  gamePoints?: number,
): Promise<TokenClaimResult> {
  try {
    if (amount <= 0) {
      return { success: false, error: 'Invalid token amount' };
    }

    console.log('🎁 Claiming tokens via API:', { amount, userAddress, gamePoints });

    const res = await fetch(`${API_BASE_URL}/api/mining-claim`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'claimTokens',
        userAddress,
        amount: amount.toString(),
        gamePoints,
      }),
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
      const errorMsg = json.error || `HTTP ${res.status}`;
      console.error('❌ Claim API error:', errorMsg);
      return { success: false, error: errorMsg };
    }

    console.log('✅ Claim tx sent:', json.data?.txHash);

    return {
      success: true,
      transactionHash: json.data?.txHash,
      amount,
    };
  } catch (error: any) {
    console.error('❌ Error claiming tokens:', error);
    return {
      success: false,
      error: error.message || 'Failed to claim tokens',
    };
  }
}

/**
 * Get MiningPool on-chain status via backend API
 * @param userAddress - Optional user address for per-user daily remaining
 */
export async function getMiningPoolStatus(
  userAddress?: string,
): Promise<MiningPoolStatus | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/mining-claim`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'getStatus',
        ...(userAddress ? { userAddress } : {}),
      }),
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
      console.error('[MiningPool] Status error:', json.error);
      return null;
    }

    return json.data as MiningPoolStatus;
  } catch (error) {
    console.error('[MiningPool] Status fetch failed:', error);
    return null;
  }
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Check if network is correct
 * @param chainId - Current chain ID
 */
export function isCorrectNetwork(chainId: number): boolean {
  return chainId === NETWORK_CONFIG.CHAIN_ID;
}

/**
 * Format token amount for display
 * @param amount - Token amount in wei
 * @param decimals - Token decimals
 */
export function formatTokenAmount(amount: bigint, decimals: number): string {
  return ethers.formatUnits(amount, decimals);
}

/**
 * Parse token amount from string
 * @param amount - Token amount string
 * @param decimals - Token decimals
 */
export function parseTokenAmount(amount: string, decimals: number): bigint {
  return ethers.parseUnits(amount, decimals);
}

/**
 * Get network name
 */
export function getNetworkName(): string {
  return NETWORK_CONFIG.NETWORK_NAME;
}

/**
 * Get contract address
 */
export function getTokenAddress(): string {
  return CONTRACT_ADDRESSES.TOKEN;
}

// ============================================================================
// Export All
// ============================================================================

export default {
  getALMANTokenContract,
  getTokenBalance,
  getTokenInfo,
  claimTokenReward,
  getMiningPoolStatus,
  isCorrectNetwork,
  formatTokenAmount,
  parseTokenAmount,
  getNetworkName,
  getTokenAddress,
};
