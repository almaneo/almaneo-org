'use client';

import { Box } from '@mui/material';
import { ReactNode } from 'react';

interface GameLayoutProps {
  hud?: ReactNode;
  canvas?: ReactNode;
  navbar?: ReactNode;
  modals?: ReactNode;
}

export default function GameLayout({
  hud,
  canvas,
  navbar,
  modals,
}: GameLayoutProps) {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 캔버스 - 전체 화면 배경 (absolute) */}
      {canvas && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
          }}
        >
          {canvas}
        </Box>
      )}

      {/* 상단 HUD (flex item, overlays canvas via z-index) */}
      {hud && (
        <Box
          sx={{
            position: 'relative',
            zIndex: 100,
            flexShrink: 0,
          }}
        >
          {hud}
        </Box>
      )}

      {/* 중앙 공간 (canvas가 배경으로 보임) */}
      <Box sx={{ flex: 1 }} />

      {/* 하단 네비게이션 바 (flex item, always visible) */}
      {navbar && (
        <Box
          sx={{
            position: 'relative',
            zIndex: 100,
            flexShrink: 0,
          }}
        >
          {navbar}
        </Box>
      )}

      {/* 모달 (팝업) */}
      {modals}
    </Box>
  );
}
