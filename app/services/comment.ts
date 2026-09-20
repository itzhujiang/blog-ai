/**
 * 评论服务 (Prisma 版本)
 */

import { defaultLogger } from '@/utils/logger';
import { prisma } from '@/utils/prisma';

export interface CommentResult {
  id: number;
  authorName: string;
  content: string;
  createdAt: number;
  isAuthor: boolean;
  parentId: number | null;
}

export interface CreateCommentParams {
  articleId: number;
  parentId: number | null;
  authorName: string;
  authorEmail: string | null;
  authorPhone: string | null;
  content: string;
  authorIp: string | null;
}

/**
 * 获取文章的已审核评论列表
 */
export async function getCommentsByArticleId(
  articleId: number,
): Promise<{ comments: CommentResult[]; total: number }> {
  try {
    const rows = await prisma.comments.findMany({
      where: {
        article_id: articleId,
        status: 'approved'
      },
      orderBy: { created_at: 'asc' },
      select: {
        id: true,
        author_name: true,
        content: true,
        created_at: true,
        is_author: true,
        parent_id: true,
      }
    });

    const comments: CommentResult[] = rows.map((c) => ({
      id: c.id,
      authorName: c.author_name,
      content: c.content,
      createdAt: Number(c.created_at),
      isAuthor: c.is_author,
      parentId: c.parent_id ?? null,
    }));

    return { comments, total: comments.length };
  } catch (error) {
    defaultLogger.error('获取评论失败:', error);
    return { comments: [], total: 0 };
  }
}

/**
 * 创建新评论（待审核状态）
 */
export async function createComment(params: CreateCommentParams) {
  try {
    const comment = await prisma.comments.create({
      data: {
        article_id: params.articleId,
        parent_id: params.parentId,
        author_name: params.authorName,
        author_email: params.authorEmail,
        author_phone: params.authorPhone,
        content: params.content,
        author_ip: params.authorIp,
        status: 'pending',
        created_at: BigInt(Date.now()),
      },
    });

    return {
      id: comment.id,
      authorName: comment.author_name,
      content: comment.content,
      createdAt: Number(comment.created_at),
      status: comment.status,
    };
  } catch (error) {
    defaultLogger.error('创建评论失败:', error);
    throw error;
  }
}
