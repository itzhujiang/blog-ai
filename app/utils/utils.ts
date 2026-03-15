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
/** 消息类型对应的图标和样式配置 */
const MESSAGE_CONFIG = {
  success: {
    icon: 'check_circle',
    bg: 'bg-[#f0f7ed] dark:bg-[#2a3325]',
    border: 'border-[#7A8B6E]/40',
    text: 'text-[#5a6b4e] dark:text-[#a0b599]',
    iconColor: 'text-[#7A8B6E]',
  },
  error: {
    icon: 'error',
    bg: 'bg-[#fdf0ed] dark:bg-[#332420]',
    border: 'border-[#c0705a]/40',
    text: 'text-[#9a4a32] dark:text-[#e0a090]',
    iconColor: 'text-[#c0705a]',
  },
  info: {
    icon: 'info',
    bg: 'bg-[#fdf5ec] dark:bg-[#2a2218]',
    border: 'border-[#D4A574]/40',
    text: 'text-[#8B6F47] dark:text-[#e0d5c6]',
    iconColor: 'text-[#D4A574]',
  },
} as const;

/**
 * 显示消息提示
 * @param options 消息提示选项
 */
export const showMessage = (options: ShowMessageOptions) => {
  const { type = 'info', message, duration = 2000, container = document.body } = options;
  const config = MESSAGE_CONFIG[type];

  const messageElement = document.createElement('div');
  messageElement.className = cn(
    'fixed top-5 left-1/2 z-50 flex items-center gap-2',
    'px-5 py-3 rounded-lg border',
    'shadow-[0_4px_10px_rgba(139,111,71,0.1)]',
    'transition-all duration-300 ease-in-out',
    config.bg, config.border, config.text
  );
  messageElement.style.transform = 'translateX(-50%) translateY(-20px)';
  messageElement.style.opacity = '0';

  // 图标
  const iconSpan = document.createElement('span');
  iconSpan.className = cn('material-symbols-outlined text-[20px]', config.iconColor);
  iconSpan.textContent = config.icon;

  // 文本
  const textSpan = document.createElement('span');
  textSpan.className = 'text-sm font-medium';
  textSpan.textContent = message;

  messageElement.appendChild(iconSpan);
  messageElement.appendChild(textSpan);
  container.appendChild(messageElement);

  // 触发重排
  requestAnimationFrame(() => {
    messageElement.style.transform = 'translateX(-50%) translateY(0)';
    messageElement.style.opacity = '1';
  });

  setTimeout(() => {
    messageElement.style.transform = 'translateX(-50%) translateY(-20px)';
    messageElement.style.opacity = '0';
    messageElement.addEventListener('transitionend', () => {
      messageElement.remove();
    }, { once: true });
  }, duration);
};

/**
 * 格式化日期时间
 * @param timestamp 时间戳（毫秒）或时间戳字符串
 * @param format 格式字符串，支持：
 *   - 'YYYY年MM月DD日' (默认)
 *   - 'YYYY-MM-DD'
 *   - 'YYYY-MM-DD HH:mm:ss'
 *   - 'YYYY.MM.DD'
 * @returns 格式化后的日期字符串
 */
export const formatDate = (timestamp: number | string | null, format = 'YYYY年MM月DD日'): string => {
  if (!timestamp) return '';

  const ms = typeof timestamp === 'string'
    ? parseInt(timestamp, 10)
    : timestamp;

  if (isNaN(ms)) return '';

  const date = new Date(ms);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  // 补零函数
  const pad = (num: number): string => num.toString().padStart(2, '0');

  // 替换格式字符串中的占位符
  return format
    .replace('YYYY', year.toString())
    .replace('MM', pad(month))
    .replace('DD', pad(day))
    .replace('HH', pad(hours))
    .replace('mm', pad(minutes))
    .replace('ss', pad(seconds));
};
