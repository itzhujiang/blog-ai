'use client';

import { useEffect, useState } from 'react';

import { http } from '@/utils/http';

import type { SearchResultItem } from '../types';

import { SearchResultCard } from './SearchResultCard';

export interface SearchResultsClientProps {
  articles: SearchResultItem[];
  keyword: string;
}

/**
 * 搜索结果客户端包装组件
 * 批量获取统计数据后渲染 SearchResultCard
 */
export function SearchResultsClient({
  articles,
  keyword,
}: SearchResultsClientProps) {
  const [statsMap, setStatsMap] = useState<
    Record<number, { viewCount: number }>
  >({});

  useEffect(() => {
    if (articles.length === 0) return;

    let cancelled = false;
    const ids = articles.map((a) => a.id).join(',');

    http.get<{ stats?: Record<string, { viewCount: number }> }>('/stats', { params: { ids } })
      .then((data) => {
        if (!cancelled && data.stats) {
          const map: Record<number, { viewCount: number }> = {};
          for (const [id, stat] of Object.entries(data.stats)) {
            const s = stat as { viewCount: number };
            map[Number(id)] = { viewCount: s.viewCount };
          }
          setStatsMap(map);
        }
      })
      .catch(() => {});

    return () => { cancelled = true; };
  }, [articles]);

  return (
    <div className="flex flex-col gap-6">
      {articles.map((article) => (
        <SearchResultCard
          key={article.id}
          article={article}
          keyword={keyword}
          viewCount={statsMap[article.id]?.viewCount}
        />
      ))}
    </div>
  );
}
