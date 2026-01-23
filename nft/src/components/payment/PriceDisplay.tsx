import React from 'react';
import { Box, Typography, Tooltip, Skeleton } from '@mui/material';
import { usePayment } from '../../contexts/PaymentContext';
import { formatEther } from 'ethers';

interface PriceDisplayProps {
  // Price in wei (as string from contract)
  priceWei: string;
  // Token symbol (e.g., 'POL', 'USDC')
  tokenSymbol?: string;
  // Token decimals (default 18)
  tokenDecimals?: number;
  // Display variant
  variant?: 'default' | 'large' | 'small' | 'inline';
  // Show token amount below USD
  showTokenAmount?: boolean;
  // Custom suffix (e.g., '/ day')
  suffix?: string;
}

/**
 * Displays price in USD with optional token amount
 */
export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  priceWei,
  tokenSymbol = 'POL',
  tokenDecimals = 18,
  variant = 'default',
  showTokenAmount = true,
  suffix = '',
}) => {
  const { getPrice, formatUsd, loading } = usePayment();

  // Convert wei to token amount
  const tokenAmount = tokenDecimals === 18
    ? parseFloat(formatEther(priceWei))
    : parseFloat(priceWei) / Math.pow(10, tokenDecimals);

  // Calculate USD price
  const tokenPrice = getPrice(tokenSymbol);
  const usdPrice = tokenAmount * tokenPrice;

  if (loading) {
    return (
      <Box>
        <Skeleton width={100} height={variant === 'large' ? 40 : 24} />
        {showTokenAmount && <Skeleton width={80} height={16} />}
      </Box>
    );
  }

  const getTypographyProps = () => {
    switch (variant) {
      case 'large':
        return { variant: 'h4' as const, fontWeight: 700 };
      case 'small':
        return { variant: 'body2' as const, fontWeight: 500 };
      case 'inline':
        return { variant: 'body1' as const, fontWeight: 600, component: 'span' as const };
      default:
        return { variant: 'h5' as const, fontWeight: 600 };
    }
  };

  return (
    <Tooltip title={`${tokenAmount.toFixed(6)} ${tokenSymbol} @ ${formatUsd(tokenPrice)}/${tokenSymbol}`}>
      <Box sx={variant === 'inline' ? { display: 'inline' } : {}}>
        <Typography {...getTypographyProps()}>
          {formatUsd(usdPrice)} {suffix}
        </Typography>
        {showTokenAmount && variant !== 'inline' && (
          <Typography variant="body2" color="text.secondary">
            {tokenAmount.toFixed(4)} {tokenSymbol}
          </Typography>
        )}
      </Box>
    </Tooltip>
  );
};

interface TokenAmountDisplayProps {
  usdAmount: number;
  tokenSymbol: string;
  showUsd?: boolean;
  variant?: 'default' | 'large' | 'small';
}

/**
 * Displays token amount needed for a USD price
 */
export const TokenAmountDisplay: React.FC<TokenAmountDisplayProps> = ({
  usdAmount,
  tokenSymbol,
  showUsd = true,
  variant = 'default',
}) => {
  const { calculateTokenAmount, formatUsd, loading } = usePayment();

  if (loading) {
    return <Skeleton width={100} height={24} />;
  }

  const tokenAmount = calculateTokenAmount(usdAmount, tokenSymbol);

  const getTypographyProps = () => {
    switch (variant) {
      case 'large':
        return { variant: 'h4' as const, fontWeight: 700 };
      case 'small':
        return { variant: 'body2' as const, fontWeight: 500 };
      default:
        return { variant: 'h5' as const, fontWeight: 600 };
    }
  };

  return (
    <Box>
      <Typography {...getTypographyProps()}>
        {tokenAmount.toFixed(4)} {tokenSymbol}
      </Typography>
      {showUsd && (
        <Typography variant="body2" color="text.secondary">
          {formatUsd(usdAmount)}
        </Typography>
      )}
    </Box>
  );
};

export default PriceDisplay;
