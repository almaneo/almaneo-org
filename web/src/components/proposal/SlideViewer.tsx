/**
 * SlideViewer - 메인 슬라이드 뷰어 컨테이너
 * 슬라이드 표시, 자막, 컨트롤, 언어 선택, 음성 파일 재생 통합
 */

import { useRef, useCallback, useState, useEffect } from 'react';
import type { Proposal, ProposalLanguage } from '../../data/proposals/types';
import { getProposalLanguages } from '../../data/proposals';
import { useSlideNavigation } from '../../hooks/useSlideNavigation';
import SlideRenderer from './SlideRenderer';
import SlideSubtitle from './SlideSubtitle';
import SlideControls from './SlideControls';
import ProposalHeader from './ProposalHeader';

interface SlideViewerProps {
  proposal: Proposal;
  initialSlide?: number;
  currentLanguage: ProposalLanguage;
  onLanguageChange: (lang: ProposalLanguage) => void;
  onClose?: () => void;
}

export default function SlideViewer({
  proposal,
  initialSlide = 0,
  currentLanguage,
  onLanguageChange,
  onClose,
}: SlideViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showControls, setShowControls] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const {
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
  } = useSlideNavigation({
    slides: proposal.slides,
    initialSlide,
    autoPlay: true,
  });

  // Get available languages for this proposal
  const availableLanguages = getProposalLanguages(proposal.meta.id);

  // Get audio file path for a specific subtitle
  const getAudioPath = useCallback((slideNumber: number, subtitleIndex: number): string => {
    const slideStr = slideNumber.toString().padStart(2, '0');
    const subtitleStr = (subtitleIndex + 1).toString().padStart(2, '0');
    return `/audio/proposals/${proposal.meta.id}/${currentLanguage}/${slideStr}-${subtitleStr}.wav`;
  }, [proposal.meta.id, currentLanguage]);

  // Play audio file
  const playAudio = useCallback((slideNumber: number, subtitleIndex: number) => {
    console.log('[Audio] playAudio called:', { slideNumber, subtitleIndex, isAudioEnabled, currentLanguage });

    if (!isAudioEnabled) {
      console.log('[Audio] Audio disabled, skipping');
      return;
    }

    // Stop current audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const audioPath = getAudioPath(slideNumber, subtitleIndex);
    console.log('[Audio] Loading:', audioPath);

    const audio = new Audio(audioPath);
    audio.volume = 1.0;

    audio.play()
      .then(() => {
        console.log('[Audio] Playing:', audioPath);
      })
      .catch((error) => {
        console.error('[Audio] Error:', audioPath, error.message);
      });

    audioRef.current = audio;
  }, [isAudioEnabled, getAudioPath, currentLanguage]);

  // Stop audio
  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
  }, []);

  // Handle audio toggle
  const handleAudioToggle = useCallback(() => {
    console.log('[Audio] Toggle clicked, current state:', isAudioEnabled);
    if (isAudioEnabled) {
      stopAudio();
    }
    setIsAudioEnabled((prev) => {
      console.log('[Audio] New state:', !prev);
      return !prev;
    });
  }, [isAudioEnabled, stopAudio]);

  // Handle subtitle index change for audio playback
  const handleSubtitleIndexChange = useCallback((subtitleIndex: number) => {
    console.log('[Audio] handleSubtitleIndexChange:', { subtitleIndex, isAudioEnabled, isPlaying, slideNumber: currentSlide.slideNumber });
    if (isAudioEnabled && isPlaying) {
      playAudio(currentSlide.slideNumber, subtitleIndex);
    }
  }, [isAudioEnabled, isPlaying, currentSlide.slideNumber, playAudio]);

  // Stop audio when slide changes or component unmounts
  useEffect(() => {
    stopAudio();
  }, [currentIndex, stopAudio]);

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [stopAudio]);

  // Stop audio when playback is paused
  useEffect(() => {
    if (!isPlaying) {
      stopAudio();
    }
  }, [isPlaying, stopAudio]);

  // 터치 스와이프 지원
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (touchStartX.current === null || touchEndX.current === null) return;

    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50; // 최소 스와이프 거리

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // 왼쪽으로 스와이프 -> 다음
        goNext();
      } else {
        // 오른쪽으로 스와이프 -> 이전
        goPrev();
      }
    }

    touchStartX.current = null;
    touchEndX.current = null;
  }, [goNext, goPrev]);

  // 컨트롤 표시/숨김 타이머
  const resetHideTimer = useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    setShowControls(true);
    hideTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000); // 3초 후 자동 숨김
  }, []);

  // 마우스 움직임 감지
  const handleMouseMove = useCallback(() => {
    resetHideTimer();
  }, [resetHideTimer]);

  // 초기 타이머 설정 및 정리
  useEffect(() => {
    resetHideTimer();
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, [resetHideTimer]);

  // 슬라이드 영역 클릭 (모바일용)
  const handleSlideClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // 컨트롤이 숨겨져 있으면 표시만 하고 리턴
      if (!showControls) {
        resetHideTimer();
        return;
      }

      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;

      // 왼쪽 1/4 클릭 -> 이전
      if (clickX < width * 0.25) {
        goPrev();
      }
      // 오른쪽 1/4 클릭 -> 다음
      else if (clickX > width * 0.75) {
        goNext();
      }
      // 중앙 클릭 -> 재생/일시정지
      else {
        togglePlay();
      }
      resetHideTimer();
    },
    [goPrev, goNext, togglePlay, showControls, resetHideTimer]
  );

  return (
    <div
      ref={containerRef}
      className="slide-viewer"
      onMouseMove={handleMouseMove}
      onTouchStart={(e) => {
        handleTouchStart(e);
        resetHideTimer();
      }}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 슬라이드 콘텐츠 영역 (전체 화면 배경) */}
      <div
        className="slide-content-fullscreen"
        onClick={handleSlideClick}
      >
        {/* 슬라이드 렌더러 */}
        <SlideRenderer
          slide={currentSlide}
          isActive={true}
        />

        {/* 자막 */}
        <SlideSubtitle
          key={currentSlide.id}
          entries={currentSlide.script}
          isPlaying={isPlaying}
          onComplete={onSubtitleComplete}
          onSubtitleIndexChange={handleSubtitleIndexChange}
        />
      </div>

      {/* 상단 헤더 (오버레이) */}
      <div className={`slide-overlay-header ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <ProposalHeader
          meta={proposal.meta}
          currentLanguage={currentLanguage}
          availableLanguages={availableLanguages}
          isAudioEnabled={isAudioEnabled}
          onLanguageChange={onLanguageChange}
          onAudioToggle={handleAudioToggle}
          onClose={onClose}
        />
      </div>

      {/* 하단 컨트롤 (오버레이) */}
      <div className={`slide-overlay-controls ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <SlideControls
          currentIndex={currentIndex}
          totalSlides={totalSlides}
          isPlaying={isPlaying}
          isFullscreen={isFullscreen}
          onPrev={goPrev}
          onNext={goNext}
          onFirst={goFirst}
          onLast={goLast}
          onTogglePlay={togglePlay}
          onToggleFullscreen={toggleFullscreen}
          onSlideClick={goToSlide}
        />
      </div>
    </div>
  );
}
