'use client';

import { Box, Button, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import Image from 'next/image';

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
      {/* Title Image */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ marginBottom: 16 }}
      >
        <Image
          src="/images/almaneo-title.webp"
          alt="AlmaNEO"
          width={280}
          height={280}
          style={{
            objectFit: 'contain',
            maxWidth: '70vw',
            height: 'auto',
          }}
          priority
        />
      </motion.div>

      {/* Tagline */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <Typography
          variant="h6"
          sx={{
            color: 'rgba(255,255,255,0.8)',
            mb: 5,
            textAlign: 'center',
            fontSize: { xs: '1rem', sm: '1.25rem' },
            px: 2,
            fontWeight: 'light',
            letterSpacing: 1
          }}
        >
          Cold Code, Warm Soul.
        </Typography>
      </motion.div>

      {/* Start Button */}
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
            fontWeight: 'bold',
            boxShadow: '0 8px 24px rgba(0, 82, 255, 0.4)',
            '&:hover': {
              bgcolor: '#0041CC',
              transform: 'scale(1.05)',
              boxShadow: '0 12px 32px rgba(0, 82, 255, 0.6)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          ENTER THE HUB
        </Button>
      </motion.div>

      {/* Subtitle */}
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
          Help democratize AI through human connection
        </Typography>
      </motion.div>
    </Box>
  );
}
