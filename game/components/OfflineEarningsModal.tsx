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
            background: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '2px solid #0052FF',
            borderRadius: 4,
            boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 20px rgba(0, 82, 255, 0.2)',
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
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'linear-gradient(180deg, rgba(0, 82, 255, 0.1) 0%, transparent 100%)',
              }}
            >
              <Typography
                variant={isLandscape ? 'h5' : 'h4'}
                sx={{
                  mb: isLandscape ? 0.5 : 1,
                  color: 'white',
                  fontWeight: 900,
                  letterSpacing: -1,
                  textShadow: '0 0 20px rgba(255,255,255,0.3)',
                }}
              >
                📡 Signal Restored
              </Typography>
              <Typography
                variant={isLandscape ? 'caption' : 'body2'}
                sx={{
                  color: 'rgba(255,255,255,0.5)',
                  fontWeight: 'light'
                }}
              >
                Your Auto-ML model stayed active during disconnect.
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
                  bgcolor: 'rgba(255,255,255,0.03)',
                  borderRadius: 2,
                  p: isLandscape ? 1.5 : 2,
                  mb: isLandscape ? 1.5 : 2,
                  textAlign: 'center',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: '#0052FF',
                    textTransform: 'uppercase',
                    letterSpacing: 2,
                    fontWeight: 'bold'
                  }}
                >
                  DISCONNECT DURATION
                </Typography>
                <Typography
                  variant={isLandscape ? 'h6' : 'h5'}
                  fontWeight="bold"
                  sx={{
                    color: 'white',
                  }}
                >
                  {formatTime(offlineTime)}
                </Typography>
              </Box>

              {/* Earnings */}
              <Box
                sx={{
                  bgcolor: 'rgba(76, 175, 80, 0.1)',
                  borderRadius: 2,
                  p: isLandscape ? 2 : 3,
                  mb: isLandscape ? 1.5 : 3,
                  textAlign: 'center',
                  border: '1px solid rgba(76, 175, 80, 0.3)',
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: 'rgba(76, 175, 80, 0.8)',
                    textTransform: 'uppercase',
                    letterSpacing: 2,
                    fontWeight: 'bold'
                  }}
                >
                  KINDNESS ACCUMULATED
                </Typography>
                <Typography
                  variant={isLandscape ? 'h4' : 'h3'}
                  fontWeight="black"
                  sx={{
                    color: '#4CAF50',
                    my: isLandscape ? 0.5 : 1,
                    textShadow: '0 0 30px rgba(76, 175, 80, 0.4)',
                  }}
                >
                  +{offlineEarnings.toLocaleString()}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255,255,255,0.4)',
                    fontWeight: 'bold'
                  }}
                >
                  POINTS SYNCED
                </Typography>
              </Box>

              {/* Close Button */}
              <Button
                variant="contained"
                fullWidth
                onClick={dismissOfflineModal}
                sx={{
                  bgcolor: '#0052FF',
                  color: 'white',
                  py: isLandscape ? 1 : 1.5,
                  fontSize: isLandscape ? '0.9rem' : '1.1rem',
                  fontWeight: 900,
                  letterSpacing: 1,
                  boxShadow: '0 4px 14px 0 rgba(0, 82, 255, 0.4)',
                  '&:hover': {
                    bgcolor: '#0041CC',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(0, 82, 255, 0.6)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                RESUME MISSION 🚀
              </Button>
            </Box>
          </motion.div>
        </Box>
      </Fade>
    </Modal>
  );
}
