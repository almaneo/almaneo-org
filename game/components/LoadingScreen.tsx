'use client';

/**
 * LoadingScreen Component
 * 게임 데이터 로딩 중 표시되는 화면
 */

import { Box, Typography, CircularProgress } from '@mui/material';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({
  message
}: LoadingScreenProps) {
  const { t } = useTranslation('game');
  const displayMessage = message || t('loading.message');
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        overflow: 'hidden',
      }}
    >
      {/* Full Background Image */}
      <Image
        src="/images/almaneo-title.webp"
        alt="AlmaNEO"
        fill
        style={{
          objectFit: 'cover',
          objectPosition: 'center',
        }}
        priority
      />

      {/* Dark Overlay for readability */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at center, rgba(10,15,26,0.4) 0%, rgba(10,15,26,0.85) 100%)',
          zIndex: 1,
        }}
      />

      {/* Content */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <CircularProgress
          size={48}
          thickness={4}
          sx={{
            color: '#0052FF',
            animationDuration: '1s',
            mb: 3,
          }}
        />

        <Typography
          variant="h6"
          sx={{
            color: 'white',
            fontWeight: 500,
            textAlign: 'center',
            px: 2,
            fontSize: { xs: '1rem', sm: '1.25rem' },
            textShadow: '0 2px 8px rgba(0,0,0,0.6)',
          }}
        >
          {displayMessage}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: 'rgba(255,255,255,0.6)',
            textAlign: 'center',
            mt: 1,
            px: 2,
            textShadow: '0 1px 4px rgba(0,0,0,0.5)',
          }}
        >
          {t('loading.subtitle')}
        </Typography>
      </Box>
    </Box>
  );
}
