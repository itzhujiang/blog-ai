'use client';

export interface HeaderSearchBarProps {
  className?: string;
}

function SearchIcon() {
  return (
    <svg
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
      />
    </svg>
  );
}

/**
 * Header 搜索栏
 * 使用原生 form 实现渐进增强，Enter 或点击图标提交跳转到搜索页
 */
export function HeaderSearchBar({ className }: HeaderSearchBarProps) {
  return (
    <form action="/search" method="get" className={className}>
      <div className="relative">
        <button
          type="submit"
          className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light/60 hover:text-text-light dark:text-text-dark/60 dark:hover:text-text-dark"
        >
          <SearchIcon />
        </button>
        <input
          type="text"
          name="q"
          placeholder="搜索..."
          className="h-10 w-40 rounded-full border-2 border-primary/50 bg-background-light pl-12 pr-4 py-2 text-sm text-foreground placeholder-text-light/60 transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:bg-background-dark dark:placeholder-text-dark/60"
        />
      </div>
    </form>
  );
}
