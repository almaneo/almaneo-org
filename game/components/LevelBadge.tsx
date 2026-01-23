'use client';

import { Box, Typography } from '@mui/material';
import { MouseEvent } from 'react';
import Image from 'next/image';
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
        width: isMobile ? 28 : 36, 
        height: isMobile ? 28 : 36, 
        position: 'relative' 
      }}>
        <Image
          src="/images/icons/level-star.png"
          alt="Level"
          fill
          style={{ 
            objectFit: 'contain',
            filter: 'drop-shadow(0 4px 8px rgba(255,215,0,0.5))',
          }}
        />
      </Box>
      <Typography
        component="div"
        sx={{
          color: '#FFF',
          fontWeight: 'bold',
          fontSize: isMobile ? 16 : 22,
          fontFamily: "'Orbitron', sans-serif",
          textShadow: '0 2px 8px rgba(0,0,0,0.8), 0 0 16px rgba(0,0,0,0.6)',
          lineHeight: 1,
        }}
      >
        Level{' '}
        <Box component="span" sx={{ fontFamily: "'Exo 2', sans-serif" }}>
          <AnimatedNumber value={level} duration={0.5} />
        </Box>
      </Typography>
    </Box>
  );
}
