/**
 * 评论 API
 * GET  /api/comments?articleId=N  — 获取已审核评论列表
 * POST /api/comments              — 发表新评论（待审核）
 */

import { NextRequest, NextResponse } from 'next/server';

import { verifyCaptcha } from '@/utils/captcha';
import { getCommentsByArticleId, createComment } from '@/services';

export async function GET(request: NextRequest) {
  try {
    const articleId = parseInt(
      request.nextUrl.searchParams.get('articleId') || '',
      10,
    );

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
    console.error('获取评论失败:', error);
    return NextResponse.json(
      { error: '获取评论失败' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 验证码校验
    const captchaResult = verifyCaptcha(
      body.captchaToken || '',
      body.captchaAnswer || '',
    );
    if (!captchaResult.valid) {
      return NextResponse.json(
        { error: captchaResult.error },
        { status: 400 },
      );
    }

    const articleId = Number(body.articleId);
    const authorName = String(body.authorName || '').trim().slice(0, 100);
    const authorEmail = body.authorEmail
      ? String(body.authorEmail).trim().slice(0, 255)
      : null;
    const content = String(body.content || '').trim().slice(0, 2000);
    const parentId = body.parentId ? Number(body.parentId) : null;

    if (!articleId || !authorName || !content) {
      return NextResponse.json(
        { error: 'articleId、authorName、content 为必填项' },
        { status: 400 },
      );
    }

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || null;

    const comment = await createComment({
      articleId,
      parentId,
      authorName,
      authorEmail,
      content,
      authorIp: ip,
    });

    return NextResponse.json(
      {
        message: '评论已提交，等待审核',
        comment,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('发表评论失败:', error);
    return NextResponse.json(
      { error: '发表评论失败' },
      { status: 500 },
    );
  }
}
