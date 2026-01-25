'use client';

import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import { useState, MouseEvent } from 'react';
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
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
}

export default function GameHUD({
  points,
  energy,
  maxEnergy,
  level,
  onProfileClick,
  onSettingsClick,
}: GameHUDProps) {
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
          gap: isMobile ? 0.3 : 2,
          px: isMobile ? 1 : 2,
          py: isMobile ? 1 : 2,
        }}
      >
        {/* Kindness Score */}
        <ResourceCounter value={points} label="Kindness" onClick={handlePointsClick} />

        {/* Energy */}
        <EnergyBar current={energy} max={maxEnergy} onClick={handleEnergyClick} />

        {/* Level */}
        <LevelBadge level={level} onClick={handleLevelClick} />

        {/* Spacer */}
        <Box sx={{ flex: 1 }} />

        {/* Wallet Button */}
        <WalletButton />

        {/* Profile Button */}
        <Box
          onClick={onProfileClick}
          sx={{
            width: isMobile ? 44 : 56,
            height: isMobile ? 44 : 56,
            position: 'relative',
            cursor: 'pointer',
            filter: 'drop-shadow(0 4px 8px rgba(33,150,243,0.5))',
            transition: 'all 0.2s ease',
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'transparent',
            '&:hover': {
              transform: 'translateY(-2px) scale(1.05)',
              filter: 'drop-shadow(0 6px 12px rgba(33,150,243,0.7))',
            },
            '&:active': {
              transform: 'scale(0.95)',
            },
          }}
        >
          <Image
            src="/images/icons/profile-user.png"
            alt="Profile"
            fill
            style={{ objectFit: 'contain' }}
          />
        </Box>

        {/* Settings Button */}
        <Box
          onClick={onSettingsClick}
          sx={{
            width: isMobile ? 44 : 56,
            height: isMobile ? 44 : 56,
            position: 'relative',
            cursor: 'pointer',
            filter: 'drop-shadow(0 4px 8px rgba(117,117,117,0.5))',
            transition: 'all 0.2s ease',
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'transparent',
            '&:hover': {
              transform: 'translateY(-2px) scale(1.05)',
              filter: 'drop-shadow(0 6px 12px rgba(117,117,117,0.7))',
            },
            '&:active': {
              transform: 'scale(0.95)',
            },
          }}
        >
          <Image
            src="/images/icons/settings-gear.png"
            alt="Settings"
            fill
            style={{ objectFit: 'contain' }}
          />
        </Box>
      </Box>

      {/* Points Popover */}
      <InfoPopover
        open={Boolean(pointsAnchor)}
        anchorEl={pointsAnchor}
        onClose={() => setPointsAnchor(null)}
        title="Kindness Details"
        icon="💖"
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
              Current:
            </Typography>
            <Typography sx={{ color: '#FFF', fontWeight: 'bold', fontSize: 14 }}>
              {points.toLocaleString()}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
              Total Earned:
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
        title="BP Status"
        icon="⚡"
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
              Current:
            </Typography>
            <Typography sx={{ color: '#FFF', fontWeight: 'bold', fontSize: 14 }}>
              {energy}/{maxEnergy}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
              Recovery:
            </Typography>
            <Typography sx={{ color: '#4CAF50', fontWeight: 'bold', fontSize: 14 }}>
              +10 every 60s
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
        title="Level Info"
        icon="🏆"
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
              Current Level:
            </Typography>
            <Typography sx={{ color: '#FFF', fontWeight: 'bold', fontSize: 14 }}>
              {level}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
              Max Level:
            </Typography>
            <Typography sx={{ color: '#FFD700', fontWeight: 'bold', fontSize: 14 }}>
              {GAME_CONFIG.MAX_LEVEL}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
              Progress:
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
