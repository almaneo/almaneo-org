'use client';

import { useState, useEffect } from 'react';
import { Box, IconButton } from '@mui/material';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { useIsMobile } from '@/hooks/useIsMobile';

export default function FullscreenButton() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    
    try {
      if (!isFullscreen) {
        // iOS Safari 체크
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        
        if (isIOS) {
          // iOS: 스크롤 숨김 + viewport 조정
          document.body.style.overflow = 'hidden';
          window.scrollTo(0, 1); // 주소창 숨김
          
          // 메타태그 업데이트
          const viewport = document.querySelector('meta[name=viewport]');
          if (viewport) {
            viewport.setAttribute('content', 
              'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover'
            );
          }
          setIsFullscreen(true);
        } else {
          // 일반 모바일
          await document.documentElement.requestFullscreen();
        }
      } else {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        if (isIOS) {
          document.body.style.overflow = '';
          const viewport = document.querySelector('meta[name=viewport]');
          if (viewport) {
            viewport.setAttribute('content', 
              'width=device-width, initial-scale=1'
            );
          }
          setIsFullscreen(false);
        } else {
          await document.exitFullscreen();
        }
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  };

  // 모바일에만 표시
  if (!isMobile) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        right: 16,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 10000, // DEV 버튼보다 위로
      }}
    >
      <IconButton
        onClick={toggleFullscreen}
        sx={{
          bgcolor: 'rgba(0,0,0,0.6)',
          color: 'white',
          width: 56,
          height: 56,
          backdropFilter: 'blur(10px)',
          '&:hover': {
            bgcolor: 'rgba(0,0,0,0.8)',
          },
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        }}
      >
        {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
      </IconButton>
    </Box>
  );
}
