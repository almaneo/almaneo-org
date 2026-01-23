import React, { useEffect, useState } from 'react';
import { Snackbar, Box, Typography } from '@mui/material';
import { Achievement } from '@/lib/achievements';

interface AchievementNotificationProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export default function AchievementNotification({ achievement, onClose }: AchievementNotificationProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (achievement) {
      setOpen(true);
    }
  }, [achievement]);

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      onClose();
    }, 300); // Wait for animation to finish
  };

  if (!achievement) return null;

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{ mt: 2 }}
    >
      <Box
        onClick={handleClose}
        sx={{
          width: '100%',
          minWidth: 300,
          maxWidth: 400,
          background: 'rgba(20, 15, 10, 0.95)',
          border: '2px solid #FFD700',
          borderRadius: 2,
          boxShadow: '0 20px 60px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,215,0,0.2)',
          p: 2,
          cursor: 'pointer',
          position: 'relative',
          '&:hover': {
            borderColor: '#FFF',
            boxShadow: '0 20px 60px rgba(255,215,0,0.3), inset 0 1px 0 rgba(255,215,0,0.3)',
          },
          transition: 'all 0.3s ease',
        }}
      >
        {/* Close button */}
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: '#FFD700',
            fontSize: '20px',
            fontWeight: 'bold',
            opacity: 0.7,
            '&:hover': {
              opacity: 1,
            },
          }}
        >
          ×
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Achievement Icon */}
          <Box
            sx={{
              fontSize: '48px',
              lineHeight: 1,
              filter: 'drop-shadow(0 0 10px rgba(255,215,0,0.6))',
            }}
          >
            {achievement.icon}
          </Box>

          {/* Achievement Info */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                mb: 0.5,
                color: '#FFD700',
                textShadow: '0 0 10px rgba(255,215,0,0.5)',
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            >
              🎉 Achievement Unlocked!
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 0.5,
                color: '#FFF',
                textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
              }}
            >
              {achievement.title}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                mb: 0.5,
              }}
            >
              {achievement.description}
            </Typography>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                bgcolor: 'rgba(255, 215, 0, 0.2)',
                border: '1px solid rgba(255, 215, 0, 0.4)',
                px: 1,
                py: 0.25,
                borderRadius: 1,
              }}
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 600, 
                  color: '#FFD700',
                  textShadow: '0 0 8px rgba(255,215,0,0.5)',
                }}
              >
                Reward: +{achievement.reward.toLocaleString()} pts
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Snackbar>
  );
}
