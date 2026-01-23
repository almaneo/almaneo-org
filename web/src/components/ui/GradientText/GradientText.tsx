import { type ReactNode } from 'react';
import { cn } from '../../../utils';

export interface GradientTextProps {
  children: ReactNode;
  variant?: 'default' | 'cold' | 'warm' | 'jeong';
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'p';
  className?: string;
}

const variantClasses = {
  default: 'gradient-text',
  cold: 'gradient-text-cold',
  warm: 'gradient-text-warm',
  jeong: 'gradient-text-jeong',
};

export function GradientText({
  children,
  variant = 'default',
  as: Component = 'span',
  className,
}: GradientTextProps) {
  return (
    <Component className={cn(variantClasses[variant], className)}>
      {children}
    </Component>
  );
}
