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
        {/* 头像 */}
        <div className="relative size-48 flex-shrink-0 overflow-hidden rounded-full shadow-natural lg:size-56">
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
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            欢迎来到我的空间
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-text-light dark:text-text-dark">
            我是木心，一个热爱科技与设计的创作者。在这里，我分享关于技术探索、
            设计思考和生活感悟的文章，以及 AI 艺术创作的实验。
          </p>
          <div className="flex justify-center gap-4 lg:justify-start">
            <Link href="/about">
              <Button>阅读我的故事</Button>
            </Link>
            <Link href="/articles">
              <Button variant="outline">浏览文章</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
