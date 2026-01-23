'use client';

import { useState, useEffect, useRef } from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import { useGameStore } from '@/hooks/useGameStore';
import { UPGRADES } from '@/lib/constants';

export default function EnergyTimer() {
  const { energy, maxEnergy, upgrades, incrementEnergy } = useGameStore();
  const [progress, setProgress] = useState(0);
  const accumulatedRef = useRef(0); // 누적 에너지 (소수점 포함)

  useEffect(() => {
    // Only run timer if energy is below max
    if (energy >= maxEnergy) {
      accumulatedRef.current = 0;
      setProgress(0);
      return;
    }

    // Calculate energy regeneration rate based on upgrade level
    const regenPerMinute = UPGRADES.energyRegen.getEffect(upgrades.energyRegen);
    const regenPerSecond = regenPerMinute / 60; // Convert to per second

    const interval = setInterval(() => {
      // Accumulate energy
      accumulatedRef.current += regenPerSecond;

      // If accumulated >= 1.0, regenerate energy
      if (accumulatedRef.current >= 1.0) {
        incrementEnergy();
        accumulatedRef.current -= 1.0;
        setProgress(0);
      } else {
        // Update progress bar
        setProgress(accumulatedRef.current * 100);
      }
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, [energy, maxEnergy, upgrades.energyRegen, incrementEnergy]);

  // Don't show timer if energy is full
  if (energy >= maxEnergy) {
    return (
      <Box sx={{ mt: 1 }}>
        <Typography 
          variant="caption" 
          sx={{ 
            color: '#4CAF50',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          ✓ Energy Full
        </Typography>
      </Box>
    );
  }

  // Calculate time to next energy
  const regenPerMinute = UPGRADES.energyRegen.getEffect(upgrades.energyRegen);
  const regenPerSecond = regenPerMinute / 60;
  const remainingToNextEnergy = 1.0 - accumulatedRef.current;
  const secondsToNext = Math.ceil(remainingToNextEnergy / regenPerSecond);

  return (
    <Box sx={{ mt: 1 }}>
      {/* Timer Text */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
        <Typography 
          variant="caption" 
          sx={{ 
            color: 'rgba(255,255,255,0.7)',
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          ⏱️ Next energy in:
        </Typography>
        <Typography 
          variant="caption" 
          sx={{ 
            color: '#FFC107',
            fontWeight: 'bold',
          }}
        >
          {secondsToNext}s
        </Typography>
      </Box>

      {/* Progress Bar */}
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 4,
          borderRadius: 2,
          bgcolor: 'rgba(255, 255, 255, 0.1)',
          '& .MuiLinearProgress-bar': {
            bgcolor: '#FFC107',
            borderRadius: 2,
          },
        }}
      />
    </Box>
  );
}
