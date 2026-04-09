/**
 * 文章服务
 */

import { Sequelize } from 'sequelize';

import type { ArticleItem } from '@/components/LatestArticles';

import type { ArticleDetail } from '../articles/[slug]/types';
import type { ArticleListItem, CategoryTag, SortType } from '../articles/types';

import {
  commentCountAttribute,
  getVirtualInt,
  extractCategories,
  extractThumbnailUrl,
} from './helpers';

/**
 * 获取最新文章（首页用）
 */
export async function getLatestArticles(
  limit = 6,
): Promise<ArticleItem[]> {
  try {
    const { initAllModels } = await import('@/utils/models');
    const {
      Article, ArticleCategory, Category,
      ArticleMedia, MediaFile,
    } = await initAllModels();

    const articles = await Article.findAll({
      where: { status: 'published' },
      order: [['publishedAt', 'DESC']],
      limit,
      attributes: ['id', 'title', 'slug', 'excerpt', 'publishedAt'],
      include: [
        {
          model: ArticleCategory,
          as: 'articleCategories',
          include: [{
            model: Category,
            as: 'category',
            attributes: ['name'],
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
    });

    return articles.map((article) => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      publishedAt: article.publishedAt,
      thumbnailUrl: extractThumbnailUrl(article.articleMedias),
      categoryName: article.articleCategories?.[0]?.category?.name || undefined,
    }));
  } catch (error) {
    console.error('获取文章失败:', error);
    return [];
  }
}

/**
 * 获取文章列表（含分页、分类筛选、排序）
 */
export async function getArticles(
  page: number,
  categorySlug: string | null,
  sort: SortType,
  pageSize = 6,
): Promise<{ articles: ArticleListItem[]; total: number }> {
  try {
    const { initAllModels } = await import('@/utils/models');
    const {
      Article, ArticleCategory, Category,
      ArticleMedia, MediaFile,
    } = await initAllModels();

    const offset = (page - 1) * pageSize;

    // 构建分类筛选条件
    const categoryInclude = categorySlug
      ? {
        model: ArticleCategory,
        as: 'articleCategories' as const,
        required: true,
        include: [{
          model: Category,
          as: 'category' as const,
          attributes: ['id', 'name', 'slug'],
          where: { slug: categorySlug },
        }],
      }
      : {
        model: ArticleCategory,
        as: 'articleCategories' as const,
        required: false,
        include: [{
          model: Category,
          as: 'category' as const,
          attributes: ['id', 'name', 'slug'],
        }],
      };

    const order: [string | ReturnType<typeof Sequelize.literal>, string][] =
      sort === 'comments'
        ? [[Sequelize.literal('"commentCount"'), 'DESC']]
        : [['publishedAt', 'DESC']];

    const { count, rows } = await Article.findAndCountAll({
      where: { status: 'published' },
      attributes: {
        include: [commentCountAttribute()],
      },
      include: [
        categoryInclude,
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
      order,
      limit: pageSize,
      offset,
      distinct: true,
      subQuery: false,
    });

    const articles: ArticleListItem[] = rows.map((article) => {
      const categories: CategoryTag[] = extractCategories(article.articleCategories);
      return {
        id: article.id,
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt || null,
        publishedAt: article.publishedAt
          ? parseInt(String(article.publishedAt), 10)
          : null,
        thumbnailUrl: extractThumbnailUrl(article.articleMedias),
        categories,
        commentCount: getVirtualInt(article.dataValues, 'commentCount'),
      };
    });

    return { articles, total: count };
  } catch (error) {
    console.error('获取文章列表失败:', error);
    return { articles: [], total: 0 };
  }
}

/**
 * 获取文章详情（含 Markdown 内容）
 */
export async function getArticleBySlug(
  slug: string,
): Promise<ArticleDetail | null> {
  try {
    const normalizedSlug = decodeURIComponent(slug);
    const { initAllModels } = await import('@/utils/models');
    const {
      Article, ArticleCategory, Category,
      ArticleMedia, MediaFile,
    } = await initAllModels();

    const article = await Article.findOne({
      where: { slug: normalizedSlug, status: 'published' },
      attributes: {
        include: [commentCountAttribute()],
      },
      include: [
        {
          model: ArticleCategory,
          as: 'articleCategories' as const,
          required: false,
          include: [{
            model: Category,
            as: 'category' as const,
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
      subQuery: false,
    });

    if (!article) return null;

    // 文章正文直接来自数据库 content 字段
    const content = article.content || '';

    return {
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt || null,
      authorName: article.authorName,
      publishedAt: article.publishedAt
        ? parseInt(String(article.publishedAt), 10)
        : null,
      thumbnailUrl: extractThumbnailUrl(article.articleMedias),
      categories: extractCategories(article.articleCategories),
      commentCount: getVirtualInt(article.dataValues, 'commentCount'),
      content,
    };
  } catch (error) {
    console.error('获取文章详情失败:', error);
    return null;
  }
}

/**
 * 批量获取文章统计数据（阅读量、阅读时间）
 */
export async function getArticleStats(
  ids: number[],
): Promise<Record<string, { viewCount: number; readingTime: number }>> {
  const { initAllModels } = await import('@/utils/models');
  const { Article } = await initAllModels();

  const rows = await Article.findAll({
    where: { id: ids },
    attributes: ['id', 'viewCount', 'readingTime'],
  });

  const stats: Record<string, { viewCount: number; readingTime: number }> = {};
  for (const row of rows) {
    stats[String(row.id)] = {
      viewCount: row.viewCount,
      readingTime: row.readingTime,
    };
  }
  return stats;
}

/**
 * 递增文章阅读量并返回最新统计
 */
export async function incrementViewCount(
  articleId: number,
): Promise<{ viewCount: number; readingTime: number } | null> {
  const { initAllModels } = await import('@/utils/models');
  const { Article } = await initAllModels();

  await Article.increment('viewCount', {
    where: { id: articleId },
  });

  const article = await Article.findByPk(articleId, {
    attributes: ['viewCount', 'readingTime'],
  });

  if (!article) return null;

  return {
    viewCount: article.viewCount,
    readingTime: article.readingTime,
  };
}
