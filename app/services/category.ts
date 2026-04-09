/**
 * 分类服务
 */

import { QueryTypes } from 'sequelize';

export interface CategoryWithCount {
  id: number;
  name: string;
  slug: string;
  articleCount: number;
}

interface CategoryCountRow {
  categoryId: number;
  articleCount: number;
}

/**
 * 获取所有分类及其已发布文章数量
 */
export async function getCategoriesWithCount(): Promise<CategoryWithCount[]> {
  try {
    const { initAllModels, sequelize } = await import('@/utils/models');
    const { Category } = await initAllModels();

    const [categories, countRows] = await Promise.all([
      Category.findAll({
        order: [['name', 'ASC']],
        attributes: ['id', 'name', 'slug'],
      }),
      sequelize.query<CategoryCountRow>(
        `
          SELECT
            ac.category_id AS "categoryId",
            COUNT(*)::int AS "articleCount"
          FROM article_categories ac
          INNER JOIN articles a ON ac.article_id = a.id
          WHERE a.status = 'published'
            AND a.deleted_at IS NULL
          GROUP BY ac.category_id
        `,
        { type: QueryTypes.SELECT }
      ),
    ]);

    const articleCountMap = new Map<number, number>(
      countRows.map((row) => [row.categoryId, row.articleCount])
    );

    return categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      articleCount: articleCountMap.get(cat.id) || 0,
    }));
  } catch (error) {
    console.error('获取分类失败:', error);
    return [];
  }
}
