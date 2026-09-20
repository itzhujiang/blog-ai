/**
 * 文章服务 (Prisma 版本)
 */

import type { ArticleItem } from '@/components/LatestArticles';

import { prisma } from '@/utils/prisma';
import { defaultLogger } from '@/utils/logger';

import type { ArticleDetail } from '../articles/[slug]/types';
import type { ArticleListItem, SortType } from '../articles/types';

/**
 * 获取最新文章（首页用）
 */
export async function getLatestArticles(
  limit = 6,
): Promise<ArticleItem[]> {
  try {
    const articles = await prisma.articles.findMany({
      where: {
        status: 'published',
        deleted_at: 0
      },
      orderBy: { published_at: 'desc' },
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        published_at: true,
        article_categories: {
          take: 1,
          include: {
            categories: {
              select: { name: true }
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
        }
      },
    });

    return articles.map((article) => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt || '',
      publishedAt: article.published_at ? Number(article.published_at) : null,
      thumbnailUrl: article.article_media[0]?.media_files?.file_url || null,
      categoryName: article.article_categories[0]?.categories?.name || undefined,
    }));
  } catch (error) {
    defaultLogger.error('获取文章失败:', error);
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
    const offset = (page - 1) * pageSize;

    // 构建查询条件
    const where: any = {
      status: 'published',
      deleted_at: 0,
    };

    // 分类筛选
    if (categorySlug) {
      where.article_categories = {
        some: {
          categories: {
            slug: categorySlug
          }
        }
      };
    }

    // 排序
    let orderBy: any = {};
    switch (sort) {
      case 'latest':
        orderBy = { published_at: 'desc' };
        break;
      case 'comments':
        // 按评论数排序需要在查询后处理
        orderBy = { published_at: 'desc' };
        break;
      default:
        orderBy = { published_at: 'desc' };
    }

    // 并行查询文章和总数
    const [articles, total] = await Promise.all([
      prisma.articles.findMany({
        where,
        orderBy,
        skip: offset,
        take: pageSize,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          view_count: true,
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

    const articleList: ArticleListItem[] = articles.map((article) => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt || null,
      thumbnailUrl: article.article_media[0]?.media_files?.file_url || null,
      commentCount: article.comments.length,
      publishedAt: article.published_at ? Number(article.published_at) : null,
      categories: article.article_categories.map(ac => ({
        id: ac.categories.id,
        name: ac.categories.name,
        slug: ac.categories.slug,
      })),
    }));

    return { articles: articleList, total };
  } catch (error) {
    defaultLogger.error('获取文章列表失败:', error);
    return { articles: [], total: 0 };
  }
}

/**
 * 根据 slug 获取单篇文章详情
 */
export async function getArticleBySlug(slug: string): Promise<ArticleDetail | null> {
  try {
    const article = await prisma.articles.findUnique({
      where: { slug },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        author_name: true,
        content: true,
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
    });

    if (!article) {
      return null;
    }

    return {
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt || null,
      authorName: article.author_name,
      content: article.content,
      publishedAt: article.published_at ? Number(article.published_at) : null,
      thumbnailUrl: article.article_media[0]?.media_files?.file_url || null,
      commentCount: article.comments.length,
      categories: article.article_categories.map(ac => ({
        id: ac.categories.id,
        name: ac.categories.name,
        slug: ac.categories.slug,
      })),
    };
  } catch (error) {
    defaultLogger.error('获取文章详情失败:', error);
    return null;
  }
}

/**
 * 获取文章统计信息（支持批量查询）
 */
export async function getArticleStats(articleIds: number | number[]) {
  try {
    // 单个 ID
    if (typeof articleIds === 'number') {
      const article = await prisma.articles.findUnique({
        where: { id: articleIds },
        select: {
          view_count: true,
          comments: {
            where: { status: 'approved' },
            select: { id: true }
          }
        },
      });

      if (!article) {
        return { viewCount: 0, commentCount: 0 };
      }

      return {
        viewCount: article.view_count,
        commentCount: article.comments.length,
      };
    }

    // 批量查询
    const articles = await prisma.articles.findMany({
      where: {
        id: { in: articleIds }
      },
      select: {
        id: true,
        view_count: true,
        comments: {
          where: { status: 'approved' },
          select: { id: true }
        }
      },
    });

    const statsMap: Record<number, { viewCount: number; commentCount: number }> = {};

    articles.forEach((article) => {
      statsMap[article.id] = {
        viewCount: article.view_count,
        commentCount: article.comments.length,
      };
    });

    return statsMap;
  } catch (error) {
    defaultLogger.error('获取文章统计失败:', error);
    return typeof articleIds === 'number'
      ? { viewCount: 0, commentCount: 0 }
      : {};
  }
}

/**
 * 增加文章浏览次数
 */
export async function incrementViewCount(articleId: number): Promise<{ viewCount: number; commentCount: number } | null> {
  try {
    await prisma.articles.update({
      where: { id: articleId },
      data: {
        view_count: {
          increment: 1
        }
      },
    });

    // 返回更新后的统计信息
    return await getArticleStats(articleId) as { viewCount: number; commentCount: number };
  } catch (error) {
    defaultLogger.error('增加浏览次数失败:', error);
    return null;
  }
}
