'use client';

import { Box, Typography } from '@mui/material';
import { useState, MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import ResourceCounter from './ResourceCounter';
import EnergyBar from './EnergyBar';
import LevelBadge from './LevelBadge';
import WalletButton from './WalletButton';
import InfoPopover from './InfoPopover';
import EnergyTimer from './EnergyTimer';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useGameStore } from '@/hooks/useGameStore';
import { GAME_CONFIG } from '@/lib/constants';

interface GameHUDProps {
  points: number;
  energy: number;
  maxEnergy: number;
  level: number;
}

export default function GameHUD({
  points,
  energy,
  maxEnergy,
  level,
}: GameHUDProps) {
  const { t } = useTranslation('game');
  const isMobile = useIsMobile();
  const { totalPoints } = useGameStore();

  // 팝업 상태 관리
  const [pointsAnchor, setPointsAnchor] = useState<HTMLElement | null>(null);
  const [energyAnchor, setEnergyAnchor] = useState<HTMLElement | null>(null);
  const [levelAnchor, setLevelAnchor] = useState<HTMLElement | null>(null);

  const handlePointsClick = (event: MouseEvent<HTMLElement>) => {
    setPointsAnchor(event.currentTarget);
  };

  const handleEnergyClick = (event: MouseEvent<HTMLElement>) => {
    setEnergyAnchor(event.currentTarget);
  };

  const handleLevelClick = (event: MouseEvent<HTMLElement>) => {
    setLevelAnchor(event.currentTarget);
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: isMobile ? 0.5 : 2,
          px: isMobile ? 0.5 : 2,
          py: isMobile ? 0.5 : 1,
        }}
      >
        {/* Kindness Score */}
        <ResourceCounter value={points} label={t('hud.kindness')} onClick={handlePointsClick} />

        {/* Energy */}
        <EnergyBar current={energy} max={maxEnergy} onClick={handleEnergyClick} />

        {/* Level */}
        <LevelBadge level={level} onClick={handleLevelClick} />

        {/* Spacer */}
        <Box sx={{ flex: 1 }} />

        {/* Wallet Button */}
        <WalletButton />
      </Box>

      {/* Points Popover */}
      <InfoPopover
        open={Boolean(pointsAnchor)}
        anchorEl={pointsAnchor}
        onClose={() => setPointsAnchor(null)}
        title={t('hud.kindnessDetails')}
        icon="💖"
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
              {t('hud.current')}
            </Typography>
            <Typography sx={{ color: '#FFF', fontWeight: 'bold', fontSize: 14 }}>
              {points.toLocaleString()}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
              {t('hud.totalEarned')}
            </Typography>
            <Typography sx={{ color: '#FFD700', fontWeight: 'bold', fontSize: 14 }}>
              {totalPoints.toLocaleString()}
            </Typography>
          </Box>
        </Box>
      </InfoPopover>

      {/* Energy Popover */}
      <InfoPopover
        open={Boolean(energyAnchor)}
        anchorEl={energyAnchor}
        onClose={() => setEnergyAnchor(null)}
        title={t('hud.bpStatus')}
        icon="⚡"
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
              {t('hud.current')}
            </Typography>
            <Typography sx={{ color: '#FFF', fontWeight: 'bold', fontSize: 14 }}>
              {energy}/{maxEnergy}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
              {t('hud.recovery')}
            </Typography>
            <Typography sx={{ color: '#4CAF50', fontWeight: 'bold', fontSize: 14 }}>
              {t('hud.recoveryRate', { rate: 10, interval: 60 })}
            </Typography>
          </Box>
          <Box sx={{ mt: 1, pt: 1, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <EnergyTimer />
          </Box>
        </Box>
      </InfoPopover>

      {/* Level Popover */}
      <InfoPopover
        open={Boolean(levelAnchor)}
        anchorEl={levelAnchor}
        onClose={() => setLevelAnchor(null)}
        title={t('hud.levelInfo')}
        icon="🏆"
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
              {t('hud.currentLevel')}
            </Typography>
            <Typography sx={{ color: '#FFF', fontWeight: 'bold', fontSize: 14 }}>
              {level}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
              {t('hud.maxLevel')}
            </Typography>
            <Typography sx={{ color: '#FFD700', fontWeight: 'bold', fontSize: 14 }}>
              {GAME_CONFIG.MAX_LEVEL}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
              {t('hud.progress')}
            </Typography>
            <Typography sx={{ color: '#4CAF50', fontWeight: 'bold', fontSize: 14 }}>
              {totalPoints.toLocaleString()}/{(1000 * Math.pow(level, 1.5)).toLocaleString()}
            </Typography>
          </Box>
        </Box>
      </InfoPopover>
    </>
  );
}
