'use client';

import { Box, Typography, Badge } from '@mui/material';
import { ReactNode } from 'react';
import { useIsMobile } from '@/hooks/useIsMobile';

interface GameIconButtonProps {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  badge?: number;
  active?: boolean;
}

export default function GameIconButton({
  icon,
  label,
  onClick,
  badge,
  active = false,
}: GameIconButtonProps) {
  const isMobile = useIsMobile();

  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: isMobile ? 0 : 0.5,
        cursor: 'pointer',
        userSelect: 'none',
        transition: 'transform 0.2s ease',
        touchAction: 'manipulation',
        WebkitTapHighlightColor: 'transparent',
        '&:active': {
          transform: 'scale(0.9) translateY(2px)',
        },
      }}
    >
      {/* 아이콘 버튼 */}
      <Badge
        badgeContent={badge}
        color="error"
        sx={{
          '& .MuiBadge-badge': {
            fontSize: 11,
            fontWeight: 'bold',
            minWidth: 20,
            height: 20,
            border: '2px solid white',
          },
        }}
      >
        <Box
          sx={{
            width: isMobile ? 56 : 108,
            height: isMobile ? 56 : 108,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            filter: active 
              ? 'drop-shadow(0 8px 16px rgba(255,215,0,0.8)) drop-shadow(0 4px 8px rgba(255,215,0,0.6))'
              : 'drop-shadow(0 6px 12px rgba(0,0,0,0.4)) drop-shadow(0 3px 6px rgba(0,0,0,0.3))',
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-4px) scale(1.05)',
              filter: active
                ? 'drop-shadow(0 12px 24px rgba(255,215,0,0.9)) drop-shadow(0 6px 12px rgba(255,215,0,0.7))'
                : 'drop-shadow(0 10px 20px rgba(0,0,0,0.5)) drop-shadow(0 5px 10px rgba(0,0,0,0.4))',
            },
            '&:active': {
              transform: 'scale(0.95)',
            },
          }}
        >
          {icon}
        </Box>
      </Badge>

      {/* 라벨 */}
      <Typography
        sx={{
          display: isMobile ? 'none' : 'block',
          color: active ? '#FFD700' : '#fff',
          fontSize: 14,
          fontWeight: active ? 'bold' : 600,
          fontFamily: "'Exo 2', sans-serif",
          textShadow: '0 2px 6px rgba(0,0,0,0.9), 0 0 12px rgba(0,0,0,0.7)',
          letterSpacing: 0.5,
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}
