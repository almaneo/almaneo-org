/**
 * LeaderboardPanel Component
 * 
 * 리더보드 메인 패널
 * 탭, 내 순위, 리더보드 리스트 표시
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  IconButton,
  CircularProgress,
  Divider,
  Chip,
  useMediaQuery,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import LeaderboardCard from './LeaderboardCard';
import {
  LeaderboardEntry,
  LeaderboardType,
  generateMockLeaderboard,
  calculateLeaderboardStats,
  getLastUpdatedText,
} from '@/lib/leaderboard';
import {
  getTopPlayers,
  getWeeklyTopPlayers,
  getMonthlyTopPlayers,
  getUserRank,
  updateUserRank,
} from '@/lib/supabaseLeaderboard';
import { useGameStore } from '@/hooks/useGameStore';

export default function LeaderboardPanel() {
  // Landscape 모드 감지
  const isLandscape = useMediaQuery('(orientation: landscape) and (max-height: 500px)');
  const isMobile = useMediaQuery('(max-width: 480px)');

  const [activeTab, setActiveTab] = useState<LeaderboardType>('global');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const { totalPoints, level } = useGameStore();
  const currentUserId = 'current_user'; // TODO: 실제 userId로 교체

  // 목 데이터 로드 (개발용)
  useEffect(() => {
    loadLeaderboard();
  }, [activeTab]);

  // 10초마다 자동 새로고침
  useEffect(() => {
    const interval = setInterval(() => {
      loadLeaderboard();
    }, 10000); // 10초

    return () => clearInterval(interval);
  }, [activeTab, totalPoints, level]);

  const loadLeaderboard = async () => {
    setLoading(true);

    try {
      // 개발 모드: 목 데이터 우선 사용
      const USE_MOCK_DATA = true; // TODO: Supabase 준비되면 false로 변경

      let fetchedData: LeaderboardEntry[] = [];

      if (USE_MOCK_DATA) {
        // 목 데이터 사용
        console.log('Using mock data (development mode)');
        fetchedData = generateMockLeaderboard(100);

        // 현재 유저 추가
        const currentUserEntry: LeaderboardEntry = {
          userId: currentUserId,
          username: 'You',
          totalPoints,
          level,
          rank: 0,
          lastUpdated: new Date(),
        };

        fetchedData.push(currentUserEntry);
      } else {
        // Supabase 데이터 사용
        switch (activeTab) {
          case 'global':
            fetchedData = await getTopPlayers(100);
            break;
          case 'weekly':
            fetchedData = await getWeeklyTopPlayers(100);
            break;
          case 'monthly':
            fetchedData = await getMonthlyTopPlayers(100);
            break;
        }

        // Supabase에 데이터가 없으면 목 데이터 사용
        if (fetchedData.length === 0) {
          console.log('Using mock data - no Supabase data found');
          fetchedData = generateMockLeaderboard(100);
        }

        // 현재 유저 정보 가져오기
        const currentUserEntry = await getUserRank(currentUserId);

        if (!currentUserEntry) {
          const newUserEntry: LeaderboardEntry = {
            userId: currentUserId,
            username: 'You',
            totalPoints,
            level,
            rank: 0,
            lastUpdated: new Date(),
          };

          await updateUserRank(currentUserId, {
            username: 'You',
            totalPoints,
            level,
          });

          fetchedData.push(newUserEntry);
        } else {
          fetchedData.push(currentUserEntry);
        }
      }

      // 포인트 기준 정렬
      fetchedData.sort((a, b) => b.totalPoints - a.totalPoints);

      // 순위 재계산
      fetchedData.forEach((entry, index) => {
        entry.rank = index + 1;
      });

      setLeaderboard(fetchedData);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      // 에러 시 목 데이터 사용
      const mockData = generateMockLeaderboard(100);

      // 현재 유저 추가
      const currentUserEntry: LeaderboardEntry = {
        userId: currentUserId,
        username: 'You',
        totalPoints,
        level,
        rank: 0,
        lastUpdated: new Date(),
      };

      mockData.push(currentUserEntry);
      mockData.sort((a, b) => b.totalPoints - a.totalPoints);
      mockData.forEach((entry, index) => {
        entry.rank = index + 1;
      });

      setLeaderboard(mockData);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadLeaderboard();
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: LeaderboardType) => {
    setActiveTab(newValue);
  };

  // 통계 계산
  const stats = calculateLeaderboardStats(leaderboard);

  // 내 순위 찾기
  const myEntry = leaderboard.find(entry => entry.userId === currentUserId);

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: isLandscape ? 1 : isMobile ? 1 : 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: isLandscape ? 1 : isMobile ? 1 : 2 }}>
          <Typography
            variant={isLandscape ? 'h6' : isMobile ? 'body1' : 'h5'}
            sx={{
              color: 'white',
              fontWeight: 900,
              fontSize: isLandscape ? 20 : isMobile ? 15 : undefined,
              letterSpacing: -0.5,
            }}
          >
            🏆 Global Ranking
          </Typography>
          <Chip
            label={`${stats.totalPlayers} AGENTS`}
            size="small"
            sx={{
              bgcolor: 'rgba(255, 215, 0, 0.15)',
              color: '#FFD700',
              border: '1px solid rgba(255, 215, 0, 0.3)',
              fontWeight: 900,
              fontSize: isLandscape ? 10 : isMobile ? 9 : 11,
              height: isMobile ? 22 : undefined,
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.4)', fontWeight: 'bold', fontSize: isMobile ? 10 : undefined }}>
            {getLastUpdatedText(lastUpdate).toUpperCase()}
          </Typography>
          <IconButton
            onClick={handleRefresh}
            disabled={loading}
            size="small"
            sx={{
              color: '#FFD700',
              p: isMobile ? 0.5 : undefined,
              '&:hover': {
                bgcolor: 'rgba(255, 215, 0, 0.1)',
              },
            }}
          >
            {loading ? (
              <CircularProgress size={isMobile ? 16 : 20} sx={{ color: '#FFD700' }} />
            ) : (
              <RefreshIcon sx={{ fontSize: isMobile ? 18 : undefined }} />
            )}
          </IconButton>
        </Box>
      </Box>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          mb: isLandscape ? 1 : isMobile ? 1 : 2,
          minHeight: isLandscape ? 36 : isMobile ? 32 : 48,
          '& .MuiTab-root': {
            color: 'rgba(255, 255, 255, 0.3)',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: isMobile ? 0.5 : 1,
            fontSize: isLandscape ? 12 : isMobile ? 11 : 13,
            minHeight: isLandscape ? 36 : isMobile ? 32 : 48,
            minWidth: isMobile ? 60 : undefined,
            px: isMobile ? 1 : undefined,
            '&.Mui-selected': {
              color: '#FFD700',
            },
          },
          '& .MuiTabs-indicator': {
            backgroundColor: '#FFD700',
            height: 2,
            borderRadius: '2px 2px 0 0',
          },
        }}
      >
        <Tab label="All Time" value="global" />
        <Tab label="Weekly" value="weekly" />
        <Tab label="Monthly" value="monthly" />
      </Tabs>

      <Divider sx={{ mb: isMobile ? 1 : 2, borderColor: 'rgba(255, 255, 255, 0.05)' }} />

      {loading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            py: 8,
          }}
        >
          <CircularProgress sx={{ color: '#FFD700' }} />
        </Box>
      ) : (
        <Box
          sx={{
            maxHeight: isLandscape ? 400 : isMobile ? 'calc(60dvh - 80px)' : 600,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: isLandscape ? 1 : isMobile ? 1 : 2,
            pr: 0.5,
            '&::-webkit-scrollbar': {
              width: isLandscape ? 4 : isMobile ? 4 : 8,
            },
            '&::-webkit-scrollbar-track': {
              background: 'rgba(0,0,0,0.2)',
              borderRadius: 4,
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(255, 215, 0, 0.3)',
              borderRadius: 4,
              '&:hover': {
                background: 'rgba(255, 215, 0, 0.5)',
              },
            },
          }}
        >
          {/* 내 순위 (상단 고정) */}
          {myEntry && (
            <>
              <LeaderboardCard
                entry={myEntry}
                isCurrentUser={true}
              />
              <Divider sx={{ my: 1 }} />
            </>
          )}

          {/* 리더보드 리스트 */}
          {leaderboard
            .filter(entry => entry.userId !== currentUserId) // 내 카드 제외
            .slice(0, 100) // Top 100만 표시
            .map((entry) => (
              <LeaderboardCard
                key={entry.userId}
                entry={entry}
                isCurrentUser={false}
              />
            ))}

          {leaderboard.length === 0 && (
            <Box
              sx={{
                textAlign: 'center',
                py: 8,
              }}
            >
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                No ranking data available.
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
