/**
 * 网站配置 API
 * GET /api/site-config
 * 获取网站标题和描述
 */

import { NextResponse } from 'next/server';

import { apiLogger, defaultLogger } from '@/utils/logger';
import { prisma } from '@/utils/prisma';

const DEFAULT_SITE_CONFIG = {
  siteTitle: '暖木博客 - 暖木与阳光',
  siteDescription: '一个探索科技、设计、生活及AI创作潜能的个人博客',
};

export async function GET() {
  try {
    apiLogger.info('[GET /api/site-config]');

    // 并行获取标题和描述
    const [titleSetting, descriptionSetting] = await Promise.all([
      prisma.site_settings.findUnique({
        where: { setting_key: 'site_title' },
        select: { setting_value: true },
      }),
      prisma.site_settings.findUnique({
        where: { setting_key: 'site_description' },
        select: { setting_value: true },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        siteTitle: titleSetting?.setting_value || DEFAULT_SITE_CONFIG.siteTitle,
        siteDescription:
          descriptionSetting?.setting_value || DEFAULT_SITE_CONFIG.siteDescription,
      },
    });
  } catch (error) {
    defaultLogger.error('获取网站配置失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '获取网站配置失败',
      },
      { status: 500 }
    );
  }
}
