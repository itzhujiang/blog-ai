/**
 * 搜索服务
 */

import { Op } from 'sequelize';

import { defaultLogger } from '@/utils/logger';

import type { SearchResultItem } from '../search/types';


import {
  getApprovedCommentCountMap,
  extractCategories,
  extractThumbnailUrl,
  escapeLikePattern,
} from './helpers';

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
    const { initAllModels } = await import('@/utils/models');
    const {
      Article, ArticleCategory, Category,
      ArticleMedia, MediaFile, Comment,
    } = await initAllModels();

    const escaped = escapeLikePattern(query);
    const likePattern = `%${escaped}%`;

    const { count, rows } = await Article.findAndCountAll({
      where: {
        status: 'published',
        [Op.or]: [
          { title: { [Op.iLike]: likePattern } },
          { excerpt: { [Op.iLike]: likePattern } },
        ],
      },
      include: [
        {
          model: ArticleCategory,
          as: 'articleCategories',
          required: false,
          include: [{
            model: Category,
            as: 'category',
            attributes: ['id', 'name', 'slug'],
          }],
        },
        {
          model: ArticleMedia,
          as: 'articleMedias',
          where: { usageType: 'thumbnail' },
          required: false,
          limit: 1,
          include: [{
            model: MediaFile,
            as: 'media',
            attributes: ['fileUrl'],
          }],
        },
      ],
      order: [['publishedAt', 'DESC']],
      limit: pageSize,
      offset: (page - 1) * pageSize,
      distinct: true,
      subQuery: false,
    });

    const articleIds = rows.map((article) => article.id);
    const commentCountMap = await getApprovedCommentCountMap(Comment, articleIds);

    const articles: SearchResultItem[] = rows.map((article) => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt || null,
      publishedAt: article.publishedAt
        ? parseInt(String(article.publishedAt), 10)
        : null,
      thumbnailUrl: extractThumbnailUrl(article.articleMedias),
      categories: extractCategories(article.articleCategories),
      commentCount: commentCountMap[article.id] || 0,
    }));

    if (sort === 'comments') {
      articles.sort((a, b) => b.commentCount - a.commentCount);
    }

    return { articles, total: count };
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
  import('@/utils/models')
    .then(({ initAllModels }) => initAllModels())
    .then(({ SearchLog }) => {
      SearchLog.create({
        query: params.query,
        resultsCount: params.resultsCount,
        ipAddress: params.ipAddress || null,
        userAgent: params.userAgent || null,
      }).catch(() => {});
    })
    .catch(() => {});
}
