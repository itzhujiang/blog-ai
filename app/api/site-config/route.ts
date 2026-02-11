/**
 * 网站配置 API
 * GET /api/site-config
 * 获取网站标题和描述
 */

import { NextResponse } from 'next/server';

import { SiteSetting } from '@/utils/models';

const DEFAULT_SITE_CONFIG = {
  siteTitle: '暖木博客 - 暖木与阳光',
  siteDescription: '一个探索科技、设计、生活及AI创作潜能的个人博客',
};

export async function GET() {
  try {
    // 并行获取标题和描述
    const [titleSetting, descriptionSetting] = await Promise.all([
      SiteSetting.findOne({
        where: { settingKey: 'site_title' },
        attributes: ['settingValue'],
      }),
      SiteSetting.findOne({
        where: { settingKey: 'site_description' },
        attributes: ['settingValue'],
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        siteTitle: titleSetting?.settingValue || DEFAULT_SITE_CONFIG.siteTitle,
        siteDescription:
          descriptionSetting?.settingValue || DEFAULT_SITE_CONFIG.siteDescription,
      },
    });
  } catch (error) {
    console.error('获取网站配置失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '获取网站配置失败',
      },
      { status: 500 }
    );
  }
}
