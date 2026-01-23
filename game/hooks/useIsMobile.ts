'use client';

import { useState, useEffect } from 'react';

/**
 * 모바일 기기 여부를 감지하는 커스텀 훅
 * User Agent를 기반으로 모바일 기기를 판별합니다.
 * 
 * @returns {boolean} isMobile - 모바일 기기 여부
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      setIsMobile(mobile);
    };

    checkMobile();

    // 리사이즈 이벤트에서 재체크 (필요시)
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return isMobile;
}
