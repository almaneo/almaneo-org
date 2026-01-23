import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../../utils';

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  overlay?: 'warm' | 'cold' | 'warm-bottom' | 'none';
  size?: 'default' | 'small';
}

export function Section({
  children,
  overlay = 'none',
  size = 'default',
  className,
  ...props
}: SectionProps) {
  const overlayClass = {
    warm: 'section-overlay-warm',
    cold: 'section-overlay-cold',
    'warm-bottom': 'section-overlay-warm-bottom',
    none: '',
  }[overlay];

  const sizeClass = size === 'small' ? 'section-sm' : 'section';

  return (
    <section className={cn(sizeClass, className)} {...props}>
      {overlay !== 'none' && <div className={overlayClass} />}
      <div className="relative z-10">{children}</div>
    </section>
  );
}
