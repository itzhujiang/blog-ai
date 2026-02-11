/**
 * 服务层统一导出
 */

// 文章服务
export {
  getLatestArticles,
  getArticles,
  getArticleBySlug,
  getArticleStats,
  incrementViewCount,
} from './article';

// 分类服务
export { getCategoriesWithCount } from './category';
export type { CategoryWithCount } from './category';

// 评论服务
export { getCommentsByArticleId, createComment } from './comment';
export type { CommentResult, CreateCommentParams } from './comment';

// 搜索服务
export { searchArticles, logSearch } from './search';
export type { SearchSortType, LogSearchParams } from './search';

// 关于页服务
export { getAboutPageData } from './about';

// 站点配置
export { getSiteConfigSSR } from './site-config';
export type { SiteConfig } from './site-config';

// 工具函数
export { escapeLikePattern } from './helpers';
