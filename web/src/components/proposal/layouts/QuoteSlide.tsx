/**
 * QuoteSlide - 인용문 슬라이드 레이아웃
 * 감성적인 인용문 중심
 */

import type { Slide } from '../../../data/proposals/types';

interface QuoteSlideProps {
  slide: Slide;
}

export default function QuoteSlide({ slide }: QuoteSlideProps) {
  return (
    <div className="slide-fullscreen-bg">
      {/* 배경 이미지 */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(/src/assets/images/proposal/${slide.image})`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/20" />

      {/* 콘텐츠 */}
      <div className="slide-content-overlay items-center justify-center">
        <div className="max-w-4xl px-6 sm:px-8 lg:px-12 text-center">
        {/* 타이틀 */}
        {slide.title && (
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
            {slide.title}
            {slide.titleHighlight && (
              <span className="block text-xl sm:text-2xl md:text-3xl text-white/80 mt-2">
                {slide.titleHighlight}
              </span>
            )}
          </h2>
        )}

        {/* 콘텐츠 */}
        {slide.content && (
          <div className="mt-8 text-left">
            <div className="text-base sm:text-lg text-slate-300 whitespace-pre-line leading-relaxed">
              {slide.content}
            </div>
          </div>
        )}

        {/* 메인 인용문 */}
        {slide.quote && (
          <blockquote className="mt-10">
            <div className="relative">
              {/* 인용 부호 */}
              <span className="absolute -top-4 -left-4 text-6xl text-jeong-orange/30 font-serif">
                "
              </span>
              <p className="text-lg sm:text-xl md:text-2xl text-jeong-orange italic leading-relaxed px-8">
                {slide.quote}
              </p>
              <span className="absolute -bottom-8 -right-4 text-6xl text-jeong-orange/30 font-serif rotate-180">
                "
              </span>
            </div>
            {slide.quoteAuthor && (
              <footer className="mt-6 text-slate-400">
                — {slide.quoteAuthor}
              </footer>
            )}
          </blockquote>
        )}
        </div>
      </div>
    </div>
  );
}
