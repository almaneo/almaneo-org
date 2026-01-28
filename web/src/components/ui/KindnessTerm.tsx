/**
 * KindnessTerm Component
 * 친절 모드에서 용어에 도움말 툴팁을 표시하는 컴포넌트
 */

import { useState, useRef, useEffect, useCallback, type ReactNode } from 'react';
import { HelpCircle } from 'lucide-react';
import { useKindnessMode } from '../../contexts/KindnessModeContext';
import { findTerm, type GlossaryTerm } from '../../data/glossary';

interface KindnessTermProps {
  /** 용어 키 (glossary.ts의 key) */
  termKey: string;
  /** 표시할 텍스트 (없으면 glossary의 term 사용) */
  children?: ReactNode;
  /** 추가 클래스 */
  className?: string;
  /** 인라인 스타일 유지 여부 (기본: true) */
  inline?: boolean;
}

interface TooltipPosition {
  vertical: 'top' | 'bottom';
  horizontal: 'left' | 'center' | 'right';
}

export function KindnessTerm({
  termKey,
  children,
  className = '',
  inline = true,
}: KindnessTermProps) {
  const { isKindnessMode } = useKindnessMode();
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<TooltipPosition>({ vertical: 'top', horizontal: 'center' });
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const term = findTerm(termKey);

  // 툴팁 위치 계산 (상하좌우 경계 체크)
  const calculatePosition = useCallback(() => {
    if (!triggerRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipWidth = 280; // 툴팁 너비
    const margin = 12; // 화면 가장자리 여백
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // 상하 위치 결정
    const spaceAbove = triggerRect.top;
    const spaceBelow = viewportHeight - triggerRect.bottom;
    const vertical = spaceAbove < 200 && spaceBelow > spaceAbove ? 'bottom' : 'top';

    // 좌우 위치 결정
    const triggerCenter = triggerRect.left + triggerRect.width / 2;
    const tooltipHalfWidth = tooltipWidth / 2;

    let horizontal: 'left' | 'center' | 'right' = 'center';
    let leftOffset = 0;

    // 왼쪽으로 벗어나는 경우
    if (triggerCenter - tooltipHalfWidth < margin) {
      horizontal = 'left';
      leftOffset = margin - triggerRect.left;
    }
    // 오른쪽으로 벗어나는 경우
    else if (triggerCenter + tooltipHalfWidth > viewportWidth - margin) {
      horizontal = 'right';
      leftOffset = viewportWidth - margin - tooltipWidth - triggerRect.left;
    }
    // 가운데 정렬 가능
    else {
      horizontal = 'center';
      leftOffset = triggerRect.width / 2 - tooltipHalfWidth;
    }

    setPosition({ vertical, horizontal });
    setTooltipStyle({
      left: horizontal === 'center' ? '50%' : `${leftOffset}px`,
      transform: horizontal === 'center' ? 'translateX(-50%)' : 'none',
    });
  }, []);

  // 툴팁 열릴 때 위치 계산
  useEffect(() => {
    if (isOpen) {
      calculatePosition();
      // 리사이즈 시 재계산
      window.addEventListener('resize', calculatePosition);
      return () => window.removeEventListener('resize', calculatePosition);
    }
  }, [isOpen, calculatePosition]);

  // 외부 클릭 시 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // 친절 모드가 꺼져있거나 용어를 찾을 수 없으면 일반 텍스트로 표시
  if (!isKindnessMode || !term) {
    return <span className={className}>{children || term?.term || termKey}</span>;
  }

  const displayText = children || term.term;

  return (
    <span
      ref={triggerRef}
      className={`kindness-term-wrapper ${inline ? 'inline' : 'inline-block'} ${className}`}
    >
      <span
        className="kindness-term"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.stopPropagation();
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
      >
        {displayText}
        <HelpCircle className="kindness-term-icon" strokeWidth={2} />
      </span>

      {/* Tooltip */}
      {isOpen && (
        <div
          ref={tooltipRef}
          className={`kindness-tooltip ${position.vertical === 'bottom' ? 'kindness-tooltip-bottom' : 'kindness-tooltip-top'}`}
          style={tooltipStyle}
          role="tooltip"
        >
          {/* Arrow - 좌우 위치에 따라 화살표 위치 조정 */}
          <div
            className={`kindness-tooltip-arrow ${position.vertical === 'bottom' ? 'kindness-tooltip-arrow-top' : 'kindness-tooltip-arrow-bottom'}`}
            style={{
              left: position.horizontal === 'center' ? '50%' :
                    position.horizontal === 'left' ? '20px' : 'auto',
              right: position.horizontal === 'right' ? '20px' : 'auto',
              transform: position.horizontal === 'center' ? 'translateX(-50%)' : 'none',
            }}
          />

          {/* Content */}
          <div className="kindness-tooltip-content">
            {/* Header */}
            <div className="kindness-tooltip-header">
              <span className="kindness-tooltip-term">{term.term}</span>
              <span className={`kindness-tooltip-category kindness-tooltip-category-${term.category}`}>
                {getCategoryLabel(term.category)}
              </span>
            </div>

            {/* Simple explanation */}
            <p className="kindness-tooltip-simple">{term.simple}</p>

            {/* Detailed explanation (if exists) */}
            {term.detailed && (
              <p className="kindness-tooltip-detailed">{term.detailed}</p>
            )}

            {/* Example (if exists) */}
            {term.example && (
              <div className="kindness-tooltip-example">
                <span className="kindness-tooltip-example-label">예시</span>
                <span>{term.example}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </span>
  );
}

// 카테고리 라벨
function getCategoryLabel(category: GlossaryTerm['category']): string {
  const labels: Record<GlossaryTerm['category'], string> = {
    blockchain: '블록체인',
    token: '토큰',
    defi: 'DeFi',
    nft: 'NFT',
    governance: '거버넌스',
    neos: 'NEOS',
  };
  return labels[category];
}

export default KindnessTerm;
