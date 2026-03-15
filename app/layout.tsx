import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import React from 'react';

import AiChat from '@/components/AiChat';
import { Header, Footer } from '@/components/layout';
import PhoneDialog from '@/components/PhoneDialog';
import { getSiteConfigSSR } from '@/utils/site-config';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

/**
 * 动态生成页面元数据
 * 从 site_settings 表获取网站标题和描述
 */
export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = await getSiteConfigSSR();
  return {
    title: siteConfig.siteTitle,
    description: siteConfig.siteDescription,
    other: {
      'google-adsense-account': 'ca-pub-',
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
          rel="stylesheet"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="flex h-screen w-full flex-col">
          <div className="flex flex-col items-center">
            <div className="w-full max-w-5xl px-6 sm:px-8">
              <Header />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <div className="flex flex-col items-center">
              <div className="w-full max-w-5xl px-6 sm:px-8">
                <main>
                  {children}
                </main>
                <Footer />
              </div>
            </div>
          </div>
          <div>
            <AiChat></AiChat>
            <PhoneDialog></PhoneDialog>
          </div>
        </div>
      </body>
    </html>
  );
}
