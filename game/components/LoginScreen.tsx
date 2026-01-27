'use client';

import { Box, Typography, Button } from '@mui/material';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface LoginScreenProps {
  onLogin: () => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const { t } = useTranslation('game');
  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        background: 'radial-gradient(circle at center, #0a192f 0%, #000000 100%)',
        color: 'white',
        padding: { xs: 1.5, sm: 4 },
        overflow: 'auto',
        position: 'relative',
        flexDirection: 'column',
      }}
    >
      {/* Background Particles Pattern */}
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          opacity: 0.1,
          backgroundImage: 'radial-gradient(#0052ff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          animation: 'float 60s infinite linear',
          '@keyframes float': {
            '0%': { backgroundPosition: '0 0' },
            '100%': { backgroundPosition: '500px 500px' },
          },
        }}
      />

      {/* Ambient Glow */}
      <Box sx={{
        position: 'absolute',
        top: '20%',
        left: '20%',
        width: 400,
        height: 400,
        bgcolor: 'rgba(0, 82, 255, 0.1)',
        filter: 'blur(100px)',
        borderRadius: '50%',
        zIndex: 0,
      }} />
      <Box sx={{
        position: 'absolute',
        bottom: '20%',
        right: '20%',
        width: 400,
        height: 400,
        bgcolor: 'rgba(255, 107, 0, 0.05)',
        filter: 'blur(100px)',
        borderRadius: '50%',
        zIndex: 0,
      }} />

      {/* Main Container */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        sx={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 1.5, sm: 3, md: 8 },
          alignItems: 'center',
          justifyContent: 'center',
          my: 'auto',
        }}
      >
        {/* Branding Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          {/* Logo */}
          <Box
            sx={{
              mb: { xs: 1, sm: 3 },
              filter: 'drop-shadow(0 0 20px rgba(0, 82, 255, 0.4))',
            }}
          >
            <Image
              src="/logo.png"
              alt="AlmaNEO"
              width={350}
              height={100}
              priority
              style={{
                maxWidth: '60vw',
                height: 'auto',
              }}
            />
          </Box>

          {/* Slogan */}
          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
              mb: { xs: 0.5, sm: 2 },
              letterSpacing: -1,
              background: 'linear-gradient(90deg, #fff 0%, #0052ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '1.4rem', sm: '2rem', md: '3rem' },
            }}
          >
            {t('login.slogan')}
          </Typography>

          <Typography
            sx={{
              color: 'rgba(255,255,255,0.7)',
              mb: { xs: 1, sm: 3 },
              fontWeight: 300,
              lineHeight: 1.5,
              maxWidth: 500,
              fontSize: { xs: '0.8rem', sm: '1rem' },
              px: 1,
            }}
          >
            {t('login.description')}
          </Typography>

          {/* Stats Preview */}
          <Box sx={{ display: 'flex', gap: { xs: 3, sm: 4 } }}>
            <Box>
              <Typography sx={{ color: '#0052ff', fontWeight: 'bold', fontSize: { xs: '0.9rem', sm: '1rem' } }}>8B+</Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: { xs: '0.6rem', sm: '0.75rem' } }}>{t('login.humansTargeted')}</Typography>
            </Box>
            <Box>
              <Typography sx={{ color: '#FF6B00', fontWeight: 'bold', fontSize: { xs: '0.9rem', sm: '1rem' } }}>100%</Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: { xs: '0.6rem', sm: '0.75rem' } }}>{t('login.openAccess')}</Typography>
            </Box>
          </Box>
        </Box>

        {/* Login Card */}
        <Box
          sx={{
            width: '100%',
            maxWidth: 360,
            p: { xs: 2.5, sm: 4 },
            bgcolor: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            borderRadius: 3,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          }}
        >
          <Typography sx={{ mb: { xs: 2, sm: 3 }, fontWeight: 'bold', textAlign: 'center', fontSize: { xs: '1.1rem', sm: '1.3rem' } }}>
            {t('login.welcomeTitle')}
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: { xs: 2, sm: 3 } }}>
            {[
              { icon: '🧠', text: t('login.feature1') },
              { icon: '💖', text: t('login.feature2') },
              { icon: '💎', text: t('login.feature3') },
            ].map((feature, i) => (
              <Box
                key={i}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  p: { xs: 1, sm: 1.5 },
                  borderRadius: 2,
                  bgcolor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.02)',
                }}
              >
                <Typography sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>{feature.icon}</Typography>
                <Typography sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' }, color: 'rgba(255,255,255,0.8)' }}>
                  {feature.text}
                </Typography>
              </Box>
            ))}
          </Box>

          <Button
            onClick={onLogin}
            fullWidth
            variant="contained"
            sx={{
              py: { xs: 1.2, sm: 2 },
              borderRadius: 2,
              bgcolor: '#0052ff',
              fontWeight: 'bold',
              fontSize: { xs: '0.95rem', sm: '1.1rem' },
              boxShadow: '0 0 20px rgba(0, 82, 255, 0.4)',
              '&:hover': {
                bgcolor: '#0041cc',
                boxShadow: '0 0 30px rgba(0, 82, 255, 0.6)',
              }
            }}
          >
            {t('login.connectWallet')}
          </Button>

          <Typography variant="caption" sx={{ display: 'block', mt: { xs: 1.5, sm: 3 }, textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: { xs: '0.6rem', sm: '0.75rem' } }}>
            {t('login.poweredBy')}
            <br />
            {t('login.secureLogin')}
          </Typography>
        </Box>
      </Box>

      {/* Footer Branding */}
      <Box sx={{ textAlign: 'center', width: '100%', opacity: 0.3, py: { xs: 1, sm: 2 }, mt: 'auto' }}>
        <Typography variant="caption" sx={{ letterSpacing: 2, fontSize: { xs: '0.55rem', sm: '0.75rem' } }}>
          {t('login.copyright')}
        </Typography>
      </Box>
    </Box>
  );
}
