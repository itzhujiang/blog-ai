/**
 * 搜索服务 (Prisma 版本)
 */

import { defaultLogger } from '@/utils/logger';
import { prisma } from '@/utils/prisma';

import type { SearchResultItem } from '../search/types';

export type SearchSortType = 'relevance' | 'latest' | 'comments';

/**
 * 搜索文章（模糊匹配标题和摘要）
 */
export async function searchArticles(
  query: string,
  page: number,
  sort: SearchSortType,
  pageSize = 10,
): Promise<{ articles: SearchResultItem[]; total: number }> {
  try {
    const offset = (page - 1) * pageSize;

    const where = {
      status: 'published' as const,
      deleted_at: 0,
      OR: [
        { title: { contains: query, mode: 'insensitive' as const } },
        { excerpt: { contains: query, mode: 'insensitive' as const } },
      ],
    };

    const [articles, total] = await Promise.all([
      prisma.articles.findMany({
        where,
        orderBy: sort === 'latest' ? { published_at: 'desc' } : undefined,
        skip: offset,
        take: pageSize,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          published_at: true,
          article_categories: {
            include: {
              categories: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                }
              }
            }
          },
          article_media: {
            take: 1,
            where: { usage_type: 'thumbnail' },
            include: {
              media_files: {
                select: { file_url: true }
              }
            }
          },
          comments: {
            where: { status: 'approved' },
            select: { id: true }
          }
        },
      }),
      prisma.articles.count({ where }),
    ]);

    let results: SearchResultItem[] = articles.map((article) => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt || null,
      publishedAt: article.published_at ? Number(article.published_at) : null,
      thumbnailUrl: article.article_media[0]?.media_files?.file_url || null,
      categories: article.article_categories.map(ac => ({
        id: ac.categories.id,
        name: ac.categories.name,
        slug: ac.categories.slug,
      })),
      commentCount: article.comments.length,
    }));

    // 按评论数排序
    if (sort === 'comments') {
      results.sort((a, b) => b.commentCount - a.commentCount);
    }

    return { articles: results, total };
  } catch (error) {
    defaultLogger.error('搜索失败:', error);
    return { articles: [], total: 0 };
  }
}

export interface LogSearchParams {
  query: string;
  resultsCount: number;
  ipAddress?: string | null;
  userAgent?: string | null;
}

/**
 * 记录搜索日志（fire-and-forget）
 */
export function logSearch(params: LogSearchParams): void {
  prisma.search_logs.create({
    data: {
      query: params.query,
      results_count: params.resultsCount,
      ip_address: params.ipAddress || null,
      user_agent: params.userAgent || null,
      created_at: BigInt(Date.now()),
    },
  }).catch(() => {
    // 忽略错误
  });
}
