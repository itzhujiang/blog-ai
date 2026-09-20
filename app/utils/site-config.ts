/**
 * 网站配置工具函数 (Prisma 版本)
 * SSR/ISR 服务端渲染时使用，直接查询数据库
 * 客户端组件使用 /api/site-config 端点
 */

import { prisma } from '@/utils/prisma';
import { defaultLogger } from '@/utils/logger';

/**
 * 网站配置项类型
 */
export interface SiteConfig {
  siteTitle: string;
  siteDescription: string;
  avatarPath: string;
  footerCopyright: string;
}

/**
 * 默认配置值（当数据库没有配置时使用）
 */
const DEFAULT_SITE_CONFIG: SiteConfig = {
  siteTitle: '暖木博客',
  siteDescription: '一个探索科技、设计、生活及AI创作潜能的个人博客',
  avatarPath: '',
  footerCopyright: '© 2024 暖木博客. 版权所有.',
};

/**
 * SSR/ISR 服务端渲染时获取网站配置
 * 直接使用 Prisma 查询数据库
 */
export async function getSiteConfigSSR(): Promise<SiteConfig> {
  try {
    // 并行获取所有配置
    const [titleSetting, descriptionSetting, avatarSetting, copyrightSetting] = await Promise.all([
      prisma.site_settings.findUnique({
        where: { setting_key: 'site_title' },
        select: { setting_value: true },
      }),
      prisma.site_settings.findUnique({
        where: { setting_key: 'site_description' },
        select: { setting_value: true },
      }),
      prisma.site_settings.findUnique({
        where: { setting_key: 'avatar_path' },
        select: { setting_value: true },
      }),
      prisma.site_settings.findUnique({
        where: { setting_key: 'footer_copyright' },
        select: { setting_value: true },
      }),
    ]);

    return {
      siteTitle: titleSetting?.setting_value || DEFAULT_SITE_CONFIG.siteTitle,
      siteDescription:
        descriptionSetting?.setting_value || DEFAULT_SITE_CONFIG.siteDescription,
      avatarPath: avatarSetting?.setting_value || DEFAULT_SITE_CONFIG.avatarPath,
      footerCopyright: copyrightSetting?.setting_value || DEFAULT_SITE_CONFIG.footerCopyright,
    };
  } catch (error) {
    defaultLogger.error('获取网站配置失败:', error);
    return DEFAULT_SITE_CONFIG;
  }
}
