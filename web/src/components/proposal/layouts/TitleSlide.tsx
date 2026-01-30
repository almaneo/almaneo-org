/**
 * TitleSlide - 타이틀 슬라이드 레이아웃
 * 풀스크린 이미지 배경 + 중앙 텍스트
 */

import type { Slide } from '../../../data/proposals/types';

interface TitleSlideProps {
  slide: Slide;
}

export default function TitleSlide({ slide }: TitleSlideProps) {
  return (
    <div className="slide-fullscreen-bg">
      {/* 배경 이미지 */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(/src/assets/images/proposal/${slide.image})`,
        }}
      />
      {/* 그라디언트 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

      {/* 콘텐츠 (중앙) */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-8 max-w-4xl mx-auto">
        {/* 메인 타이틀 */}
        {slide.title && (
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-4 drop-shadow-lg">
            {slide.title}
          </h1>
        )}

        {/* 하이라이트 타이틀 */}
        {slide.titleHighlight && (
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold gradient-text mb-6 drop-shadow-md">
            {slide.titleHighlight}
          </h2>
        )}

        {/* 서브타이틀 */}
        {slide.subtitle && (
          <p className="text-lg sm:text-xl md:text-2xl text-slate-300 mt-8 drop-shadow">
            {slide.subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
