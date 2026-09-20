/**
 * 共享查询工具函数 (Prisma 版本)
 */

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
