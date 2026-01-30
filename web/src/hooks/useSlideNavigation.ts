/**
 * useSlideNavigation - 슬라이드 네비게이션 훅
 * 슬라이드 이동, 자동 재생, 키보드/터치 이벤트 처리
 */

import { useState, useCallback, useEffect } from 'react';
import type { Slide } from '../data/proposals/types';

interface UseSlideNavigationOptions {
  slides: Slide[];
  initialSlide?: number;
  autoPlay?: boolean;
}

interface UseSlideNavigationReturn {
  // State
  currentIndex: number;
  currentSlide: Slide;
  isPlaying: boolean;
  isFullscreen: boolean;
  totalSlides: number;

  // Actions
  goToSlide: (index: number) => void;
  goNext: () => void;
  goPrev: () => void;
  goFirst: () => void;
  goLast: () => void;
  togglePlay: () => void;
  toggleFullscreen: () => void;
  onSubtitleComplete: () => void;
}

export function useSlideNavigation({
  slides,
  initialSlide = 0,
  autoPlay = true,
}: UseSlideNavigationOptions): UseSlideNavigationReturn {
  const [currentIndex, setCurrentIndex] = useState(initialSlide);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const totalSlides = slides.length;
  const currentSlide = slides[currentIndex];

  // 슬라이드 이동
  const goToSlide = useCallback(
    (index: number) => {
      const newIndex = Math.max(0, Math.min(index, totalSlides - 1));
      setCurrentIndex(newIndex);
      // 슬라이드 변경 시 재생 상태 유지
    },
    [totalSlides]
  );

  const goNext = useCallback(() => {
    if (currentIndex < totalSlides - 1) {
      goToSlide(currentIndex + 1);
    }
  }, [currentIndex, totalSlides, goToSlide]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      goToSlide(currentIndex - 1);
    }
  }, [currentIndex, goToSlide]);

  const goFirst = useCallback(() => {
    goToSlide(0);
  }, [goToSlide]);

  const goLast = useCallback(() => {
    goToSlide(totalSlides - 1);
  }, [totalSlides, goToSlide]);

  // 재생/일시정지 토글
  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  // 풀스크린 토글
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  }, []);

  // 자막 완료 시 다음 슬라이드
  const onSubtitleComplete = useCallback(() => {
    if (isPlaying && currentIndex < totalSlides - 1) {
      // 약간의 딜레이 후 다음 슬라이드
      setTimeout(() => {
        goNext();
      }, 500);
    }
  }, [isPlaying, currentIndex, totalSlides, goNext]);

  // 키보드 이벤트
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 입력 필드에서는 무시
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          goNext();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          goPrev();
          break;
        case ' ': // Space
          e.preventDefault();
          togglePlay();
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'Escape':
          if (isFullscreen) {
            document.exitFullscreen?.();
            setIsFullscreen(false);
          }
          break;
        case 'Home':
          e.preventDefault();
          goFirst();
          break;
        case 'End':
          e.preventDefault();
          goLast();
          break;
        default:
          // 숫자 키 (1-9)
          if (e.key >= '1' && e.key <= '9') {
            const slideNum = parseInt(e.key, 10);
            if (slideNum <= totalSlides) {
              goToSlide(slideNum - 1);
            }
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    goNext,
    goPrev,
    goFirst,
    goLast,
    goToSlide,
    togglePlay,
    toggleFullscreen,
    isFullscreen,
    totalSlides,
  ]);

  // 풀스크린 변경 감지
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () =>
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return {
    currentIndex,
    currentSlide,
    isPlaying,
    isFullscreen,
    totalSlides,
    goToSlide,
    goNext,
    goPrev,
    goFirst,
    goLast,
    togglePlay,
    toggleFullscreen,
    onSubtitleComplete,
  };
}

export default useSlideNavigation;
