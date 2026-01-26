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
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 상단 HUD */}
      {hud && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
          }}
        >
          {hud}
        </Box>
      )}

      {/* 중앙 캔버스 - 전체 화면 배경 */}
      {canvas && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0,
          }}
        >
          {canvas}
        </Box>
      )}

      {/* 하단 네비게이션 바 */}
      {navbar && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 100,
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
