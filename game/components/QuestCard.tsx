/**
 * QuestCard Component
 * 
 * 개별 일일 퀘스트를 표시하는 카드 컴포넌트
 */

import { Box, Typography, Button, LinearProgress, useMediaQuery } from '@mui/material';
import { DailyQuest, getQuestProgress } from '@/lib/quests';
import { formatNumber } from '@/lib/utils';

interface QuestCardProps {
  quest: DailyQuest;
  onClaim: (questId: string) => void;
}

export default function QuestCard({ quest, onClaim }: QuestCardProps) {
  const progress = getQuestProgress(quest);
  const isCompleted = quest.completed;
  const canClaim = progress >= 100 && !isCompleted;
  const isLandscape = useMediaQuery('(orientation: landscape) and (max-height: 500px)');

  return (
    <Box
      sx={{
        position: 'relative',
        background: isCompleted
          ? 'linear-gradient(145deg, rgba(46, 125, 50, 0.3) 0%, rgba(27, 94, 32, 0.3) 100%)'
          : 'linear-gradient(145deg, rgba(60, 40, 25, 0.8) 0%, rgba(40, 25, 15, 0.8) 100%)',
        border: isCompleted ? '2px solid #4CAF50' : '2px solid rgba(139, 69, 19, 0.6)',
        borderRadius: 2,
        p: isLandscape ? 1.5 : 2.5,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          borderColor: canClaim ? '#FFD700' : isCompleted ? '#4CAF50' : 'rgba(139, 69, 19, 0.8)',
          boxShadow: canClaim 
            ? '0 8px 24px rgba(255, 215, 0, 0.3)'
            : '0 8px 24px rgba(0, 0, 0, 0.3)',
        },
      }}
    >
      {/* Header: Icon + Title */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: isLandscape ? 1 : 1.5,
          mb: isLandscape ? 1 : 1.5,
        }}
      >
        <Box sx={{ fontSize: isLandscape ? 28 : 36, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>
          {quest.icon}
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h6"
            sx={{
              color: '#FFD700',
              fontWeight: 700,
              textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
              fontSize: isLandscape ? 16 : undefined,
            }}
          >
            {quest.title}
          </Typography>
        </Box>
      </Box>

      {/* Description */}
      <Typography
        variant="body2"
        sx={{
          color: 'rgba(255, 255, 255, 0.7)',
          mb: isLandscape ? 1 : 2,
          fontSize: isLandscape ? 11 : 13,
        }}
      >
        {quest.description}
      </Typography>

      {/* Progress Bar */}
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
                ? 'linear-gradient(90deg, #4CAF50 0%, #81C784 100%)'
                : 'linear-gradient(90deg, #FFD700 0%, #FFA000 100%)',
            },
          }}
        />
      </Box>

      {/* Progress Text: Current / Target */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: isLandscape ? 1.5 : 2,
        }}
      >
        <Typography variant={isLandscape ? 'caption' : 'body2'} sx={{ color: '#FFF', fontWeight: 600 }}>
          {formatNumber(quest.current)} / {formatNumber(quest.target)}
        </Typography>
        <Typography variant={isLandscape ? 'caption' : 'body2'} sx={{ color: '#FFD700', fontWeight: 600 }}>
          {progress.toFixed(0)}%
        </Typography>
      </Box>

      {/* Reward + Action */}
      <Box
        sx={{
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
          🌾 +{formatNumber(quest.reward)}
        </Typography>
        
        <Button
          variant="contained"
          onClick={() => onClaim(quest.id)}
          disabled={!canClaim}
          sx={{
            minWidth: isLandscape ? 80 : 100,
            fontSize: isLandscape ? 12 : undefined,
            background: canClaim
              ? 'linear-gradient(135deg, #FFD700 0%, #FFA000 100%)'
              : isCompleted
              ? 'rgba(76, 175, 80, 0.5)'
              : 'rgba(100, 100, 100, 0.5)',
            color: canClaim ? '#000' : 'rgba(255,255,255,0.5)',
            fontWeight: 700,
            textTransform: 'none',
            '&:hover': {
              background: canClaim
                ? 'linear-gradient(135deg, #FFA000 0%, #FF6F00 100%)'
                : isCompleted
                ? 'rgba(76, 175, 80, 0.5)'
                : 'rgba(100, 100, 100, 0.5)',
              transform: canClaim ? 'scale(1.05)' : 'none',
            },
            '&:disabled': {
              color: 'rgba(255,255,255,0.3)',
            },
            transition: 'all 0.2s ease',
          }}
        >
          {isCompleted ? '✓ Claimed' : canClaim ? '🎁 Claim' : '⏳ In Progress'}
        </Button>
      </Box>
    </Box>
  );
}
