import { type ReactNode } from 'react';
import { cn } from '../../../utils';

export interface SectionHeaderProps {
  tag?: string;
  tagColor?: 'warm' | 'cold' | 'default';
  title: ReactNode;
  subtitle?: string;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

const tagColors = {
  warm: 'text-warm-orange-300',
  cold: 'text-cold-blue-300',
  default: 'text-text-muted',
};

export function SectionHeader({
  tag,
  tagColor = 'warm',
  title,
  subtitle,
  className,
  align = 'center',
}: SectionHeaderProps) {
  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[align];

  return (
    <div className={cn('section-header', alignClass, className)}>
      {tag && (
        <span className={cn('section-tag', tagColors[tagColor])}>
          {tag}
        </span>
      )}
      <h2 className="section-title">{title}</h2>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </div>
  );
}
