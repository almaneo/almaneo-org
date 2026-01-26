import React from 'react';
import { Box, Typography, LinearProgress, useMediaQuery } from '@mui/material';
import { Achievement } from '@/lib/achievements';

interface AchievementCardProps {
  achievement: Achievement;
  current: number;
  onClaim?: (id: string) => void;
}

export default function AchievementCard({ achievement, current, onClaim }: AchievementCardProps) {
  const { id, title, description, icon, target, reward, completed, completedAt, hidden } = achievement;
  const isLandscape = useMediaQuery('(orientation: landscape) and (max-height: 500px)');
  const isMobile = useMediaQuery('(max-width: 480px)');

  // Calculate progress
  const progress = Math.min((current / target) * 100, 100);
  const isCompleted = completed;
  const isHidden = hidden && !completed;

  // Format completed date
  const formatDate = (date?: Date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Box
      sx={{
        p: isLandscape ? 1.5 : isMobile ? 1.5 : 2.5,
        flex: '0 0 auto', // flex-shrink 방지
        minHeight: 'fit-content', // 콘텐츠에 맞는 최소 높이
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        background: isCompleted
          ? 'rgba(255, 215, 0, 0.08)'
          : 'rgba(255, 255, 255, 0.03)',
        border: isCompleted ? '2px solid #FFD700' : '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 3,
        filter: isHidden ? 'blur(3px)' : 'none',
        opacity: isHidden ? 0.6 : 1,
        '&:hover': {
          transform: 'translateY(-4px)',
          borderColor: isCompleted ? '#FFD700' : 'rgba(255, 255, 255, 0.2)',
          boxShadow: isCompleted
            ? '0 8px 32px rgba(255, 215, 0, 0.2)'
            : '0 8px 24px rgba(0, 0, 0, 0.3)',
        },
      }}
    >
      {/* Completed Badge */}
      {isCompleted && (
        <Box
          sx={{
            position: 'absolute',
            top: isLandscape ? 8 : isMobile ? 8 : 12,
            right: isLandscape ? 8 : isMobile ? 8 : 12,
            bgcolor: '#FFD700',
            color: '#0A0F1A',
            px: isLandscape ? 1 : isMobile ? 1 : 1.5,
            py: 0.25,
            borderRadius: 1,
            fontWeight: 900,
            fontSize: isLandscape ? 8 : isMobile ? 8 : 10,
            letterSpacing: 1,
            boxShadow: '0 2px 8px rgba(255, 215, 0, 0.5)',
          }}
        >
          EARNED
        </Box>
      )}

      {/* Icon and Title Row */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: isLandscape ? 1 : isMobile ? 1.25 : 2, mb: isLandscape ? 1 : isMobile ? 1 : 1.5 }}>
        {/* Icon */}
        <Box
          sx={{
            fontSize: isLandscape ? 32 : isMobile ? 28 : 48,
            lineHeight: 1,
            minWidth: isLandscape ? 32 : isMobile ? 28 : 48,
            filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.1))',
          }}
        >
          {isHidden ? '🔒' : icon}
        </Box>

        {/* Title and Description */}
        <Box sx={{ flex: 1 }}>
          <Typography
            variant={isMobile ? 'body2' : 'h6'}
            sx={{
              fontWeight: 800,
              color: 'white',
              mb: 0.25,
              fontSize: isLandscape ? 14 : isMobile ? 13 : 18,
              letterSpacing: -0.5,
            }}
          >
            {isHidden ? 'Encrypted Data' : title}
          </Typography>

          <Typography
            variant="caption"
            sx={{
              color: 'rgba(255, 255, 255, 0.5)',
              lineHeight: 1.4,
              fontSize: isLandscape ? 10 : isMobile ? 11 : 13,
              fontWeight: 300,
            }}
          >
            {isHidden ? 'Unlock this node to decrypt mission data.' : description}
          </Typography>
        </Box>
      </Box>

      {/* Progress Section */}
      {!isHidden && (
        <>
          <Box sx={{ mb: isLandscape ? 0.75 : isMobile ? 0.75 : 1.5 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: isLandscape ? 5 : isMobile ? 5 : 8,
                borderRadius: 1,
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                '& .MuiLinearProgress-bar': {
                  background: isCompleted
                    ? 'linear-gradient(90deg, #4CAF50 0%, #81C784 100%)'
                    : 'linear-gradient(90deg, #FFD700 0%, #FF6B00 100%)',
                },
              }}
            />
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: isMobile ? 10 : undefined }}>
              SYNC: {current} / {target}
            </Typography>
            <Typography variant="caption" sx={{ color: isCompleted ? '#4CAF50' : '#FFD700', fontWeight: 800, fontSize: isMobile ? 10 : undefined }}>
              {progress.toFixed(0)}%
            </Typography>
          </Box>
        </>
      )}

      {/* Reward */}
      <Box
        sx={{
          mt: isLandscape ? 1 : isMobile ? 1 : 2,
          pt: isLandscape ? 1 : isMobile ? 1 : 2,
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', display: 'block', fontSize: isMobile ? 9 : 10 }}>UNLOCKED REWARD</Typography>
          <Typography
            variant="body2"
            sx={{
              color: isCompleted ? '#4CAF50' : 'white',
              fontWeight: 800,
              fontSize: isLandscape ? 13 : isMobile ? 13 : 16,
            }}
          >
            💖 +{reward}
          </Typography>
        </Box>

        {isCompleted && completedAt && (
          <Typography
            variant="caption"
            sx={{
              color: 'rgba(255, 255, 255, 0.3)',
              fontSize: isLandscape ? 9 : isMobile ? 9 : 11,
            }}
          >
            {formatDate(completedAt)}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
