'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

import type { CategoryTag } from '../types';

export interface CategoryFilterProps {
  categories: CategoryTag[];
  currentCategory: string | null;
}

/**
 * 分类筛选组件
 * 点击分类标签更新 URL 参数，重置页码
 */
export function CategoryFilter({ categories, currentCategory }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCategoryClick = useCallback((slug: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (slug) {
      params.set('category', slug);
    } else {
      params.delete('category');
    }
    // 切换分类时重置页码
    params.delete('page');

    router.push(`/articles?${params.toString()}`);
  }, [router, searchParams]);

  const baseClass = 'cursor-pointer rounded-full border px-3 py-1 text-sm transition-colors';
  const activeClass = 'border-primary bg-primary/20 font-semibold text-text-light dark:bg-primary/30 dark:text-text-dark';
  const inactiveClass = 'border-primary/30 bg-background-light text-text-light/80 hover:border-primary/50 hover:bg-primary/10 dark:bg-background-dark dark:text-text-dark/80 dark:hover:bg-primary/20';

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm">
      <button
        className={`${baseClass} ${!currentCategory ? activeClass : inactiveClass}`}
        onClick={() => handleCategoryClick(null)}
      >
        全部
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          className={`${baseClass} ${currentCategory === cat.slug ? activeClass : inactiveClass}`}
          onClick={() => handleCategoryClick(cat.slug)}
        >
          {cat.name}{cat.articleCount !== undefined ? ` (${cat.articleCount})` : ''}
        </button>
      ))}
    </div>
  );
}
