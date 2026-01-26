'use client';

import { Box, Typography } from '@mui/material';
import { MouseEvent } from 'react';
import AnimatedNumber from './AnimatedNumber';
import { useIsMobile } from '@/hooks/useIsMobile';

interface ResourceCounterProps {
  value: number;
  label?: string;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
}

export default function ResourceCounter({
  value,
  label,
  onClick
}: ResourceCounterProps) {
  const isMobile = useIsMobile();

  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: isMobile ? 0.5 : 1,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s',
        '&:hover': onClick ? {
          transform: 'scale(1.05)',
        } : {},
      }}
    >
      <Box sx={{
        width: isMobile ? 20 : 40,
        height: isMobile ? 20 : 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: isMobile ? 16 : 32,
        filter: 'drop-shadow(0 0 8px rgba(255, 0, 107, 0.4))',
      }}>
        💖
      </Box>
      <Typography
        component="div"
        sx={{
          color: '#FFF',
          fontWeight: 'bold',
          fontSize: isMobile ? 12 : 22,
          fontFamily: "'Exo 2', sans-serif",
          textShadow: '0 2px 8px rgba(0,0,0,0.8), 0 0 16px rgba(0,0,0,0.6)',
          lineHeight: 1,
        }}
      >
        <AnimatedNumber value={value} duration={0.5} />
      </Typography>
    </Box>
  );
}
