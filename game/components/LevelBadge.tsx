'use client';

import { Box, Typography } from '@mui/material';
import { MouseEvent } from 'react';
import AnimatedNumber from './AnimatedNumber';
import { useIsMobile } from '@/hooks/useIsMobile';

interface LevelBadgeProps {
  level: number;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
}

export default function LevelBadge({ level, onClick }: LevelBadgeProps) {
  const isMobile = useIsMobile();

  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: isMobile ? 0.3 : 0.5,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s',
        '&:hover': onClick ? {
          transform: 'scale(1.05)',
        } : {},
      }}
    >
      <Box sx={{
        width: isMobile ? 18 : 36,
        height: isMobile ? 18 : 36,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: isMobile ? 14 : 28,
        filter: 'drop-shadow(0 4px 8px rgba(255,215,0,0.5))',
      }}>
        🏆
      </Box>
      <Typography
        component="div"
        sx={{
          color: '#FFF',
          fontWeight: 'bold',
          fontSize: isMobile ? 12 : 22,
          fontFamily: isMobile ? "'Exo 2', sans-serif" : "'Orbitron', sans-serif",
          textShadow: '0 2px 8px rgba(0,0,0,0.8), 0 0 16px rgba(0,0,0,0.6)',
          lineHeight: 1,
        }}
      >
        {isMobile ? 'Lv.' : 'Level '}
        <Box component="span" sx={{ fontFamily: "'Exo 2', sans-serif" }}>
          <AnimatedNumber value={level} duration={0.5} />
        </Box>
      </Typography>
    </Box>
  );
}
