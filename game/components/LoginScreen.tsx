'use client';

import { Box, Typography, Button } from '@mui/material';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface LoginScreenProps {
  onLogin: () => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a472a 0%, #0d2818 100%)',
        color: 'white',
        padding: { xs: 2, sm: 4 },
        overflow: 'auto',
        position: 'relative',
      }}
    >
      {/* Background Rice Pattern */}
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          opacity: 0.05,
          backgroundImage: 'url(/images/rice.png)',
          backgroundSize: '100px',
          backgroundRepeat: 'repeat',
          animation: 'float 20s infinite linear',
          '@keyframes float': {
            '0%': { backgroundPosition: '0 0' },
            '100%': { backgroundPosition: '100px 100px' },
          },
        }}
      />

      {/* Main Container - 2단 레이아웃 */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        sx={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: { xs: '100%', sm: 900 },
          display: 'flex',
          flexDirection: { xs: 'row', sm: 'row' },
          gap: { xs: 2, sm: 4 },
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* 왼쪽: 로고 + 메시지 */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: { xs: 'flex-start', sm: 'center' },
            textAlign: { xs: 'left', sm: 'center' },
          }}
        >
          {/* Logo */}
          <Box
            sx={{
              mb: 1,
              filter: 'drop-shadow(0 4px 12px rgba(255,215,0,0.6))',
            }}
          >
            <Image
              src="/images/mimig-farm-logo.png"
              alt="MiMiG Farm"
              width={200}
              height={60}
              priority
              style={{
                maxWidth: '100%',
                height: 'auto',
              }}
            />
          </Box>

          {/* Title */}
          <Typography
            component={motion.h1}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            sx={{
              mb: 0.5,
              fontWeight: 'bold',
              color: '#FFD700',
              fontSize: { xs: '0.85rem', sm: '1.8rem' },
              lineHeight: 1.2,
            }}
          >
            🌾 Welcome to
            <br />
            MiMiG Carbon Farm
          </Typography>

          {/* Description */}
          <Typography
            component={motion.p}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            sx={{
              color: 'rgba(255,255,255,0.85)',
              fontSize: { xs: '0.65rem', sm: '0.95rem' },
              lineHeight: 1.3,
            }}
          >
            Harvest rice, earn points,
            <br />
            and contribute to
            <br />
            sustainable farming.
          </Typography>
        </Box>

        {/* 오른쪽: Features + 버튼 */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: { xs: 1, sm: 2 },
          }}
        >
          {/* Features - 세로 배치 */}
          <Box
            component={motion.div}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 0.8,
              width: '100%',
            }}
          >
            <Box
              sx={{
                bgcolor: 'rgba(255,255,255,0.1)',
                borderRadius: 1.5,
                p: { xs: 0.8, sm: 1.5 },
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Typography sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>
                🌾
              </Typography>
              <Typography
                sx={{
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: { xs: '0.7rem', sm: '0.9rem' },
                  fontWeight: 500,
                }}
              >
                Tap to Harvest
              </Typography>
            </Box>

            <Box
              sx={{
                bgcolor: 'rgba(255,255,255,0.1)',
                borderRadius: 1.5,
                p: { xs: 0.8, sm: 1.5 },
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Typography sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>
                💎
              </Typography>
              <Typography
                sx={{
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: { xs: '0.7rem', sm: '0.9rem' },
                  fontWeight: 500,
                }}
              >
                Earn Rewards
              </Typography>
            </Box>

            <Box
              sx={{
                bgcolor: 'rgba(255,255,255,0.1)',
                borderRadius: 1.5,
                p: { xs: 0.8, sm: 1.5 },
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Typography sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>
                🌍
              </Typography>
              <Typography
                sx={{
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: { xs: '0.7rem', sm: '0.9rem' },
                  fontWeight: 500,
                }}
              >
                Save Planet
              </Typography>
            </Box>
          </Box>

          {/* Connect Button */}
          <Button
            component={motion.button}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onLogin}
            variant="contained"
            size="large"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            sx={{
              bgcolor: '#FFD700',
              color: '#1a472a',
              px: { xs: 2.5, sm: 5 },
              py: { xs: 1, sm: 1.8 },
              borderRadius: 3,
              fontWeight: 'bold',
              fontSize: { xs: '0.8rem', sm: '1.1rem' },
              boxShadow: '0 4px 16px rgba(255,215,0,0.4)',
              transition: 'all 0.3s',
              width: '100%',
              '&:hover': {
                bgcolor: '#FFC700',
                boxShadow: '0 8px 24px rgba(255,215,0,0.6)',
              },
            }}
          >
            🔗 Connect Wallet
          </Button>

          {/* Security Note */}
          <Typography
            component={motion.p}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            sx={{
              color: 'rgba(255,255,255,0.5)',
              fontSize: { xs: '0.55rem', sm: '0.7rem' },
              textAlign: 'center',
            }}
          >
            🔒 Secure login with Web3Auth
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
