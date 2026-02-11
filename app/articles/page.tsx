import type { Metadata } from 'next';

import { getArticles, getCategoriesWithCount } from '@/services';

import { ArticleListClient, CategoryFilter, SortOptions, Pagination } from './components';
import type { SortType } from './types';

// ISR: 每小时重新验证
export const revalidate = 3600;

const PAGE_SIZE = 6;

interface ArticlesPageProps {
  searchParams: Promise<{
    page?: string;
    category?: string;
    sort?: string;
  }>;
}

/**
 * 动态 SEO 元数据
 * 按分类筛选时显示分类名称
 */
export async function generateMetadata(
  { searchParams }: ArticlesPageProps,
): Promise<Metadata> {
  const params = await searchParams;
  const categorySlug = params.category || null;

  if (categorySlug) {
    const { initAllModels } = await import('@/utils/models');
    const { Category } = await initAllModels();
    const category = await Category.findOne({
      where: { slug: categorySlug },
    });

    if (category) {
      return {
        title: `${category.name} - 文章 - 暖木博客`,
        description:
          `浏览暖木博客中「${category.name}」分类下的所有文章`,
      };
    }
  }

  return {
    title: '所有文章 - 暖木博客',
    description:
      '在这里，我记录了关于技术学习、生活故事和AI创作的思考与发现。',
  };
}

/**
 * 文章列表页
 */
export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || '1', 10) || 1);
  const categorySlug = params.category || null;
  const sort: SortType = params.sort === 'comments' ? 'comments' : 'latest';

  const [{ articles, total }, categories] = await Promise.all([
    getArticles(page, categorySlug, sort),
    getCategoriesWithCount(),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <main className="flex-grow">
      {/* 页面标题 */}
      <section className="py-12 sm:py-16">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-text-light dark:text-text-dark sm:text-5xl">
            所有文章
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-text-light/80 dark:text-text-dark/80 sm:text-lg">
            在这里，我记录了关于技术学习、生活故事和AI创作的思考与发现。希望你能找到感兴趣的内容。
          </p>
        </div>
      </section>

      {/* 文章列表区域 */}
      <section className="pb-16 sm:pb-24">
        <div className="flex flex-col gap-12">
          {/* 筛选和排序 */}
          <div className="flex flex-col gap-8">
            <CategoryFilter
              categories={categories}
              currentCategory={categorySlug}
            />
            <SortOptions currentSort={sort} />
          </div>

          {/* 文章卡片列表 */}
          {articles.length > 0 ? (
            <ArticleListClient articles={articles} />
          ) : (
            <div className="py-16 text-center">
              <p className="text-text-light/80 dark:text-text-dark/80">
                暂无文章，敬请期待...
              </p>
            </div>
          )}

          {/* 分页 */}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            category={categorySlug}
            sort={sort}
          />
        </div>
      </section>
    </main>
  );
}
