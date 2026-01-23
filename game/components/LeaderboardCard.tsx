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
          ? 'linear-gradient(145deg, rgba(25, 118, 210, 0.3), rgba(13, 71, 161, 0.3))'
          : isTopThree
          ? 'linear-gradient(145deg, rgba(255, 215, 0, 0.15), rgba(255, 165, 0, 0.15))'
          : 'linear-gradient(145deg, rgba(60, 40, 25, 0.8), rgba(40, 25, 15, 0.8))',
        border: isCurrentUser 
          ? '2px solid #2196F3'
          : isTopThree
          ? '2px solid #FFD700'
          : '2px solid rgba(139, 69, 19, 0.6)',
        borderRadius: 2,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          borderColor: isCurrentUser ? '#2196F3' : isTopThree ? '#FFD700' : 'rgba(139, 69, 19, 0.8)',
          boxShadow: isCurrentUser 
            ? '0 8px 24px rgba(33, 150, 243, 0.4)'
            : isTopThree
            ? '0 8px 24px rgba(255, 215, 0, 0.3)'
            : '0 8px 24px rgba(0, 0, 0, 0.3)',
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
                fontSize: isLandscape ? 32 : undefined,
              }}
            >
              {medal}
            </Typography>
          ) : (
            <Typography
              variant="h6"
              component="span"
              sx={{
                fontWeight: 700,
                color: isTopThree ? '#FFD700' : '#FFF',
                textShadow: isTopThree ? '1px 1px 2px rgba(0,0,0,0.8)' : 'none',
                fontSize: isLandscape ? 16 : undefined,
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
            bgcolor: isCurrentUser ? 'primary.main' : 'grey.600',
            fontWeight: 'bold',
            border: isTopThree ? '2px solid #FFD700' : 'none',
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
                fontWeight: 700,
                color: isTopThree ? '#FFD700' : '#FFF',
                textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                fontSize: isLandscape ? 16 : undefined,
              }}
            >
              {username}
            </Typography>
            {isCurrentUser && (
              <Chip
                label="You"
                size="small"
                sx={{
                  bgcolor: '#2196F3',
                  color: 'white',
                  fontWeight: 700,
                  height: 20,
                  fontSize: isLandscape ? 10 : 11,
                }}
              />
            )}
          </Box>
          
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: 13,
            }}
          >
            Level {level}
          </Typography>
        </Box>

        {/* 포인트 & 순위 변동 */}
        <Box sx={{ textAlign: 'right' }}>
          <Typography
            variant={isLandscape ? 'body1' : 'h6'}
            sx={{
              fontWeight: 700,
              color: '#FFD700',
              textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
              fontSize: isLandscape ? 16 : undefined,
            }}
          >
            🌾 {formatPoints(totalPoints)}
          </Typography>
          
          {changeText && (
            <Typography
              variant="caption"
              sx={{
                color: changeColor,
                fontWeight: 600,
                fontSize: 11,
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
