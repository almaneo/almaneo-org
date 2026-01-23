'use client';

import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

export default function RotateDevicePrompt() {
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      // 세로 모드 감지
      const portrait = window.innerHeight > window.innerWidth;
      setIsPortrait(portrait);
    };

    // 초기 체크
    checkOrientation();

    // 리사이즈/방향 변경 감지
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  if (!isPortrait) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        bgcolor: 'rgba(0, 0, 0, 0.95)',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
      }}
    >
      {/* 회전 아이콘 애니메이션 */}
      <motion.div
        animate={{
          rotate: [0, -90, -90, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <Box
          sx={{
            fontSize: 80,
            filter: 'drop-shadow(0 0 20px rgba(255,215,0,0.8))',
          }}
        >
          📱
        </Box>
      </motion.div>

      {/* 메시지 */}
      <Box sx={{ textAlign: 'center', px: 4 }}>
        <Typography
          variant="h4"
          sx={{
            color: '#FFD700',
            fontWeight: 'bold',
            fontFamily: "'Orbitron', sans-serif",
            mb: 2,
            textShadow: '0 0 20px rgba(255,215,0,0.8)',
          }}
        >
          Please Rotate Your Device
        </Typography>
        
        <Typography
          variant="h6"
          sx={{
            color: '#FFF',
            fontFamily: "'Exo 2', sans-serif",
            mb: 1,
          }}
        >
          기기를 가로 방향으로 회전해주세요
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: 'rgba(255,255,255,0.7)',
            fontFamily: "'Exo 2', sans-serif",
          }}
        >
          이 게임은 가로 모드에 최적화되어 있습니다
        </Typography>
      </Box>

      {/* 방향 표시 */}
      <motion.div
        animate={{
          x: [-20, 20, -20],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <Typography
          sx={{
            color: '#FFD700',
            fontSize: 40,
            filter: 'drop-shadow(0 0 10px rgba(255,215,0,0.6))',
          }}
        >
          ↔️
        </Typography>
      </motion.div>
    </Box>
  );
}
