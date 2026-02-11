'use client';

import { useEffect, useState } from 'react';

import type { ArticleStatsData } from '../types';

export interface ArticleStatsProps {
  articleId: number;
}

/**
 * 文章统计信息客户端组件
 * 挂载时 POST 递增阅读量并获取统计数据
 */
export function ArticleStats({ articleId }: ArticleStatsProps) {
  const [stats, setStats] = useState<ArticleStatsData | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/stats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ articleId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && data.viewCount !== undefined) {
          setStats({
            viewCount: data.viewCount,
            readingTime: data.readingTime,
          });
        }
      })
      .catch(() => {});

    return () => { cancelled = true; };
  }, [articleId]);

  const viewCountText = stats ? String(stats.viewCount) : '--';
  const readingTimeText = stats
    ? (stats.readingTime > 0 ? `${stats.readingTime} 分钟阅读` : '< 1 分钟阅读')
    : '-- 分钟阅读';

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-text-light/80 dark:text-text-dark/80">
      <div className="flex items-center gap-1">
        <span className="material-symbols-outlined !text-base">
          visibility
        </span>
        <span>{viewCountText} 阅读</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="material-symbols-outlined !text-base">
          schedule
        </span>
        <span>{readingTimeText}</span>
      </div>
    </div>
  );
}
