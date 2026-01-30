/**
 * StatsSlide - 통계/테이블 슬라이드 레이아웃
 * 전체 화면 배경 + 테이블 오버레이
 */

import type { Slide } from '../../../data/proposals/types';

interface StatsSlideProps {
  slide: Slide;
}

export default function StatsSlide({ slide }: StatsSlideProps) {
  const { tableData } = slide;

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
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />

      {/* 콘텐츠 오버레이 */}
      <div className="slide-content-overlay items-center">
        <div className="w-full max-w-4xl px-4">
          {/* 타이틀 */}
          {slide.title && (
            <h2 className="slide-title text-center">
              {slide.title}
              {slide.titleHighlight && (
                <span className="slide-title-highlight">
                  {slide.titleHighlight}
                </span>
              )}
            </h2>
          )}

          {/* 테이블 */}
          {tableData && (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full border-collapse bg-black/40 backdrop-blur-sm rounded-lg overflow-hidden">
                <thead>
                  <tr>
                    {tableData.headers.map((header, idx) => (
                      <th
                        key={idx}
                        className="px-4 py-3 text-left text-sm font-semibold bg-slate-800/60 text-slate-200 border-b border-slate-700"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableData.rows.map((row, rowIdx) => (
                    <tr
                      key={rowIdx}
                      className="border-b border-slate-800/50"
                    >
                      {row.map((cell, cellIdx) => (
                        <td
                          key={cellIdx}
                          className={`
                            px-4 py-3 text-sm
                            ${cellIdx === tableData.highlightColumn
                              ? 'text-jeong-orange font-medium'
                              : 'text-slate-300'
                            }
                            ${cellIdx === 0 ? 'font-medium text-white' : ''}
                          `}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 인용문 */}
          {slide.quote && (
            <blockquote className="slide-quote mt-6">
              <p className="text-lg text-jeong-orange italic">
                {slide.quote}
              </p>
            </blockquote>
          )}
        </div>
      </div>
    </div>
  );
}
