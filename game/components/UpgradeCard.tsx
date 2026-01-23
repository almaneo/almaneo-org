'use client';

import React from 'react';
import { Box, Typography, Button, useMediaQuery } from '@mui/material';
import { formatNumber } from '@/lib/utils';

interface UpgradeCardProps {
  icon: string;
  name: string;
  description: string;
  level: number;
  maxLevel: number;
  effect: string;
  cost: number;
  canAfford: boolean;
  onUpgrade: () => void;
}

export default function UpgradeCard({
  icon,
  name,
  description,
  level,
  maxLevel,
  effect,
  cost,
  canAfford,
  onUpgrade,
}: UpgradeCardProps) {
  const isMaxLevel = level >= maxLevel;
  const isLandscape = useMediaQuery('(orientation: landscape) and (max-height: 500px)');
  
  return (
    <Box
      sx={{
        position: 'relative',
        background: 'linear-gradient(145deg, rgba(60, 40, 25, 0.8) 0%, rgba(40, 25, 15, 0.8) 100%)',
        border: '2px solid rgba(139, 69, 19, 0.6)',
        borderRadius: 2,
        p: isLandscape ? 1.5 : 2.5,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          borderColor: '#FFD700',
          boxShadow: '0 8px 24px rgba(255, 215, 0, 0.3)',
        },
      }}
    >
      {/* 아이콘 + 이름 */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: isLandscape ? 1.5 : 2, mb: isLandscape ? 1.5 : 2 }}>
        <Box
          sx={{
            fontSize: isLandscape ? 36 : 48,
            filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))',
          }}
        >
          {icon}
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h6"
            sx={{
              color: '#FFD700',
              fontWeight: 700,
              textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
              fontSize: isLandscape ? 16 : undefined,
            }}
          >
            {name}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: isLandscape ? 11 : 13,
            }}
          >
            {description}
          </Typography>
        </Box>
      </Box>

      {/* 레벨 & 효과 */}
      <Box sx={{ mb: isLandscape ? 1.5 : 2 }}>
        <Typography
          variant="body2"
          sx={{
            color: '#FFD700',
            fontWeight: 600,
            mb: 0.5,
            fontSize: isLandscape ? 12 : undefined,
          }}
        >
          Level {level} / {maxLevel}
        </Typography>
        <Box
          sx={{
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: 1,
            p: isLandscape ? 1 : 1.5,
            border: '1px solid rgba(255, 215, 0, 0.2)',
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: '#4CAF50',
              fontWeight: 700,
              fontSize: isLandscape ? 15 : 18,
            }}
          >
            {effect}
          </Typography>
        </Box>
      </Box>

      {/* 비용 & 버튼 */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography
          variant="body2"
          sx={{
            color: canAfford ? '#FFF' : '#f44336',
            fontWeight: 600,
            fontSize: isLandscape ? 12 : undefined,
          }}
        >
          Cost: {formatNumber(cost)} 🌾
        </Typography>
        
        <Button
          variant="contained"
          onClick={onUpgrade}
          disabled={!canAfford || isMaxLevel}
          sx={{
            minWidth: isLandscape ? 80 : 100,
            fontSize: isLandscape ? 12 : undefined,
            background: isMaxLevel
              ? 'rgba(100, 100, 100, 0.5)'
              : canAfford
              ? 'linear-gradient(135deg, #FFD700 0%, #FFA000 100%)'
              : 'rgba(100, 100, 100, 0.5)',
            color: isMaxLevel ? 'rgba(255,255,255,0.5)' : '#000',
            fontWeight: 700,
            textTransform: 'none',
            '&:hover': {
              background: isMaxLevel
                ? 'rgba(100, 100, 100, 0.5)'
                : canAfford
                ? 'linear-gradient(135deg, #FFA000 0%, #FF6F00 100%)'
                : 'rgba(100, 100, 100, 0.5)',
              transform: canAfford && !isMaxLevel ? 'scale(1.05)' : 'none',
            },
            '&:disabled': {
              color: 'rgba(255,255,255,0.3)',
            },
            transition: 'all 0.2s ease',
          }}
        >
          {isMaxLevel ? 'MAX' : '⬆️ UPGRADE'}
        </Button>
      </Box>
    </Box>
  );
}
