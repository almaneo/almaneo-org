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
          ? 'linear-gradient(145deg, rgba(255, 215, 0, 0.2) 0%, rgba(255, 165, 0, 0.2) 100%)'
          : 'linear-gradient(145deg, rgba(60, 40, 25, 0.8) 0%, rgba(40, 25, 15, 0.8) 100%)',
        border: isCompleted ? '2px solid #FFD700' : '2px solid rgba(139, 69, 19, 0.6)',
        borderRadius: 2,
        filter: isHidden ? 'blur(3px)' : 'none',
        opacity: isHidden ? 0.6 : 1,
        '&:hover': {
          transform: 'translateY(-4px)',
          borderColor: isCompleted ? '#FFD700' : 'rgba(139, 69, 19, 0.8)',
          boxShadow: isCompleted 
            ? '0 8px 24px rgba(255, 215, 0, 0.4)'
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
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA000 100%)',
            color: '#000',
            px: isLandscape ? 1 : 1.5,
            py: 0.5,
            borderRadius: 1,
            fontWeight: 700,
            fontSize: isLandscape ? 10 : 12,
            boxShadow: '0 2px 8px rgba(255, 215, 0, 0.5)',
          }}
        >
          ✓ Completed
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
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
          }}
        >
          {isHidden ? '🔒' : icon}
        </Box>

        {/* Title and Description */}
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: isCompleted ? '#FFD700' : '#FFF',
              mb: 0.5,
              textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
              fontSize: isLandscape ? 16 : undefined,
            }}
          >
            {isHidden ? 'Secret Achievement' : title}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: isCompleted ? 'rgba(255, 215, 0, 0.8)' : 'rgba(255, 255, 255, 0.7)',
              lineHeight: 1.5,
              fontSize: isLandscape ? 11 : 13,
            }}
          >
            {isHidden ? 'Hidden achievement. Complete it to unlock!' : description}
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
                height: isLandscape ? 8 : 10,
                borderRadius: 1,
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 215, 0, 0.2)',
                '& .MuiLinearProgress-bar': {
                  background: isCompleted
                    ? 'linear-gradient(90deg, #FFD700 0%, #FFA000 100%)'
                    : 'linear-gradient(90deg, #4CAF50 0%, #81C784 100%)',
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
            <Typography variant={isLandscape ? 'caption' : 'body2'} sx={{ color: '#FFF', fontWeight: 600 }}>
              Progress: {current} / {target}
            </Typography>
            <Typography variant={isLandscape ? 'caption' : 'body2'} sx={{ color: '#FFD700', fontWeight: 600 }}>
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
          borderTop: '1px solid rgba(255, 215, 0, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="body1"
          sx={{
            color: '#FFD700',
            fontWeight: 700,
            fontSize: isLandscape ? 14 : 16,
          }}
        >
          🏆 Reward: {reward} points
        </Typography>
        
        {isCompleted && completedAt && (
          <Typography
            variant="caption"
            sx={{
              color: 'rgba(255, 215, 0, 0.7)',
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
