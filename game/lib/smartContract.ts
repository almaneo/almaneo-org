/**
 * Smart Contract Integration
 * AlmaNEO Kindness Game - Token Claim System
 */

import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, NETWORK_CONFIG } from '@/contracts/addresses';
import ALMANTokenABI from '@/contracts/abis/ALMANToken.json';

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

// ============================================================================
// Contract Instance
// ============================================================================

/**
 * Get MiMiGToken contract instance
 * @param signerOrProvider - Signer or Provider
 */
export function getMiMiGTokenContract(
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
 * Get user's MiMiG token balance
 * @param address - User wallet address
 * @param provider - Provider instance
 */
export async function getTokenBalance(
  address: string,
  provider: ethers.Provider
): Promise<TokenBalance> {
  try {
    const contract = getMiMiGTokenContract(provider);
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
    const contract = getMiMiGTokenContract(provider);
    
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
// Write Functions (Transactions)
// ============================================================================

/**
 * Claim token reward from game points
 * @param signer - User's signer
 * @param amount - Token amount to claim (in token units, e.g., 1.5)
 * @param recipientAddress - Recipient address (usually same as signer)
 */
export async function claimTokenReward(
  signer: ethers.Signer,
  amount: number,
  recipientAddress: string
): Promise<TokenClaimResult> {
  try {
    // Validate amount
    if (amount <= 0) {
      return {
        success: false,
        error: 'Invalid token amount',
      };
    }
    
    // Get contract with signer
    const contract = getMiMiGTokenContract(signer);
    
    // Get decimals
    const decimals = await contract.decimals();
    
    // Convert amount to wei (token base units)
    const amountWei = ethers.parseUnits(amount.toString(), decimals);
    
    console.log('🎁 Claiming tokens:', {
      amount,
      amountWei: amountWei.toString(),
      recipient: recipientAddress,
    });
    
    // Send transaction (mint tokens)
    // Note: This requires the signer to have MINTER_ROLE
    // For game rewards, a backend service should handle minting
    const tx = await contract.mint(recipientAddress, amountWei);
    
    console.log('📤 Transaction sent:', tx.hash);
    
    // Wait for confirmation
    const receipt = await tx.wait();
    
    if (receipt.status === 1) {
      console.log('✅ Transaction confirmed:', receipt.hash);
      
      return {
        success: true,
        transactionHash: receipt.hash,
        amount,
      };
    } else {
      console.error('❌ Transaction failed:', receipt);
      
      return {
        success: false,
        error: 'Transaction failed',
      };
    }
  } catch (error: any) {
    console.error('❌ Error claiming tokens:', error);
    
    // Parse error message
    let errorMessage = 'Failed to claim tokens';
    
    if (error.code === 'ACTION_REJECTED') {
      errorMessage = 'Transaction rejected by user';
    } else if (error.code === 'INSUFFICIENT_FUNDS') {
      errorMessage = 'Insufficient funds for gas';
    } else if (error.message) {
      // Extract readable error message
      if (error.message.includes('AccessControl')) {
        errorMessage = 'Unauthorized: Missing MINTER_ROLE';
      } else if (error.message.includes('execution reverted')) {
        errorMessage = 'Transaction reverted';
      } else {
        errorMessage = error.message.substring(0, 100);
      }
    }
    
    return {
      success: false,
      error: errorMessage,
    };
  }
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Estimate gas for token claim
 * @param signer - User's signer
 * @param amount - Token amount
 * @param recipientAddress - Recipient address
 */
export async function estimateClaimGas(
  signer: ethers.Signer,
  amount: number,
  recipientAddress: string
): Promise<bigint> {
  try {
    const contract = getMiMiGTokenContract(signer);
    const decimals = await contract.decimals();
    const amountWei = ethers.parseUnits(amount.toString(), decimals);
    
    const gasEstimate = await contract.mint.estimateGas(
      recipientAddress,
      amountWei
    );
    
    return gasEstimate;
  } catch (error) {
    console.error('Error estimating gas:', error);
    throw new Error('Failed to estimate gas');
  }
}

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
  getMiMiGTokenContract,
  getTokenBalance,
  getTokenInfo,
  claimTokenReward,
  estimateClaimGas,
  isCorrectNetwork,
  formatTokenAmount,
  parseTokenAmount,
  getNetworkName,
  getTokenAddress,
};
