import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils';

const glassCardVariants = cva(
  // Base glass styles
  'glass rounded-3xl transition-all duration-300',
  {
    variants: {
      padding: {
        none: 'p-0',
        sm: 'p-3 sm:p-4',
        md: 'p-4 sm:p-5 md:p-6',
        lg: 'p-4 sm:p-6 md:p-8',
        xl: 'p-5 sm:p-7 md:p-10',
      },
      temperature: {
        neutral: '',
        warm: 'card-warm',
        cold: 'card-cold',
        success: 'card-success',
      },
      hover: {
        true: 'card-hover',
        false: '',
      },
      border: {
        none: 'border-0',
        default: '',
        warm: 'border-warm',
        cold: 'border-cold',
        success: 'border-success',
      },
    },
    defaultVariants: {
      padding: 'lg',
      temperature: 'neutral',
      hover: false,
      border: 'default',
    },
  }
);

export interface GlassCardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glassCardVariants> {
  children: ReactNode;
  as?: 'div' | 'article' | 'section';
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      className,
      padding,
      temperature,
      hover,
      border,
      children,
      as: Component = 'div',
      ...props
    },
    ref
  ) => {
    return (
      <Component
        className={cn(
          glassCardVariants({ padding, temperature, hover, border }),
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

GlassCard.displayName = 'GlassCard';

export { GlassCard, glassCardVariants };
