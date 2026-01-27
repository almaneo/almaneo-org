'use client';

import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import type { CulturalScenarioData } from '@/lib/worldTravel/types';
import { useTranslation } from 'react-i18next';

interface CulturalScenarioQuestProps {
  data: CulturalScenarioData;
  onComplete: (correct: boolean) => void;
}

export default function CulturalScenarioQuest({
  data,
  onComplete,
}: CulturalScenarioQuestProps) {
  const { t } = useTranslation('game');
  const [chosen, setChosen] = useState<'left' | 'right' | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleChoice = (side: 'left' | 'right') => {
    if (chosen) return;
    setChosen(side);
    setTimeout(() => setShowResult(true), 400);
  };

  const isCorrect = chosen ? data.options[chosen].isKind : false;

  const handleContinue = () => {
    onComplete(isCorrect);
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
      {!showResult && (
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
      )}

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
                  {isCorrect ? '💛' : '💭'}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: isCorrect ? '#4ade80' : '#f87171',
                    mb: 1,
                  }}
                >
                  {isCorrect ? t('travel.kindnessSpreads') : t('travel.thinkAgain')}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 13,
                    color: 'rgba(255,255,255,0.7)',
                    lineHeight: 1.5,
                  }}
                >
                  {data.explanation}
                </Typography>
              </Box>

              <Box
                onClick={handleContinue}
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
          </Box>
        )}
      </AnimatePresence>
    </Box>
  );
}
