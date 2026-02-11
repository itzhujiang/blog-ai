/**
 * 分类 API
 * GET /api/categories
 * 返回所有分类及其文章数量
 */

import { NextResponse } from 'next/server';

import { getCategoriesWithCount } from '@/services';

export async function GET() {
  try {
    const categories = await getCategoriesWithCount();

    return NextResponse.json(
      { categories },
      {
        headers: {
          'Cache-Control':
            'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      },
    );
  } catch (error) {
    console.error('获取分类失败:', error);
    return NextResponse.json(
      { error: '获取分类失败' },
      { status: 500 },
    );
  }
}
