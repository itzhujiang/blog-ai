'use client';

import Image from 'next/image';
import { forwardRef, type HTMLAttributes, useState } from 'react';

import { cn } from '@/utils/utils';

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
};

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt = '', fallback, size = 'md', ...props }, ref) => {
    const [imageError, setImageError] = useState(false);

    const showFallback = !src || imageError;

    return (
      <div
        ref={ref}
        className={cn(
          'relative overflow-hidden rounded-full',
          'bg-primary/20 text-primary',
          'flex items-center justify-center font-medium',
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {showFallback ? (
          <span>{fallback || alt?.charAt(0)?.toUpperCase() || '?'}</span>
        ) : (
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

export { Avatar };
