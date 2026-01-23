import { useEffect } from 'react';

interface KindnessRippleProps {
  x: number;
  y: number;
  onComplete: () => void;
}

export const KindnessRipple = ({ x, y, onComplete }: KindnessRippleProps) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 1000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className="fixed pointer-events-none rounded-full animate-ripple"
      style={{
        left: x - 50,
        top: y - 50,
        width: 100,
        height: 100,
        background: 'radial-gradient(circle, rgba(255,107,0,0.5) 0%, transparent 70%)',
      }}
    />
  );
};

export default KindnessRipple;
