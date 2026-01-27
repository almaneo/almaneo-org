'use client';

import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import type { TriviaQuizData } from '@/lib/worldTravel/types';
import type { QuestResultData } from './QuestScreen';
import { useTranslation } from 'react-i18next';

interface TriviaQuizQuestProps {
  data: TriviaQuizData;
  onShowResult: (data: QuestResultData) => void;
}

export default function TriviaQuizQuest({
  data,
  onShowResult,
}: TriviaQuizQuestProps) {
  const { t } = useTranslation('game');
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const handleSelect = (index: number) => {
    if (selected !== null) return;
    setSelected(index);
    const isCorrect = index === data.correctIndex;
    setTimeout(() => {
      setRevealed(true);
      onShowResult({
        correct: isCorrect,
        emoji: isCorrect ? '🎉' : '📚',
        title: isCorrect ? t('travel.correct') : t('travel.notQuite'),
        explanation: data.explanation,
      });
    }, 500);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
      {/* Question */}
      <Box
        sx={{
          p: 2.5,
          borderRadius: 3,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          textAlign: 'center',
        }}
      >
        <Typography sx={{ fontSize: 20, mb: 1.5 }}>❓</Typography>
        <Typography
          sx={{
            fontSize: 16,
            color: '#fff',
            fontWeight: 500,
            lineHeight: 1.6,
          }}
        >
          {data.question}
        </Typography>
      </Box>

      {/* Choices */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {data.choices.map((choice, index) => {
          const isThis = selected === index;
          const isAnswer = index === data.correctIndex;
          const isCorrect = selected === data.correctIndex;

          let bgColor = 'rgba(255,255,255,0.05)';
          let borderColor = 'rgba(255,255,255,0.1)';

          if (revealed && isAnswer) {
            bgColor = 'rgba(74,222,128,0.15)';
            borderColor = 'rgba(74,222,128,0.5)';
          } else if (revealed && isThis && !isCorrect) {
            bgColor = 'rgba(248,113,113,0.15)';
            borderColor = 'rgba(248,113,113,0.5)';
          } else if (isThis && !revealed) {
            bgColor = 'rgba(255,215,0,0.15)';
            borderColor = 'rgba(255,215,0,0.5)';
          }

          const label = String.fromCharCode(65 + index); // A, B, C, D

          return (
            <motion.div
              key={index}
              whileHover={selected === null ? { scale: 1.01 } : undefined}
              whileTap={selected === null ? { scale: 0.99 } : undefined}
              animate={
                revealed && !isAnswer && !isThis ? { opacity: 0.4 } : {}
              }
            >
              <Box
                onClick={() => handleSelect(index)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  p: 1.5,
                  borderRadius: 2,
                  cursor: selected !== null ? 'default' : 'pointer',
                  background: bgColor,
                  border: `2px solid ${borderColor}`,
                  transition: 'all 0.3s ease',
                  '&:hover':
                    selected === null
                      ? {
                          background: 'rgba(255,255,255,0.08)',
                          borderColor: 'rgba(255,255,255,0.2)',
                        }
                      : {},
                }}
              >
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(255,255,255,0.08)',
                    flexShrink: 0,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: revealed && isAnswer ? '#4ade80' : 'rgba(255,255,255,0.6)',
                    }}
                  >
                    {revealed && isAnswer ? '✓' : label}
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    fontSize: 14,
                    color: '#fff',
                    fontWeight: isThis ? 600 : 400,
                  }}
                >
                  {choice}
                </Typography>
              </Box>
            </motion.div>
          );
        })}
      </Box>
    </Box>
  );
}
