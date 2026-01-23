import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab, Chip, useMediaQuery } from '@mui/material';
import { Achievement, AchievementCategory } from '@/lib/achievements';
import AchievementCard from './AchievementCard';

interface AchievementPanelProps {
  achievements: Achievement[];
  stats: {
    totalTaps: number;
    totalPoints: number;
    tapPowerLevel: number;
    energyCapacityLevel: number;
    autoFarmLevel: number;
    energyRegenLevel: number;
    level: number;
    totalQuests: number;
    playTime: number;
    loginStreak: number;
  };
  onClaim?: (id: string) => void;
}

export default function AchievementPanel({ achievements, stats, onClaim }: AchievementPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | AchievementCategory>('all');
  const isLandscape = useMediaQuery('(orientation: landscape) and (max-height: 500px)');

  // Calculate completion rate
  const completedCount = achievements.filter(a => a.completed).length;
  const totalCount = achievements.length;
  const completionRate = Math.round((completedCount / totalCount) * 100);

  // Filter achievements by category
  const filteredAchievements = selectedCategory === 'all'
    ? achievements
    : achievements.filter(a => a.category === selectedCategory);

  // Get current value for each achievement
  const getCurrentValue = (achievement: Achievement): number => {
    switch (achievement.id) {
      // Tap achievements
      case 'first_harvest':
      case 'century_club':
      case 'millennium':
      case 'click_master':
        return stats.totalTaps;

      // Points achievements
      case 'first_fortune':
      case 'point_collector':
      case 'wealthy_farmer':
        return stats.totalPoints;

      // Upgrade achievements
      case 'first_upgrade':
        return stats.tapPowerLevel + stats.energyCapacityLevel + stats.autoFarmLevel + stats.energyRegenLevel;
      case 'max_energy':
        return stats.energyCapacityLevel;
      case 'power_tapper':
        return stats.tapPowerLevel;
      case 'automation_king':
        return stats.autoFarmLevel;
      case 'energy_master':
        return stats.energyRegenLevel;
      case 'perfect_farm':
        return stats.tapPowerLevel + stats.energyCapacityLevel + stats.autoFarmLevel + stats.energyRegenLevel;

      // Level achievements
      case 'beginner':
      case 'advanced':
      case 'master':
        return stats.level;

      // Special achievements
      case 'night_owl':
        return 0; // Checked separately
      case 'dedicated':
        return stats.loginStreak;
      case 'veteran':
        return stats.playTime;
      case 'quest_master':
        return stats.totalQuests;

      default:
        return 0;
    }
  };

  // Category icons and labels
  const categories: { value: 'all' | AchievementCategory; label: string; icon: string }[] = [
    { value: 'all', label: 'All', icon: '🏆' },
    { value: 'tap', label: 'Tap', icon: '👆' },
    { value: 'points', label: 'Points', icon: '💎' },
    { value: 'upgrade', label: 'Upgrade', icon: '📈' },
    { value: 'level', label: 'Level', icon: '🌟' },
    { value: 'special', label: 'Special', icon: '✨' },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: isLandscape ? 2 : 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: isLandscape ? 1.5 : 2 }}>
          <Typography variant={isLandscape ? 'h6' : 'h5'} sx={{ color: '#FFD700', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
            🏆 Achievements
          </Typography>
          
          {/* Completion Rate */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label={`${completedCount} / ${totalCount}`}
              size="small"
              sx={{
                bgcolor: 'rgba(255, 215, 0, 0.2)',
                color: '#FFD700',
                border: '1px solid rgba(255, 215, 0, 0.4)',
                fontWeight: 600,
                fontSize: isLandscape ? 11 : undefined,
              }}
            />
            <Typography variant={isLandscape ? 'caption' : 'body2'} sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              ({completionRate}% Completed)
            </Typography>
          </Box>
        </Box>

        {/* Category Tabs */}
        <Tabs
          value={selectedCategory}
          onChange={(_, newValue) => setSelectedCategory(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              minHeight: isLandscape ? 40 : 48,
              textTransform: 'none',
              fontWeight: 500,
              fontSize: isLandscape ? 13 : undefined,
              color: 'rgba(255, 255, 255, 0.6)',
              '&.Mui-selected': {
                color: '#FFD700',
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#FFD700',
            },
          }}
        >
          {categories.map((cat) => (
            <Tab
              key={cat.value}
              value={cat.value}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </Box>
              }
            />
          ))}
        </Tabs>
      </Box>

      {/* Achievement Cards */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: isLandscape ? 1.5 : 2,
        }}
      >
        {filteredAchievements.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              color: 'rgba(255, 255, 255, 0.6)',
            }}
          >
            <Typography variant="h6" sx={{ mb: 1 }}>
              No Achievements
            </Typography>
            <Typography variant="body2">
              Try selecting a different category
            </Typography>
          </Box>
        ) : (
          filteredAchievements.map((achievement) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              current={getCurrentValue(achievement)}
              onClaim={onClaim}
            />
          ))
        )}
      </Box>
    </Box>
  );
}
