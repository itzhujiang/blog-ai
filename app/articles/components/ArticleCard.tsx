import Image from 'next/image';
import Link from 'next/link';

import { getThumbnailUrl } from '@/utils/file-url';
import { formatDate } from '@/utils/utils';

import type { ArticleListItem } from '../types';

export interface ArticleCardProps {
  article: ArticleListItem;
  viewCount?: number;
}

/**
 * 文章卡片组件
 * 水平布局，左侧缩略图，右侧文章信息
 */
export function ArticleCard({ article, viewCount }: ArticleCardProps) {
  const firstCategory = article.categories[0];

  return (
    <article className="group relative flex flex-col md:flex-row gap-6 overflow-hidden rounded-xl border border-primary/10 bg-background-light p-4 shadow-natural transition-shadow duration-300 hover:shadow-natural-hover dark:bg-background-dark">
      {/* 缩略图 */}
      <Link
        href={`/articles/${article.slug}`}
        className="block w-full md:w-72 shrink-0 overflow-hidden rounded-lg relative z-10"
      >
        <div className="relative aspect-[16/10] md:h-full w-full">
          {article.thumbnailUrl ? (
            <Image
              src={getThumbnailUrl(article.thumbnailUrl)}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 288px"
            />
          ) : (
            <div className="w-full h-full bg-primary/20 flex items-center justify-center">
              <span className="text-primary">暂无图片</span>
            </div>
          )}
        </div>
      </Link>

      {/* 文章信息 */}
      <div className="flex flex-1 flex-col justify-between py-1">
        <div>
          {/* 分类标签 + 日期 */}
          <div className="flex items-center gap-2 mb-2">
            {firstCategory && (
              <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-text-light/90 dark:bg-primary/20 dark:text-text-dark/90">
                {firstCategory.name}
              </span>
            )}
            <span className="text-xs text-text-light/60 dark:text-text-dark/60">
              {formatDate(article.publishedAt)}
            </span>
          </div>

          {/* 标题 */}
          <Link
            href={`/articles/${article.slug}`}
            className="text-xl font-bold text-[#5a472b] transition-colors hover:text-cta-light dark:text-text-dark dark:hover:text-cta-dark after:absolute after:inset-0 after:content-['']"
          >
            {article.title}
          </Link>

          {/* 摘要 */}
          {article.excerpt && (
            <p className="mt-3 line-clamp-2 text-sm font-normal leading-relaxed text-text-light/80 dark:text-text-dark/80">
              {article.excerpt}
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
        </div>
      </div>
    </article>
  );
}
