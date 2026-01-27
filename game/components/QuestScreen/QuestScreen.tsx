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

export interface QuestResultData {
  correct: boolean;
  emoji: string;
  title: string;
  explanation: string;
  answerText?: string;
  funFact?: { label: string; text: string };
}

type QuestPhase = 'playing' | 'result' | 'complete';

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

  const [phase, setPhase] = useState<QuestPhase>('playing');
  const [pointsEarned, setPointsEarned] = useState(0);
  const [wasCorrect, setWasCorrect] = useState(false);
  const [resultData, setResultData] = useState<QuestResultData | null>(null);

  const country = selectedCountryId ? getCountry(selectedCountryId) : null;
  const quest = country?.quests.find(q => q.id === selectedQuestId);

  // Quest component calls this when user answers → transition to 'result' phase
  const handleShowResult = useCallback((data: QuestResultData) => {
    setResultData(data);
    setPhase('result');
  }, []);

  // User clicks Continue on result view → process completion → transition to 'complete' phase
  const handleResultContinue = useCallback(() => {
    if (!resultData || !selectedQuestId) return;

    const points = completeQuest(selectedQuestId, resultData.correct);
    if (points > 0) {
      addPoints(points);
    }
    updateQuestProgress('travel');
    updateAchievementStats('travel');

    // Sync travel stats to achievement stats
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
    setWasCorrect(resultData.correct);
    setResultData(null);
    setPhase('complete');
  }, [resultData, selectedQuestId, completeQuest, addPoints, updateQuestProgress, updateAchievementStats]);

  const handleContinue = () => {
    setPhase('playing');
    setPointsEarned(0);
    goBack(); // go back to country view
  };

  if (!quest || !country) {
    return null;
  }

  // Phase: complete → QuestComplete screen (existing, works fine)
  if (phase === 'complete') {
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

  // Phase: result → Full-screen result view (replaces quest content, no overlay)
  if (phase === 'result' && resultData) {
    return (
      <Box
        sx={{
          width: '100%',
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
            justifyContent: 'center',
            px: 2,
            py: 1.5,
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(0,0,0,0.3)',
            flexShrink: 0,
          }}
        >
          <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>
            {quest.title}
          </Typography>
          <Typography sx={{ fontSize: 16, ml: 1 }}>{country.flag}</Typography>
        </Box>

        {/* Result Content - centered in available space */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            px: 2,
            py: 3,
          }}
        >
          <Box sx={{ maxWidth: 320, width: '100%' }}>
            {/* Result Card */}
            <Box
              sx={{
                p: 2.5,
                borderRadius: 3,
                background: resultData.correct
                  ? 'rgba(10,20,15,0.98)'
                  : 'rgba(20,10,10,0.98)',
                border: resultData.correct
                  ? '1px solid rgba(74,222,128,0.3)'
                  : '1px solid rgba(248,113,113,0.3)',
                textAlign: 'center',
                mb: 1.5,
              }}
            >
              <Typography sx={{ fontSize: 28, mb: 1 }}>{resultData.emoji}</Typography>
              <Typography
                sx={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: resultData.correct ? '#4ade80' : '#f87171',
                  mb: 1,
                }}
              >
                {resultData.title}
              </Typography>
              <Typography
                sx={{
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.7)',
                  lineHeight: 1.5,
                }}
              >
                {resultData.explanation}
              </Typography>

              {resultData.answerText && (
                <Typography
                  sx={{
                    fontSize: 13,
                    color: 'rgba(255,255,255,0.7)',
                    mt: 1,
                    mb: 1.5,
                  }}
                >
                  {resultData.answerText}
                </Typography>
              )}

              {resultData.funFact && (
                <Box
                  sx={{
                    mt: 1.5,
                    p: 1.5,
                    borderRadius: 2,
                    background: 'rgba(255,215,0,0.06)',
                    border: '1px solid rgba(255,215,0,0.15)',
                    textAlign: 'left',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 11,
                      color: '#FFD700',
                      fontWeight: 600,
                      mb: 0.5,
                    }}
                  >
                    💡 {resultData.funFact.label}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 12,
                      color: 'rgba(255,255,255,0.7)',
                      lineHeight: 1.5,
                    }}
                  >
                    {resultData.funFact.text}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Continue Button */}
            <Box
              onClick={handleResultContinue}
              sx={{
                p: 1.5,
                borderRadius: 2,
                textAlign: 'center',
                cursor: 'pointer',
                background: '#FFD700',
                color: '#0A0F1A',
                fontWeight: 700,
                fontSize: 14,
                '&:active': { opacity: 0.9 },
              }}
            >
              {t('travel.continue')}
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  // Phase: playing → Quest content
  return (
    <Box
      sx={{
        width: '100%',
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
}
