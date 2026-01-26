/**
 * LoadingScreen Component
 * 게임 데이터 로딩 중 표시되는 화면
 */

import { Box, Typography, CircularProgress } from '@mui/material';
import Image from 'next/image';

interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({
  message = 'Loading your journey...'
}: LoadingScreenProps) {
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
        background: 'linear-gradient(135deg, #0A0F1A 0%, #1e293b 50%, #0A0F1A 100%)',
        zIndex: 9999,
      }}
    >
      {/* Title Image */}
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Image
          src="/images/almaneo-title.webp"
          alt="AlmaNEO"
          width={200}
          height={200}
          style={{
            objectFit: 'contain',
            maxWidth: '50vw',
            height: 'auto',
          }}
          priority
        />
      </Box>

      {/* Loading Spinner */}
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 3,
        }}
      >
        <CircularProgress
          size={48}
          thickness={4}
          sx={{
            color: '#0052FF',
            animationDuration: '1s',
          }}
        />
      </Box>

      {/* Loading Message */}
      <Typography
        variant="h6"
        sx={{
          color: 'white',
          fontWeight: 500,
          textAlign: 'center',
          px: 2,
          fontSize: { xs: '1rem', sm: '1.25rem' },
        }}
      >
        {message}
      </Typography>

      {/* Subtitle */}
      <Typography
        variant="body2"
        sx={{
          color: 'rgba(255,255,255,0.5)',
          textAlign: 'center',
          mt: 1,
          px: 2,
        }}
      >
        Explore cultures, spread kindness
      </Typography>
    </Box>
  );
}
