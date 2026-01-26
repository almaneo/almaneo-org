/**
 * LeaderboardCard Component
 * 
 * 개별 리더보드 엔트리 카드
 * 순위, 유저 정보, 포인트, 순위 변동 표시
 */

import React from 'react';
import { Box, Typography, Avatar, Chip, useMediaQuery } from '@mui/material';
import {
  LeaderboardEntry,
  getRankMedal,
  getRankChangeText,
  getRankChangeColor,
  formatPoints,
  formatRank,
} from '@/lib/leaderboard';

interface LeaderboardCardProps {
  entry: LeaderboardEntry;
  isCurrentUser?: boolean;
}

export default function LeaderboardCard({
  entry,
  isCurrentUser = false,
}: LeaderboardCardProps) {
  // Landscape 모드 감지
  const isLandscape = useMediaQuery('(orientation: landscape) and (max-height: 500px)');

  const { rank, username, level, totalPoints, rankChange } = entry;

  const medal = getRankMedal(rank);
  const isTopThree = rank <= 3;

  // 순위 변동 텍스트 및 색상
  const changeText = rankChange !== undefined ? getRankChangeText(rankChange) : null;
  const changeColor = rankChange !== undefined ? getRankChangeColor(rankChange) : 'text.secondary';

  return (
    <Box
      sx={{
        p: isLandscape ? 1.5 : 2,
        background: isCurrentUser
          ? 'rgba(255, 215, 0, 0.1)'
          : isTopThree
            ? 'rgba(255, 255, 255, 0.05)'
            : 'rgba(255, 255, 255, 0.02)',
        border: isCurrentUser
          ? '2px solid #FFD700'
          : isTopThree
            ? '1px solid rgba(255, 255, 255, 0.2)'
            : '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: 3,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          borderColor: isCurrentUser ? '#FFD700' : isTopThree ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.15)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          bgcolor: 'rgba(255, 255, 255, 0.08)',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: isLandscape ? 1.5 : 2,
        }}
      >
        {/* 순위 표시 */}
        <Box
          sx={{
            minWidth: isLandscape ? 50 : 60,
            textAlign: 'center',
          }}
        >
          {medal ? (
            <Typography
              variant={isLandscape ? 'h5' : 'h4'}
              component="span"
              sx={{
                fontSize: isLandscape ? 32 : 40,
                filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.2))',
              }}
            >
              {medal}
            </Typography>
          ) : (
            <Typography
              variant="h6"
              component="span"
              sx={{
                fontWeight: 900,
                color: isTopThree ? 'white' : 'rgba(255, 255, 255, 0.4)',
                fontSize: isLandscape ? 16 : 20,
              }}
            >
              #{formatRank(rank)}
            </Typography>
          )}
        </Box>

        {/* 유저 아바타 */}
        <Avatar
          sx={{
            width: isLandscape ? 36 : 48,
            height: isLandscape ? 36 : 48,
            bgcolor: isCurrentUser ? '#FFD700' : 'rgba(255,255,255,0.1)',
            fontWeight: 'bold',
            border: isTopThree ? '2px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.05)',
            fontSize: isLandscape ? 16 : 20,
          }}
        >
          {username.charAt(0).toUpperCase()}
        </Avatar>

        {/* 유저 정보 */}
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Typography
              variant={isLandscape ? 'body1' : 'h6'}
              sx={{
                fontWeight: 800,
                color: 'white',
                fontSize: isLandscape ? 16 : 18,
                letterSpacing: -0.5,
              }}
            >
              {username}
            </Typography>
            {isCurrentUser && (
              <Chip
                label="YOU"
                size="small"
                sx={{
                  bgcolor: '#FFD700',
                  color: '#0A0F1A',
                  fontWeight: 900,
                  height: 18,
                  fontSize: 9,
                  letterSpacing: 1,
                }}
              />
            )}
          </Box>

          <Typography
            variant="caption"
            sx={{
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: 11,
              fontWeight: 'bold',
              letterSpacing: 1,
            }}
          >
            PHASE {level}
          </Typography>
        </Box>

        {/* 포인트 & 순위 변동 */}
        <Box sx={{ textAlign: 'right' }}>
          <Typography
            variant={isLandscape ? 'body1' : 'h6'}
            sx={{
              fontWeight: 900,
              color: 'white',
              fontSize: isLandscape ? 16 : 18,
            }}
          >
            💖 {formatPoints(totalPoints)}
          </Typography>

          {changeText && (
            <Typography
              variant="caption"
              sx={{
                color: changeColor,
                fontWeight: 800,
                fontSize: 10,
                letterSpacing: 0.5,
              }}
            >
              {changeText}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}
