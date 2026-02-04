import Link from 'next/link';

/**
 * 分类数据接口
 */
export interface CategoryItem {
  id: number;
  name: string;
  slug: string;
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
    <section className="py-12">
      <h2 className="mb-8 text-center text-2xl font-bold text-foreground">
        探索分类
      </h2>

      <div className="flex flex-wrap items-center justify-center gap-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/articles?category=${category.slug}`}
            className="rounded-full border-2 border-primary/50 px-5 py-2 text-sm font-medium text-foreground transition-all duration-300 hover:border-primary hover:bg-primary/10"
          >
            {category.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
