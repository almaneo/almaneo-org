'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useGameStore } from '@/hooks/useGameStore';

export default function SaveIndicator() {
  const { saveStatus, lastSaveTime, saveError } = useGameStore();
  const [timeSinceSave, setTimeSinceSave] = useState('');

  useEffect(() => {
    if (lastSaveTime === 0) return;

    const updateTime = () => {
      const now = Date.now();
      const diffSeconds = Math.floor((now - lastSaveTime) / 1000);

      if (diffSeconds < 60) {
        setTimeSinceSave(`${diffSeconds}s ago`);
      } else if (diffSeconds < 3600) {
        const minutes = Math.floor(diffSeconds / 60);
        setTimeSinceSave(`${minutes}m ago`);
      } else {
        const hours = Math.floor(diffSeconds / 3600);
        setTimeSinceSave(`${hours}h ago`);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [lastSaveTime]);

  if (saveStatus === 'idle' && lastSaveTime === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        py: 1,
      }}
    >
      {saveStatus === 'saving' && (
        <>
          <CircularProgress size={12} sx={{ color: '#FFC107' }} />
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            Saving...
          </Typography>
        </>
      )}

      {saveStatus === 'success' && (
        <>
          <Typography variant="caption" sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
            ✓
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            Saved {timeSinceSave}
          </Typography>
        </>
      )}

      {saveStatus === 'error' && (
        <>
          <Typography variant="caption" sx={{ color: '#F44336', fontWeight: 'bold' }}>
            ⚠️
          </Typography>
          <Typography variant="caption" sx={{ color: '#F44336' }}>
            {saveError || 'Save failed'}
          </Typography>
        </>
      )}
    </Box>
  );
}
