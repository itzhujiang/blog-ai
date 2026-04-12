import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getArticleBySlug } from '@/services';
import { getServerFileUrl } from '@/utils/file-url';

import {
  Breadcrumb,
  ArticleHeader,
  ArticleStats,
  ArticleContent,
  ArticleFooter,
  BackToTop,
  CommentSection,
} from './components';
import type { BreadcrumbItem } from './types';

// ISR: 每小时重新验证
export const revalidate = 3600;

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

/**
 * 动态生成 SEO 元数据
 */
export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return { title: '文章未找到 - 暖木博客' };
  }

  return {
    title: `${article.title} - 暖木博客`,
    description: article.excerpt || `阅读文章：${article.title}`,
    openGraph: {
      title: article.title,
      description: article.excerpt || undefined,
      images: article.thumbnailUrl
        ? [getServerFileUrl(article.thumbnailUrl)]
        : undefined,
    },
  };
}

/**
 * 文章详情页
 */
export default async function ArticleDetailPage({
  params,
}: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  // 构建面包屑数据
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: '首页', href: '/' },
    { label: '文章', href: '/articles' },
  ];

  const firstCategory = article.categories[0];
  if (firstCategory) {
    breadcrumbItems.push({
      label: firstCategory.name,
      href: `/articles?category=${firstCategory.slug}`,
    });
  }

  breadcrumbItems.push({ label: article.title });

  return (
    <main className="flex-grow">
      <article className="py-8 sm:py-12">
        <div className="mx-auto max-w-3xl px-4">
          {/* 面包屑导航 */}
          <Breadcrumb items={breadcrumbItems} />

          {/* 文章头部 */}
          <div className="mt-8">
            <ArticleHeader article={article} />
          </div>

          {/* 统计信息（客户端实时获取） */}
          <div className="mt-4">
            <ArticleStats articleId={article.id} />
          </div>

          {/* 文章内容 */}
          <div className="mt-12">
            <ArticleContent content={article.content} />
          </div>

          {/* 文章底部 */}
          <ArticleFooter
            categories={article.categories}
            title={article.title}
            slug={article.slug}
          />

          {/* 评论区 */}
          <CommentSection articleId={article.id} />
        </div>
      </article>

      {/* 回到顶部 */}
      <BackToTop />
    </main>
  );
}
