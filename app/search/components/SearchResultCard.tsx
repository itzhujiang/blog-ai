import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { getThumbnailUrl } from '@/utils/file-url';
import { formatDate } from '@/utils/utils';

import type { SearchResultItem } from '../types';


export interface SearchResultCardProps {
  article: SearchResultItem;
  keyword: string;
  viewCount?: number;
}

/**
 * 转义正则特殊字符
 */
function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * 关键词高亮：将文本中匹配的关键词用 <mark> 包裹
 */
function highlightKeyword(text: string, keyword: string): ReactNode[] {
  if (!keyword || !text) return [text];
  const escaped = escapeRegExp(keyword);
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === keyword.toLowerCase()
      ? <mark key={i} className="bg-highlight-bg px-0.5 dark:bg-primary/20">{part}</mark>
      : part
  );
}


/**
 * 搜索结果卡片
 * 水平布局，左侧缩略图，右侧标题+摘要+元信息，关键词高亮
 */
export function SearchResultCard({ article, keyword, viewCount }: SearchResultCardProps) {
  const firstCategory = article.categories[0];

  return (
    <article className="group flex flex-col gap-4 overflow-hidden rounded-xl border-2 border-wood-border/50 bg-off-white p-6 shadow-natural transition-shadow duration-300 hover:shadow-natural-hover dark:bg-background-dark sm:flex-row sm:gap-6">
      {/* 缩略图 */}
      <Link
        href={`/articles/${article.slug}`}
        className="block w-full shrink-0 overflow-hidden rounded-lg sm:w-52"
      >
        <div className="relative aspect-[16/10] w-full sm:h-full">
          {article.thumbnailUrl ? (
            <Image
              src={getThumbnailUrl(article.thumbnailUrl)}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, 208px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-primary/20">
              <span className="text-primary">暂无图片</span>
            </div>
          )}
        </div>
      </Link>

      {/* 文章信息 */}
      <div className="flex flex-1 flex-col justify-between py-1">
        <div>
          {/* 分类标签 + 日期 */}
          <div className="mb-2 flex items-center gap-2">
            {firstCategory && (
              <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-text-light/90 dark:bg-primary/20 dark:text-text-dark/90">
                {firstCategory.name}
              </span>
            )}
            <span className="text-xs text-text-light/60 dark:text-text-dark/60">
              {formatDate(article.publishedAt)}
            </span>
          </div>

          {/* 标题（高亮） */}
          <Link
            href={`/articles/${article.slug}`}
            className="text-xl font-bold text-wood-dark transition-colors hover:text-cta-light dark:text-text-dark dark:hover:text-cta-dark"
          >
            {highlightKeyword(article.title, keyword)}
          </Link>

          {/* 摘要（高亮） */}
          {article.excerpt && (
            <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-text-light/80 dark:text-text-dark/80">
              {highlightKeyword(article.excerpt, keyword)}
            </p>
          )}
        </div>

        {/* 底部：评论数 + 阅读更多 */}
        <div className="mt-4 flex items-center gap-4 text-xs font-medium text-text-light/60 dark:text-text-dark/60">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined !text-sm">mode_comment</span>
            <span>{article.commentCount} 评论</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined !text-sm">visibility</span>
            <span>{viewCount ?? '--'} 阅读</span>
          </div>
          <Link
            href={`/articles/${article.slug}`}
            className="ml-auto font-bold text-cta-light hover:underline dark:text-cta-dark"
          >
            阅读更多 →
          </Link>
        </div>
      </div>
    </article>
  );
}
