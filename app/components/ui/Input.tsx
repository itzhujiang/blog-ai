import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';

import { cn } from '@/utils/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, ...props }, ref) => {
    if (icon) {
      return (
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light/60 dark:text-text-dark/60 flex items-center justify-center">
            {icon}
          </div>
          <input
            ref={ref}
            className={cn(
              'h-10 w-full rounded-full border-2 border-primary/50',
              'bg-background-light dark:bg-background-dark',
              'pl-12 pr-4 py-2 text-sm',
              'text-foreground',
              'placeholder-text-light/60 dark:placeholder-text-dark/60',
              'focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary',
              'transition-colors duration-200',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              className
            )}
            {...props}
          />
        </div>
      );
    }

    return (
      <input
        ref={ref}
        className={cn(
          'h-10 w-full rounded-full border-2 border-primary/50',
          'bg-background-light dark:bg-background-dark',
          'px-4 py-2 text-sm',
          'text-foreground',
          'placeholder-text-light/60 dark:placeholder-text-dark/60',
          'focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary',
          'transition-colors duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };
