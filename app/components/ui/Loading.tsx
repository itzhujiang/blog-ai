import { type HTMLAttributes } from 'react';

import { cn } from '@/utils/utils';

export interface LoadingProps extends HTMLAttributes<HTMLDivElement> {
  /** 动画类型 */
  variant?: 'spinner' | 'dots' | 'pulse' | 'bars';
  /** 尺寸 */
  size?: 'sm' | 'md' | 'lg';
  /** 加载文本 */
  text?: string;
  /** 是否全屏遮罩 */
  fullscreen?: boolean;
  /** 自定义颜色 */
  color?: string;
}

const Loading = ({
  className,
  variant = 'spinner',
  size = 'md',
  text,
  fullscreen = false,
  color,
  ...props
}: LoadingProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const dotSizeClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2.5 h-2.5',
    lg: 'w-3.5 h-3.5',
  };

  const barSizeClasses = {
    sm: 'w-1 h-3',
    md: 'w-1.5 h-5',
    lg: 'w-2 h-7',
  };

  const colorClass = color || 'border-primary';

  // Spinner 动画
  const renderSpinner = () => (
    <div
      className={cn(
        sizeClasses[size],
        'border-4 border-t-transparent rounded-full animate-spin',
        colorClass
      )}
    />
  );

  // Dots 动画
  const renderDots = () => (
    <div className="flex items-center gap-1.5">
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className={cn(
            dotSizeClasses[size],
            'rounded-full bg-primary animate-bounce',
            color && `bg-[${color}]`
          )}
          style={{
            animationDelay: `${index * 0.15}s`,
            animationDuration: '0.6s',
          }}
        />
      ))}
    </div>
  );

  // Pulse 动画
  const renderPulse = () => (
    <div
      className={cn(
        sizeClasses[size],
        'rounded-full bg-primary animate-pulse',
        color && `bg-[${color}]`
      )}
    />
  );

  // Bars 动画
  const renderBars = () => (
    <div className="flex items-center gap-1">
      {[0, 1, 2, 3].map((index) => (
        <div
          key={index}
          className={cn(
            barSizeClasses[size],
            'bg-primary rounded-sm animate-pulse',
            color && `bg-[${color}]`
          )}
          style={{
            animationDelay: `${index * 0.1}s`,
            animationDuration: '0.8s',
          }}
        />
      ))}
    </div>
  );

  const renderAnimation = () => {
    switch (variant) {
      case 'spinner':
        return renderSpinner();
      case 'dots':
        return renderDots();
      case 'pulse':
        return renderPulse();
      case 'bars':
        return renderBars();
      default:
        return renderSpinner();
    }
  };

  const content = (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3',
        className
      )}
      {...props}
    >
      {renderAnimation()}
      {text && (
        <p
          className={cn(
            'text-text-light dark:text-text-dark font-medium',
            textSizeClasses[size]
          )}
        >
          {text}
        </p>
      )}
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
};

Loading.displayName = 'Loading';

export { Loading };
