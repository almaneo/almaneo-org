'use client';

import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import ScreenRotationIcon from '@mui/icons-material/ScreenRotation';

interface OrientationLockProps {
  children: React.ReactNode;
}

export default function OrientationLock({ children }: OrientationLockProps) {
  const [isLandscape, setIsLandscape] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // 모바일 체크
    const checkMobile = () => {
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      setIsMobile(mobile);
    };

    // 화면 방향 체크
    const checkOrientation = () => {
      if (typeof window !== 'undefined') {
        const isLandscapeMode = window.innerWidth > window.innerHeight;
        setIsLandscape(isLandscapeMode);
      }
    };

    checkMobile();
    checkOrientation();

    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  // 모바일 + 세로모드 → 경고 표시
  if (isMobile && !isLandscape) {
    return (
      <Box
        sx={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          textAlign: 'center',
          p: 3,
        }}
      >
        <ScreenRotationIcon
          sx={{
            fontSize: 120,
            mb: 3,
            animation: 'rotate 2s ease-in-out infinite',
            '@keyframes rotate': {
              '0%, 100%': { transform: 'rotate(0deg)' },
              '50%': { transform: 'rotate(90deg)' },
            },
          }}
        />
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Please Rotate Your Device
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          MiMiG Carbon Farm is best played in landscape mode
        </Typography>
      </Box>
    );
  }

  // 가로모드 또는 데스크탑 → 정상 렌더링
  return <>{children}</>;
}
