import React, { useEffect, useRef } from 'react';
import { motion, useSpring, useTransform, animate } from 'framer-motion';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  duration = 0.5,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = ''
}) => {
  const nodeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = nodeRef.current;

    if (!node) return;

    // 현재 표시된 값을 가져옴
    const currentText = node.textContent || '0';
    const currentValue = parseFloat(currentText.replace(/[^0-9.-]/g, '')) || 0;

    // 애니메이션 컨트롤
    const controls = animate(currentValue, value, {
      duration,
      ease: 'easeOut',
      onUpdate(latest) {
        // 숫자 포맷팅
        const formatted = decimals > 0
          ? latest.toFixed(decimals)
          : Math.floor(latest).toString();

        // 천 단위 구분자 추가
        const withCommas = formatted.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        // 업데이트
        node.textContent = `${prefix}${withCommas}${suffix}`;
      }
    });

    return () => controls.stop();
  }, [value, duration, decimals, prefix, suffix]);

  // 초기값 설정
  const initialValue = decimals > 0
    ? value.toFixed(decimals)
    : Math.floor(value).toString();
  const withCommas = initialValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return (
    <span ref={nodeRef} className={className}>
      {prefix}{withCommas}{suffix}
    </span>
  );
};

export default AnimatedNumber;
