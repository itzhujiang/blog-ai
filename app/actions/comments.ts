'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

import { createComment } from '@/services/comment';
import { verifyCaptcha } from '@/utils/captcha';
import { apiLogger, defaultLogger } from '@/utils/logger';

export interface SubmitCommentResult {
  success: boolean;
  message?: string;
  error?: string;
  comment?: {
    id: number;
    authorName: string;
    content: string;
    createdAt: number;
    status: string;
  };
}

/**
 * Server Action: 提交评论
 * 使用 useFormState 调用，自动处理表单提交和状态管理
 */
export async function submitComment(
  prevState: SubmitCommentResult | null,
  formData: FormData
): Promise<SubmitCommentResult> {
  try {
    // 1. 提取表单数据
    const articleId = Number(formData.get('articleId'));
    const authorName = String(formData.get('authorName') || '').trim().slice(0, 100);
    const authorEmail = formData.get('authorEmail')
      ? String(formData.get('authorEmail')).trim().slice(0, 255)
      : null;
    const content = String(formData.get('content') || '').trim().slice(0, 2000);
    const parentId = formData.get('parentId') ? Number(formData.get('parentId')) : null;
    const captchaToken = String(formData.get('captchaToken') || '');
    const captchaAnswer = String(formData.get('captchaAnswer') || '');

    apiLogger.info(`[submitComment] articleId=${articleId}, authorName=${authorName}`);

    // 2. 验证必填字段
    if (!articleId || !authorName || !content) {
      return { success: false, error: 'articleId、authorName、content 为必填项' };
    }

    // 3. 验证码校验
    const captchaResult = verifyCaptcha(captchaToken, captchaAnswer);
    if (!captchaResult.valid) {
      return { success: false, error: captchaResult.error || '验证码错误' };
    }

    // 4. 获取客户端 IP
    const headersList = await headers();
    const ip =
      headersList.get('x-forwarded-for')?.split(',')[0]?.trim()
      || headersList.get('x-real-ip')
      || null;

    // 5. 调用服务层创建评论
    const comment = await createComment({
      articleId,
      parentId,
      authorName,
      authorEmail,
      content,
      authorIp: ip,
    });

    // 6. 自动刷新文章详情页缓存
    revalidatePath(`/articles/${articleId}`);

    return {
      success: true,
      message: '评论已提交，等待审核',
      comment,
    };
  } catch (error) {
    defaultLogger.error('提交评论失败:', error);
    return { success: false, error: '提交评论失败，请稍后重试' };
  }
}
