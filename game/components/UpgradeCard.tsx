'use client';

import React from 'react';
import { Box, Typography, Button, useMediaQuery } from '@mui/material';
import { formatNumber } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation('game');
  const isMaxLevel = level >= maxLevel;
  const isLandscape = useMediaQuery('(orientation: landscape) and (max-height: 500px)');
  const isMobile = useMediaQuery('(max-width: 480px)');

  return (
    <Box
      sx={{
        position: 'relative',
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 3,
        p: isLandscape ? 1.5 : isMobile ? 1.5 : 2.5,
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
      <Box sx={{ display: 'flex', alignItems: 'center', gap: isLandscape ? 1 : isMobile ? 1.25 : 2, mb: isLandscape ? 1 : isMobile ? 1 : 2 }}>
        <Box
          sx={{
            fontSize: isLandscape ? 32 : isMobile ? 28 : 48,
            filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.3))',
          }}
        >
          {icon}
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant={isMobile ? 'body2' : 'h6'}
            sx={{
              color: 'white',
              fontWeight: 800,
              fontSize: isLandscape ? 14 : isMobile ? 13 : 18,
              letterSpacing: -0.5,
            }}
          >
            {name}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: isLandscape ? 10 : isMobile ? 10 : 13,
              fontWeight: 300,
            }}
          >
            {description}
          </Typography>
        </Box>
      </Box>

      {/* 레벨 & 효과 */}
      <Box sx={{ mb: isLandscape ? 1 : isMobile ? 1 : 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
          <Typography
            variant="caption"
            sx={{
              color: '#FFD700',
              fontWeight: 'bold',
              fontSize: isLandscape ? 9 : isMobile ? 9 : 11,
              letterSpacing: 1,
            }}
          >
            {t('upgrades.panel.effect')}
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
            {t('upgrades.panel.levelLabel', { level })} / {maxLevel}
          </Typography>
        </Box>
        <Box
          sx={{
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: 2,
            p: isLandscape ? 0.75 : isMobile ? 0.75 : 1.5,
            border: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: '#4CAF50',
              fontWeight: 800,
              fontSize: isLandscape ? 14 : isMobile ? 14 : 18,
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
            {t('upgrades.panel.costLabel')}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: canAfford ? 'white' : '#f44336',
              fontWeight: 700,
              fontSize: isLandscape ? 13 : isMobile ? 13 : 16,
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
            minWidth: isLandscape ? 72 : isMobile ? 72 : 100,
            fontSize: isMobile ? 11 : undefined,
            py: isMobile ? 0.75 : undefined,
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
          {isMaxLevel ? t('common.maxed') : t('modals.upgrade')}
        </Button>
      </Box>
    </Box>
  );
}
