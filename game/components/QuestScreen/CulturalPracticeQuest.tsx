'use client';

import { useState, useCallback } from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import type { CulturalPracticeData } from '@/lib/worldTravel/types';
import { useTranslation } from 'react-i18next';

interface CulturalPracticeQuestProps {
  data: CulturalPracticeData;
  onComplete: (correct: boolean) => void;
}

export default function CulturalPracticeQuest({
  data,
  onComplete,
}: CulturalPracticeQuestProps) {
  const { t } = useTranslation('game');
  const [taps, setTaps] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  const progress = (taps / data.tapsRequired) * 100;

  const handleTap = useCallback(() => {
    if (completed) return;

    const newTaps = taps + 1;
    setTaps(newTaps);

    const newStep = Math.min(
      Math.floor((newTaps / data.tapsRequired) * data.steps.length),
      data.steps.length - 1
    );
    if (newStep !== currentStep) {
      setCurrentStep(newStep);
    }

    if (newTaps >= data.tapsRequired) {
      setCompleted(true);
    }
  }, [taps, completed, currentStep, data]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
      {/* Instruction */}
      <Box
        sx={{
          p: 2,
          borderRadius: 3,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          textAlign: 'center',
        }}
      >
        <Typography sx={{ fontSize: 20, mb: 1 }}>🙏</Typography>
        <Typography
          sx={{
            fontSize: 15,
            color: '#fff',
            fontWeight: 500,
            lineHeight: 1.5,
          }}
        >
          {data.instruction}
        </Typography>
      </Box>

      {/* Current Step */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              background: 'rgba(0,82,255,0.08)',
              border: '1px solid rgba(0,82,255,0.2)',
              textAlign: 'center',
            }}
          >
            <Typography
              sx={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', mb: 0.5 }}
            >
              {t('travel.stepOf', { current: currentStep + 1, total: data.steps.length })}
            </Typography>
            <Typography
              sx={{
                fontSize: 14,
                color: '#fff',
                fontWeight: 500,
                lineHeight: 1.5,
              }}
            >
              {data.steps[currentStep]}
            </Typography>
          </Box>
        </motion.div>
      </AnimatePresence>

      {/* Progress */}
      <Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mb: 0.5,
          }}
        >
          <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
            {t('travel.progress')}
          </Typography>
          <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
            {taps}/{data.tapsRequired}
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={Math.min(progress, 100)}
          sx={{
            height: 6,
            borderRadius: 3,
            bgcolor: 'rgba(255,255,255,0.06)',
            '& .MuiLinearProgress-bar': {
              borderRadius: 3,
              background: completed
                ? 'linear-gradient(90deg, #FFD700, #FF6B00)'
                : 'linear-gradient(90deg, #0052FF, #06b6d4)',
            },
          }}
        />
      </Box>

      {/* Tap Area */}
      {!completed && (
        <motion.div whileTap={{ scale: 0.95 }}>
          <Box
            onClick={handleTap}
            sx={{
              p: 3,
              borderRadius: 3,
              textAlign: 'center',
              cursor: 'pointer',
              background: 'linear-gradient(135deg, rgba(0,82,255,0.2), rgba(6,182,212,0.2))',
              border: '2px solid rgba(0,82,255,0.3)',
              userSelect: 'none',
              touchAction: 'manipulation',
              '&:active': {
                background: 'linear-gradient(135deg, rgba(0,82,255,0.3), rgba(6,182,212,0.3))',
              },
            }}
          >
            <Typography sx={{ fontSize: 32, mb: 0.5 }}>👆</Typography>
            <Typography
              sx={{
                fontSize: 14,
                color: '#fff',
                fontWeight: 600,
              }}
            >
              {t('travel.tapToPractice')}
            </Typography>
          </Box>
        </motion.div>
      )}

      {/* Completion Overlay - centered on screen */}
      <AnimatePresence>
        {completed && (
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
                  background: 'rgba(10,20,15,0.98)',
                  border: '1px solid rgba(74,222,128,0.3)',
                  textAlign: 'center',
                  mb: 1.5,
                }}
              >
                <Typography sx={{ fontSize: 28, mb: 1 }}>✨</Typography>
                <Typography
                  sx={{ fontSize: 18, fontWeight: 700, color: '#4ade80', mb: 1 }}
                >
                  {t('travel.wellDone')}
                </Typography>
                <Typography
                  sx={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}
                >
                  {data.completionMessage}
                </Typography>
              </Box>

              <Box
                onClick={() => onComplete(true)}
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
