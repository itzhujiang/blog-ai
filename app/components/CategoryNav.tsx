import Link from 'next/link';

/**
 * 分类数据接口
 */
export interface CategoryItem {
  id: number;
  name: string;
  slug: string;
  articleCount?: number;
}

export interface CategoryNavProps {
  categories: CategoryItem[];
}

/**
 * 分类导航组件
 * 展示文章分类导航按钮
 */
export function CategoryNav({ categories }: CategoryNavProps) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:pb-24">
      <h2 className="mb-8 text-center text-2xl font-bold tracking-tight text-text-light dark:text-text-dark sm:text-3xl">
        文章分类
      </h2>

      <div className="flex flex-wrap items-center justify-center gap-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/articles?category=${category.slug}`}
            className="cursor-pointer rounded-full border-2 border-primary/50 bg-background-light dark:bg-background-dark px-6 py-2.5 text-sm font-semibold text-text-light dark:text-text-dark shadow-natural transition-all hover:bg-primary hover:text-white dark:hover:bg-primary/80 hover:shadow-natural-hover"
          >
            {category.name}
            {category.articleCount !== undefined && (
              <span className="ml-1.5 text-xs opacity-70">
                ({category.articleCount})
              </span>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
