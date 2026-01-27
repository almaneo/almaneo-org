/**
 * QuestCard Component
 * 
 * 개별 일일 퀘스트를 표시하는 카드 컴포넌트
 */

import { Box, Typography, Button, LinearProgress, useMediaQuery } from '@mui/material';
import { DailyQuest, getQuestProgress } from '@/lib/quests';
import { formatNumber } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface QuestCardProps {
  quest: DailyQuest;
  onClaim: (questId: string) => void;
}

export default function QuestCard({ quest, onClaim }: QuestCardProps) {
  const { t } = useTranslation('game');
  const progress = getQuestProgress(quest);
  const isCompleted = quest.completed;
  const canClaim = progress >= 100 && !isCompleted;
  const isLandscape = useMediaQuery('(orientation: landscape) and (max-height: 500px)');
  const isMobile = useMediaQuery('(max-width: 480px)');

  return (
    <Box
      sx={{
        position: 'relative',
        background: isCompleted
          ? 'rgba(76, 175, 80, 0.05)'
          : 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(10px)',
        border: isCompleted ? '2px solid rgba(76, 175, 80, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 3,
        p: isLandscape ? 1 : isMobile ? 1 : 2.5,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          borderColor: canClaim ? '#FFD700' : isCompleted ? '#4CAF50' : 'rgba(255, 255, 255, 0.2)',
          boxShadow: canClaim
            ? '0 8px 32px rgba(255, 215, 0, 0.2)'
            : '0 8px 32px rgba(0, 0, 0, 0.3)',
        },
      }}
    >
      {/* Header: Icon + Title */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: isLandscape ? 0.75 : isMobile ? 0.75 : 1.5,
          mb: isLandscape ? 0.5 : isMobile ? 0.5 : 1.5,
        }}
      >
        <Box sx={{ fontSize: isLandscape ? 24 : isMobile ? 24 : 36, filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.1))' }}>
          {quest.icon}
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant={isMobile ? 'body2' : 'h6'}
            sx={{
              color: 'white',
              fontWeight: 800,
              fontSize: isLandscape ? 14 : isMobile ? 13 : 18,
              letterSpacing: -0.5,
            }}
          >
            {quest.titleKey ? t(quest.titleKey) : quest.title}
          </Typography>
        </Box>
      </Box>

      {/* Description */}
      <Typography
        variant="body2"
        sx={{
          color: 'rgba(255, 255, 255, 0.5)',
          mb: isLandscape ? 0.5 : isMobile ? 0.5 : 2,
          fontSize: isLandscape ? 10 : isMobile ? 11 : 13,
          fontWeight: 300,
        }}
      >
        {quest.descriptionKey ? t(quest.descriptionKey, { target: quest.target }) : quest.description}
      </Typography>

      {/* Progress Bar */}
      <Box sx={{ mb: isLandscape ? 0.5 : isMobile ? 0.5 : 1.5 }}>
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

      {/* Progress Text: Current / Target */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: isLandscape ? 0.5 : isMobile ? 0.5 : 2,
        }}
      >
        <Typography variant="caption" sx={{ color: 'white', opacity: 0.8, fontWeight: 600, fontSize: isMobile ? 10 : undefined }}>
          {formatNumber(quest.current)} / {formatNumber(quest.target)}
        </Typography>
        <Typography variant="caption" sx={{ color: isCompleted ? '#4CAF50' : '#FFD700', fontWeight: 800, fontSize: isMobile ? 10 : undefined }}>
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
        <Box>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', display: 'block', fontSize: isMobile ? 9 : 10 }}>{t('quest.reward')}</Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#4CAF50',
              fontWeight: 800,
              fontSize: isLandscape ? 13 : isMobile ? 13 : 16,
            }}
          >
            💖 +{formatNumber(quest.reward)}
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={() => onClaim(quest.id)}
          disabled={!canClaim}
          sx={{
            minWidth: isLandscape ? 72 : isMobile ? 72 : 100,
            fontSize: isLandscape ? 11 : isMobile ? 11 : undefined,
            py: isMobile ? 0.75 : undefined,
            borderRadius: 2,
            background: canClaim
              ? '#FFD700'
              : isCompleted
                ? 'rgba(76, 175, 80, 0.2)'
                : 'rgba(100, 100, 100, 0.1)',
            color: canClaim ? '#0A0F1A' : 'rgba(255,255,255,0.3)',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: 1,
            '&:hover': {
              bgcolor: canClaim ? '#e6c200' : undefined,
              transform: canClaim ? 'translateY(-2px)' : 'none',
            },
            transition: 'all 0.2s ease',
          }}
        >
          {isCompleted ? t('quest.completed') : canClaim ? t('quest.claim') : t('quest.active')}
        </Button>
      </Box>
    </Box>
  );
}
