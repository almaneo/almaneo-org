import { parseUnits } from 'ethers';

/**
 * Default gas settings for Polygon Amoy testnet
 * These values ensure transactions are processed reliably
 */
export const DEFAULT_GAS_SETTINGS = {
  // Minimum priority fee for faster processing
  maxPriorityFeePerGas: parseUnits('30', 'gwei'),
  // Maximum fee per gas (priority fee + base fee)
  maxFeePerGas: parseUnits('50', 'gwei'),
};

/**
 * Get transaction options with proper gas settings for different operations
 * @param operation - Type of operation to get gas settings for
 * @returns Transaction options object
 */
export const getTxOptions = (operation: 'mint' | 'listing' | 'buy' | 'bid' | 'offer' | 'cancel' | 'approve' | 'admin') => {
  const gasLimits: Record<string, number> = {
    mint: 800000,
    listing: 600000,
    buy: 800000,    // Increased from 500000 - buyNow uses ~500k gas
    bid: 500000,
    offer: 500000,
    cancel: 300000,
    approve: 150000,
    admin: 200000,
  };

  return {
    gasLimit: gasLimits[operation] || 300000,
    ...DEFAULT_GAS_SETTINGS,
  };
};

/**
 * Get transaction options with value (for payable functions)
 * @param operation - Type of operation
 * @param value - ETH/POL value to send
 * @returns Transaction options object with value
 */
export const getTxOptionsWithValue = (
  operation: 'buy' | 'bid' | 'offer',
  value: bigint
) => {
  return {
    ...getTxOptions(operation),
    value,
  };
};
