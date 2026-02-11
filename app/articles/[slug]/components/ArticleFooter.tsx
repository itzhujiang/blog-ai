import Link from 'next/link';

import type { ArticleCategory } from '../types';

export interface ArticleFooterProps {
  categories: ArticleCategory[];
  title: string;
  slug: string;
}

/**
 * 文章底部组件：分类标签 + 分享按钮（服务端组件）
 */
export function ArticleFooter({
  categories,
  title,
  slug,
}: ArticleFooterProps) {
  const articleUrl = encodeURIComponent(
    `${process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'}/articles/${slug}`
  );
  const encodedTitle = encodeURIComponent(title);

  return (
    <footer className="border-t border-primary/20 pt-8 mt-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* 分类标签 */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/articles?category=${cat.slug}`}
              className="rounded-full bg-primary/20 px-3 py-1 text-sm
                text-text-light dark:text-text-dark
                hover:bg-primary/30 transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* 分享按钮 */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-text-light/60 dark:text-text-dark/60">
            分享：
          </span>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${articleUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-light/60 hover:text-cta-light dark:text-text-dark/60 dark:hover:text-cta-dark transition-colors"
            aria-label="分享到 Twitter"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${articleUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-light/60 hover:text-cta-light dark:text-text-dark/60 dark:hover:text-cta-dark transition-colors"
            aria-label="分享到 Facebook"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
