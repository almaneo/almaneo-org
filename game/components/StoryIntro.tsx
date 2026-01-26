/**
 * Story Introduction Component - Card-Style Modal
 *
 * Card modal with:
 * - Square image (1:1 aspect ratio)
 * - Subtitle text below image
 * - Typing animation (30ms/char)
 * - Progress dots + nav arrows
 * - Sound effects (page-turn, typing)
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const typingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Sound effects
  const soundsRef = useRef<{
    pageturn: Howl | null;
    typing: Howl | null;
    bgm: Howl | null;
  }>({
    pageturn: null,
    typing: null,
    bgm: null
  });
  const initializedRef = useRef(false);

  // Initialize sounds when modal opens
  useEffect(() => {
    if (!open) {
      if (initializedRef.current) {
        if (soundsRef.current.bgm) {
          const bgmRef = soundsRef.current.bgm;
          bgmRef.fade(bgmRef.volume(), 0, 500);
          setTimeout(() => {
            bgmRef.stop();
            bgmRef.unload();
          }, 500);
        }
        if (soundsRef.current.pageturn) {
          soundsRef.current.pageturn.stop();
          soundsRef.current.pageturn.unload();
        }
        if (soundsRef.current.typing) {
          soundsRef.current.typing.stop();
          soundsRef.current.typing.unload();
        }
        soundsRef.current = { pageturn: null, typing: null, bgm: null };
        initializedRef.current = false;
      }
      return;
    }

    if (initializedRef.current) return;

    if (typeof window !== 'undefined') {
      const bgm = new Howl({
        src: ['/sounds/story-bgm.mp3'],
        volume: 0.3,
        loop: true,
        html5: true
      });
      bgm.play();

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
        }),
        bgm
      };
      initializedRef.current = true;
    }
  }, [open]);

  // Typing animation effect
  useEffect(() => {
    if (!scene || !open) return;

    // Reset for new scene
    setDisplayedText('');
    setIsTypingComplete(false);

    // Clear previous typing interval
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }

    const delay = currentScene === 0 ? 800 : 500;

    const startTimer = setTimeout(() => {
      // Play typing sound
      if (soundsRef.current.typing) {
        soundsRef.current.typing.stop();
        soundsRef.current.typing.play();
      }

      const fullText = scene.text;
      let index = 0;

      typingIntervalRef.current = setInterval(() => {
        if (index < fullText.length) {
          setDisplayedText(fullText.slice(0, index + 1));
          index++;
        } else {
          setIsTypingComplete(true);
          if (typingIntervalRef.current) {
            clearInterval(typingIntervalRef.current);
            typingIntervalRef.current = null;
          }
          // Stop typing sound
          if (soundsRef.current.typing) {
            soundsRef.current.typing.stop();
          }
        }
      }, 30);
    }, delay);

    return () => {
      clearTimeout(startTimer);
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
      }
    };
  }, [currentScene, scene, open]);

  // Navigation handlers
  const handleNext = () => {
    if (currentScene < totalScenes - 1) {
      if (soundsRef.current.pageturn) {
        soundsRef.current.pageturn.play();
      }
      setCurrentScene(currentScene + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentScene > 0) {
      if (soundsRef.current.pageturn) {
        soundsRef.current.pageturn.play();
      }
      setCurrentScene(currentScene - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('storyViewed', 'true');
    setCurrentScene(0);
    onClose();
  };

  // Click on image area: skip typing or advance
  const handleImageClick = () => {
    if (!isTypingComplete) {
      // Skip typing - show full text
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
      }
      setDisplayedText(scene.text);
      setIsTypingComplete(true);
      if (soundsRef.current.typing) {
        soundsRef.current.typing.stop();
      }
    } else {
      // Advance to next scene
      handleNext();
    }
  };

  // Progress dot click
  const handleDotClick = (index: number) => {
    if (soundsRef.current.pageturn) {
      soundsRef.current.pageturn.play();
    }
    setCurrentScene(index);
  };

  // Reset on close
  useEffect(() => {
    if (!open) {
      setCurrentScene(0);
      setDisplayedText('');
      setIsTypingComplete(false);
    }
  }, [open]);

  if (!open || !scene) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="story-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleComplete}
      >
        <motion.div
          className="story-modal-content"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button className="story-close-btn" onClick={handleComplete}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          {/* Scene container - square aspect ratio */}
          <div className="story-scene-container" onClick={handleImageClick}>
            {/* Progress dots */}
            <div className="story-progress">
              {openingStory.map((_, index) => (
                <div
                  key={index}
                  className={`story-progress-dot ${index === currentScene ? 'active' : ''} ${index < currentScene ? 'completed' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDotClick(index);
                  }}
                />
              ))}
            </div>

            {/* Scene image with transition */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentScene}
                className="story-image-wrapper"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4 }}
              >
                <img
                  src={scene.image}
                  alt={`Scene ${currentScene + 1}`}
                  className="story-image"
                  draggable={false}
                />
              </motion.div>
            </AnimatePresence>

            {/* Navigation arrows */}
            <button
              className="story-nav-btn story-nav-prev"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              disabled={currentScene === 0}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              className="story-nav-btn story-nav-next"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>

          {/* Subtitle area - below image */}
          <div className="story-subtitle-container">
            <p className="story-subtitle">
              {displayedText}
              {!isTypingComplete && <span className="typing-cursor">|</span>}
            </p>
          </div>

          {/* Scene counter */}
          <div className="story-scene-counter">
            {currentScene + 1} / {totalScenes}
          </div>

          {/* Tap hint */}
          <p className="story-tap-hint">
            {isTypingComplete ? 'Tap image to continue' : 'Tap to skip'}
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
