/**
 * 文件 URL 处理工具函数
 */

const ABSOLUTE_URL_PATTERN = /^https?:\/\//i;

function isAbsoluteUrl(path: string): boolean {
  return ABSOLUTE_URL_PATTERN.test(path);
}

function normalizePath(path: string): string {
  return path.startsWith('/') ? path : `/${path}`;
}

function joinUrl(baseUrl: string | undefined, path: string): string {
  if (!baseUrl) {
    return normalizePath(path);
  }

  return `${baseUrl.replace(/\/$/, '')}${normalizePath(path)}`;
}

/**
 * 获取前端展示用文件 URL。
 * 相对路径统一返回站内稳定路径，避免 SSR 与客户端地址不一致。
 */
export function getFileUrl(filePath: string | null | undefined): string {
  if (!filePath) {
    return '';
  }

  if (isAbsoluteUrl(filePath)) {
    return filePath;
  }

  return normalizePath(filePath);
}

/**
 * 获取仅服务端使用的绝对文件 URL。
 * 优先使用服务端环境变量，确保服务端请求和 metadata 生成拿到可访问的绝对地址。
 */
export function getServerFileUrl(filePath: string | null | undefined): string {
  if (!filePath) {
    return '';
  }

  if (isAbsoluteUrl(filePath)) {
    return filePath;
  }

  return joinUrl(process.env.BACKEND_BASE_URL, filePath);
}

/**
 * 获取文章缩略图 URL
 */
export function getThumbnailUrl(thumbnailUrl: string | null | undefined): string {
  return getFileUrl(thumbnailUrl);
}

/**
 * 获取文章内容文件 URL（用于获取 Markdown 文件）
 */
export function getArticleFileUrl(filePath: string | null | undefined): string {
  return getFileUrl(filePath);
}

/**
 * 获取服务端文章内容文件 URL
 */
export function getServerArticleFileUrl(filePath: string | null | undefined): string {
  return getServerFileUrl(filePath);
}

/**
 * 获取媒体文件 URL
 */
export function getMediaUrl(filePath: string | null | undefined): string {
  return getFileUrl(filePath);
}
