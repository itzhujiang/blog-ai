/**
 * 分类服务 (Prisma 版本)
 */
import { defaultLogger } from '@/utils/logger';
import { prisma } from '@/utils/prisma';

export interface CategoryWithCount {
  id: number;
  name: string;
  slug: string;
  articleCount: number;
}

/**
 * 获取所有分类及其已发布文章数量
 */
export async function getCategoriesWithCount(): Promise<CategoryWithCount[]> {
  try {
    const categories = await prisma.categories.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

    // 并行获取每个分类的文章数
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat: { id: number; name: string; slug: string }) => {
        const count = await prisma.article_categories.count({
          where: {
            category_id: cat.id,
            articles: {
              status: 'published',
              deleted_at: 0
            }
          }
        });

        return {
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          articleCount: count,
        };
      })
    );

    return categoriesWithCount;
  } catch (error) {
    defaultLogger.error('获取分类失败:', error);
    return [];
  }
}
