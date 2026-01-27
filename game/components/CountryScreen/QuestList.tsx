'use client';

import { Box, Typography, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';
import type { Quest, QuestResult } from '@/lib/worldTravel/types';
import { useTranslation } from 'react-i18next';

interface QuestListProps {
  quests: Quest[];
  questResults: Record<string, QuestResult>;
  onQuestSelect: (questId: string) => void;
}

const QUEST_TYPE_ICONS: Record<string, string> = {
  cultural_scenario: '🤝',
  trivia_quiz: '❓',
  cultural_practice: '🙏',
  history_lesson: '📖',
};

// Quest type labels loaded from i18n in component

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: '#4ade80',
  medium: '#facc15',
  hard: '#f87171',
};

export default function QuestList({
  quests,
  questResults,
  onQuestSelect,
}: QuestListProps) {
  const { t } = useTranslation('game');
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Typography
        sx={{
          fontSize: 14,
          fontWeight: 700,
          color: 'rgba(255,255,255,0.7)',
          textTransform: 'uppercase',
          letterSpacing: 1,
          mb: 0.5,
        }}
      >
        {t('travel.questsCount', { count: quests.length })}
      </Typography>

      {quests.map((quest, index) => {
        const result = questResults[quest.id];
        const isCompleted = result?.completed;
        const isCorrect = result?.correct;

        return (
          <motion.div
            key={quest.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.08, duration: 0.2 }}
          >
            <Box
              onClick={() => onQuestSelect(quest.id)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                p: 1.5,
                borderRadius: 2,
                cursor: 'pointer',
                background: isCompleted
                  ? 'rgba(74,222,128,0.06)'
                  : 'rgba(255,255,255,0.03)',
                border: isCompleted
                  ? '1px solid rgba(74,222,128,0.15)'
                  : '1px solid rgba(255,255,255,0.06)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  background: isCompleted
                    ? 'rgba(74,222,128,0.1)'
                    : 'rgba(255,255,255,0.06)',
                  borderColor: isCompleted
                    ? 'rgba(74,222,128,0.25)'
                    : 'rgba(255,255,255,0.12)',
                  transform: 'translateX(4px)',
                },
              }}
            >
              {/* Icon */}
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 2,
                  background: 'rgba(255,255,255,0.05)',
                  fontSize: 20,
                  flexShrink: 0,
                }}
              >
                {QUEST_TYPE_ICONS[quest.type] || '❓'}
              </Box>

              {/* Quest Info */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  sx={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: isCompleted ? '#4ade80' : '#fff',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {quest.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.25 }}>
                  <Typography
                    sx={{
                      fontSize: 10,
                      color: 'rgba(255,255,255,0.4)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {t(`travel.questTypes.${quest.type}`)}
                  </Typography>
                  <Box
                    sx={{
                      width: 3,
                      height: 3,
                      borderRadius: '50%',
                      bgcolor: 'rgba(255,255,255,0.2)',
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: 10,
                      color: DIFFICULTY_COLORS[quest.difficulty],
                      fontWeight: 600,
                      textTransform: 'uppercase',
                    }}
                  >
                    {t(`travel.difficulty.${quest.difficulty}`)}
                  </Typography>
                </Box>
              </Box>

              {/* Status / Points */}
              <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                {isCompleted ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {isCorrect && (
                      <StarIcon sx={{ fontSize: 14, color: '#FFD700' }} />
                    )}
                    <CheckCircleIcon sx={{ fontSize: 18, color: '#4ade80' }} />
                  </Box>
                ) : (
                  <Chip
                    label={`+${quest.points}`}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(255,215,0,0.1)',
                      color: '#FFD700',
                      fontSize: 11,
                      fontWeight: 700,
                      height: 22,
                      border: '1px solid rgba(255,215,0,0.2)',
                    }}
                  />
                )}
              </Box>
            </Box>
          </motion.div>
        );
      })}
    </Box>
  );
}
