import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui';
import { getThumbnailUrl } from '@/utils/file-url';
import { getSiteConfigSSR } from '@/utils/site-config';

import defaultImg from '../assets/default-img.png';

/**
 * 首页个人简介区域组件
 * 展示博主头像、欢迎语和 CTA 按钮
 *
 * 头像图片路径从后端服务 http://localhost:8089 获取
 */
export async function HeroSection() {
  // 从数据库获取网站配置（SSR）
  const siteConfig = await getSiteConfigSSR();
  const avatarUrl = siteConfig.avatarPath
    ? getThumbnailUrl(siteConfig.avatarPath)
    : defaultImg;

  return (
    <section className="py-16 sm:py-24">
      <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
        {/* 头像 - 带白色边框 */}
        <div className="relative size-48 flex-shrink-0 overflow-hidden rounded-full shadow-natural border-4 border-white dark:border-background-dark lg:size-56">
          <Image
            src={avatarUrl}
            alt="博主头像"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 192px, 224px"
          />
        </div>

        {/* 文字内容 */}
        <div className="flex flex-col gap-6 text-center lg:text-left">
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-text-light dark:text-text-dark sm:text-5xl">
            欢迎来到我的空间
          </h1>
          <p className="text-base font-normal leading-relaxed text-text-light/80 dark:text-text-dark/80 sm:text-lg">
            {siteConfig.siteDescription}
          </p>
          <div className="flex justify-center lg:justify-start">
            <Link href="/about">
              <Button>阅读我的故事</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
