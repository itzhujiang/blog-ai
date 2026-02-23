import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 合并 Tailwind CSS 类名的工具函数
 * 结合 clsx 的条件类名处理和 tailwind-merge 的智能合并
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ShowMessageOptions {
  /** 类型 */
  type?: 'success' | 'error' | 'info';
  /** 信息 */
  message: string;
  /** 显示持续时间，单位毫秒，默认为 2000ms */
  duration?: number;
  /** 信息显示容器 */
  container?: HTMLElement; // 可选的容器元素，默认为 document.body
}
/**
 * 显示消息提示
 * @param options 消息提示选项
 */
export const showMessage = (options: ShowMessageOptions) => {
  const { type = 'info', message, duration = 2000, container = document.body } = options;

  const messageElement = document.createElement('div');
  messageElement.textContent = message;
  // transform: translate(-50%,-50%) translateY(15px);
  messageElement.className = cn(
    'fixed top-4 left-1/2  px-4 py-2 rounded shadow-lg text-white z-50 transition-opacity duration-300',
    type === 'success' && 'bg-green-500',
    type === 'error' && 'bg-red-500',
    type === 'info' && 'bg-blue-500'
  );

  container.appendChild(messageElement);
  messageElement.clientHeight;
  messageElement.style.opacity = '1';
  messageElement.style.transform = 'translate(-50%, -50%)';
  setTimeout(() => {
    messageElement.style.opacity = '0';
    messageElement.style.transform = 'translate(-50%,-50%) translateY(-15px)';
    messageElement.addEventListener('transitionend', () => {
      messageElement.remove();
    }, {
      once: true
    });
  }, duration);
};
