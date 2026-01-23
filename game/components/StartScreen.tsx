'use client';

import { Box, Button, Typography } from '@mui/material';
import { motion } from 'framer-motion';

interface StartScreenProps {
  open: boolean;
  onStart: () => void;
}

export default function StartScreen({ open, onStart }: StartScreenProps) {
  if (!open) return null;
  
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        bgcolor: '#0A0F1A',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        overflow: 'hidden',
      }}
    >
      {/* 로고 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Typography
          variant="h2"
          sx={{
            color: '#0052FF',
            fontWeight: 'bold',
            mb: 2,
            textAlign: 'center',
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            px: 2,
          }}
        >
          💙 AlmaNEO Kindness 🧡
        </Typography>
      </motion.div>

      {/* 부제 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <Typography
          variant="h6"
          sx={{
            color: 'rgba(255,255,255,0.8)',
            mb: 6,
            textAlign: 'center',
            fontSize: { xs: '1rem', sm: '1.25rem' },
            px: 2,
          }}
        >
          Spread kindness, earn ALMAN tokens
        </Typography>
      </motion.div>

      {/* Start 버튼 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Button
          variant="contained"
          onClick={onStart}
          sx={{
            bgcolor: '#0052FF',
            color: 'white',
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
            px: { xs: 4, sm: 6 },
            py: { xs: 1.5, sm: 2 },
            borderRadius: 3,
            boxShadow: '0 8px 24px rgba(0, 82, 255, 0.4)',
            '&:hover': {
              bgcolor: '#0041CC',
              transform: 'scale(1.05)',
              boxShadow: '0 12px 32px rgba(0, 82, 255, 0.6)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          🎮 Start Game
        </Button>
      </motion.div>

      {/* 안내 텍스트 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <Typography
          variant="body2"
          sx={{
            color: 'rgba(255,255,255,0.6)',
            mt: 4,
            textAlign: 'center',
            fontSize: { xs: '0.875rem', sm: '1rem' },
            px: 2,
          }}
        >
          탭하여 환경을 지키는 여정을 시작하세요
        </Typography>
      </motion.div>
    </Box>
  );
}
