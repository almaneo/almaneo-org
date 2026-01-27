'use client';

import { useState, useCallback, useEffect, forwardRef, useImperativeHandle } from 'react';
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

export interface QuestResultData {
  correct: boolean;
  emoji: string;
  title: string;
  explanation: string;
  answerText?: string;
  funFact?: { label: string; text: string };
}

export interface QuestScreenHandle {
  handleResultContinue: () => void;
}

interface QuestScreenProps {
  onBack: () => void;
  onResultChange?: (data: QuestResultData | null) => void;
}

const QuestScreen = forwardRef<QuestScreenHandle, QuestScreenProps>(function QuestScreen({ onBack, onResultChange }, ref) {
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
  const [resultData, setResultData] = useState<QuestResultData | null>(null);

  const country = selectedCountryId ? getCountry(selectedCountryId) : null;
  const quest = country?.quests.find(q => q.id === selectedQuestId);

  const handleShowResult = useCallback((data: QuestResultData) => {
    setResultData(data);
  }, []);

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

  const handleResultContinue = useCallback(() => {
    if (resultData) {
      handleQuestComplete(resultData.correct);
      setResultData(null);
    }
  }, [resultData, handleQuestComplete]);

  // Expose handleResultContinue to parent via ref
  useImperativeHandle(ref, () => ({
    handleResultContinue,
  }), [handleResultContinue]);

  // Notify parent when resultData changes (parent renders the overlay)
  useEffect(() => {
    onResultChange?.(resultData);
  }, [resultData, onResultChange]);

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
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(180deg, #0A0F1A 0%, #111827 100%)',
        position: 'relative',
        overflow: 'hidden',
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
            onShowResult={handleShowResult}
          />
        )}
        {quest.data.type === 'trivia_quiz' && (
          <TriviaQuizQuest
            data={quest.data as TriviaQuizData}
            onShowResult={handleShowResult}
          />
        )}
        {quest.data.type === 'cultural_practice' && (
          <CulturalPracticeQuest
            data={quest.data as CulturalPracticeData}
            onShowResult={handleShowResult}
          />
        )}
        {quest.data.type === 'history_lesson' && (
          <HistoryLessonQuest
            data={quest.data as HistoryLessonData}
            onShowResult={handleShowResult}
          />
        )}
      </Box>
    </Box>
  );
});

export default QuestScreen;
