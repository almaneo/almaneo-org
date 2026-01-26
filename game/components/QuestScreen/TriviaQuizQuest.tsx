'use client';

import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import type { TriviaQuizData } from '@/lib/worldTravel/types';

interface TriviaQuizQuestProps {
  data: TriviaQuizData;
  onComplete: (correct: boolean) => void;
}

export default function TriviaQuizQuest({
  data,
  onComplete,
}: TriviaQuizQuestProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (index: number) => {
    if (selected !== null) return;
    setSelected(index);
    setTimeout(() => setShowResult(true), 500);
  };

  const isCorrect = selected === data.correctIndex;

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
          const revealed = showResult;

          let bgColor = 'rgba(255,255,255,0.05)';
          let borderColor = 'rgba(255,255,255,0.1)';

          if (revealed && isAnswer) {
            bgColor = 'rgba(74,222,128,0.15)';
            borderColor = 'rgba(74,222,128,0.5)';
          } else if (revealed && isThis && !isCorrect) {
            bgColor = 'rgba(248,113,113,0.15)';
            borderColor = 'rgba(248,113,113,0.5)';
          } else if (isThis && !revealed) {
            bgColor = 'rgba(0,82,255,0.15)';
            borderColor = 'rgba(0,82,255,0.5)';
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

      {/* Result Overlay - centered on screen */}
      <AnimatePresence>
        {showResult && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 50,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(0,0,0,0.7)',
              p: 2,
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.3 }}
              style={{ width: '100%', maxWidth: 320 }}
            >
              <Box
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  background: isCorrect
                    ? 'rgba(10,20,15,0.98)'
                    : 'rgba(20,10,10,0.98)',
                  border: isCorrect
                    ? '1px solid rgba(74,222,128,0.3)'
                    : '1px solid rgba(248,113,113,0.3)',
                  textAlign: 'center',
                  mb: 1.5,
                }}
              >
                <Typography sx={{ fontSize: 28, mb: 1 }}>
                  {isCorrect ? '🎉' : '📚'}
                </Typography>
                <Typography sx={{ fontSize: 18, fontWeight: 700, color: isCorrect ? '#4ade80' : '#f87171', mb: 1 }}>
                  {isCorrect ? 'Correct!' : 'Not quite!'}
                </Typography>
                <Typography sx={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
                  {data.explanation}
                </Typography>
              </Box>

              <Box
                onClick={() => onComplete(isCorrect)}
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: 'linear-gradient(135deg, #0052FF, #06b6d4)',
                  '&:hover': { opacity: 0.9 },
                  '&:active': { transform: 'scale(0.97)' },
                }}
              >
                <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>
                  Continue
                </Typography>
              </Box>
            </motion.div>
          </Box>
        )}
      </AnimatePresence>
    </Box>
  );
}
