/**
 * 文件 URL 处理工具函数
 * 处理数据库中的相对路径，转换为完整的 URL
 */

// 后端服务的基础 URL
const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL || 'http://192.168.2.106:8089';

/**
 * 将数据库中的相对路径转换为完整的 URL
 *
 * @param relativePath - 数据库中存储的相对路径（如 '/images/avatar.jpg'）
 * @returns 完整的访问 URL（如 'http://localhost:8089/images/avatar.jpg'）
 */
export function getFileUrl(relativePath: string | null | undefined): string {
  if (!relativePath) {
    return '';
  }

  // 如果已经是完整 URL，直接返回
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
    return relativePath;
  }

  // 确保路径以 '/' 开头
  const normalizedPath = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;

  return `${BACKEND_BASE_URL}${normalizedPath}`;
}

/**
 * 获取文章缩略图 URL
 *
 * @param thumbnailUrl - 数据库中的缩略图路径
 * @returns 完整的缩略图访问 URL
 */
export function getThumbnailUrl(thumbnailUrl: string | null | undefined): string {
  return getFileUrl(thumbnailUrl);
}

/**
 * 获取文章内容文件 URL（用于获取 Markdown 文件）
 *
 * @param filePath - 数据库中的文件路径
 * @returns 完整的文件访问 URL
 */
export function getArticleFileUrl(filePath: string | null | undefined): string {
  return getFileUrl(filePath);
}

/**
 * 获取媒体文件 URL
 *
 * @param filePath - 数据库中的媒体文件路径
 * @returns 完整的媒体文件访问 URL
 */
export function getMediaUrl(filePath: string | null | undefined): string {
  return getFileUrl(filePath);
}
