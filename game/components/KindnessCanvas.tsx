'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound, SoundType } from '@/lib/sounds';
import { useIsMobile } from '@/hooks/useIsMobile';
import { KINDNESS_SCENARIOS, KindnessScenario } from '@/lib/kindnessData';

interface KindnessCanvasProps {
  onHarvest: () => void;
  canHarvest: boolean;
  tapPower: number;
}

interface ClickEffect {
  id: string;
  x: number;
  y: number;
  points: number;
  hearts: Array<{ angle: number; distance: number; delay: number; scale: number }>;
}

export default function KindnessCanvas({ onHarvest, canHarvest, tapPower }: KindnessCanvasProps) {
  const [clickEffects, setClickEffects] = useState<ClickEffect[]>([]);
  const isMobile = useIsMobile();

  // Game State
  const [currentScenario, setCurrentScenario] = useState<KindnessScenario | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'fail'; message: string } | null>(null);

  // Load random scenario
  const loadNewScenario = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * KINDNESS_SCENARIOS.length);
    setCurrentScenario(KINDNESS_SCENARIOS[randomIndex]);
    setFeedback(null);
  }, []);

  // Initial load
  useEffect(() => {
    loadNewScenario();
  }, [loadNewScenario]);

  const handleChoice = useCallback((isKind: boolean, e: React.MouseEvent | React.TouchEvent) => {
    if (!canHarvest) {
      playSound(SoundType.WARNING);
      return;
    }

    if (!isKind) {
      // Wrong choice
      playSound(SoundType.WARNING);
      setFeedback({ type: 'fail', message: "Not quite... Try again!" });
      return;
    }

    // Correct choice!
    playSound(SoundType.CLICK);
    setFeedback({ type: 'success', message: `${currentScenario?.value}!` });

    // Visual Effect
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top;

    const heartCount = 6;
    const hearts = Array.from({ length: heartCount }, (_, i) => ({
      angle: (360 / heartCount) * i,
      distance: 80,
      delay: i * 0.05,
      scale: 0.8
    }));

    const effect: ClickEffect = {
      id: `${Date.now()}`,
      x,
      y,
      points: tapPower,
      hearts
    };

    setClickEffects(prev => [...prev, effect]);
    onHarvest(); // Add score

    // Load next scenario after delay
    setTimeout(() => {
      setClickEffects(prev => prev.filter(e => e.id !== effect.id));
      loadNewScenario();
    }, 1200);

  }, [canHarvest, currentScenario, onHarvest, tapPower, loadNewScenario]);

  if (!currentScenario) return null;

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: 'radial-gradient(circle at center, #1a237e 0%, #000000 100%)',
      }}
    >
      {/* Background Grid */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          opacity: 0.2,
          backgroundImage: 'radial-gradient(#4fc3f7 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }}
      />

      {/* Scenario Card */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: 400,
          perspective: '1000px',
          zIndex: 5
        }}
      >
        <AnimatePresence mode='wait'>
          <motion.div
            key={currentScenario.id}
            initial={{ opacity: 0, rotateY: 90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, rotateY: -90 }}
            transition={{ duration: 0.4 }}
          >
            <Paper
              elevation={6}
              sx={{
                p: 3,
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,, 255, 255, 0.2)',
                textAlign: 'center',
                color: 'white'
              }}
            >
              {/* Flag & Culture */}
              <Typography variant="h2" sx={{ mb: 1 }}>
                {currentScenario.flag}
              </Typography>
              <Typography variant="subtitle2" sx={{ opacity: 0.7, mb: 2 }}>
                {currentScenario.culture}
              </Typography>

              {/* Situation */}
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 4, minHeight: 60 }}>
                "{currentScenario.situation}"
              </Typography>

              {/* Feedback Overlay */}
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 10,
                    width: '100%'
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      color: feedback.type === 'success' ? '#4caf50' : '#f44336',
                      fontWeight: 'bold',
                      textShadow: '0 0 10px rgba(0,0,0,0.8)',
                      bgcolor: 'rgba(0,0,0,0.8)',
                      py: 1
                    }}
                  >
                    {feedback.message}
                  </Typography>
                </motion.div>
              )}

              {/* Options */}
              <Box sx={{ display: 'flex', gap: 2, flexDirection: isMobile ? 'column' : 'row' }}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={(e) => handleChoice(currentScenario.options.left.isKind, e)}
                  disabled={!canHarvest || feedback !== null}
                  sx={{
                    py: 1.5,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                    border: '1px solid rgba(255,255,255,0.3)'
                  }}
                >
                  {currentScenario.options.left.text}
                </Button>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={(e) => handleChoice(currentScenario.options.right.isKind, e)}
                  disabled={!canHarvest || feedback !== null}
                  sx={{
                    py: 1.5,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                    border: '1px solid rgba(255,255,255,0.3)'
                  }}
                >
                  {currentScenario.options.right.text}
                </Button>
              </Box>
            </Paper>
          </motion.div>
        </AnimatePresence>
      </Box>

      {/* Low Energy Overlay */}
      {!canHarvest && (
        <Box
          sx={{
            position: 'absolute',
            bottom: '20%',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            bgcolor: 'rgba(0,0,0,0.8)',
            px: 3,
            py: 1,
            borderRadius: 20
          }}
        >
          <Typography sx={{ color: '#ff9800', fontWeight: 'bold' }}>
            ⚡ Low BP (Recharging...)
          </Typography>
        </Box>
      )}

      {/* Reward Particles */}
      <AnimatePresence>
        {clickEffects.map(effect => (
          <React.Fragment key={effect.id}>
            {effect.hearts.map((heart, index) => {
              const radians = (heart.angle * Math.PI) / 180;
              const endX = Math.cos(radians) * heart.distance;
              const endY = Math.sin(radians) * heart.distance;

              return (
                <motion.div
                  key={`${effect.id}-heart-${index}`}
                  initial={{ opacity: 1, x: 0, y: 0, scale: 0 }}
                  animate={{ opacity: 0, x: endX, y: endY - 100, scale: heart.scale }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  style={{
                    position: 'absolute',
                    left: effect.x,
                    top: effect.y,
                    zIndex: 20,
                    pointerEvents: 'none',
                    fontSize: '2rem'
                  }}
                >
                  💖
                </motion.div>
              );
            })}
          </React.Fragment>
        ))}
      </AnimatePresence>
    </Box>
  );
}
