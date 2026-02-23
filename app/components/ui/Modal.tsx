import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '@/utils/utils';

export interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** 是否显示蒙层 */
  visible?: boolean
}

// 蒙层
const Modal = forwardRef<HTMLDivElement, ModalProps>(({
  children, className, visible = false, ...props
}, ref) => {
  return (
    visible ? <div 
      ref={ref}
      className={
        cn(
          'fixed inset-0 bg-[#191510]/80 z-40 flex items-center justify-center p-6 backdrop-blur-sm',
          className
        )
      }
      {...props}
    >
      <div className='flex justify-center items-center'>
        {children}
      </div>
    </div> : null
  );
});

Modal.displayName = 'Modal';

export interface ModalContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

// 容器
const ModalContainer = forwardRef<HTMLDivElement, ModalContainerProps>(({ children, className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn('bg-muji-off-white bg-background-light dark:bg-background-dark w-full max-w-[420px] rounded-xl shadow-xl overflow-hidden relative border border-muji-border border-primary dark:border-primary/20', className)} {...props}>
      {children}
      <div className='h-1.5 w-full bg-primary/20'></div>
    </div>
  );
});

ModalContainer.displayName = 'ModalContainer';
export { Modal, ModalContainer };
