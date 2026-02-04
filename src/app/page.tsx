import {
  HeroSection,
  LatestArticles,
  CategoryNav,
  AiGalleryPreview,
} from './components';
import type { ArticleItem, CategoryItem, GalleryItem } from './components';

// ISR: 每小时重新验证
export const revalidate = 3600;

/**
 * 获取最新文章
 */
async function getLatestArticles(): Promise<ArticleItem[]> {
  try {
    const { initAllModels } = await import('@/utils/models');
    const { Article } = await initAllModels();

    const articles = await Article.findAll({
      where: { status: 'published' },
      order: [['publishedAt', 'DESC']],
      limit: 6,
      attributes: ['id', 'title', 'slug', 'excerpt', 'publishedAt', 'thumbnailUrl'],
    });

    return articles.map((article) => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      publishedAt: article.publishedAt,
      thumbnailUrl: article.thumbnailUrl,
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
 * AI 画廊静态数据（暂时使用占位数据）
 */
const staticGalleryItems: GalleryItem[] = [
  { id: 1, imageUrl: '/images/gallery/ai-art-1.jpg', alt: 'AI 艺术作品 1' },
  { id: 2, imageUrl: '/images/gallery/ai-art-2.jpg', alt: 'AI 艺术作品 2' },
  { id: 3, imageUrl: '/images/gallery/ai-art-3.jpg', alt: 'AI 艺术作品 3' },
  { id: 4, imageUrl: '/images/gallery/ai-art-4.jpg', alt: 'AI 艺术作品 4' },
  { id: 5, imageUrl: '/images/gallery/ai-art-5.jpg', alt: 'AI 艺术作品 5' },
];

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
      <AiGalleryPreview items={staticGalleryItems} />
    </>
  );
}
