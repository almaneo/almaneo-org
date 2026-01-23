import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Chip,
  Avatar,
  CircularProgress,
} from '@mui/material';
import { usePayment } from '../../contexts/PaymentContext';
import type { PaymentToken } from '../../contexts/PaymentContext';

// Token icons mapping (you can replace with actual icon URLs)
const TOKEN_ICONS: Record<string, string> = {
  POL: '/icons/pol.png',
  MATIC: '/icons/pol.png',
  USDC: '/icons/usdc.png',
  USDT: '/icons/usdt.png',
  MIMIG: '/icons/mimig.png',
};

// Fallback colors for avatar if no icon
const TOKEN_COLORS: Record<string, string> = {
  POL: '#8247E5',
  MATIC: '#8247E5',
  USDC: '#2775CA',
  USDT: '#26A17B',
  MIMIG: '#FF6B35',
};

interface TokenSelectorProps {
  value: PaymentToken | null;
  onChange: (token: PaymentToken) => void;
  label?: string;
  showPrice?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  size?: 'small' | 'medium';
}

export const TokenSelector: React.FC<TokenSelectorProps> = ({
  value,
  onChange,
  label = 'Payment Token',
  showPrice = true,
  disabled = false,
  fullWidth = true,
  size = 'medium',
}) => {
  const { activeTokens, loading, formatUsd } = usePayment();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CircularProgress size={20} />
        <Typography variant="body2">Loading tokens...</Typography>
      </Box>
    );
  }

  if (activeTokens.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No payment tokens available
      </Typography>
    );
  }

  const getTokenAvatar = (symbol: string) => {
    const iconUrl = TOKEN_ICONS[symbol];
    const color = TOKEN_COLORS[symbol] || '#888';

    return (
      <Avatar
        src={iconUrl}
        sx={{
          width: 24,
          height: 24,
          bgcolor: color,
          fontSize: '0.75rem',
        }}
      >
        {symbol.charAt(0)}
      </Avatar>
    );
  };

  return (
    <FormControl fullWidth={fullWidth} size={size} disabled={disabled}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value?.address || ''}
        onChange={(e) => {
          const token = activeTokens.find(t => t.address === e.target.value);
          if (token) onChange(token);
        }}
        label={label}
        renderValue={(selected) => {
          const token = activeTokens.find(t => t.address === selected);
          if (!token) return null;
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {getTokenAvatar(token.symbol)}
              <Typography>{token.symbol}</Typography>
              {showPrice && (
                <Chip
                  label={formatUsd(token.usdPrice)}
                  size="small"
                  sx={{ ml: 'auto' }}
                />
              )}
            </Box>
          );
        }}
      >
        {activeTokens.map((token) => (
          <MenuItem key={token.address} value={token.address}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
              {getTokenAvatar(token.symbol)}
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body1">{token.symbol}</Typography>
                {token.isNative && (
                  <Typography variant="caption" color="text.secondary">
                    Native Token
                  </Typography>
                )}
              </Box>
              {showPrice && (
                <Typography variant="body2" color="text.secondary">
                  {formatUsd(token.usdPrice)}
                </Typography>
              )}
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

interface TokenChipSelectorProps {
  value: PaymentToken | null;
  onChange: (token: PaymentToken) => void;
  showPrice?: boolean;
}

/**
 * Alternative chip-based token selector for compact UIs
 */
export const TokenChipSelector: React.FC<TokenChipSelectorProps> = ({
  value,
  onChange,
  showPrice = false,
}) => {
  const { activeTokens, loading, formatUsd } = usePayment();

  if (loading) {
    return <CircularProgress size={20} />;
  }

  return (
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
      {activeTokens.map((token) => (
        <Chip
          key={token.address}
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <span>{token.symbol}</span>
              {showPrice && (
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                  ({formatUsd(token.usdPrice)})
                </Typography>
              )}
            </Box>
          }
          onClick={() => onChange(token)}
          variant={value?.address === token.address ? 'filled' : 'outlined'}
          color={value?.address === token.address ? 'primary' : 'default'}
          sx={{
            fontWeight: value?.address === token.address ? 600 : 400,
          }}
        />
      ))}
    </Box>
  );
};

export default TokenSelector;
