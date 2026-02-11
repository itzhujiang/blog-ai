'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

import type { SortType } from '../types';

export interface SortOptionsProps {
  currentSort: SortType;
}

/**
 * 排序选项组件
 * 支持「最新发布」和「评论最多」两种排序
 */
export function SortOptions({ currentSort }: SortOptionsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortClick = useCallback((sort: SortType) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', sort);
    // 切换排序时重置页码
    params.delete('page');
    router.push(`/articles?${params.toString()}`);
  }, [router, searchParams]);

  const baseClass = 'cursor-pointer rounded-full px-4 py-2 font-semibold transition-colors';
  const activeClass = 'bg-primary/20 text-text-light dark:bg-primary/30 dark:text-text-dark';
  const inactiveClass = 'text-text-light/80 hover:bg-primary/20 dark:text-text-dark/80 dark:hover:bg-primary/30';

  return (
    <div className="flex items-center justify-end gap-4 text-sm">
      <span className="text-text-light/80 dark:text-text-dark/80">排序:</span>
      <div className="flex gap-2">
        <button
          className={`${baseClass} ${currentSort === 'latest' ? activeClass : inactiveClass}`}
          onClick={() => handleSortClick('latest')}
        >
          最新发布
        </button>
        <button
          className={`${baseClass} ${currentSort === 'comments' ? activeClass : inactiveClass}`}
          onClick={() => handleSortClick('comments')}
        >
          评论最多
        </button>
      </div>
    </div>
  );
}
