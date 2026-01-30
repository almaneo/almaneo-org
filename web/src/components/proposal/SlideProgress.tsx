/**
 * SlideProgress - 슬라이드 진행 표시
 * 진행바 + 슬라이드 번호
 */

interface SlideProgressProps {
  currentIndex: number;
  totalSlides: number;
  onSlideClick?: (index: number) => void;
}

export default function SlideProgress({
  currentIndex,
  totalSlides,
  onSlideClick,
}: SlideProgressProps) {
  const progress = ((currentIndex + 1) / totalSlides) * 100;

  return (
    <div className="w-full">
      {/* 진행바 */}
      <div
        className="slide-progress cursor-pointer"
        onClick={(e) => {
          if (!onSlideClick) return;
          const rect = e.currentTarget.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const percentage = clickX / rect.width;
          const slideIndex = Math.floor(percentage * totalSlides);
          onSlideClick(slideIndex);
        }}
      >
        <div
          className="slide-progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 슬라이드 인디케이터 */}
      <div className="flex items-center justify-center gap-1 mt-2">
        {Array.from({ length: totalSlides }, (_, idx) => (
          <button
            key={idx}
            onClick={() => onSlideClick?.(idx)}
            className={`
              w-2 h-2 rounded-full transition-all duration-200
              ${idx === currentIndex
                ? 'bg-neos-blue scale-125'
                : idx < currentIndex
                ? 'bg-slate-500'
                : 'bg-slate-700'
              }
              hover:bg-neos-blue/70
            `}
            aria-label={`슬라이드 ${idx + 1}로 이동`}
          />
        ))}
      </div>
    </div>
  );
}
