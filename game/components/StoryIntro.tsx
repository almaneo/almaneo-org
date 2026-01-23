/**
 * Story Introduction Component - Optimized Version
 * 
 * Movie-like storytelling with:
 * - CSS background image (no flicker)
 * - Subtitle-style text at bottom
 * - Typing animation effect (30ms/char)
 * - Buttons appear after typing complete
 * - Sound effects only (BGM in StartScreen)
 */

import { useState, useEffect, useRef } from 'react';
import { 
  Dialog, 
  DialogContent, 
  Button, 
  Box, 
  Typography,
  IconButton
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
import { openingStory, getTotalScenes } from '@/lib/storyContent';
import { Howl } from 'howler';

// ============================================================================
// Types
// ============================================================================

interface StoryIntroProps {
  open: boolean;
  onClose: () => void;
}

// ============================================================================
// Component
// ============================================================================

export default function StoryIntro({ open, onClose }: StoryIntroProps) {
  // Scene navigation
  const [currentScene, setCurrentScene] = useState(0);
  const totalScenes = getTotalScenes();
  const scene = openingStory[currentScene];
  
  // Typing animation
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const skipTypingRef = useRef(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  
  // Sound effects (useRef로 관리)
  const soundsRef = useRef<{
    pageturn: Howl | null;
    typing: Howl | null;
  }>({
    pageturn: null,
    typing: null
  });
  
  // 초기화 플래그
  const initializedRef = useRef(false);

  // Initialize sounds when modal opens (한 번만 실행)
  useEffect(() => {
    if (!open) {
      // 모달이 닫힐 때만 cleanup
      if (initializedRef.current) {
        console.log('🔇 Stopping sound effects...');
        if (soundsRef.current.pageturn) {
          soundsRef.current.pageturn.stop();
          soundsRef.current.pageturn.unload();
        }
        if (soundsRef.current.typing) {
          soundsRef.current.typing.stop();
          soundsRef.current.typing.unload();
        }
        soundsRef.current = { pageturn: null, typing: null };
        initializedRef.current = false;
      }
      return;
    }
    
    // 이미 초기화되었으면 스킵
    if (initializedRef.current) return;
    
    // 첫 open 시에만 초기화 (배경음악은 StartScreen에서)
    if (typeof window !== 'undefined') {
      console.log('🎵 Initializing sound effects...');
      soundsRef.current = {
        pageturn: new Howl({
          src: ['/sounds/page-turn.mp3'],
          volume: 0.5,
          html5: true
        }),
        typing: new Howl({
          src: ['/sounds/typing.mp3'],
          volume: 0.4,
          html5: true
        })
      };
      
      initializedRef.current = true;
    }
  }, [open]);

  // Typing animation effect
  useEffect(() => {
    if (!scene) return;
    
    // Reset for new scene
    setDisplayedText('');
    setIsTypingComplete(false);
    skipTypingRef.current = false;
    setShowSubtitle(false);
    
    // 첫 페이지는 사운드 초기화 완료까지 대기
    const checkSoundReady = () => {
      if (currentScene === 0 && !initializedRef.current) {
        // 사운드 아직 초기화 안 됨, 100ms 후 재시도
        setTimeout(checkSoundReady, 100);
        return;
      }
      
      // 사운드 준비 완료 또는 첫 페이지 아님
      const delay = currentScene === 0 ? 1200 : 1000;
      
      // Show image for delay time, then start subtitle + typing
      const showSubtitleTimer = setTimeout(() => {
        setShowSubtitle(true);
        
        // Play typing sound when subtitle appears
        if (soundsRef.current.typing) {
          soundsRef.current.typing.stop();
          console.log('⌨️ Playing typing sound (scene:', currentScene, ')');
          soundsRef.current.typing.play();
        }
        
        const fullText = scene.text;
        let index = 0;
        
        const typingInterval = setInterval(() => {
          if (skipTypingRef.current) {
            // Skip to end
            setDisplayedText(fullText);
            setIsTypingComplete(true);
            clearInterval(typingInterval);
          } else if (index < fullText.length) {
            setDisplayedText(fullText.slice(0, index + 1));
            index++;
          } else {
            setIsTypingComplete(true);
            clearInterval(typingInterval);
          }
        }, 30); // 30ms per character
        
        return () => clearInterval(typingInterval);
      }, delay);
      
      return () => clearTimeout(showSubtitleTimer);
    };
    
    checkSoundReady();
  }, [currentScene, scene]);

  // Navigation handlers
  const handleNext = () => {
    if (currentScene < totalScenes - 1) {
      // Play page turn sound
      if (soundsRef.current.pageturn) {
        console.log('📄 Playing page turn sound...');
        soundsRef.current.pageturn.play();
      }
      setCurrentScene(currentScene + 1);
    } else {
      handleComplete();
    }
  };
  
  const handleComplete = () => {
    localStorage.setItem('storyViewed', 'true');
    setCurrentScene(0);
    onClose();
  };
  
  const handleSkip = () => {
    handleComplete();
  };
  
  // Click subtitle to skip typing
  const handleSubtitleClick = () => {
    if (!isTypingComplete) {
      skipTypingRef.current = true;
    }
  };
  
  // Progress dot click
  const handleDotClick = (index: number) => {
    if (soundsRef.current.pageturn) {
      soundsRef.current.pageturn.play();
    }
    setCurrentScene(index);
  };

  if (!scene) return null;
  
  return (
    <Dialog 
      open={open} 
      fullScreen
      PaperProps={{
        sx: {
          bgcolor: '#000',
          overflow: 'hidden',
          position: 'fixed',
          inset: 0,
          margin: 0,
          maxHeight: '100%',
          height: '100vh',
          minHeight: '-webkit-fill-available',
        }
      }}
    >
      <DialogContent 
        sx={{ 
          p: 0,
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100vh',
          minHeight: '-webkit-fill-available',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Skip Button (Always visible) */}
        <IconButton
          onClick={handleSkip}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            color: 'white',
            bgcolor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(10px)',
            zIndex: 100,
            '&:hover': {
              bgcolor: 'rgba(0, 0, 0, 0.8)'
            }
          }}
        >
          <CloseIcon />
        </IconButton>
        
        {/* Background Image (CSS - No Flicker!) */}
        <Box
          sx={{
            position: 'fixed',
            inset: 0,
            width: '100%',
            height: '100vh',
            minHeight: '-webkit-fill-available',
            backgroundImage: `url(${scene.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            transition: 'opacity 0.5s ease-in-out',
            opacity: 1,
          }}
        />
        
        {/* Subtitle Box (Bottom) - Appears after 1 second */}
        {showSubtitle && (
          <Box
            onClick={handleSubtitleClick}
            sx={{
              position: 'absolute',
              bottom: 100,
              left: '50%',
              transform: 'translateX(-50%)',
              width: { xs: '85%', sm: '75%', md: '70%' },
              maxWidth: 800,
              bgcolor: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(12px)',
              borderRadius: 2,
              p: { xs: 2, sm: 2.5 },
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
              cursor: isTypingComplete ? 'default' : 'pointer',
              zIndex: 10,
              opacity: 1,
              transition: 'opacity 0.5s ease-in-out',
            }}
          >
                <Typography sx={{
                  color: 'white',
                  fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                  lineHeight: 1.6,
                  fontFamily: '"Noto Sans KR", -apple-system, sans-serif',
                  textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                  wordBreak: 'keep-all',
                  whiteSpace: 'pre-wrap',
                }}>
                  {displayedText}
                  {!isTypingComplete && (
                    <Box
                      component="span"
                      sx={{
                        display: 'inline-block',
                        width: 2,
                        height: '1em',
                        bgcolor: 'white',
                        ml: 0.3,
                        animation: 'blink 1s infinite',
                        '@keyframes blink': {
                          '0%, 49%': { opacity: 1 },
                          '50%, 100%': { opacity: 0 }
                        }
                      }}
                    />
                  )}
                </Typography>
              </Box>
        )}
        
        {/* Navigation Buttons (Appear after typing complete) */}
        <AnimatePresence>
          {showSubtitle && isTypingComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              style={{
                position: 'absolute',
                bottom: 30,
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: 16,
                zIndex: 20,
              }}
            >
              <Button 
                variant="outlined" 
                onClick={handleSkip}
                sx={{ 
                  color: 'white',
                  borderColor: 'rgba(255, 255, 255, 0.4)',
                  bgcolor: 'rgba(0, 0, 0, 0.6)',
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(0, 0, 0, 0.8)'
                  },
                  px: 3,
                  py: 1,
                  fontSize: { xs: '0.9rem', sm: '1rem' }
                }}
              >
                Skip Story
              </Button>
              <Button 
                variant="contained" 
                onClick={handleNext}
                sx={{
                  bgcolor: '#4CAF50',
                  color: 'white',
                  '&:hover': {
                    bgcolor: '#45a049'
                  },
                  px: 4,
                  py: 1,
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  boxShadow: '0 4px 16px rgba(76, 175, 80, 0.4)'
                }}
              >
                {currentScene < totalScenes - 1 ? 'Next →' : 'Start Game! 🎮'}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Progress Dots */}
        {showSubtitle && (
          <Box 
            sx={{ 
              position: 'absolute',
              bottom: 70,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex', 
              gap: 1,
              alignItems: 'center',
              zIndex: 15,
              opacity: 1,
              transition: 'opacity 0.5s ease-in-out',
            }}
          >
          {openingStory.map((_, index) => (
            <Box
              key={index}
              sx={{
                width: index === currentScene ? 12 : 8,
                height: index === currentScene ? 12 : 8,
                borderRadius: '50%',
                bgcolor: index === currentScene 
                  ? '#4CAF50' 
                  : 'rgba(255, 255, 255, 0.4)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                boxShadow: index === currentScene 
                  ? '0 0 8px rgba(76, 175, 80, 0.8)'
                  : 'none',
              }}
              onClick={() => handleDotClick(index)}
            />
          ))}
          </Box>
        )}
        
        {/* Scene Counter */}
        {showSubtitle && (
          <Typography
            variant="caption"
            sx={{
              position: 'absolute',
              bottom: { xs: 50, sm: 55 },
              left: '50%',
              transform: 'translateX(-50%)',
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: { xs: '0.7rem', sm: '0.75rem' },
              zIndex: 15,
              textShadow: '0 2px 4px rgba(0,0,0,0.8)'
            }}
          >
            {currentScene + 1} / {totalScenes}
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
}
