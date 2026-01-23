import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useContracts } from '../hooks/useContracts';
import { useTokenPrices } from '../hooks/useTokenPrices';
import { ZeroAddress } from 'ethers';

// Symbol normalization: MATIC -> POL (Polygon rebranding September 2024)
const normalizeSymbol = (symbol: string, isNative: boolean): string => {
  const upper = symbol.toUpperCase();
  // Native token on Polygon is now POL (previously MATIC)
  if (isNative && (upper === 'MATIC' || upper === 'POL' || upper === '')) {
    return 'POL';
  }
  // Also normalize any "MATIC" references to "POL"
  if (upper === 'MATIC') {
    return 'POL';
  }
  return symbol;
};

export interface PaymentToken {
  address: string;
  symbol: string;
  decimals: number;
  isActive: boolean;
  isNative: boolean;
  usdPrice: number;
}

interface PaymentContextType {
  // Payment tokens
  paymentTokens: PaymentToken[];
  activeTokens: PaymentToken[];
  selectedToken: PaymentToken | null;
  setSelectedToken: (token: PaymentToken | null) => void;
  loading: boolean;
  error: string | null;

  // Price utilities
  getPrice: (symbol: string) => number;
  convertToUsd: (amount: number, symbol: string) => number;
  convertFromUsd: (usdAmount: number, symbol: string) => number;
  formatUsd: (amount: number) => string;
  formatTokenAmount: (amount: number, symbol: string, decimals?: number) => string;

  // Calculate payment
  calculateTokenAmount: (usdPrice: number, tokenSymbol: string) => number;

  // Get token by address
  getTokenByAddress: (address: string) => PaymentToken | null;

  // Refresh
  refresh: () => Promise<void>;
  refreshPrices: () => void;
}

const PaymentContext = createContext<PaymentContextType | null>(null);

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within PaymentProvider');
  }
  return context;
};

interface PaymentProviderProps {
  children: React.ReactNode;
}

export const PaymentProvider: React.FC<PaymentProviderProps> = ({ children }) => {
  const contracts = useContracts();
  const {
    prices,
    loading: pricesLoading,
    getPrice,
    convertToUsd,
    convertFromUsd,
    formatUsd,
    formatTokenAmount,
    refresh: refreshPrices,
  } = useTokenPrices(['POL', 'USDC', 'USDT', 'MIMIG']);

  const [paymentTokens, setPaymentTokens] = useState<PaymentToken[]>([]);
  const [selectedToken, setSelectedToken] = useState<PaymentToken | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch payment tokens from contract
  const fetchPaymentTokens = useCallback(async () => {
    if (!contracts) return;

    setLoading(true);
    setError(null);

    try {
      const allTokens = await contracts.paymentManager.getAllPaymentTokens();
      const tokenList: PaymentToken[] = [];

      for (const tokenData of allTokens) {
        const isNative = tokenData.tokenAddress === ZeroAddress;
        const rawSymbol = tokenData.symbol || (isNative ? 'POL' : 'UNKNOWN');
        const symbol = normalizeSymbol(rawSymbol, isNative); // MATIC -> POL
        const usdPrice = getPrice(symbol);

        tokenList.push({
          address: tokenData.tokenAddress,
          symbol,
          decimals: Number(tokenData.decimals),
          isActive: tokenData.active,
          isNative,
          usdPrice,
        });
      }

      setPaymentTokens(tokenList);

      // Set default selected token (first active token, prefer USDC)
      const activeTokens = tokenList.filter(t => t.isActive);
      const defaultToken = activeTokens.find(t => t.symbol === 'USDC')
        || activeTokens.find(t => t.isNative)
        || activeTokens[0];

      if (defaultToken && !selectedToken) {
        setSelectedToken(defaultToken);
      }
    } catch (err) {
      console.error('Error fetching payment tokens:', err);
      setError('Failed to fetch payment tokens');
    } finally {
      setLoading(false);
    }
  }, [contracts, getPrice, selectedToken]);

  // Update token prices when prices change
  useEffect(() => {
    if (paymentTokens.length > 0 && Object.keys(prices).length > 0) {
      setPaymentTokens(prev => prev.map(token => ({
        ...token,
        usdPrice: getPrice(token.symbol),
      })));

      // Update selected token price
      if (selectedToken) {
        setSelectedToken(prev => prev ? {
          ...prev,
          usdPrice: getPrice(prev.symbol),
        } : null);
      }
    }
  }, [prices]);

  // Initial fetch
  useEffect(() => {
    fetchPaymentTokens();
  }, [contracts]);

  // Active tokens only
  const activeTokens = useMemo(() =>
    paymentTokens.filter(t => t.isActive),
    [paymentTokens]
  );

  // Calculate token amount needed for a USD price
  const calculateTokenAmount = useCallback((usdPrice: number, tokenSymbol: string): number => {
    const tokenPrice = getPrice(tokenSymbol);
    if (tokenPrice === 0) return 0;
    return usdPrice / tokenPrice;
  }, [getPrice]);

  // Get token info by address
  const getTokenByAddress = useCallback((address: string): PaymentToken | null => {
    const normalizedAddress = address.toLowerCase();
    return paymentTokens.find(t => t.address.toLowerCase() === normalizedAddress) || null;
  }, [paymentTokens]);

  const value: PaymentContextType = {
    paymentTokens,
    activeTokens,
    selectedToken,
    setSelectedToken,
    loading: loading || pricesLoading,
    error,
    getPrice,
    convertToUsd,
    convertFromUsd,
    formatUsd,
    formatTokenAmount,
    calculateTokenAmount,
    getTokenByAddress,
    refresh: fetchPaymentTokens,
    refreshPrices,
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};

export default PaymentContext;
