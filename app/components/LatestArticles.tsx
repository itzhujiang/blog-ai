import Image from 'next/image';
import Link from 'next/link';

import { getThumbnailUrl } from '@/utils/file-url';

/**
 * 文章数据接口
 */
export interface ArticleItem {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  publishedAt: number | null;
  thumbnailUrl: string | null;
  categoryName?: string;
}

export interface LatestArticlesProps {
  articles: ArticleItem[];
}

/**
 * 格式化日期
 */
function formatDate(timestamp: number | string | null): string {
  if (!timestamp) return '';
  const ms = typeof timestamp === 'string' ? parseInt(timestamp, 10) : timestamp;
  if (isNaN(ms)) return '';
  const date = new Date(ms);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}年${month}月${day}日`;
}

/**
 * 最新文章列表组件
 * 横向卡片布局展示文章
 */
export function LatestArticles({ articles }: LatestArticlesProps) {
  if (articles.length === 0) {
    return (
      <section className="py-16">
        <h2 className="mb-8 text-2xl font-bold tracking-tight text-center text-text-light dark:text-text-dark sm:text-3xl">
          最新文章
        </h2>
        <p className="text-center text-text-light/80 dark:text-text-dark/80">
          暂无文章，敬请期待...
        </p>
      </section>
    );
  }

  return (
    <section className="py-16">
      <h2 className="mb-8 text-2xl font-bold tracking-tight text-center text-text-light dark:text-text-dark sm:text-3xl">
        最新文章
      </h2>

      <div className="flex flex-col gap-8">
        {articles.map((article) => (
          <article
            key={article.id}
            className="group relative flex flex-col md:flex-row gap-6 overflow-hidden rounded-xl border-2 border-primary/30 bg-white/40 dark:bg-background-dark/40 p-5 shadow-natural transition-all duration-300 hover:shadow-natural-hover hover:border-primary/60"
          >
            {/* 缩略图 */}
            <div className="relative md:w-1/3 aspect-video md:aspect-auto h-48 md:h-60 rounded-lg overflow-hidden flex-shrink-0">
              {article.thumbnailUrl ? (
                <Image
                  src={getThumbnailUrl(article.thumbnailUrl)}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              ) : (
                <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary">暂无图片</span>
                </div>
              )}
            </div>

            {/* 文章内容 */}
            <div className="flex flex-col justify-center flex-grow gap-3">
              {/* 分类标签 */}
              {article.categoryName && (
                <span className="text-xs font-bold uppercase tracking-wider text-cta-light dark:text-cta-dark">
                  {article.categoryName}
                </span>
              )}

              {/* 标题 */}
              <h3 className="text-xl md:text-2xl font-bold text-text-light dark:text-text-dark group-hover:text-primary transition-colors">
                <Link href={`/articles/${article.slug}`} className="after:absolute after:inset-0 after:content-['']">{article.title}</Link>
              </h3>

              {/* 摘要 */}
              {article.excerpt && (
                <p className="text-sm md:text-base font-normal text-text-light/80 dark:text-text-dark/80 line-clamp-3">
                  {article.excerpt}
                </p>
              )}

              {/* 底部信息 */}
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-primary/10">
                <time className="text-xs font-medium text-text-light/60 dark:text-text-dark/60">
                  {formatDate(article.publishedAt)}
                </time>
                <Link
                  href="/articles"
                  className="relative z-10 text-sm font-bold text-cta-light dark:text-cta-dark flex items-center gap-1 group/link"
                >
                  阅读更多
                  <span className="material-symbols-outlined text-sm transition-transform group-hover/link:translate-x-1">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
