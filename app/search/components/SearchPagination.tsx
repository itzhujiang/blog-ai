import Link from 'next/link';

export interface SearchPaginationProps {
  currentPage: number;
  totalPages: number;
  query: string;
  sort: string;
}

/**
 * 构建搜索分页 URL
 */
function buildPageUrl(page: number, query: string, sort: string): string {
  const params = new URLSearchParams();
  params.set('q', query);
  if (page > 1) params.set('page', String(page));
  if (sort !== 'relevance') params.set('sort', sort);
  return `/search?${params.toString()}`;
}

/**
 * 生成页码列表（含省略号）
 */
function getPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | 'ellipsis')[] = [1];

  if (current > 3) {
    pages.push('ellipsis');
  }

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i += 1) {
    pages.push(i);
  }

  if (current < total - 2) {
    pages.push('ellipsis');
  }

  pages.push(total);
  return pages;
}

/**
 * 搜索分页导航
 */
export function SearchPagination({ currentPage, totalPages, query, sort }: SearchPaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);
  const pageItemBase = 'flex size-10 items-center justify-center rounded-full font-bold transition-colors';
  const activeClass = 'bg-[#E9DBCB] text-text-light dark:bg-[#5a472b] dark:text-text-dark';
  const inactiveClass = 'text-text-light/80 hover:bg-primary/20 dark:text-text-dark/80 dark:hover:bg-primary/30';
  const arrowClass = 'flex size-10 items-center justify-center rounded-full text-text-light/60 transition-colors hover:bg-primary/20 dark:text-text-dark/60 dark:hover:bg-primary/30';

  return (
    <div className="flex items-center justify-center gap-2 pt-8">
      {/* 上一页 */}
      {currentPage > 1 ? (
        <Link href={buildPageUrl(currentPage - 1, query, sort)} className={arrowClass}>
          <span className="material-symbols-outlined text-xl">chevron_left</span>
        </Link>
      ) : (
        <span className={`${arrowClass} pointer-events-none opacity-40`}>
          <span className="material-symbols-outlined text-xl">chevron_left</span>
        </span>
      )}

      {/* 页码 */}
      {pages.map((page, idx) =>
        page === 'ellipsis' ? (
          <span key={`ellipsis-${idx}`} className="text-text-light/60 dark:text-text-dark/60">...</span>
        ) : (
          <Link
            key={page}
            href={buildPageUrl(page, query, sort)}
            className={`${pageItemBase} ${page === currentPage ? activeClass : inactiveClass}`}
          >
            {page}
          </Link>
        )
      )}

      {/* 下一页 */}
      {currentPage < totalPages ? (
        <Link href={buildPageUrl(currentPage + 1, query, sort)} className={arrowClass}>
          <span className="material-symbols-outlined text-xl">chevron_right</span>
        </Link>
      ) : (
        <span className={`${arrowClass} pointer-events-none opacity-40`}>
          <span className="material-symbols-outlined text-xl">chevron_right</span>
        </span>
      )}
    </div>
  );
}
