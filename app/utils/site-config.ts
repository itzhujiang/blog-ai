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
}

/**
 * 默认配置值（当数据库没有配置时使用）
 */
const DEFAULT_SITE_CONFIG: SiteConfig = {
  siteTitle: '暖木博客 - 暖木与阳光',
  siteDescription: '一个探索科技、设计、生活及AI创作潜能的个人博客',
};

/**
 * SSR/ISR 服务端渲染时获取网站配置
 * 直接使用 Sequelize 模型查询数据库
 */
export async function getSiteConfigSSR(): Promise<SiteConfig> {
  try {
    const { SiteSetting } = await import('./models');

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

    return {
      siteTitle: titleSetting?.settingValue || DEFAULT_SITE_CONFIG.siteTitle,
      siteDescription:
        descriptionSetting?.settingValue || DEFAULT_SITE_CONFIG.siteDescription,
    };
  } catch (error) {
    console.error('获取网站配置失败:', error);
    return DEFAULT_SITE_CONFIG;
  }
}
