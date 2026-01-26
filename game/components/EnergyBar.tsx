'use client';

import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useEffect, useState, MouseEvent } from 'react';
import AnimatedNumber from './AnimatedNumber';
import { useIsMobile } from '@/hooks/useIsMobile';

interface EnergyBarProps {
  current: number;
  max: number;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
}

export default function EnergyBar({ current, max, onClick }: EnergyBarProps) {
  const percentage = Math.min((current / max) * 100, 100);
  const isLow = percentage < 30;
  const [isPulsing, setIsPulsing] = useState(false);
  const [prevCurrent, setPrevCurrent] = useState(current);
  const isMobile = useIsMobile();

  // 에너지 증가 감지
  useEffect(() => {
    if (current > prevCurrent) {
      // 에너지 회복 시 Pulse 효과
      setIsPulsing(true);
      const timer = setTimeout(() => setIsPulsing(false), 600);
      return () => clearTimeout(timer);
    }
    setPrevCurrent(current);
  }, [current, prevCurrent]);

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
      {/* 에너지 아이콘 - Pulse 효과 */}
      <motion.div
        animate={
          isPulsing
            ? {
                scale: [1, 1.2, 1],
                filter: [
                  'drop-shadow(0 4px 8px rgba(255,193,7,0.5))',
                  'drop-shadow(0 0 16px rgba(255,193,7,1))',
                  'drop-shadow(0 4px 8px rgba(255,193,7,0.5))'
                ]
              }
            : isLow
            ? {
                scale: [1, 1.15, 1],
                opacity: [1, 0.6, 1],
                filter: [
                  'drop-shadow(0 4px 8px rgba(255,193,7,0.5))',
                  'drop-shadow(0 0 12px rgba(255,82,34,0.8))',
                  'drop-shadow(0 4px 8px rgba(255,193,7,0.5))'
                ]
              }
            : {}
        }
        transition={
          isPulsing
            ? { duration: 0.6, ease: 'easeOut' }
            : isLow
            ? { duration: 0.8, repeat: Infinity, ease: 'easeInOut' }
            : {}
        }
      >
        <Box sx={{
          width: isMobile ? 18 : 36,
          height: isMobile ? 18 : 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: isMobile ? 14 : 28,
          filter: 'drop-shadow(0 4px 8px rgba(255,193,7,0.5))',
        }}>
          ⚡
        </Box>
      </motion.div>

      {/* 에너지 숫자 - 깜빡임 효과 (부족 시) */}
      <motion.div
        animate={
          isLow
            ? {
                color: ['#FF5722', '#FF8A65', '#FF5722'],
                scale: [1, 1.1, 1]
              }
            : {}
        }
        transition={
          isLow
            ? { duration: 0.8, repeat: Infinity, ease: 'easeInOut' }
            : {}
        }
      >
        <Typography
          component="div"
          sx={{
            color: isLow ? '#FF5722' : '#FFF',
            fontWeight: 'bold',
            fontSize: isMobile ? 12 : 22,
            fontFamily: "'Exo 2', sans-serif",
            textShadow: '0 2px 8px rgba(0,0,0,0.8), 0 0 16px rgba(0,0,0,0.6)',
            lineHeight: 1,
          }}
        >
          <AnimatedNumber value={current} duration={0.3} />
          <span>/{max}</span>
        </Typography>
      </motion.div>
    </Box>
  );
}
