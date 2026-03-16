/**
 * 分类服务
 */

import { Sequelize } from 'sequelize';

import { getVirtualInt } from './helpers';

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
    const { initAllModels } = await import('@/utils/models');
    const { Category } = await initAllModels();

    const categories = await Category.findAll({
      order: [['name', 'ASC']],
      attributes: [
        'id',
        'name',
        'slug',
        [
          Sequelize.literal(
            '(SELECT COUNT(*) FROM article_categories ac'
            + ' JOIN articles a ON ac.article_id = a.id'
            + ' WHERE ac.category_id = "c".id'
            + ' AND a.status = \'published\''
            + ' AND a.deleted_at IS NULL)'
          ),
          'articleCount',
        ],
      ],
    });

    return categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      articleCount: getVirtualInt(cat.dataValues, 'articleCount'),
    }));
  } catch (error) {
    console.error('获取分类失败:', error);
    return [];
  }
}
