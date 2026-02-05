'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/utils/utils';

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: '首页', href: '/' },
  { label: '关于', href: '/about' },
  { label: '文章', href: '/articles' },
  { label: 'AI作品展示', href: '/ai-gallery' },
];

export interface NavigationProps {
  className?: string;
}

export function Navigation({ className }: NavigationProps) {
  const pathname = usePathname();

  return (
    <nav className={cn('hidden items-center gap-8 md:flex', className)}>
      {navItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'text-sm font-medium transition-colors',
              'hover:text-cta-light dark:hover:text-cta-dark',
              isActive && 'text-cta-light dark:text-cta-dark'
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
