'use client';

import { Box, Typography, LinearProgress } from '@mui/material';
import { useGameStore } from '@/hooks/useGameStore';
import EnergyTimer from './EnergyTimer';

export default function Header() {
  const { 
    points, 
    energy, 
    maxEnergy, 
    level,
    totalPoints 
  } = useGameStore();

  const energyPercent = (energy / maxEnergy) * 100;

  return (
    <Box
      sx={{
        py: 2,
        px: 3,
        bgcolor: 'rgba(0, 0, 0, 0.3)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      {/* Top Row */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        {/* Left: Game Title */}
        <Box>
          <Typography variant="h5" fontWeight="bold" sx={{ color: '#fff' }}>
            💙 AlmaNEO Kindness
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
            Spread kindness, earn ALMAN
          </Typography>
        </Box>

        {/* Right: Stats */}
        <Box sx={{ display: 'flex', gap: 3 }}>
          {/* Level */}
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Level
            </Typography>
            <Typography variant="h6" fontWeight="bold" sx={{ color: '#FFD700' }}>
              {level}
            </Typography>
          </Box>

          {/* Points */}
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Points
            </Typography>
            <Typography variant="h6" fontWeight="bold" sx={{ color: '#4CAF50' }}>
              {points.toLocaleString()}
            </Typography>
          </Box>

          {/* Total Points */}
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Total
            </Typography>
            <Typography variant="h6" fontWeight="bold" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              {totalPoints.toLocaleString()}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Energy Bar */}
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            ⚡ Energy
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            {Math.floor(energy)} / {maxEnergy}
          </Typography>
        </Box>
        
        <LinearProgress
          variant="determinate"
          value={energyPercent}
          sx={{
            height: 8,
            borderRadius: 4,
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            '& .MuiLinearProgress-bar': {
              bgcolor: energyPercent > 50 
                ? '#4CAF50' 
                : energyPercent > 20 
                  ? '#FFC107' 
                  : '#F44336',
              borderRadius: 4,
            },
          }}
        />

        {/* Energy Timer */}
        <EnergyTimer />
      </Box>
    </Box>
  );
}
