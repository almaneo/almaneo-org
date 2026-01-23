'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { playSound, SoundType } from '@/lib/sounds';

interface LevelUpEffectProps {
  show: boolean;
  level: number;
  onClose: () => void;
}

export default function LevelUpEffect({ show, level, onClose }: LevelUpEffectProps) {
  // 파티클 생성 (20개)
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    angle: (360 / 20) * i,
    delay: i * 0.05,
    distance: 200 + Math.random() * 100
  }));

  React.useEffect(() => {
    if (show) {
      // 레벨업 사운드 재생
      playSound(SoundType.LEVEL_UP);
      
      // 3초 후 자동 닫기
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 9999,
            pointerEvents: 'none'
          }}
        >
          {/* 배경 오버레이 */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',              background: 'radial-gradient(circle, rgba(255,215,0,0.2) 0%, rgba(0,0,0,0.8) 100%)',
              backdropFilter: 'blur(8px)'
            }}
          />

          {/* 중앙 텍스트 */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              zIndex: 2
            }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                duration: 0.6, 
                type: 'spring',
                stiffness: 200,
                damping: 15
              }}
            >
              <Typography
                variant="h1"
                sx={{
                  color: '#FFD700',
                  fontWeight: 'bold',
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: { xs: '3rem', sm: '4rem', md: '5rem' },
                  textShadow: `
                    0 0 20px rgba(255,215,0,1),
                    0 0 40px rgba(255,215,0,0.8),
                    0 0 60px rgba(255,215,0,0.6),
                    4px 4px 8px rgba(0,0,0,0.8)
                  `,
                  mb: 2
                }}
              >
                LEVEL UP!
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Typography
                variant="h3"
                sx={{
                  color: '#FFF',
                  fontWeight: 'bold',
                  fontFamily: "'Exo 2', sans-serif",
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },                  textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                }}
              >
                Level {level}
              </Typography>
            </motion.div>
          </Box>

          {/* 금색 파티클 폭발 */}
          {particles.map((particle) => {
            const radians = (particle.angle * Math.PI) / 180;
            const endX = Math.cos(radians) * particle.distance;
            const endY = Math.sin(radians) * particle.distance;

            return (
              <motion.div
                key={particle.id}
                initial={{
                  opacity: 1,
                  x: 0,
                  y: 0,
                  scale: 0
                }}
                animate={{
                  opacity: 0,
                  x: endX,
                  y: endY,
                  scale: 2,
                  rotate: 720
                }}
                transition={{
                  duration: 2,
                  delay: particle.delay,
                  ease: 'easeOut'
                }}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  zIndex: 1
                }}
              >
                <Image
                  src="/images/particle-sparkle.png"
                  alt="Sparkle"
                  width={48}
                  height={48}
                  style={{
                    filter: 'drop-shadow(0 0 12px rgba(255,215,0,1))'
                  }}
                />
              </motion.div>
            );
          })}

          {/* 링 확산 효과 */}
          <motion.div            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 4, opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '200px',
              height: '200px',
              border: '4px solid #FFD700',
              borderRadius: '50%',
              zIndex: 0
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
