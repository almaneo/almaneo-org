import { useState, useEffect, useCallback } from 'react';

// Token price mapping (CoinGecko IDs)
// Note: Polygon rebranded from MATIC to POL in September 2024
// New CoinGecko ID: 'polygon-ecosystem-token' (POL)
// Old ID 'matic-network' still works for legacy MATIC
const COINGECKO_IDS: Record<string, string> = {
  POL: 'polygon-ecosystem-token',  // New POL token (Polygon 2.0)
  MATIC: 'polygon-ecosystem-token', // MATIC -> POL migration, same token
  USDC: 'usd-coin',
  USDT: 'tether',
  // MIMIG is not on CoinGecko, we'll use a fixed/mock price
};

// For tokens not on CoinGecko (like MIMIG), use mock prices
const MOCK_PRICES: Record<string, number> = {
  MIMIG: 0.134, // Mock price in USD
};

export interface TokenPrice {
  symbol: string;
  usdPrice: number;
  lastUpdated: number;
}

export interface TokenPrices {
  [symbol: string]: TokenPrice;
}

const CACHE_DURATION = 60000; // 1 minute cache
const API_BASE_URL = 'https://api.coingecko.com/api/v3';

export const useTokenPrices = (symbols: string[] = ['POL', 'USDC', 'USDT', 'MIMIG']) => {
  const [prices, setPrices] = useState<TokenPrices>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState(0);

  const fetchPrices = useCallback(async (force = false) => {
    // Check cache
    if (!force && Date.now() - lastFetch < CACHE_DURATION && Object.keys(prices).length > 0) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get CoinGecko IDs for symbols that have them
      const coinGeckoSymbols = symbols.filter(s => COINGECKO_IDS[s.toUpperCase()]);
      const ids = coinGeckoSymbols.map(s => COINGECKO_IDS[s.toUpperCase()]).join(',');

      const newPrices: TokenPrices = {};
      const now = Date.now();

      // Fetch from CoinGecko if we have IDs
      if (ids) {
        try {
          const response = await fetch(
            `${API_BASE_URL}/simple/price?ids=${ids}&vs_currencies=usd`,
            {
              headers: {
                'Accept': 'application/json',
              },
            }
          );

          if (response.ok) {
            const data = await response.json();

            // Map CoinGecko response back to symbols
            for (const symbol of coinGeckoSymbols) {
              const id = COINGECKO_IDS[symbol.toUpperCase()];
              if (data[id]?.usd) {
                newPrices[symbol.toUpperCase()] = {
                  symbol: symbol.toUpperCase(),
                  usdPrice: data[id].usd,
                  lastUpdated: now,
                };
              }
            }
          }
        } catch (apiError) {
          console.warn('CoinGecko API error, using fallback prices:', apiError);
        }
      }

      // Add mock prices for tokens not on CoinGecko
      for (const symbol of symbols) {
        const upperSymbol = symbol.toUpperCase();
        if (!newPrices[upperSymbol] && MOCK_PRICES[upperSymbol]) {
          newPrices[upperSymbol] = {
            symbol: upperSymbol,
            usdPrice: MOCK_PRICES[upperSymbol],
            lastUpdated: now,
          };
        }
      }

      // Stablecoins fallback (USDC, USDT should be ~$1)
      if (!newPrices['USDC']) {
        newPrices['USDC'] = { symbol: 'USDC', usdPrice: 1.0, lastUpdated: now };
      }
      if (!newPrices['USDT']) {
        newPrices['USDT'] = { symbol: 'USDT', usdPrice: 1.0, lastUpdated: now };
      }

      // POL fallback
      if (!newPrices['POL']) {
        newPrices['POL'] = { symbol: 'POL', usdPrice: 0.45, lastUpdated: now };
      }

      setPrices(newPrices);
      setLastFetch(now);
    } catch (err) {
      console.error('Error fetching token prices:', err);
      setError('Failed to fetch token prices');

      // Set fallback prices on error
      const now = Date.now();
      setPrices({
        POL: { symbol: 'POL', usdPrice: 0.45, lastUpdated: now },
        USDC: { symbol: 'USDC', usdPrice: 1.0, lastUpdated: now },
        USDT: { symbol: 'USDT', usdPrice: 1.0, lastUpdated: now },
        MIMIG: { symbol: 'MIMIG', usdPrice: MOCK_PRICES['MIMIG'], lastUpdated: now },
      });
    } finally {
      setLoading(false);
    }
  }, [symbols, lastFetch, prices]);

  // Initial fetch
  useEffect(() => {
    fetchPrices();
  }, []);

  // Auto-refresh every minute
  useEffect(() => {
    const interval = setInterval(() => {
      fetchPrices(true);
    }, CACHE_DURATION);

    return () => clearInterval(interval);
  }, [fetchPrices]);

  // Utility functions
  const getPrice = useCallback((symbol: string): number => {
    return prices[symbol.toUpperCase()]?.usdPrice ?? 0;
  }, [prices]);

  const convertToUsd = useCallback((amount: number, symbol: string): number => {
    const price = getPrice(symbol);
    return amount * price;
  }, [getPrice]);

  const convertFromUsd = useCallback((usdAmount: number, symbol: string): number => {
    const price = getPrice(symbol);
    if (price === 0) return 0;
    return usdAmount / price;
  }, [getPrice]);

  const formatUsd = useCallback((amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }, []);

  const formatTokenAmount = useCallback((amount: number, symbol: string, decimals = 4): string => {
    return `${amount.toFixed(decimals)} ${symbol}`;
  }, []);

  return {
    prices,
    loading,
    error,
    refresh: () => fetchPrices(true),
    getPrice,
    convertToUsd,
    convertFromUsd,
    formatUsd,
    formatTokenAmount,
  };
};

export default useTokenPrices;
