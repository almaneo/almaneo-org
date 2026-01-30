/**
 * SlideControls - 슬라이드 컨트롤 바
 * 재생/일시정지, 이전/다음, 풀스크린
 */

import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward,
} from 'lucide-react';
import SlideProgress from './SlideProgress';

interface SlideControlsProps {
  currentIndex: number;
  totalSlides: number;
  isPlaying: boolean;
  isFullscreen: boolean;
  onPrev: () => void;
  onNext: () => void;
  onFirst: () => void;
  onLast: () => void;
  onTogglePlay: () => void;
  onToggleFullscreen: () => void;
  onSlideClick: (index: number) => void;
}

export default function SlideControls({
  currentIndex,
  totalSlides,
  isPlaying,
  isFullscreen,
  onPrev,
  onNext,
  onFirst,
  onLast,
  onTogglePlay,
  onToggleFullscreen,
  onSlideClick,
}: SlideControlsProps) {
  return (
    <div className="slide-controls">
      {/* 진행 표시 */}
      <div className="mb-4">
        <SlideProgress
          currentIndex={currentIndex}
          totalSlides={totalSlides}
          onSlideClick={onSlideClick}
        />
      </div>

      {/* 컨트롤 버튼들 */}
      <div className="flex items-center justify-between">
        {/* 왼쪽: 처음/이전 */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={onFirst}
            disabled={currentIndex === 0}
            className="slide-control-btn"
            aria-label="처음으로"
          >
            <SkipBack className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={onPrev}
            disabled={currentIndex === 0}
            className="slide-control-btn"
            aria-label="이전 슬라이드"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* 중앙: 재생/일시정지 + 슬라이드 번호 */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={onTogglePlay}
            className="slide-control-btn-primary"
            aria-label={isPlaying ? '일시정지' : '재생'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 sm:w-6 sm:h-6" />
            ) : (
              <Play className="w-5 h-5 sm:w-6 sm:h-6" />
            )}
          </button>

          <span className="text-sm sm:text-base text-slate-400 font-mono min-w-[60px] text-center">
            {currentIndex + 1} / {totalSlides}
          </span>
        </div>

        {/* 오른쪽: 다음/끝/풀스크린 */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={onNext}
            disabled={currentIndex === totalSlides - 1}
            className="slide-control-btn"
            aria-label="다음 슬라이드"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={onLast}
            disabled={currentIndex === totalSlides - 1}
            className="slide-control-btn"
            aria-label="끝으로"
          >
            <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* 구분선 */}
          <div className="w-px h-6 bg-slate-700 mx-1 sm:mx-2" />

          <button
            onClick={onToggleFullscreen}
            className="slide-control-btn"
            aria-label={isFullscreen ? '전체화면 종료' : '전체화면'}
          >
            {isFullscreen ? (
              <Minimize className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <Maximize className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>
        </div>
      </div>

      {/* 키보드 단축키 힌트 (데스크톱에서만) */}
      <div className="hidden lg:flex items-center justify-center gap-4 mt-3 text-xs text-slate-600">
        <span>← → 이동</span>
        <span>Space 재생/일시정지</span>
        <span>F 전체화면</span>
        <span>Esc 종료</span>
      </div>
    </div>
  );
}
