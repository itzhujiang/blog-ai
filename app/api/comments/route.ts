/**
 * 评论 API
 * GET  /api/comments?articleId=N  — 获取已审核评论列表
 *
 * 注意：评论提交功能已迁移到 Server Actions（app/actions/comments.ts）
 */

import { NextRequest, NextResponse } from 'next/server';

import { getCommentsByArticleId } from '@/services';
import { apiLogger, defaultLogger } from '@/utils/logger';

export async function GET(request: NextRequest) {
  try {
    const articleId = parseInt(
      request.nextUrl.searchParams.get('articleId') || '',
      10,
    );

    apiLogger.info(`[GET /api/comments] articleId=${articleId}`);

    if (!articleId || isNaN(articleId)) {
      return NextResponse.json(
        { error: 'articleId 参数必填' },
        { status: 400 },
      );
    }

    const result = await getCommentsByArticleId(articleId);

    return NextResponse.json(
      result,
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (error) {
    defaultLogger.error('获取评论失败:', error);
    return NextResponse.json(
      { error: '获取评论失败' },
      { status: 500 },
    );
  }
}
