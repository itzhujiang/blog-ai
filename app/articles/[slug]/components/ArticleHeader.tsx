import Image from 'next/image';
import Link from 'next/link';

import { getThumbnailUrl } from '@/utils/file-url';
import { formatDate } from '@/utils/utils';

import type { ArticleDetail } from '../types';

export interface ArticleHeaderProps {
  article: ArticleDetail;
}


/**
 * 文章头部组件：头图 + 标题 + 元信息（服务端组件）
 */
export function ArticleHeader({ article }: ArticleHeaderProps) {
  const firstCategory = article.categories[0];

  return (
    <header className="flex flex-col gap-8">
      {/* 头图 */}
      {article.thumbnailUrl && (
        <div className="aspect-video w-full overflow-hidden rounded-xl shadow-natural">
          <div className="relative h-full w-full">
            <Image
              src={getThumbnailUrl(article.thumbnailUrl)}
              alt={article.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
        </div>
      )}

      {/* 标题 */}
      <h1 className="text-4xl font-extrabold tracking-tight text-center text-[#5a472b] dark:text-text-dark sm:text-5xl">
        {article.title}
      </h1>

      {/* 元信息 */}
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-text-light/80 dark:text-text-dark/80">
        <div className="flex items-center gap-1">
          <span className="material-symbols-outlined !text-base">
            calendar_month
          </span>
          <span>{formatDate(article.publishedAt)}</span>
        </div>

        <div className="flex items-center gap-1">
          <span className="material-symbols-outlined !text-base">
            person
          </span>
          <span>{article.authorName}</span>
        </div>

        {firstCategory && (
          <Link
            href={`/articles?category=${firstCategory.slug}`}
            className="flex items-center gap-1 hover:text-cta-light dark:hover:text-cta-dark transition-colors"
          >
            <span className="material-symbols-outlined !text-base">
              folder
            </span>
            <span>{firstCategory.name}</span>
          </Link>
        )}

        <div className="flex items-center gap-1">
          <span className="material-symbols-outlined !text-base">
            mode_comment
          </span>
          <span>{article.commentCount} 评论</span>
        </div>
      </div>
    </header>
  );
}
