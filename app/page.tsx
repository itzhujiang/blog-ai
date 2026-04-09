import { getLatestArticles, getCategoriesWithCount } from '@/services';

import { LatestArticles, CategoryNav, HeroSection } from './components';

// ISR: 每小时重新验证
export const revalidate = 3600;

/**
 * 首页组件
 */
export default async function Home() {
  const [articles, categories] = await Promise.all([
    getLatestArticles(),
    getCategoriesWithCount(),
  ]);

  return (
    <>
      <HeroSection />
      <LatestArticles articles={articles} />
      <CategoryNav categories={categories} />
    </>
  );
}
