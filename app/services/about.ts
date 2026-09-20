/**
 * 关于页服务 (Prisma 版本)
 */

import axios from 'axios';

import { getFileUrl, getServerFileUrl } from '@/utils/file-url';
import { defaultLogger } from '@/utils/logger';
import { prisma } from '@/utils/prisma';

import type { AboutPageData } from '../about/types';

/**
 * 从数据库获取关于我页面数据
 */
export async function getAboutPageData(): Promise<AboutPageData | null> {
  try {
    const page = await prisma.about_page.findUnique({
      where: { id: 1 },
      include: {
        about_page_media: {
          include: {
            media_files: {
              select: {
                file_path: true
              }
            }
          }
        }
      },
    });

    if (!page) return null;

    // 提取媒体文件
    const medias = page.about_page_media || [];

    // 头像
    const avatarMedia = medias.find((m) => m.usage_type === 'avatar');
    const avatarUrl = avatarMedia?.media_files?.file_path
      ? getFileUrl(avatarMedia.media_files.file_path)
      : null;

    // 内容 Markdown
    let introContent = '';
    const contentMedia = medias.find((m) => m.usage_type === 'content');
    if (contentMedia?.media_files?.file_path) {
      try {
        const fileUrl = getServerFileUrl(contentMedia.media_files.file_path);
        const response = await axios.get<string>(fileUrl, {
          timeout: 10000,
        });
        introContent = response.data;
      } catch (err) {
        defaultLogger.error('获取关于我内容文件失败:', err);
      }
    }

    return {
      nickname: page.nickname || '',
      jobTitle: page.job_title || '',
      personalTags: page.personal_tags as string[] || [],
      avatarUrl,
      introContent,
      skills: page.skills as any,
      timeline: page.timeline as any,
      contactInfo: page.contact_info as AboutPageData['contactInfo'],
      socialLinks: page.social_links as AboutPageData['socialLinks'],
    };
  } catch (error) {
    defaultLogger.error('获取关于我页面数据失败:', error);
    return null;
  }
}
