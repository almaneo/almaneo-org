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
  message = 'Loading your farm...' 
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
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        zIndex: 9999,
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          height: 120,
          position: 'relative',
          mb: 4,
          filter: 'drop-shadow(0 4px 8px rgba(255,215,0,0.6))',
        }}
      >
        <Image
          src="/images/mimig-farm-logo.png"
          alt="MiMiG Farm"
          height={120}
          width={400}
          style={{
            height: '100%',
            width: 'auto',
            objectFit: 'contain',
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
          size={60}
          thickness={4}
          sx={{
            color: '#FFD700',
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
        }}
      >
        {message}
      </Typography>

      {/* Subtitle */}
      <Typography
        variant="body2"
        sx={{
          color: 'rgba(255,255,255,0.7)',
          textAlign: 'center',
          mt: 1,
          px: 2,
        }}
      >
        Preparing your sustainable farm...
      </Typography>
    </Box>
  );
}
