/**
 * KindnessTerm Component
 * 친절 모드에서 용어에 도움말 툴팁을 표시하는 컴포넌트
 */

import { useState, useRef, useEffect, type ReactNode } from 'react';
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

export function KindnessTerm({
  termKey,
  children,
  className = '',
  inline = true,
}: KindnessTermProps) {
  const { isKindnessMode } = useKindnessMode();
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<'top' | 'bottom'>('top');
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const term = findTerm(termKey);

  // 툴팁 위치 계산
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceAbove = rect.top;

      // 위 공간이 부족하면 아래에 표시
      setPosition(spaceAbove < 200 ? 'bottom' : 'top');
    }
  }, [isOpen]);

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
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setIsOpen(!isOpen)}
      >
        {displayText}
        <HelpCircle className="kindness-term-icon" strokeWidth={2} />
      </span>

      {/* Tooltip */}
      {isOpen && (
        <div
          ref={tooltipRef}
          className={`kindness-tooltip ${position === 'bottom' ? 'kindness-tooltip-bottom' : 'kindness-tooltip-top'}`}
          role="tooltip"
        >
          {/* Arrow */}
          <div className={`kindness-tooltip-arrow ${position === 'bottom' ? 'kindness-tooltip-arrow-top' : 'kindness-tooltip-arrow-bottom'}`} />

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
