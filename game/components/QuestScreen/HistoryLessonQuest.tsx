'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Box, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import type { HistoryLessonData } from '@/lib/worldTravel/types';
import { useTranslation } from 'react-i18next';

interface HistoryLessonQuestProps {
  data: HistoryLessonData;
  onComplete: (correct: boolean) => void;
}

export default function HistoryLessonQuest({
  data,
  onComplete,
}: HistoryLessonQuestProps) {
  const { t } = useTranslation('game');
  const [phase, setPhase] = useState<'read' | 'quiz' | 'result'>('read');
  const [selected, setSelected] = useState<number | null>(null);

  const isCorrect = selected === data.correctIndex;

  const handleStartQuiz = () => setPhase('quiz');

  const handleSelect = (index: number) => {
    if (selected !== null) return;
    setSelected(index);
    setTimeout(() => setPhase('result'), 500);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
      <AnimatePresence mode="wait">
        {/* Read Phase */}
        {phase === 'read' && (
          <motion.div
            key="read"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Box
              sx={{
                p: 2.5,
                borderRadius: 3,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                mb: 2,
              }}
            >
              <Typography sx={{ fontSize: 20, mb: 1.5, textAlign: 'center' }}>
                📖
              </Typography>
              <Typography
                sx={{
                  fontSize: 14,
                  color: 'rgba(255,255,255,0.85)',
                  lineHeight: 1.8,
                  textAlign: 'justify',
                }}
              >
                {data.story}
              </Typography>
            </Box>

            <Box
              onClick={handleStartQuiz}
              sx={{
                p: 1.5,
                borderRadius: 2,
                textAlign: 'center',
                cursor: 'pointer',
                background: 'linear-gradient(135deg, #0052FF, #06b6d4)',
                '&:hover': { opacity: 0.9 },
              }}
            >
              <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>
                {t('travel.readItQuizMe')}
              </Typography>
            </Box>
          </motion.div>
        )}

        {/* Quiz Phase */}
        {phase === 'quiz' && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Box
              sx={{
                p: 2,
                borderRadius: 3,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                textAlign: 'center',
                mb: 2,
              }}
            >
              <Typography
                sx={{
                  fontSize: 15,
                  color: '#fff',
                  fontWeight: 500,
                  lineHeight: 1.6,
                }}
              >
                {data.question}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {data.choices.map((choice, index) => {
                const isThis = selected === index;
                const label = String.fromCharCode(65 + index);

                return (
                  <motion.div
                    key={index}
                    whileHover={selected === null ? { scale: 1.01 } : undefined}
                    whileTap={selected === null ? { scale: 0.99 } : undefined}
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
                        background: isThis
                          ? 'rgba(0,82,255,0.15)'
                          : 'rgba(255,255,255,0.05)',
                        border: isThis
                          ? '2px solid rgba(0,82,255,0.5)'
                          : '2px solid rgba(255,255,255,0.1)',
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
                            color: 'rgba(255,255,255,0.6)',
                          }}
                        >
                          {label}
                        </Typography>
                      </Box>
                      <Typography
                        sx={{ fontSize: 14, color: '#fff', fontWeight: isThis ? 600 : 400 }}
                      >
                        {choice}
                      </Typography>
                    </Box>
                  </motion.div>
                );
              })}
            </Box>
          </motion.div>
        )}

      </AnimatePresence>

      {/* Result Overlay - portaled to body for proper centering */}
      {phase === 'result' && createPortal(
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 9999,
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
                {isCorrect ? '🎓' : '📖'}
              </Typography>
              <Typography
                sx={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: isCorrect ? '#4ade80' : '#f87171',
                  mb: 1,
                }}
              >
                {isCorrect ? t('travel.correct') : t('travel.notQuite')}
              </Typography>
              <Typography
                sx={{
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.7)',
                  mb: 1.5,
                }}
              >
                {t('travel.answerWas')} <b>{data.choices[data.correctIndex]}</b>
              </Typography>

              {/* Fun Fact */}
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  background: 'rgba(255,215,0,0.06)',
                  border: '1px solid rgba(255,215,0,0.15)',
                  textAlign: 'left',
                }}
              >
                <Typography
                  sx={{ fontSize: 11, color: '#FFD700', fontWeight: 600, mb: 0.5 }}
                >
                  💡 {t('travel.funFact')}
                </Typography>
                <Typography
                  sx={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}
                >
                  {data.funFact}
                </Typography>
              </Box>
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
                {t('travel.continue')}
              </Typography>
            </Box>
          </motion.div>
        </Box>,
        document.body
      )}
    </Box>
  );
}
