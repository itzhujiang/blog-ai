import { LatestArticles, CategoryNav, HeroSection } from './components';
import type { ArticleItem, CategoryItem } from './components';

// ISR: 每小时重新验证
export const revalidate = 3600;

/**
 * 获取最新文章
 */
async function getLatestArticles(): Promise<ArticleItem[]> {
  try {
    const { initAllModels } = await import('@/utils/models');
    const { Article, ArticleCategory, Category } = await initAllModels();

    const articles = await Article.findAll({
      where: { status: 'published' },
      order: [['publishedAt', 'DESC']],
      limit: 6,
      attributes: ['id', 'title', 'slug', 'excerpt', 'publishedAt', 'thumbnailUrl'],
      include: [
        {
          model: ArticleCategory,
          as: 'articleCategories',
          include: [
            {
              model: Category,
              as: 'category',
              attributes: ['name'],
            },
          ],
        },
      ],
    });

    return articles.map((article) => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      publishedAt: article.publishedAt,
      thumbnailUrl: article.thumbnailUrl,
      // 获取第一个分类名称
      categoryName: article.articleCategories?.[0]?.category?.name || undefined,
    }));
  } catch (error) {
    console.error('获取文章失败:', error);
    return [];
  }
}

/**
 * 获取所有分类
 */
async function getCategories(): Promise<CategoryItem[]> {
  try {
    const { initAllModels } = await import('@/utils/models');
    const { Category } = await initAllModels();

    const categories = await Category.findAll({
      order: [['name', 'ASC']],
      attributes: ['id', 'name', 'slug'],
    });

    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
    }));
  } catch (error) {
    console.error('获取分类失败:', error);
    return [];
  }
}

/**
 * 首页组件
 */
export default async function Home() {
  const [articles, categories] = await Promise.all([
    getLatestArticles(),
    getCategories(),
  ]);

  return (
    <>
      <HeroSection />
      <LatestArticles articles={articles} />
      <CategoryNav categories={categories} />
    </>
  );
}
