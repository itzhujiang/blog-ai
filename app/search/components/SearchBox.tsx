'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

export interface SearchBoxProps {
  initialQuery: string;
}

/**
 * 搜索页大搜索框
 * 客户端组件，支持输入、清除、提交跳转
 */
export function SearchBox({ initialQuery }: SearchBoxProps) {
  const [value, setValue] = useState(initialQuery);
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <div className="relative flex-1">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="输入关键词搜索文章..."
          className="h-14 w-full rounded-full border-2 border-wood-border bg-off-white pl-6 pr-12 text-base text-foreground placeholder-text-light/60 transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:bg-background-dark dark:placeholder-text-dark/60"
        />
        {/* 清除按钮 */}
        {value && (
          <button
            type="button"
            onClick={() => setValue('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-text-light/60 hover:text-text-light dark:text-text-dark/60 dark:hover:text-text-dark"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        )}
      </div>
      <button
        type="submit"
        className="rounded-full bg-wood-light px-8 font-bold text-wood-dark transition-colors hover:bg-primary/40 dark:bg-wood-dark dark:text-text-dark dark:hover:bg-primary/30"
      >
        搜索
      </button>
    </form>
  );
}
