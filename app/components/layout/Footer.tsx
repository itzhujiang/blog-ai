import Link from 'next/link';

import { getSiteConfigSSR } from '@/utils/site-config';
import { cn } from '@/utils/utils';

export interface FooterProps {
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

function FacebookIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
      <path
        clipRule="evenodd"
        d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
        fillRule="evenodd"
      />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
      <path
        clipRule="evenodd"
        d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.012-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.345 2.525c.636-.247 1.363-.416 2.427-.465C9.793 2.013 10.147 2 12.315 2h.001zm-1.04 2.265c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.86.399-1.249.789-.389.389-.607.782-.789 1.249-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807s.011 2.784.058 3.807c.045.975.207 1.504.344 1.857.182.466.399.86.789 1.249.389.389.782.607 1.249.789.353.137.882.3 1.857.344 1.023.047 1.351.058 3.807.058s2.784-.011 3.807-.058c.975-.045 1.504-.207 1.857-.344.467-.182.86-.399 1.249-.789.389-.389.607-.782.789-1.249.137-.353.3-.882-.344-1.857.047-1.023.058-1.351.058-3.807s-.011-2.784-.058-3.807c-.045-.975-.207-1.504-.344-1.857a3.097 3.097 0 00-.789-1.249 3.097 3.097 0 00-1.249-.789c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 100 10.27 5.135 5.135 0 000-10.27zm0 8.468a3.333 3.333 0 110-6.666 3.333 3.333 0 010 6.666zm5.338-9.87a1.262 1.262 0 100 2.524 1.262 1.262 0 000-2.524z"
        fillRule="evenodd"
      />
    </svg>
  );
}

const footerLinks = [
  { label: '关于', href: '/about' },
  { label: '文章', href: '/articles' },
  { label: '隐私政策', href: '/privacy' },
];

const socialLinks = [
  { icon: FacebookIcon, href: '#', label: 'Facebook' },
  { icon: TwitterIcon, href: '#', label: 'Twitter' },
  { icon: InstagramIcon, href: '#', label: 'Instagram' },
];

export async function Footer({ className }: FooterProps) {
  const siteConfig = await getSiteConfigSSR();

  return (
    <footer className={cn('border-t border-primary/30 py-12', className)}>
      <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-2 md:text-left">
        {/* Left Column: Logo and Social */}
        <div className="flex flex-col items-center gap-4 md:items-start">
          <div className="flex items-center gap-4">
            <LogoIcon />
            <h2 className="text-xl font-bold tracking-tight text-text-light dark:text-text-dark">
              {siteConfig.siteTitle}
            </h2>
          </div>
          <div className="flex gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className={cn(
                  'text-text-light/80 dark:text-text-dark/80',
                  'transition-colors',
                  'hover:text-cta-light dark:hover:text-cta-dark'
                )}
              >
                <social.icon />
              </a>
            ))}
          </div>
        </div>

        {/* Right Column: Links */}
        <div className="flex flex-col items-center gap-4 md:items-start">
          <h3 className="font-bold text-text-light dark:text-text-dark">链接</h3>
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm text-text-light/80 dark:text-text-dark/80',
                'transition-colors',
                'hover:text-cta-light dark:hover:text-cta-dark'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Copyright */}
      <div className={cn(
        'mt-12 border-t border-primary/30 pt-8',
        'text-center text-sm text-text-light/60 dark:text-text-dark/60'
      )}>
        <p>{siteConfig.footerCopyright}</p>
      </div>
    </footer>
  );
}
