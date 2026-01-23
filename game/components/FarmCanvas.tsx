'use client';

import React, { useState, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { playSound, SoundType } from '@/lib/sounds';
import { useIsMobile } from '@/hooks/useIsMobile';

interface FarmCanvasProps {
  onHarvest: () => void;
  canHarvest: boolean;
  tapPower: number;
}

interface ClickEffect {
  id: string;
  x: number;
  y: number;
  points: number;
  stars: Array<{ angle: number; distance: number; delay: number }>;
}

export default function FarmCanvas({ onHarvest, canHarvest, tapPower }: FarmCanvasProps) {
  const [clickEffects, setClickEffects] = useState<ClickEffect[]>([]);
  const isMobile = useIsMobile();

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!canHarvest) {
      // 에너지 부족 시 경고 사운드
      playSound(SoundType.WARNING);
      return;
    }

    // 터치/클릭 방지 (중복 실행 방지)
    e.preventDefault();

    // 클릭 위치 계산
    const rect = e.currentTarget.getBoundingClientRect();
    let clientX: number;
    let clientY: number;

    if ('touches' in e) {
      // 터치 이벤트
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      // 마우스 이벤트
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // 별 파티클 생성 (4-6개)
    const starCount = 4 + Math.floor(Math.random() * 3);
    const stars = Array.from({ length: starCount }, (_, i) => ({
      angle: (360 / starCount) * i + Math.random() * 30,
      distance: 60 + Math.random() * 40,
      delay: i * 0.05
    }));

    // 클릭 효과 생성
    const effect: ClickEffect = {
      id: `${Date.now()}-${Math.random()}`,
      x,
      y,
      points: tapPower,
      stars
    };

    setClickEffects(prev => [...prev, effect]);

    // 수확 사운드 재생
    playSound(SoundType.CLICK);

    // 수확 핸들러 호출
    onHarvest();

    // 3초 후 효과 제거
    setTimeout(() => {
      setClickEffects(prev => prev.filter(e => e.id !== effect.id));
    }, 1000);
  }, [canHarvest, onHarvest, tapPower]);

  return (
    <Box
      onClick={handleClick}
      onTouchStart={handleClick}
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        cursor: canHarvest ? 'pointer' : 'not-allowed',
        touchAction: 'manipulation',
        WebkitTapHighlightColor: 'transparent',
        userSelect: 'none',
      }}
    >
      {/* 배경 이미지 */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          opacity: canHarvest ? 1 : 0.6
        }}
      >
        <Image
          src="/images/farm-background.png"
          alt="Rice Farm"
          fill
          style={{
            objectFit: 'cover',
            objectPosition: 'center'
          }}
          priority
        />
      </Box>

      {/* 오버레이 그라디언트 */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: canHarvest 
            ? 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.3))'
            : 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.5))',
          zIndex: 1,
          transition: 'background 0.3s ease'
        }}
      />

      {/* 중앙 텍스트 */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 2,
          textAlign: 'center',
          pointerEvents: 'none'
        }}
      >
        <motion.div
          animate={{
            scale: canHarvest ? [1, 1.05, 1] : 1,
            opacity: canHarvest ? [0.9, 1, 0.9] : 0.5
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          {canHarvest ? (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: isMobile ? 1 : 2, 
              flexWrap: 'nowrap',
              justifyContent: 'center' 
            }}>
              <Box sx={{ 
                width: isMobile ? 60 : 120, 
                height: isMobile ? 60 : 120, 
                position: 'relative',
                flexShrink: 0
              }}>
                <Image
                  src="/images/rice-icon.png"
                  alt="Rice"
                  fill
                  style={{ objectFit: 'contain', filter: 'drop-shadow(0 0 8px rgba(255,215,0,0.8))' }}
                />
              </Box>
              <Typography
                variant="h3"
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  fontFamily: "'Orbitron', sans-serif",
                  textShadow: '2px 2px 8px rgba(0,0,0,0.8)',
                  fontSize: isMobile ? '1rem' : '3rem',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                }}
              >
                TAP TO CARBON RICE
              </Typography>
              <Box sx={{ 
                width: isMobile ? 60 : 120, 
                height: isMobile ? 60 : 120, 
                position: 'relative',
                flexShrink: 0
              }}>
                <Image
                  src="/images/rice-icon.png"
                  alt="Rice"
                  fill
                  style={{ objectFit: 'contain', filter: 'drop-shadow(0 0 8px rgba(255,215,0,0.8))' }}
                />
              </Box>
            </Box>
          ) : (
            <Typography
              variant="h3"
              sx={{
                color: 'white',
                fontWeight: 'bold',
                fontFamily: "'Orbitron', sans-serif",
                textShadow: '2px 2px 8px rgba(0,0,0,0.8)',
                fontSize: isMobile ? '1rem' : '3rem',
              }}
            >
              ⚡ ENERGY LOW ⚡
            </Typography>
          )}
          
          {canHarvest && (
            <Typography
              variant="h6"
              sx={{
                color: '#FFD700',
                fontWeight: 'medium',
                fontFamily: "'Exo 2', sans-serif",
                textShadow: '1px 1px 4px rgba(0,0,0,0.8)',
                fontSize: isMobile ? '0.75rem' : '1.25rem',
                textAlign: 'center',
              }}
            >
              +{tapPower} pts per tap
            </Typography>
          )}
        </motion.div>
      </Box>

      {/* 클릭 파티클 효과 */}
      <AnimatePresence>
        {clickEffects.map(effect => (
          <React.Fragment key={effect.id}>
            {/* 중앙 숫자 */}
            <motion.div
              initial={{ 
                opacity: 1, 
                y: 0,
                scale: 0.5
              }}
              animate={{ 
                opacity: 0, 
                y: -120,
                scale: 2.0
              }}
              exit={{ 
                opacity: 0 
              }}
              transition={{ 
                duration: 1,
                ease: 'easeOut'
              }}
              style={{
                position: 'absolute',
                left: effect.x,
                top: effect.y,
                zIndex: 10,
                pointerEvents: 'none'
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  color: '#FFD700',
                  fontWeight: 'bold',
                  fontFamily: "'Exo 2', sans-serif",
                  textShadow: '0 0 10px rgba(255,215,0,0.8), 2px 2px 4px rgba(0,0,0,0.8)',
                  WebkitTextStroke: '1px rgba(0,0,0,0.5)'
                }}
              >
                +{effect.points}
              </Typography>
            </motion.div>

            {/* 별 파티클들 */}
            {effect.stars.map((star, index) => {
              const radians = (star.angle * Math.PI) / 180;
              const endX = Math.cos(radians) * star.distance;
              const endY = Math.sin(radians) * star.distance;

              return (
                <motion.div
                  key={`${effect.id}-star-${index}`}
                  initial={{ 
                    opacity: 1,
                    x: 0,
                    y: 0,
                    scale: 0.5
                  }}
                  animate={{ 
                    opacity: 0,
                    x: endX,
                    y: endY,
                    scale: 1.5,
                    rotate: 360
                  }}
                  exit={{ 
                    opacity: 0 
                  }}
                  transition={{ 
                    duration: 0.8,
                    delay: star.delay,
                    ease: 'easeOut'
                  }}
                  style={{
                    position: 'absolute',
                    left: effect.x - 32,
                    top: effect.y - 32,
                    zIndex: 9,
                    pointerEvents: 'none'
                  }}
                >
                  <Image
                    src="/images/particle-sparkle.png"
                    alt="Sparkle"
                    width={64}
                    height={64}
                    style={{
                      filter: 'drop-shadow(0 0 8px rgba(255,215,0,0.8))'
                    }}
                  />
                </motion.div>
              );
            })}
          </React.Fragment>
        ))}
      </AnimatePresence>

      {/* 에너지 부족 오버레이 */}
      {!canHarvest && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 3,
            background: 'rgba(0,0,0,0.3)',
            pointerEvents: 'none'
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: 'white',
              fontWeight: 'medium',
              textShadow: '1px 1px 4px rgba(0,0,0,0.8)',
              textAlign: 'center',
              px: 2
            }}
          >
            Wait for energy to regenerate...
          </Typography>
        </Box>
      )}
    </Box>
  );
}
