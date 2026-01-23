import { useState, useCallback } from 'react';
import { Contract, ZeroAddress } from 'ethers';
import { useWeb3 } from '../contexts/Web3Context';
import ERC20ABI from '../contracts/ERC20ABI.json';
import { CONTRACTS } from '../contracts/addresses';
import { getTxOptions } from '../utils/gas';

interface UseERC20Result {
  // Check allowance
  checkAllowance: (tokenAddress: string, spender?: string) => Promise<bigint>;
  // Approve tokens
  approve: (tokenAddress: string, amount: bigint, spender?: string) => Promise<boolean>;
  // Check balance
  getBalance: (tokenAddress: string) => Promise<bigint>;
  // Get token info
  getTokenInfo: (tokenAddress: string) => Promise<{ symbol: string; decimals: number }>;
  // Ensure sufficient allowance (approve if needed)
  ensureAllowance: (tokenAddress: string, amount: bigint, spender?: string) => Promise<boolean>;
  // Loading state
  loading: boolean;
  // Error
  error: string | null;
}

/**
 * Hook for interacting with ERC-20 tokens
 */
export const useERC20 = (): UseERC20Result => {
  const { signer, address } = useWeb3();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Get ERC-20 contract instance
   */
  const getContract = useCallback((tokenAddress: string) => {
    if (!signer) throw new Error('Wallet not connected');
    if (tokenAddress === ZeroAddress) throw new Error('Native token does not have a contract');
    return new Contract(tokenAddress, ERC20ABI, signer);
  }, [signer]);

  /**
   * Check allowance for a token
   */
  const checkAllowance = useCallback(async (
    tokenAddress: string,
    spender: string = CONTRACTS.AlmaMarketplace
  ): Promise<bigint> => {
    if (!address) return 0n;
    if (tokenAddress === ZeroAddress) return BigInt(2) ** BigInt(256) - BigInt(1); // Max for native

    try {
      const contract = getContract(tokenAddress);
      const allowance = await contract.allowance(address, spender);
      return BigInt(allowance);
    } catch (err) {
      console.error('Error checking allowance:', err);
      return 0n;
    }
  }, [address, getContract]);

  /**
   * Approve tokens for spending
   */
  const approve = useCallback(async (
    tokenAddress: string,
    amount: bigint,
    spender: string = CONTRACTS.AlmaMarketplace
  ): Promise<boolean> => {
    if (!signer || !address) {
      setError('Wallet not connected');
      return false;
    }

    if (tokenAddress === ZeroAddress) {
      // Native token doesn't need approval
      return true;
    }

    setLoading(true);
    setError(null);

    try {
      const contract = getContract(tokenAddress);

      console.log(`Approving ${amount.toString()} tokens for ${spender}`);
      const tx = await contract.approve(spender, amount, getTxOptions('approve'));
      console.log('Approval tx sent:', tx.hash);

      await tx.wait();
      console.log('Approval confirmed');

      return true;
    } catch (err: any) {
      console.error('Approval error:', err);
      setError(err.message || 'Failed to approve tokens');
      return false;
    } finally {
      setLoading(false);
    }
  }, [signer, address, getContract]);

  /**
   * Get token balance
   */
  const getBalance = useCallback(async (tokenAddress: string): Promise<bigint> => {
    if (!address) return 0n;

    try {
      if (tokenAddress === ZeroAddress) {
        // Native token balance
        if (!signer) return 0n;
        const provider = signer.provider;
        if (!provider) return 0n;
        const balance = await provider.getBalance(address);
        return BigInt(balance);
      }

      const contract = getContract(tokenAddress);
      const balance = await contract.balanceOf(address);
      return BigInt(balance);
    } catch (err) {
      console.error('Error getting balance:', err);
      return 0n;
    }
  }, [address, signer, getContract]);

  /**
   * Get token info (symbol, decimals)
   */
  const getTokenInfo = useCallback(async (
    tokenAddress: string
  ): Promise<{ symbol: string; decimals: number }> => {
    if (tokenAddress === ZeroAddress) {
      return { symbol: 'POL', decimals: 18 };
    }

    try {
      const contract = getContract(tokenAddress);
      const [symbol, decimals] = await Promise.all([
        contract.symbol(),
        contract.decimals(),
      ]);
      return { symbol, decimals: Number(decimals) };
    } catch (err) {
      console.error('Error getting token info:', err);
      return { symbol: 'UNKNOWN', decimals: 18 };
    }
  }, [getContract]);

  /**
   * Ensure sufficient allowance, approve if needed
   */
  const ensureAllowance = useCallback(async (
    tokenAddress: string,
    amount: bigint,
    spender: string = CONTRACTS.AlmaMarketplace
  ): Promise<boolean> => {
    if (tokenAddress === ZeroAddress) {
      // Native token doesn't need approval
      return true;
    }

    setLoading(true);
    setError(null);

    try {
      const currentAllowance = await checkAllowance(tokenAddress, spender);
      console.log(`Current allowance: ${currentAllowance.toString()}, Required: ${amount.toString()}`);

      if (currentAllowance >= amount) {
        console.log('Sufficient allowance already granted');
        setLoading(false);
        return true;
      }

      // Approve max amount for convenience (common pattern)
      const maxAmount = BigInt(2) ** BigInt(256) - BigInt(1);
      return await approve(tokenAddress, maxAmount, spender);
    } catch (err: any) {
      console.error('Error ensuring allowance:', err);
      setError(err.message || 'Failed to ensure allowance');
      return false;
    } finally {
      setLoading(false);
    }
  }, [checkAllowance, approve]);

  return {
    checkAllowance,
    approve,
    getBalance,
    getTokenInfo,
    ensureAllowance,
    loading,
    error,
  };
};

export default useERC20;
