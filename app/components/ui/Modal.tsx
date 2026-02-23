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
          'fixed left-0 top-0 w-full h-full bg-black/40',
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

export { Modal };
