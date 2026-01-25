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
        p: isLandscape ? 1.5 : 2.5,
        flex: '0 0 auto', // flex-shrink 방지
        minHeight: 'fit-content', // 콘텐츠에 맞는 최소 높이
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        background: isCompleted
          ? 'rgba(0, 82, 255, 0.1)'
          : 'rgba(255, 255, 255, 0.03)',
        border: isCompleted ? '2px solid #0052FF' : '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 3,
        filter: isHidden ? 'blur(3px)' : 'none',
        opacity: isHidden ? 0.6 : 1,
        '&:hover': {
          transform: 'translateY(-4px)',
          borderColor: isCompleted ? '#0052FF' : 'rgba(255, 255, 255, 0.2)',
          boxShadow: isCompleted
            ? '0 8px 32px rgba(0, 82, 255, 0.2)'
            : '0 8px 24px rgba(0, 0, 0, 0.3)',
        },
      }}
    >
      {/* Completed Badge */}
      {isCompleted && (
        <Box
          sx={{
            position: 'absolute',
            top: isLandscape ? 8 : 12,
            right: isLandscape ? 8 : 12,
            bgcolor: '#0052FF',
            color: 'white',
            px: isLandscape ? 1 : 1.5,
            py: 0.5,
            borderRadius: 1,
            fontWeight: 900,
            fontSize: isLandscape ? 8 : 10,
            letterSpacing: 1,
            boxShadow: '0 2px 8px rgba(0, 82, 255, 0.5)',
          }}
        >
          EARNED
        </Box>
      )}

      {/* Icon and Title Row */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: isLandscape ? 1.5 : 2, mb: isLandscape ? 1 : 1.5 }}>
        {/* Icon */}
        <Box
          sx={{
            fontSize: isLandscape ? 36 : 48,
            lineHeight: 1,
            minWidth: isLandscape ? 36 : 48,
            filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.1))',
          }}
        >
          {isHidden ? '🔒' : icon}
        </Box>

        {/* Title and Description */}
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              color: 'white',
              mb: 0.5,
              fontSize: isLandscape ? 16 : 18,
              letterSpacing: -0.5,
            }}
          >
            {isHidden ? 'Encrypted Data' : title}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255, 255, 255, 0.5)',
              lineHeight: 1.5,
              fontSize: isLandscape ? 11 : 13,
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
          <Box sx={{ mb: isLandscape ? 1 : 1.5 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: isLandscape ? 6 : 8,
                borderRadius: 1,
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                '& .MuiLinearProgress-bar': {
                  background: isCompleted
                    ? 'linear-gradient(90deg, #4CAF50 0%, #81C784 100%)'
                    : 'linear-gradient(90deg, #0052FF 0%, #00C2FF 100%)',
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
            <Typography variant={isLandscape ? 'caption' : 'body2'} sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
              SYNC: {current} / {target}
            </Typography>
            <Typography variant={isLandscape ? 'caption' : 'body2'} sx={{ color: isCompleted ? '#4CAF50' : '#0052FF', fontWeight: 800 }}>
              {progress.toFixed(0)}%
            </Typography>
          </Box>
        </>
      )}

      {/* Reward */}
      <Box
        sx={{
          mt: isLandscape ? 1.5 : 2,
          pt: isLandscape ? 1.5 : 2,
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', display: 'block', fontSize: 10 }}>UNLOCKED REWARD</Typography>
          <Typography
            variant="body1"
            sx={{
              color: isCompleted ? '#4CAF50' : 'white',
              fontWeight: 800,
              fontSize: isLandscape ? 14 : 16,
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
              fontSize: isLandscape ? 10 : 11,
            }}
          >
            {formatDate(completedAt)}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
