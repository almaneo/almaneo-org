import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../../utils';

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const sizeClasses = {
  sm: 'max-w-3xl',
  md: 'max-w-4xl',
  lg: 'max-w-5xl',
  xl: 'max-w-6xl',
  full: 'max-w-full',
};

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ children, size = 'lg', className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(sizeClasses[size], 'mx-auto', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = 'Container';
