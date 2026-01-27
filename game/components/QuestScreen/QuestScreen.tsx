'use client';

import { useState, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTravelStore } from '@/hooks/useTravelStore';
import { useGameStore } from '@/hooks/useGameStore';
import type {
  CulturalScenarioData,
  TriviaQuizData,
  CulturalPracticeData,
  HistoryLessonData,
} from '@/lib/worldTravel/types';
import CulturalScenarioQuest from './CulturalScenarioQuest';
import TriviaQuizQuest from './TriviaQuizQuest';
import CulturalPracticeQuest from './CulturalPracticeQuest';
import HistoryLessonQuest from './HistoryLessonQuest';
import QuestComplete from './QuestComplete';
import { useTranslation } from 'react-i18next';

interface QuestScreenProps {
  onBack: () => void;
}

export default function QuestScreen({ onBack }: QuestScreenProps) {
  const { t } = useTranslation('game');
  const {
    selectedCountryId,
    selectedQuestId,
    getCountry,
    completeQuest,
    goBack,
  } = useTravelStore();

  const addPoints = useGameStore(state => state.addPoints);
  const updateQuestProgress = useGameStore(state => state.updateQuestProgress);
  const updateAchievementStats = useGameStore(state => state.updateAchievementStats);

  const [questDone, setQuestDone] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [wasCorrect, setWasCorrect] = useState(false);

  const country = selectedCountryId ? getCountry(selectedCountryId) : null;
  const quest = country?.quests.find(q => q.id === selectedQuestId);

  const handleQuestComplete = useCallback(
    (correct: boolean) => {
      if (!selectedQuestId) return;

      const points = completeQuest(selectedQuestId, correct);
      // Also add points to main game store
      if (points > 0) {
        addPoints(points);
      }
      // Update daily travel quest progress
      updateQuestProgress('travel');
      // Update travel achievement stats
      updateAchievementStats('travel');

      // Sync travel stats to achievement stats for travel achievements
      const travelState = useTravelStore.getState();
      const gameStore = useGameStore.getState();
      const newAchievementStats = {
        ...gameStore.achievementStats,
        countriesVisited: travelState.countriesVisited,
        totalStars: travelState.totalStars,
        perfectCountries: travelState.perfectCountries,
      };
      useGameStore.setState({ achievementStats: newAchievementStats });
      gameStore.checkAchievements();

      setPointsEarned(points);
      setWasCorrect(correct);
      setQuestDone(true);
    },
    [selectedQuestId, completeQuest, addPoints, updateQuestProgress, updateAchievementStats]
  );

  const handleContinue = () => {
    setQuestDone(false);
    setPointsEarned(0);
    goBack(); // go back to country view
  };

  if (!quest || !country) {
    return null;
  }

  // Show completion screen
  if (questDone) {
    return (
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(180deg, #0A0F1A 0%, #111827 100%)',
        }}
      >
        <QuestComplete
          questTitle={quest.title}
          pointsEarned={pointsEarned}
          correct={wasCorrect}
          onContinue={handleContinue}
          questId={quest.id}
          countryId={country?.id}
        />
      </Box>
    );
  }

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
          <Typography sx={{ fontSize: 13, fontWeight: 500 }}>{t('travel.back')}</Typography>
        </Box>

        <Typography
          sx={{
            fontSize: 14,
            fontWeight: 600,
            color: '#fff',
            textAlign: 'center',
            flex: 1,
            px: 1,
          }}
          noWrap
        >
          {quest.title}
        </Typography>

        <Typography sx={{ fontSize: 16 }}>{country.flag}</Typography>
      </Box>

      {/* Quest Content */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          '&::-webkit-scrollbar': { width: 4 },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255,255,255,0.15)',
            borderRadius: 4,
          },
        }}
      >
        {quest.data.type === 'cultural_scenario' && (
          <CulturalScenarioQuest
            data={quest.data as CulturalScenarioData}
            onComplete={handleQuestComplete}
          />
        )}
        {quest.data.type === 'trivia_quiz' && (
          <TriviaQuizQuest
            data={quest.data as TriviaQuizData}
            onComplete={handleQuestComplete}
          />
        )}
        {quest.data.type === 'cultural_practice' && (
          <CulturalPracticeQuest
            data={quest.data as CulturalPracticeData}
            onComplete={handleQuestComplete}
          />
        )}
        {quest.data.type === 'history_lesson' && (
          <HistoryLessonQuest
            data={quest.data as HistoryLessonData}
            onComplete={handleQuestComplete}
          />
        )}
      </Box>
    </Box>
  );
}
