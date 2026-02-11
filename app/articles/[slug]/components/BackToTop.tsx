'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * 回到顶部按钮（客户端组件）
 * 滚动超过 300px 时显示
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 z-40
        h-12 w-12 rounded-full
        bg-primary/80 text-white shadow-lg
        flex items-center justify-center
        hover:bg-primary transition-all duration-300
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
      aria-label="回到顶部"
    >
      <span className="material-symbols-outlined">
        keyboard_arrow_up
      </span>
    </button>
  );
}
