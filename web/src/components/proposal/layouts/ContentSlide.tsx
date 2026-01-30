/**
 * ContentSlide - 콘텐츠 슬라이드 레이아웃
 * 전체 화면 배경 이미지 + 최소한의 오버레이 텍스트
 */

import type { Slide } from '../../../data/proposals/types';

interface ContentSlideProps {
  slide: Slide;
}

export default function ContentSlide({ slide }: ContentSlideProps) {
  return (
    <div className="slide-fullscreen-bg">
      {/* 전체 화면 배경 이미지 */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(/src/assets/images/proposal/${slide.image})`,
        }}
      />

      {/* 그라디언트 오버레이 (텍스트 가독성) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

      {/* 콘텐츠 오버레이 (중앙 상단) */}
      <div className="slide-content-overlay">
        {/* 타이틀 */}
        {slide.title && (
          <h2 className="slide-title">
            {slide.title}
            {slide.titleHighlight && (
              <span className="slide-title-highlight">
                {slide.titleHighlight}
              </span>
            )}
          </h2>
        )}

        {/* 서브타이틀 */}
        {slide.subtitle && (
          <p className="slide-subtitle">
            {slide.subtitle}
          </p>
        )}

        {/* 인용문 (있는 경우만) */}
        {slide.quote && (
          <blockquote className="slide-quote">
            <p className="text-xl sm:text-2xl text-jeong-orange italic font-medium">
              "{slide.quote}"
            </p>
          </blockquote>
        )}
      </div>
    </div>
  );
}
