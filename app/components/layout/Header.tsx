import Link from 'next/link';

import { getSiteConfigSSR } from '@/utils/site-config';
import { cn } from '@/utils/utils';

import { HeaderSearchBar } from './HeaderSearchBar';
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

export async function Header({ className }: HeaderProps) {
  const siteConfig = await getSiteConfigSSR();

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
          {siteConfig.siteTitle}
        </h2>
      </Link>

      {/* Navigation */}
      <Navigation />

      {/* Search */}
      <HeaderSearchBar />
    </header>
  );
}
