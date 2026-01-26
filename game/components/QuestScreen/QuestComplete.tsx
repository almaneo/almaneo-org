'use client';

import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

interface QuestCompleteProps {
  questTitle: string;
  pointsEarned: number;
  correct: boolean;
  onContinue: () => void;
}

export default function QuestComplete({
  questTitle,
  pointsEarned,
  correct,
  onContinue,
}: QuestCompleteProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1.5,
        p: { xs: 2, sm: 3 },
        minHeight: { xs: 240, sm: 300 },
      }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      >
        <Typography sx={{ fontSize: { xs: 48, sm: 64 }, textAlign: 'center' }}>
          {correct ? '🌟' : '📚'}
        </Typography>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Typography
          sx={{
            fontSize: { xs: 16, sm: 20 },
            fontWeight: 700,
            color: correct ? '#FFD700' : '#fff',
            textAlign: 'center',
            fontFamily: "'Orbitron', sans-serif",
          }}
        >
          {correct ? 'Quest Complete!' : 'Quest Finished'}
        </Typography>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Typography
          sx={{
            fontSize: 13,
            color: 'rgba(255,255,255,0.6)',
            textAlign: 'center',
          }}
        >
          {questTitle}
        </Typography>
      </motion.div>

      {/* Points Earned */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7, type: 'spring' }}
      >
        <Box
          sx={{
            px: 3,
            py: 1.5,
            borderRadius: 3,
            background: 'rgba(255,215,0,0.1)',
            border: '1px solid rgba(255,215,0,0.3)',
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: 20, sm: 24 },
              fontWeight: 800,
              color: '#FFD700',
              textAlign: 'center',
              fontFamily: "'Orbitron', sans-serif",
            }}
          >
            +{pointsEarned}
          </Typography>
          <Typography
            sx={{
              fontSize: 11,
              color: 'rgba(255,215,0,0.7)',
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}
          >
            points earned
          </Typography>
        </Box>
      </motion.div>

      {/* Continue Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        style={{ width: '100%', maxWidth: 280 }}
      >
        <Box
          onClick={onContinue}
          sx={{
            p: 1.5,
            borderRadius: 2,
            textAlign: 'center',
            cursor: 'pointer',
            background: '#FFD700',
            '&:hover': { background: '#e6c200' },
          }}
        >
          <Typography sx={{ color: '#0A0F1A', fontWeight: 700, fontSize: 14 }}>
            Back to Country
          </Typography>
        </Box>
      </motion.div>
    </Box>
  );
}
