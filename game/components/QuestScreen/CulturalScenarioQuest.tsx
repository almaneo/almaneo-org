'use client';

import { useState, useRef, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import type { CulturalScenarioData } from '@/lib/worldTravel/types';

interface CulturalScenarioQuestProps {
  data: CulturalScenarioData;
  onComplete: (correct: boolean) => void;
}

export default function CulturalScenarioQuest({
  data,
  onComplete,
}: CulturalScenarioQuestProps) {
  const [chosen, setChosen] = useState<'left' | 'right' | null>(null);
  const [showResult, setShowResult] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showResult && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [showResult]);

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

      {/* Result */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            ref={resultRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                background: isCorrect
                  ? 'rgba(74,222,128,0.1)'
                  : 'rgba(248,113,113,0.1)',
                border: isCorrect
                  ? '1px solid rgba(74,222,128,0.3)'
                  : '1px solid rgba(248,113,113,0.3)',
                textAlign: 'center',
                mb: 1,
              }}
            >
              <Typography
                sx={{
                  fontSize: 24,
                  mb: 1,
                }}
              >
                {isCorrect ? '💛' : '💭'}
              </Typography>
              <Typography
                sx={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: isCorrect ? '#4ade80' : '#f87171',
                  mb: 1,
                }}
              >
                {isCorrect ? 'Kindness Spreads!' : 'Think Again...'}
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
              }}
            >
              <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>
                Continue
              </Typography>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}
