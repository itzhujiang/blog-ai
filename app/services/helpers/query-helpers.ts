/**
 * 共享 SQL 片段和映射工具
 */

import { Op, Sequelize } from 'sequelize';

import type { Comment } from '../../utils/models/comment';

/**
 * 批量获取文章的已审核评论数
 */
export async function getApprovedCommentCountMap(
  CommentModel: typeof Comment,
  articleIds: number[],
): Promise<Record<number, number>> {
  if (articleIds.length === 0) {
    return {};
  }

  const rows = await CommentModel.findAll({
    attributes: [
      'articleId',
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'commentCount'],
    ],
    where: {
      articleId: { [Op.in]: articleIds },
      status: 'approved',
    },
    group: ['articleId'],
  });

  const countMap: Record<number, number> = {};

  for (const row of rows) {
    const articleId = parseInt(String(row.get('articleId')), 10);
    const commentCount = parseInt(String(row.get('commentCount')), 10);
    countMap[articleId] = commentCount;
  }

  return countMap;
}

/**
 * 安全提取虚拟字段整数值
 * SQL 子查询返回的虚拟字段不在模型属性中，需要从 dataValues 中提取
 */
export function getVirtualInt(
  dataValues: unknown,
  fieldName: string,
): number {
  const record = dataValues as Record<string, unknown>;
  return parseInt(String(record[fieldName] ?? 0), 10);
}

/**
 * 从文章-分类关联中提取分类数据
 */
export function extractCategories(
  articleCategories: Array<{
    category?: { id: number; name: string; slug: string } | null;
  }> | undefined,
): Array<{ id: number; name: string; slug: string }> {
  return (articleCategories || [])
    .filter((ac) => ac.category)
    .map((ac) => ({
      id: ac.category!.id,
      name: ac.category!.name,
      slug: ac.category!.slug,
    }));
}

/**
 * 从文章-媒体关联中提取缩略图 URL
 */
export function extractThumbnailUrl(
  articleMedias: Array<{
    media?: { fileUrl: string } | null;
  }> | undefined,
): string | null {
  return articleMedias?.[0]?.media?.fileUrl || null;
}

/**
 * 转义 SQL LIKE 通配符
 */
export function escapeLikePattern(str: string): string {
  return str.replace(/[\\%_]/g, '\\$&');
}
