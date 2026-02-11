/**
 * 共享 SQL 片段和映射工具
 */

import { Sequelize } from 'sequelize';

/**
 * 评论数 SQL 子查询属性
 * 用于在文章查询中附加已审核评论数
 */
export function commentCountAttribute(): [
  ReturnType<typeof Sequelize.literal>,
  string,
] {
  return [
    Sequelize.literal(
      '(SELECT COUNT(*) FROM comments'
      + ' WHERE comments.article_id = "Article".id'
      + ' AND comments.status = \'approved\')'
    ),
    'commentCount',
  ];
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
