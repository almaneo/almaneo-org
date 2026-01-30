/**
 * SlideRenderer - 슬라이드 레이아웃 라우터
 * 슬라이드 타입에 따라 적절한 레이아웃 컴포넌트 렌더링
 */

import type { Slide } from '../../data/proposals/types';
import {
  TitleSlide,
  ContentSlide,
  StatsSlide,
  ComparisonSlide,
  QuoteSlide,
  ConclusionSlide,
} from './layouts';

interface SlideRendererProps {
  slide: Slide;
  isActive: boolean;
}

export default function SlideRenderer({ slide, isActive }: SlideRendererProps) {
  // 활성 슬라이드가 아니면 렌더링하지 않음 (성능)
  if (!isActive) {
    return null;
  }

  // 레이아웃 타입에 따라 컴포넌트 선택
  switch (slide.layout) {
    case 'title':
      return <TitleSlide slide={slide} />;

    case 'content':
      return <ContentSlide slide={slide} />;

    case 'stats':
      return <StatsSlide slide={slide} />;

    case 'comparison':
      return <ComparisonSlide slide={slide} />;

    case 'quote':
      return <QuoteSlide slide={slide} />;

    case 'conclusion':
      return <ConclusionSlide slide={slide} />;

    default:
      // 기본값: ContentSlide
      return <ContentSlide slide={slide} />;
  }
}
