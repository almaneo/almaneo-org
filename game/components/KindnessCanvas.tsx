'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound, SoundType } from '@/lib/sounds';
import { getKindnessScenarios, type KindnessScenario } from '@/lib/kindnessData';

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

  // Game State
  const [currentScenario, setCurrentScenario] = useState<KindnessScenario | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'fail'; message: string } | null>(null);

  // Load random scenario
  const loadNewScenario = useCallback(() => {
    const scenarios = getKindnessScenarios();
    const randomIndex = Math.floor(Math.random() * scenarios.length);
    setCurrentScenario(scenarios[randomIndex]);
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
      // Wrong choice - show feedback then allow retry
      playSound(SoundType.WARNING);
      setFeedback({ type: 'fail', message: "Not quite... Try again!" });
      setTimeout(() => setFeedback(null), 1500);
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
        background: 'linear-gradient(180deg, #0A0F1A 0%, #111827 100%)',
      }}
    >
      {/* Background Grid */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          opacity: 0.2,
          backgroundImage: 'radial-gradient(#FFD700 1px, transparent 1px)',
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
                p: 2.5,
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 215, 0, 0.2)',
                textAlign: 'center',
                color: 'white',
                position: 'relative',
              }}
            >
              {/* Flag & Culture */}
              <Typography sx={{ fontSize: 36, mb: 0.5, lineHeight: 1 }}>
                {currentScenario.flag}
              </Typography>
              <Typography sx={{ fontSize: 12, opacity: 0.7, mb: 1.5 }}>
                {currentScenario.culture}
              </Typography>

              {/* Situation */}
              <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 2.5, lineHeight: 1.5 }}>
                &ldquo;{currentScenario.situation}&rdquo;
              </Typography>

              {/* Options */}
              <Box sx={{ display: 'flex', gap: 1.5, flexDirection: 'column' }}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={(e) => handleChoice(currentScenario.options.left.isKind, e)}
                  disabled={!canHarvest || feedback !== null}
                  sx={{
                    py: 1.5,
                    fontSize: 12,
                    lineHeight: 1.4,
                    textTransform: 'none',
                    bgcolor: 'rgba(255,215,0,0.08)',
                    '&:hover': { bgcolor: 'rgba(255,215,0,0.15)' },
                    border: '1px solid rgba(255,215,0,0.3)',
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
                    fontSize: 12,
                    lineHeight: 1.4,
                    textTransform: 'none',
                    bgcolor: 'rgba(255,215,0,0.08)',
                    '&:hover': { bgcolor: 'rgba(255,215,0,0.15)' },
                    border: '1px solid rgba(255,215,0,0.3)',
                  }}
                >
                  {currentScenario.options.right.text}
                </Button>
              </Box>
            </Paper>
          </motion.div>
        </AnimatePresence>
      </Box>

      {/* Feedback Overlay - centered on screen */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 20,
              width: '80%',
              maxWidth: 300,
              pointerEvents: 'none',
            }}
          >
            <Box
              sx={{
                bgcolor: 'rgba(0,0,0,0.9)',
                borderRadius: 3,
                py: 2,
                px: 3,
                textAlign: 'center',
                border: feedback.type === 'success'
                  ? '2px solid rgba(76,175,80,0.5)'
                  : '2px solid rgba(244,67,54,0.5)',
                boxShadow: feedback.type === 'success'
                  ? '0 0 30px rgba(76,175,80,0.3)'
                  : '0 0 30px rgba(244,67,54,0.3)',
              }}
            >
              <Typography sx={{ fontSize: 28, mb: 0.5 }}>
                {feedback.type === 'success' ? '💛' : '💭'}
              </Typography>
              <Typography
                sx={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: feedback.type === 'success' ? '#4caf50' : '#f44336',
                }}
              >
                {feedback.message}
              </Typography>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

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
