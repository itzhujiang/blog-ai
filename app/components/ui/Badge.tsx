import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '@/utils/utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline';
  children: ReactNode;
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium',
          'transition-colors duration-200',
          {
            'bg-primary/20 text-primary': variant === 'default',
            'border border-primary/50 bg-transparent text-primary':
              variant === 'outline',
          },
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };
