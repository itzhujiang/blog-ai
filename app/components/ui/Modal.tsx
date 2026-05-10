import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '@/utils/utils';

import { Button } from './Button';

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

export interface ModalHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  onClose?: () => void;
}

const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(({ title, onClose, className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn('px-3 border-primary dark:border-primary/20 flex items-center relative h-16 overflow-hidden', className)} {...props}>
      <div className='w-8'></div>
      <h3 className='text-lg font-semibold text-muji-taupe dark:text-primary/80 text-center flex-1 pt-6'>{title}</h3>
      <button
        className='w-8 text-muji-taupe hover:text-muji-brown dark:text-primary/60 dark:hover:text-primary transition-colors p-1 cursor-pointer '
        onClick={onClose}
      >
        <span className="material-symbols-outlined text-[24px]">close</span>
      </button>
    </div>
  );
});

ModalHeader.displayName = 'ModalHeader';

export interface ModalFooterProps extends HTMLAttributes<HTMLDivElement> {
  onClose?: () => void;
  onConfirm?: () => void;
}

const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(({  onClose, onConfirm, className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn('px-4 pb-3 border-primary dark:border-primary/20 flex justify-end gap-2', className)} {...props}>
      <Button variant='outline' size='sm' onClick={onClose}>
        取消
      </Button>
      <Button size='sm' onClick={onConfirm}>
        确定
      </Button>
    </div>
  );
});

ModalFooter.displayName = 'ModalFooter';

export interface ModalBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;

}

const ModalBody = forwardRef<HTMLDivElement, ModalBodyProps>(({ children, className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn('px-6 py-3 text-sm text-muji-taupe dark:text-text-dark leading-7', className)} {...props}>
      {children}
    </div>
  );
});

ModalBody.displayName = 'ModalBody';

export { Modal, ModalContainer, ModalHeader, ModalFooter, ModalBody };
