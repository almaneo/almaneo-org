'use client';

import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import type { CulturalScenarioData } from '@/lib/worldTravel/types';
import type { QuestResultData } from './QuestScreen';
import { useTranslation } from 'react-i18next';

interface CulturalScenarioQuestProps {
  data: CulturalScenarioData;
  onShowResult: (data: QuestResultData) => void;
}

export default function CulturalScenarioQuest({
  data,
  onShowResult,
}: CulturalScenarioQuestProps) {
  const { t } = useTranslation('game');
  const [chosen, setChosen] = useState<'left' | 'right' | null>(null);

  const handleChoice = (side: 'left' | 'right') => {
    if (chosen) return;
    setChosen(side);
    const isCorrect = data.options[side].isKind;
    setTimeout(() => {
      onShowResult({
        correct: isCorrect,
        emoji: isCorrect ? '💛' : '💭',
        title: isCorrect ? t('travel.kindnessSpreads') : t('travel.thinkAgain'),
        explanation: data.explanation,
      });
    }, 400);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
      {/* Cultural Value */}
      <Box
        sx={{
          textAlign: 'center',
          px: 2,
          py: 1,
          borderRadius: 2,
          background: 'rgba(255,107,0,0.1)',
          border: '1px solid rgba(255,107,0,0.2)',
        }}
      >
        <Typography sx={{ fontSize: 12, color: '#FF6B00', fontWeight: 600 }}>
          🌟 {data.culturalValue}
        </Typography>
      </Box>

      {/* Situation */}
      <Box
        sx={{
          textAlign: 'center',
          p: 2.5,
          borderRadius: 3,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <Typography
          sx={{
            fontSize: 16,
            color: '#fff',
            fontWeight: 500,
            lineHeight: 1.6,
          }}
        >
          {data.situation}
        </Typography>
      </Box>

      {/* Choices */}
      <Box sx={{ display: 'flex', gap: 1.5 }}>
        {(['left', 'right'] as const).map(side => {
          const option = data.options[side];
          const isSelected = chosen === side;

          return (
            <motion.div
              key={side}
              style={{ flex: 1 }}
              whileHover={!chosen ? { scale: 1.02 } : undefined}
              whileTap={!chosen ? { scale: 0.98 } : undefined}
              animate={
                chosen && !isSelected
                  ? { opacity: 0.3, scale: 0.95 }
                  : chosen && isSelected
                  ? { scale: 1.05 }
                  : {}
              }
            >
              <Box
                onClick={() => handleChoice(side)}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  cursor: chosen ? 'default' : 'pointer',
                  textAlign: 'center',
                  background: isSelected
                    ? option.isKind
                      ? 'rgba(74,222,128,0.15)'
                      : 'rgba(248,113,113,0.15)'
                    : 'rgba(255,255,255,0.05)',
                  border: isSelected
                    ? option.isKind
                      ? '2px solid rgba(74,222,128,0.5)'
                      : '2px solid rgba(248,113,113,0.5)'
                    : '2px solid rgba(255,255,255,0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': !chosen
                    ? {
                        background: 'rgba(255,255,255,0.08)',
                        borderColor: 'rgba(255,255,255,0.2)',
                      }
                    : {},
                }}
              >
                <Typography
                  sx={{
                    fontSize: 14,
                    color: '#fff',
                    fontWeight: 500,
                    lineHeight: 1.4,
                  }}
                >
                  {option.text}
                </Typography>
              </Box>
            </motion.div>
          );
        })}
      </Box>
    </Box>
  );
}
