import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils';

const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        cold: 'btn-cold',
        ghost: 'btn-ghost',
        outline: 'btn-outline',
      },
      size: {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
      },
      glow: {
        true: '',
        false: '',
      },
      heartbeat: {
        true: 'animate-heartbeat',
        false: '',
      },
    },
    compoundVariants: [
      {
        variant: 'primary',
        glow: true,
        className: 'glow-orange',
      },
      {
        variant: 'cold',
        glow: true,
        className: 'glow-blue',
      },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      glow: false,
      heartbeat: false,
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      glow,
      heartbeat,
      icon,
      iconPosition = 'left',
      loading,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={cn(
          buttonVariants({ variant, size, glow, heartbeat }),
          'hover:scale-105 active:scale-95',
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            {icon && iconPosition === 'left' && <span>{icon}</span>}
            {children}
            {icon && iconPosition === 'right' && <span>{icon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
