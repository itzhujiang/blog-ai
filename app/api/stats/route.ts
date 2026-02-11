/**
 * 统计 API
 * GET  /api/stats?ids=1,2,3  — 批量查询文章统计数据
 * POST /api/stats             — 递增阅读量并返回统计数据
 */

import { NextRequest, NextResponse } from 'next/server';

import { getArticleStats, incrementViewCount } from '@/services';

const MAX_IDS = 50;

export async function GET(request: NextRequest) {
  try {
    const idsParam = request.nextUrl.searchParams.get('ids') || '';
    const ids = idsParam
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n) && n > 0);

    if (ids.length === 0) {
      return NextResponse.json(
        { error: 'ids 参数必填，格式：ids=1,2,3' },
        { status: 400 },
      );
    }

    if (ids.length > MAX_IDS) {
      return NextResponse.json(
        { error: `最多查询 ${MAX_IDS} 篇文章` },
        { status: 400 },
      );
    }

    const stats = await getArticleStats(ids);

    return NextResponse.json(
      { stats },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (error) {
    console.error('获取统计数据失败:', error);
    return NextResponse.json(
      { error: '获取统计数据失败' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const articleId = Number(body.articleId);

    if (!articleId || isNaN(articleId)) {
      return NextResponse.json(
        { error: 'articleId 参数必填' },
        { status: 400 },
      );
    }

    const result = await incrementViewCount(articleId);

    if (!result) {
      return NextResponse.json(
        { error: '文章不存在' },
        { status: 404 },
      );
    }

    return NextResponse.json(
      result,
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (error) {
    console.error('更新阅读量失败:', error);
    return NextResponse.json(
      { error: '更新阅读量失败' },
      { status: 500 },
    );
  }
}
