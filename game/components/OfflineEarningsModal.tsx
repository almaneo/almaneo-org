'use client';

import { Box, Typography, Modal, Button, Backdrop, Fade, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import { useGameStore } from '@/hooks/useGameStore';

export default function OfflineEarningsModal() {
  const { showOfflineModal, offlineEarnings, offlineTime, dismissOfflineModal } = useGameStore();
  const isLandscape = useMediaQuery('(orientation: landscape) and (max-height: 500px)');

  const formatTime = (seconds: number): string => {
    if (seconds < 60) {
      return `${seconds} seconds`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      if (minutes === 0) {
        return `${hours} hour${hours > 1 ? 's' : ''}`;
      }
      return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} min`;
    }
  };

  return (
    <Modal
      open={showOfflineModal}
      onClose={dismissOfflineModal}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
          sx: {
            backdropFilter: 'blur(8px)',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
          }
        }
      }}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Fade in={showOfflineModal} timeout={500}>
        <Box
          sx={{
            position: 'relative',
            width: { xs: '95%', sm: '90%' },
            maxWidth: 400,
            background: 'rgba(20, 15, 10, 0.95)',
            border: '2px solid #FFD700',
            borderRadius: 3,
            boxShadow: '0 20px 60px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,215,0,0.2)',
            outline: 'none',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Box
              sx={{
                textAlign: 'center',
                p: isLandscape ? 1.5 : { xs: 2, sm: 2.5 },
                borderBottom: '1px solid rgba(255, 215, 0, 0.3)',
                background: 'linear-gradient(180deg, rgba(255,215,0,0.1) 0%, transparent 100%)',
              }}
            >
              <Typography 
                variant={isLandscape ? 'h5' : 'h4'}
                sx={{ 
                  mb: isLandscape ? 0.5 : 1,
                  color: '#FFD700',
                  fontWeight: 700,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 20px rgba(255,215,0,0.3)',
                  letterSpacing: 1,
                }}
              >
                🎉 Welcome Back!
              </Typography>
              <Typography 
                variant={isLandscape ? 'caption' : 'body2'}
                sx={{ 
                  color: 'rgba(255,255,255,0.7)',
                }}
              >
                Your farm kept working while you were away
              </Typography>
            </Box>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Box sx={{ p: isLandscape ? 1.5 : { xs: 2, sm: 3 } }}>
              {/* Offline Time */}
              <Box
                sx={{
                  bgcolor: 'rgba(255,255,255,0.1)',
                  borderRadius: 2,
                  p: isLandscape ? 1.5 : 2,
                  mb: isLandscape ? 1.5 : 2,
                  textAlign: 'center',
                  border: '1px solid rgba(255,215,0,0.2)',
                }}
              >
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: 'rgba(255,255,255,0.7)',
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                  }}
                >
                  You were away for
                </Typography>
                <Typography 
                  variant={isLandscape ? 'h6' : 'h5'}
                  fontWeight="bold" 
                  sx={{ 
                    color: '#FFD700',
                    textShadow: '0 0 10px rgba(255,215,0,0.5)',
                  }}
                >
                  {formatTime(offlineTime)}
                </Typography>
              </Box>

              {/* Earnings */}
              <Box
                sx={{
                  bgcolor: 'rgba(76, 175, 80, 0.15)',
                  borderRadius: 2,
                  p: isLandscape ? 2 : 3,
                  mb: isLandscape ? 1.5 : 3,
                  textAlign: 'center',
                  border: '2px solid #4CAF50',
                  boxShadow: '0 0 20px rgba(76, 175, 80, 0.3)',
                }}
              >
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: 'rgba(255,255,255,0.7)',
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                  }}
                >
                  Offline Earnings
                </Typography>
                <Typography 
                  variant={isLandscape ? 'h4' : 'h3'}
                  fontWeight="bold" 
                  sx={{ 
                    color: '#4CAF50', 
                    my: isLandscape ? 0.5 : 1,
                    textShadow: '0 0 20px rgba(76, 175, 80, 0.6)',
                  }}
                >
                  +{offlineEarnings.toLocaleString()}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'rgba(255,255,255,0.7)',
                  }}
                >
                  points earned
                </Typography>
              </Box>

              {/* Close Button */}
              <Button
                variant="contained"
                fullWidth
                onClick={dismissOfflineModal}
                sx={{
                  bgcolor: '#4CAF50',
                  color: 'white',
                  py: isLandscape ? 1 : 1.5,
                  fontSize: isLandscape ? '1rem' : '1.1rem',
                  fontWeight: 'bold',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  boxShadow: '0 4px 12px rgba(76, 175, 80, 0.4)',
                  '&:hover': {
                    bgcolor: '#45a049',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 16px rgba(76, 175, 80, 0.6)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                Awesome! 🌾
              </Button>
            </Box>
          </motion.div>
        </Box>
      </Fade>
    </Modal>
  );
}
