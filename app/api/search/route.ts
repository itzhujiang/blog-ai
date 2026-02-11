/**
 * 搜索 API
 * GET /api/search?q=关键词&page=1&sort=relevance
 * ILIKE 模糊匹配标题和摘要，记录搜索日志
 */

import { NextRequest, NextResponse } from 'next/server';

import { searchArticles, logSearch } from '@/services';
import type { SearchSortType } from '@/services';

const PAGE_SIZE = 10;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const rawQuery = (searchParams.get('q') || '').trim().slice(0, 100);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
    const sort = (searchParams.get('sort') || 'relevance') as SearchSortType;

    if (!rawQuery) {
      return NextResponse.json(
        { articles: [], total: 0, totalPages: 0, query: '' },
      );
    }

    const { articles, total } = await searchArticles(rawQuery, page, sort, PAGE_SIZE);
    const totalPages = Math.ceil(total / PAGE_SIZE);

    // 搜索日志：fire-and-forget
    logSearch({
      query: rawQuery,
      resultsCount: total,
      ipAddress: request.headers.get('x-forwarded-for')
        || request.headers.get('x-real-ip')
        || null,
      userAgent: request.headers.get('user-agent') || null,
    });

    return NextResponse.json(
      { articles, total, totalPages, query: rawQuery },
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      },
    );
  } catch (error) {
    console.error('搜索失败:', error);
    return NextResponse.json(
      { error: '搜索失败' },
      { status: 500 },
    );
  }
}
