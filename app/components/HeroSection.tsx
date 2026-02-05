import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui';

/**
 * 首页个人简介区域组件
 * 展示博主头像、欢迎语和 CTA 按钮
 */
export function HeroSection() {
  return (
    <section className="py-16 sm:py-24">
      <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
        {/* 头像 - 带白色边框 */}
        <div className="relative size-48 flex-shrink-0 overflow-hidden rounded-full shadow-natural border-4 border-white dark:border-background-dark lg:size-56">
          <Image
            src="/images/avatar.jpg"
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
            一个探索科技、设计、生活及AI创作潜能的个人博客。欢迎来到我这片受&quot;木漏れ日&quot;启发的网络角落。
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
