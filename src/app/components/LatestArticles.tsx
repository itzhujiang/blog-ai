import Image from 'next/image';
import Link from 'next/link';

import { Card, CardContent } from '@/components/ui';

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
}

export interface LatestArticlesProps {
  articles: ArticleItem[];
}

/**
 * 格式化日期
 */
function formatDate(timestamp: number | null): string {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * 最新文章列表组件
 * 展示最新 6 篇文章卡片
 */
export function LatestArticles({ articles }: LatestArticlesProps) {
  if (articles.length === 0) {
    return (
      <section className="py-12">
        <h2 className="mb-8 text-2xl font-bold text-foreground">最新文章</h2>
        <p className="text-center text-text-light dark:text-text-dark">
          暂无文章，敬请期待...
        </p>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">最新文章</h2>
        <Link
          href="/articles"
          className="text-sm text-primary hover:underline"
        >
          查看全部 →
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <Link key={article.id} href={`/articles/${article.slug}`}>
            <Card hoverable className="h-full">
              {/* 缩略图 */}
              {article.thumbnailUrl && (
                <div className="relative -mx-4 -mt-4 mb-4 aspect-video overflow-hidden rounded-t-lg">
                  <Image
                    src={article.thumbnailUrl}
                    alt={article.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              )}

              <CardContent className="flex flex-col gap-2">
                {/* 标题 */}
                <h3 className="line-clamp-2 text-lg font-semibold text-foreground">
                  {article.title}
                </h3>

                {/* 摘要 */}
                {article.excerpt && (
                  <p className="line-clamp-2 text-sm text-text-light dark:text-text-dark">
                    {article.excerpt}
                  </p>
                )}

                {/* 发布日期 */}
                {article.publishedAt && (
                  <time className="mt-2 text-xs text-text-light/70 dark:text-text-dark/70">
                    {formatDate(article.publishedAt)}
                  </time>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
