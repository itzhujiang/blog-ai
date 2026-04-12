/**
 * 网站配置工具函数
 * SSR/ISR 服务端渲染时使用，直接查询数据库
 * 客户端组件使用 /api/site-config 端点
 */

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
 * 直接使用 Sequelize 模型查询数据库
 */
export async function getSiteConfigSSR(): Promise<SiteConfig> {
  try {
    const { initAllModels } = await import('./models');
    const { SiteSetting } = await initAllModels();

    // 并行获取所有配置
    const [titleSetting, descriptionSetting, avatarSetting, copyrightSetting] = await Promise.all([
      SiteSetting.findOne({
        where: { settingKey: 'site_title' },
        attributes: ['settingValue'],
      }),
      SiteSetting.findOne({
        where: { settingKey: 'site_description' },
        attributes: ['settingValue'],
      }),
      SiteSetting.findOne({
        where: { settingKey: 'avatar_path' },
        attributes: ['settingValue'],
      }),
      SiteSetting.findOne({
        where: { settingKey: 'footer_copyright' },
        attributes: ['settingValue'],
      }),
    ]);

    return {
      siteTitle: titleSetting?.settingValue || DEFAULT_SITE_CONFIG.siteTitle,
      siteDescription:
        descriptionSetting?.settingValue || DEFAULT_SITE_CONFIG.siteDescription,
      avatarPath: avatarSetting?.settingValue || DEFAULT_SITE_CONFIG.avatarPath,
      footerCopyright: copyrightSetting?.settingValue || DEFAULT_SITE_CONFIG.footerCopyright,
    };
  } catch (error) {
    console.error('获取网站配置失败:', error);
    return DEFAULT_SITE_CONFIG;
  }
}
