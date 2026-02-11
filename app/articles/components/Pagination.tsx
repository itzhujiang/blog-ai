import Link from 'next/link';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  category: string | null;
  sort: string;
}

/**
 * 构建分页链接的 URL
 */
function buildPageUrl(page: number, category: string | null, sort: string): string {
  const params = new URLSearchParams();
  if (page > 1) params.set('page', String(page));
  if (category) params.set('category', category);
  if (sort !== 'latest') params.set('sort', sort);
  const qs = params.toString();
  return qs ? `/articles?${qs}` : '/articles';
}

/**
 * 生成页码列表（含省略号）
 * 规则：首页、末页、当前页±1，中间用省略号
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
 * 分页导航组件
 * 使用 next/link 实现服务端渲染友好的分页
 */
export function Pagination({ currentPage, totalPages, category, sort }: PaginationProps) {
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
        <Link href={buildPageUrl(currentPage - 1, category, sort)} className={arrowClass}>
          <span className="material-symbols-outlined text-xl">chevron_left</span>
        </Link>
      ) : (
        <span className={`${arrowClass} opacity-40 pointer-events-none`}>
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
            href={buildPageUrl(page, category, sort)}
            className={`${pageItemBase} ${page === currentPage ? activeClass : inactiveClass}`}
          >
            {page}
          </Link>
        )
      )}

      {/* 下一页 */}
      {currentPage < totalPages ? (
        <Link href={buildPageUrl(currentPage + 1, category, sort)} className={arrowClass}>
          <span className="material-symbols-outlined text-xl">chevron_right</span>
        </Link>
      ) : (
        <span className={`${arrowClass} opacity-40 pointer-events-none`}>
          <span className="material-symbols-outlined text-xl">chevron_right</span>
        </span>
      )}
    </div>
  );
}
