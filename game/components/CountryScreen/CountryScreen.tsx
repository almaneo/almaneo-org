'use client';

import { Box, Typography, LinearProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { motion } from 'framer-motion';
import { useTravelStore } from '@/hooks/useTravelStore';
import type { StarRating } from '@/lib/worldTravel/types';
import CultureCard from './CultureCard';
import QuestList from './QuestList';
import { useTranslation } from 'react-i18next';

interface CountryScreenProps {
  onBack: () => void;
}

export default function CountryScreen({ onBack }: CountryScreenProps) {
  const { t } = useTranslation('game');
  const {
    selectedCountryId,
    getCountry,
    getCountryProgress,
    selectQuest,
  } = useTravelStore();

  const country = selectedCountryId ? getCountry(selectedCountryId) : null;
  const progress = selectedCountryId ? getCountryProgress(selectedCountryId) : null;

  if (!country || !progress) {
    return null;
  }

  const totalQuests = country.quests.length;
  const completedQuests = Object.values(progress.questResults).filter(
    r => r.completed
  ).length;
  const completionPercent = totalQuests > 0 ? (completedQuests / totalQuests) * 100 : 0;

  const starLabels: Record<number, string> = {
    0: t('travel.starLabels.0'),
    1: t('travel.starLabels.1'),
    2: t('travel.starLabels.2'),
    3: t('travel.starLabels.3'),
  };

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(180deg, #0A0F1A 0%, #111827 100%)',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1.5,
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(0,0,0,0.3)',
          flexShrink: 0,
        }}
      >
        <Box
          onClick={onBack}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            cursor: 'pointer',
            color: 'rgba(255,255,255,0.7)',
            '&:hover': { color: '#fff' },
          }}
        >
          <ArrowBackIcon fontSize="small" />
          <Typography sx={{ fontSize: 13, fontWeight: 500 }}>{t('common.map')}</Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ fontSize: 20 }}>{country.flag}</Typography>
          <Typography
            sx={{
              fontFamily: "'Orbitron', sans-serif",
              fontWeight: 700,
              fontSize: 16,
              color: '#fff',
            }}
          >
            {country.name}
          </Typography>
        </Box>

        {/* Stars */}
        <Box sx={{ display: 'flex', gap: 0.25 }}>
          {[1, 2, 3].map(i => (
            <Typography
              key={i}
              sx={{
                fontSize: 16,
                color: i <= progress.stars ? '#FFD700' : 'rgba(255,255,255,0.15)',
              }}
            >
              ★
            </Typography>
          ))}
        </Box>
      </Box>

      {/* Progress Bar */}
      <Box
        sx={{
          px: 2,
          py: 1,
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 0.5,
          }}
        >
          <Typography
            sx={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}
          >
            {t('travel.questProgress', { completed: completedQuests, total: totalQuests })}
          </Typography>
          <Typography
            sx={{
              fontSize: 11,
              color: progress.stars === 3 ? '#FFD700' : 'rgba(255,255,255,0.5)',
              fontWeight: progress.stars === 3 ? 700 : 400,
            }}
          >
            {starLabels[progress.stars]}
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={completionPercent}
          sx={{
            height: 4,
            borderRadius: 2,
            bgcolor: 'rgba(255,255,255,0.06)',
            '& .MuiLinearProgress-bar': {
              borderRadius: 2,
              background:
                progress.stars === 3
                  ? 'linear-gradient(90deg, #FFD700, #FF6B00)'
                  : 'linear-gradient(90deg, #0052FF, #06b6d4)',
            },
          }}
        />
      </Box>

      {/* Content */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          px: 2,
          py: 1.5,
          '&::-webkit-scrollbar': { width: 4 },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255,255,255,0.15)',
            borderRadius: 4,
          },
        }}
      >
        <CultureCard country={country} />

        <QuestList
          quests={country.quests}
          questResults={progress.questResults}
          onQuestSelect={selectQuest}
        />
      </Box>
    </Box>
  );
}
