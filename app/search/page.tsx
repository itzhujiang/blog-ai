import type { Metadata } from 'next';
import Link from 'next/link';

import { searchArticles, logSearch } from '@/services';

import { SearchBox, SearchResultsClient, SearchPagination } from './components';
import type { SearchSortType } from './types';

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 10;

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    page?: string;
    sort?: string;
  }>;
}

/**
 * 动态 SEO 元数据
 */
export async function generateMetadata(
  { searchParams }: SearchPageProps,
): Promise<Metadata> {
  const params = await searchParams;
  const query = (params.q || '').trim();

  if (query) {
    return {
      title: `"${query}" 的搜索结果 - 暖木博客`,
      description: `搜索暖木博客中与"${query}"相关的文章`,
    };
  }

  return {
    title: '搜索 - 暖木博客',
    description: '搜索暖木博客中的文章',
  };
}

/**
 * 构建排序链接 URL
 */
function buildSortUrl(query: string, sort: string): string {
  const params = new URLSearchParams();
  params.set('q', query);
  if (sort !== 'relevance') params.set('sort', sort);
  return `/search?${params.toString()}`;
}

/**
 * 搜索结果页
 */
export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = (params.q || '').trim().slice(0, 100);
  const page = Math.max(1, parseInt(params.page || '1', 10) || 1);
  const sort: SearchSortType =
    params.sort === 'latest' ? 'latest'
      : params.sort === 'comments' ? 'comments'
        : 'relevance';

  // 无关键词：显示提示
  if (!query) {
    return (
      <main className="flex-grow">
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-2xl">
            <SearchBox initialQuery="" />
            <div className="mt-16 text-center">
              <span className="material-symbols-outlined text-6xl text-text-light/30 dark:text-text-dark/30">
                search
              </span>
              <p className="mt-4 text-lg text-text-light/80 dark:text-text-dark/80">
                请输入关键词搜索文章
              </p>
              <p className="mt-2 text-sm text-text-light/60 dark:text-text-dark/60">
                支持搜索文章标题和摘要内容
              </p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const { articles, total } = await searchArticles(query, page, sort);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  // 搜索日志：fire-and-forget（页面级搜索不含 IP/UA）
  logSearch({ query, resultsCount: total });

  const sortOptions: { value: SearchSortType; label: string }[] = [
    { value: 'relevance', label: '综合排序' },
    { value: 'latest', label: '最新发布' },
    { value: 'comments', label: '最多评论' },
  ];

  return (
    <main className="flex-grow">
      <section className="py-12 sm:py-16">
        <div className="flex flex-col gap-8">
          {/* 搜索框 */}
          <div className="mx-auto w-full max-w-2xl">
            <SearchBox initialQuery={query} />
          </div>

          {/* 结果统计 + 排序 */}
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <p className="text-sm text-text-light/80 dark:text-text-dark/80">
              找到 <span className="font-bold text-text-light dark:text-text-dark">{total}</span> 个与
              &ldquo;<span className="font-bold text-primary">{query}</span>&rdquo;相关的结果
            </p>
            <div className="flex items-center gap-2">
              {sortOptions.map((opt) => (
                <Link
                  key={opt.value}
                  href={buildSortUrl(query, opt.value)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                    sort === opt.value
                      ? 'bg-wood-light text-wood-dark dark:bg-wood-dark dark:text-text-dark'
                      : 'text-text-light/70 hover:bg-primary/10 dark:text-text-dark/70 dark:hover:bg-primary/20'
                  }`}
                >
                  {opt.label}
                </Link>
              ))}
            </div>
          </div>

          {/* 搜索结果列表 */}
          {articles.length > 0 ? (
            <SearchResultsClient articles={articles} keyword={query} />
          ) : (
            <div className="py-16 text-center">
              <span className="material-symbols-outlined text-6xl text-text-light/30 dark:text-text-dark/30">
                search_off
              </span>
              <p className="mt-4 text-lg text-text-light/80 dark:text-text-dark/80">
                未找到与 &ldquo;{query}&rdquo; 相关的文章
              </p>
              <p className="mt-2 text-sm text-text-light/60 dark:text-text-dark/60">
                试试其他关键词，或使用更简短的搜索词
              </p>
            </div>
          )}

          {/* 分页 */}
          <SearchPagination
            currentPage={page}
            totalPages={totalPages}
            query={query}
            sort={sort}
          />
        </div>
      </section>
    </main>
  );
}
