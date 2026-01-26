/**
 * QuestPanel Component
 * 
 * 일일 퀘스트 3개를 표시하는 패널
 */

import { Box, Typography, useMediaQuery } from '@mui/material';
import { useGameStore } from '@/hooks/useGameStore';
import QuestCard from './QuestCard';
import { useEffect, useState } from 'react';

export default function QuestPanel() {
  const { dailyQuests, claimQuestReward } = useGameStore();
  const [timeUntilReset, setTimeUntilReset] = useState('');
  const isLandscape = useMediaQuery('(orientation: landscape) and (max-height: 500px)');

  // 리셋까지 남은 시간 계산
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setUTCHours(24, 0, 0, 0);

      const diff = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeUntilReset(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  // 퀘스트가 없으면 로딩 표시
  if (!dailyQuests || dailyQuests.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="text.secondary">
          Loading quests...
        </Typography>
      </Box>
    );
  }

  // 완료된 퀘스트 수 계산
  const completedCount = dailyQuests.filter(q => q.completed).length;
  const totalRewards = dailyQuests
    .filter(q => q.completed)
    .reduce((sum, q) => sum + q.reward, 0);

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
      <Box
        sx={{
          p: isLandscape ? 1.5 : 2.5,
          mb: isLandscape ? 1.5 : 2,
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 215, 0, 0.3)',
          borderRadius: 3,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          <Box>
            <Typography variant={isLandscape ? 'h6' : 'h5'} sx={{ color: 'white', fontWeight: 900, mb: 0.5 }}>
              📋 Mission Log
            </Typography>
            <Typography variant={isLandscape ? 'caption' : 'body2'} sx={{ color: '#FFD700', fontWeight: 'bold' }}>
              RECONSTRUCTION: {completedCount} / {dailyQuests.length}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="caption" display="block" sx={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: isLandscape ? 10 : undefined }}>
              NEXT REFRESH
            </Typography>
            <Typography variant={isLandscape ? 'caption' : 'body2'} sx={{ color: 'white', fontWeight: 'bold' }}>
              ⏰ {timeUntilReset}
            </Typography>
          </Box>
        </Box>

        {/* 총 보상 (완료된 퀘스트가 있을 때만) */}
        {completedCount > 0 && (
          <Box
            sx={{
              mt: isLandscape ? 1 : 1.5,
              pt: isLandscape ? 1 : 1.5,
              borderTop: '1px solid rgba(255, 215, 0, 0.2)',
            }}
          >
            <Typography variant={isLandscape ? 'caption' : 'body2'} sx={{ color: '#4CAF50', fontWeight: 800 }}>
              REWARDS EARNED: <strong style={{ textDecoration: 'underline' }}>+{totalRewards} 💖</strong>
            </Typography>
          </Box>
        )}
      </Box>

      {/* Quest Cards */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: isLandscape ? 1.5 : 2,
        }}
      >
        {dailyQuests.map((quest) => (
          <QuestCard
            key={quest.id}
            quest={quest}
            onClaim={claimQuestReward}
          />
        ))}
      </Box>

      {/* All Completed Message */}
      {completedCount === dailyQuests.length && (
        <Box
          sx={{
            mt: isLandscape ? 1.5 : 2,
            p: isLandscape ? 1.5 : 2.5,
            background: 'linear-gradient(145deg, rgba(76, 175, 80, 0.3), rgba(56, 142, 60, 0.3))',
            border: '2px solid #4CAF50',
            borderRadius: 2,
            textAlign: 'center',
          }}
        >
          <Typography variant={isLandscape ? 'body1' : 'h6'} sx={{ color: '#4CAF50', fontWeight: 700 }}>
            🎉 All daily quests completed!
          </Typography>
          <Typography variant={isLandscape ? 'caption' : 'body2'} sx={{ mt: 0.5, color: 'rgba(255, 255, 255, 0.8)' }}>
            Come back tomorrow!
          </Typography>
        </Box>
      )}
    </Box>
  );
}
