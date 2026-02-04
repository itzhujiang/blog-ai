import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import React from 'react';

import { Header, Footer } from '@/components/layout';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: '暖木博客 - 暖木与阳光',
  description: '一个探索科技、设计、生活及AI创作潜能的个人博客',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="relative flex min-h-screen w-full flex-col">
          <div className="layout-container flex h-full grow flex-col items-center">
            <div className="layout-content-container flex w-full max-w-5xl flex-col px-6 sm:px-8">
              <Header />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
