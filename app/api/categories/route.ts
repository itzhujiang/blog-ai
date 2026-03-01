/**
 * 分类 API
 * GET /api/categories
 * 返回所有分类及其文章数量
 */

import { NextResponse } from 'next/server';

import { getCategoriesWithCount } from '@/services';
import { apiLogger, defaultLogger } from '@/utils/logger';

export async function GET() {
  try {
    apiLogger.info('[GET /api/categories]');

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
    defaultLogger.error('获取分类失败:', error);
    return NextResponse.json(
      { error: '获取分类失败' },
      { status: 500 },
    );
  }
}
