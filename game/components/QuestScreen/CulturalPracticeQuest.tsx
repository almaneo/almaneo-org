'use client';

import { useState, useCallback } from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import type { CulturalPracticeData } from '@/lib/worldTravel/types';
import type { QuestResultData } from './QuestScreen';
import { useTranslation } from 'react-i18next';

interface CulturalPracticeQuestProps {
  data: CulturalPracticeData;
  onShowResult: (data: QuestResultData) => void;
}

export default function CulturalPracticeQuest({
  data,
  onShowResult,
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
      onShowResult({
        correct: true,
        emoji: '✨',
        title: t('travel.wellDone'),
        explanation: data.completionMessage,
      });
    }
  }, [taps, completed, currentStep, data, onShowResult, t]);

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
              background: 'rgba(255,215,0,0.08)',
              border: '1px solid rgba(255,215,0,0.2)',
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
                : 'linear-gradient(90deg, #FFD700, #FFA500)',
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
              background: 'linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,107,0,0.15))',
              border: '2px solid rgba(255,215,0,0.3)',
              userSelect: 'none',
              touchAction: 'manipulation',
              '&:active': {
                background: 'linear-gradient(135deg, rgba(255,215,0,0.25), rgba(255,107,0,0.25))',
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
    </Box>
  );
}
