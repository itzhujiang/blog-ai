import Link from 'next/link';

import { Input } from '@/components/ui';
import { cn } from '@/utils/utils';

import { Navigation } from './Navigation';

export interface HeaderProps {
  className?: string;
}

function LogoIcon() {
  return (
    <svg
      className="size-6 text-cta-light dark:text-cta-dark"
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  );
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

export function Header({ className }: HeaderProps) {
  return (
    <header
      className={cn(
        'flex items-center justify-between whitespace-nowrap',
        'border-b border-primary/30 py-4',
        className
      )}
    >
      {/* Logo and Title */}
      <Link href="/" className="flex items-center gap-4">
        <LogoIcon />
        <h2 className="text-xl font-bold tracking-tight text-text-light dark:text-text-dark">
          暖木博客
        </h2>
      </Link>

      {/* Navigation */}
      <Navigation />

      {/* Search */}
      <Input
        type="text"
        placeholder="搜索..."
        className="w-40"
        icon={<SearchIcon />}
      />
    </header>
  );
}
