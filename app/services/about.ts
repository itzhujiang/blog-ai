/**
 * 关于页服务
 */

import axios from 'axios';

import { getFileUrl } from '@/utils/file-url';
import { defaultLogger } from '@/utils/logger';

import type { AboutPageData } from '../about/types';

/**
 * 从数据库获取关于我页面数据
 */
export async function getAboutPageData(): Promise<AboutPageData | null> {
  try {
    const { initAllModels } = await import('@/utils/models');
    const { AboutPage, AboutPageMedia, MediaFile } =
      await initAllModels();

    const page = await AboutPage.findOne({
      where: { id: 1 },
      include: [
        {
          model: AboutPageMedia,
          as: 'aboutPageMedias',
          required: false,
          include: [
            {
              model: MediaFile,
              as: 'media',
              attributes: ['fileUrl'],
            },
          ],
        },
      ],
    });

    if (!page) return null;

    // 提取媒体文件
    const medias = (page as unknown as {
      aboutPageMedias?: Array<{
        usageType: string;
        media?: { fileUrl: string };
      }>;
    }).aboutPageMedias || [];

    // 头像
    const avatarMedia = medias.find((m) => m.usageType === 'avatar');
    const avatarUrl = avatarMedia?.media?.fileUrl
      ? getFileUrl(avatarMedia.media.fileUrl)
      : null;

    // 内容 Markdown
    let introContent = '';
    const contentMedia = medias.find((m) => m.usageType === 'content');
    if (contentMedia?.media?.fileUrl) {
      try {
        const fileUrl = getFileUrl(contentMedia.media.fileUrl);
        const response = await axios.get<string>(fileUrl, {
          timeout: 10000,
        });
        introContent = response.data;
      } catch (err) {
        defaultLogger.error('获取关于我内容文件失败:', err);
      }
    }

    return {
      nickname: page.nickname,
      jobTitle: page.jobTitle,
      personalTags: page.personalTags,
      avatarUrl,
      introContent,
      skills: page.skills,
      timeline: page.timeline,
      contactInfo: page.contactInfo as AboutPageData['contactInfo'],
      socialLinks: page.socialLinks as AboutPageData['socialLinks'],
    };
  } catch (error) {
    defaultLogger.error('获取关于我页面数据失败:', error);
    return null;
  }
}
