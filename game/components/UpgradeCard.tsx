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
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 3,
        p: isLandscape ? 1.5 : 2.5,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          borderColor: '#FFD700',
          boxShadow: '0 8px 32px rgba(255, 215, 0, 0.2)',
          bgcolor: 'rgba(255, 255, 255, 0.05)',
        },
      }}
    >
      {/* 아이콘 + 이름 */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: isLandscape ? 1.5 : 2, mb: isLandscape ? 1.5 : 2 }}>
        <Box
          sx={{
            fontSize: isLandscape ? 36 : 48,
            filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.3))',
          }}
        >
          {icon}
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h6"
            sx={{
              color: 'white',
              fontWeight: 800,
              fontSize: isLandscape ? 16 : 18,
              letterSpacing: -0.5,
            }}
          >
            {name}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: isLandscape ? 11 : 13,
              fontWeight: 300,
            }}
          >
            {description}
          </Typography>
        </Box>
      </Box>

      {/* 레벨 & 효과 */}
      <Box sx={{ mb: isLandscape ? 1.5 : 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography
            variant="caption"
            sx={{
              color: '#FFD700',
              fontWeight: 'bold',
              fontSize: isLandscape ? 10 : 11,
              letterSpacing: 1,
            }}
          >
            UPGRADE PHASE
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: 'white',
              fontWeight: 'bold',
              bgcolor: 'rgba(255,255,255,0.1)',
              px: 1,
              borderRadius: 1,
            }}
          >
            Lvl {level} / {maxLevel}
          </Typography>
        </Box>
        <Box
          sx={{
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: 2,
            p: isLandscape ? 1 : 1.5,
            border: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: '#4CAF50',
              fontWeight: 800,
              fontSize: isLandscape ? 15 : 18,
              textAlign: 'center',
            }}
          >
            {effect}
          </Typography>
        </Box>
      </Box>

      {/* 비용 & 버튼 */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography
            variant="caption"
            sx={{
              color: 'rgba(255,255,255,0.4)',
              display: 'block',
            }}
          >
            Requirement
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: canAfford ? 'white' : '#f44336',
              fontWeight: 700,
              fontSize: isLandscape ? 14 : 16,
            }}
          >
            💖 {formatNumber(cost)}
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={onUpgrade}
          disabled={!canAfford || isMaxLevel}
          sx={{
            minWidth: isLandscape ? 80 : 100,
            borderRadius: 2,
            background: isMaxLevel
              ? 'rgba(100, 100, 100, 0.1)'
              : canAfford
                ? '#FFD700'
                : 'rgba(100, 100, 100, 0.2)',
            color: isMaxLevel ? 'rgba(255,255,255,0.2)' : canAfford ? '#0A0F1A' : 'white',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: 1,
            '&:hover': {
              bgcolor: '#e6c200',
              transform: canAfford && !isMaxLevel ? 'translateY(-2px)' : 'none',
              boxShadow: '0 4px 12px rgba(255, 215, 0, 0.4)',
            },
            transition: 'all 0.2s ease',
          }}
        >
          {isMaxLevel ? 'Maxed' : 'Upgrade'}
        </Button>
      </Box>
    </Box>
  );
}
