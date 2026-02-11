import Link from 'next/link';

import type { BreadcrumbItem } from '../types';

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

/**
 * 面包屑导航组件（服务端组件）
 */
export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm text-text-light/80 dark:text-text-dark/80">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li
              key={item.label}
              className="flex items-center"
              {...(isLast ? { 'aria-current': 'page' as const } : {})}
            >
              {index > 0 && (
                <span className="material-symbols-outlined !text-base mr-2">
                  chevron_right
                </span>
              )}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="hover:text-cta-light dark:hover:text-cta-dark transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="truncate max-w-[200px]">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
