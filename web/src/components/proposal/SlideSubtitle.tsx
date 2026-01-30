/**
 * SlideSubtitle - 페이드 자막 컴포넌트
 * 자막이 순차적으로 페이드인/아웃되며 표시
 */

import { useState, useEffect, useRef } from 'react';
import type { SubtitleEntry } from '../../data/proposals/types';

interface SlideSubtitleProps {
  entries: SubtitleEntry[];
  isPlaying: boolean;
  onComplete?: () => void;
  onSubtitleIndexChange?: (index: number) => void;
}

type FadeState = 'waiting' | 'in' | 'visible' | 'out';

export default function SlideSubtitle({
  entries,
  isPlaying,
  onComplete,
  onSubtitleIndexChange,
}: SlideSubtitleProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeState, setFadeState] = useState<FadeState>('waiting');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onCompleteRef = useRef(onComplete);
  const onSubtitleIndexChangeRef = useRef(onSubtitleIndexChange);

  // 콜백 참조 업데이트 (클로저 문제 방지)
  useEffect(() => {
    onCompleteRef.current = onComplete;
    onSubtitleIndexChangeRef.current = onSubtitleIndexChange;
  }, [onComplete, onSubtitleIndexChange]);

  // 슬라이드 변경 시 초기화 (entries 배열이 바뀔 때)
  useEffect(() => {
    // 타이머 정리
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // 상태 초기화
    setCurrentIndex(0);
    setFadeState('waiting');
  }, [entries]);

  // 메인 상태 머신 - 모든 전환 로직
  useEffect(() => {
    // 타이머 정리
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // 재생 중이 아니면 중단
    if (!isPlaying) return;

    // 유효한 자막이 없으면 중단
    const entry = entries[currentIndex];
    if (!entry) return;

    switch (fadeState) {
      case 'waiting':
        // 슬라이드 전환 후 대기 → 페이드인 시작
        timerRef.current = setTimeout(() => {
          setFadeState('in');
        }, 400);
        break;

      case 'in':
        // 자막이 나타날 때 인덱스 콜백 호출 (음성 재생용)
        onSubtitleIndexChangeRef.current?.(currentIndex);
        // 페이드인 애니메이션 (300ms) 후 → visible
        timerRef.current = setTimeout(() => {
          setFadeState('visible');
        }, 300);
        break;

      case 'visible':
        // duration 동안 표시 후 → 페이드아웃
        // (페이드인 300ms + 페이드아웃 300ms = 600ms 제외)
        const displayTime = Math.max(entry.duration - 600, 800);
        timerRef.current = setTimeout(() => {
          setFadeState('out');
        }, displayTime);
        break;

      case 'out':
        // 페이드아웃 애니메이션 (300ms) 후 → 다음 자막 또는 완료
        timerRef.current = setTimeout(() => {
          if (currentIndex < entries.length - 1) {
            // 다음 자막
            setCurrentIndex(prev => prev + 1);
            setFadeState('in');
          } else {
            // 모든 자막 완료
            setFadeState('waiting');
            onCompleteRef.current?.();
          }
        }, 300);
        break;
    }

    // cleanup: 컴포넌트 언마운트 또는 deps 변경 시
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [fadeState, currentIndex, isPlaying, entries]);

  // 표시할 자막
  const entry = entries[currentIndex];

  // waiting 상태이거나 자막이 없으면 렌더링 안 함
  if (fadeState === 'waiting' || !entry) {
    return null;
  }

  // 페이드 상태에 따른 CSS
  const fadeClass =
    fadeState === 'in' ? 'animate-fade-in' :
    fadeState === 'visible' ? 'opacity-100' :
    fadeState === 'out' ? 'animate-fade-out' :
    'opacity-0';

  return (
    <div className="subtitle-container">
      <p
        className={`subtitle-text ${fadeClass} ${
          entry.highlight ? 'text-jeong-orange font-semibold' : 'text-white'
        }`}
      >
        {entry.text}
      </p>
    </div>
  );
}
