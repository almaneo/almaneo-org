/**
 * ComparisonSlide - 비교 슬라이드 레이아웃
 * 좌우 비교 또는 테이블 비교
 */

import type { Slide } from '../../../data/proposals/types';

interface ComparisonSlideProps {
  slide: Slide;
}

export default function ComparisonSlide({ slide }: ComparisonSlideProps) {
  const { comparisonData, tableData } = slide;

  return (
    <div className="slide-fullscreen-bg">
      {/* 배경 이미지 */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(/src/assets/images/proposal/${slide.image})`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-black/30" />

      {/* 콘텐츠 */}
      <div className="slide-content-overlay items-center justify-center p-4 sm:p-6 lg:p-8">
        {/* 타이틀 */}
        {slide.title && (
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 text-center">
            {slide.title}
          </h2>
        )}

        {/* 좌우 비교 데이터 */}
        {comparisonData && (
          <div className="flex flex-col md:flex-row gap-4 sm:gap-6 lg:gap-8 w-full max-w-5xl">
            {/* 왼쪽 */}
            <div
              className={`flex-1 rounded-xl p-4 sm:p-6 backdrop-blur-sm ${
                comparisonData.leftColor === 'warm'
                  ? 'bg-jeong-orange/40 border border-jeong-orange/40'
                  : comparisonData.leftColor === 'cold'
                  ? 'bg-neos-blue/40 border border-neos-blue/40'
                  : 'bg-slate-800/60 border border-slate-700'
              }`}
            >
              <h3
                className={`text-lg sm:text-xl font-semibold mb-4 ${
                  comparisonData.leftColor === 'warm'
                    ? 'text-jeong-orange'
                    : comparisonData.leftColor === 'cold'
                    ? 'text-neos-blue'
                    : 'text-white'
                }`}
              >
                {comparisonData.leftTitle}
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                {comparisonData.leftItems.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-sm sm:text-base text-slate-300"
                  >
                    <span className="text-jeong-orange mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 중앙 화살표 (데스크톱) */}
            <div className="hidden md:flex items-center justify-center">
              <div className="text-3xl text-slate-500">⇄</div>
            </div>

            {/* 오른쪽 */}
            <div
              className={`flex-1 rounded-xl p-4 sm:p-6 backdrop-blur-sm ${
                comparisonData.rightColor === 'warm'
                  ? 'bg-jeong-orange/40 border border-jeong-orange/40'
                  : comparisonData.rightColor === 'cold'
                  ? 'bg-neos-blue/40 border border-neos-blue/40'
                  : 'bg-slate-800/60 border border-slate-700'
              }`}
            >
              <h3
                className={`text-lg sm:text-xl font-semibold mb-4 ${
                  comparisonData.rightColor === 'warm'
                    ? 'text-jeong-orange'
                    : comparisonData.rightColor === 'cold'
                    ? 'text-neos-blue'
                    : 'text-white'
                }`}
              >
                {comparisonData.rightTitle}
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                {comparisonData.rightItems.filter(Boolean).map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-sm sm:text-base text-slate-300"
                  >
                    <span className="text-neos-blue mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* 테이블 비교 (tableData 사용) */}
        {tableData && !comparisonData && (
          <div className="w-full max-w-4xl overflow-x-auto">
            <table className="w-full border-collapse bg-black/40 backdrop-blur-sm rounded-lg overflow-hidden">
              <thead>
                <tr>
                  {tableData.headers.map((header, idx) => (
                    <th
                      key={idx}
                      className={`
                        px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-semibold
                        bg-slate-800/60 text-slate-200 border-b border-slate-700
                        ${idx === tableData.highlightColumn ? 'text-jeong-orange' : ''}
                      `}
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
                          px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm
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
      </div>
    </div>
  );
}
