/**
 * ConclusionSlide - 결론/CTA 슬라이드 레이아웃
 * 맺음말과 연락처
 */

import type { Slide } from '../../../data/proposals/types';

interface ConclusionSlideProps {
  slide: Slide;
}

export default function ConclusionSlide({ slide }: ConclusionSlideProps) {
  return (
    <div className="slide-fullscreen-bg">
      {/* 배경 이미지 */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(/images/proposal/${slide.image})`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />

      {/* 콘텐츠 */}
      <div className="slide-content-overlay text-center">
        <div className="max-w-4xl">
        {/* 타이틀 */}
        {slide.title && (
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            {slide.title}
          </h2>
        )}

        {/* 콘텐츠 */}
        {slide.content && (
          <div className="text-base sm:text-lg md:text-xl text-slate-300 whitespace-pre-line leading-relaxed">
            {slide.content}
          </div>
        )}

        {/* 인용문 */}
        {slide.quote && (
          <blockquote className="mt-8 mb-8">
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text">
              {slide.quote}
            </p>
          </blockquote>
        )}

        {/* 서브타이틀 */}
        {slide.subtitle && (
          <p className="text-base sm:text-lg text-slate-400 mt-6 mb-8">
            {slide.subtitle}
          </p>
        )}

        {/* 슬로건 */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <p className="text-xl sm:text-2xl font-semibold text-white">
            Cold Code, <span className="text-jeong-orange">Warm Soul</span>
          </p>
        </div>
        </div>
      </div>
    </div>
  );
}
