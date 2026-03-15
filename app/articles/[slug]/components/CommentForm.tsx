'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';

import { submitComment } from '@/actions/comments';
import type { SubmitCommentResult } from '@/actions/comments';
import { http } from '@/utils/http';

import type { CaptchaResponse } from '../types';

interface CommentFormProps {
  articleId: number;
  parentId?: number | null;
  onSubmitSuccess: () => void;
  onCancel?: () => void;
  isReply?: boolean;
}

export function CommentForm({
  articleId,
  parentId,
  onSubmitSuccess,
  onCancel,
  isReply = false,
}: CommentFormProps) {
  const [captchaSvg, setCaptchaSvg] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [state, formAction] = useFormState<SubmitCommentResult | null, FormData>(
    submitComment,
    null
  );

  const fetchCaptcha = useCallback(async () => {
    try {
      const data = await http.get<CaptchaResponse>('/api/captcha');
      setCaptchaSvg(data.svg);
      setCaptchaToken(data.token);
    } catch {
      // 静默失败，用户可手动刷新
    }
  }, []);

  useEffect(() => {
    fetchCaptcha().catch(() => {
      // 静默失败
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 处理提交成功
  useEffect(() => {
    if (state?.success) {
      alert(state.message || '评论已提交');
      fetchCaptcha().catch(() => {
        // 静默失败
      });
      onSubmitSuccess();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.success]);

  return (
    <form
      action={formAction}
      className={`rounded-xl bg-primary/5 dark:bg-primary/10 shadow-sm ${
        isReply ? 'p-4' : 'p-6'
      }`}
    >
      <input type="hidden" name="articleId" value={articleId} />
      {parentId && <input type="hidden" name="parentId" value={parentId} />}
      <input type="hidden" name="captchaToken" value={captchaToken} />

      <div className={`grid grid-cols-1 gap-4 ${isReply ? '' : 'sm:grid-cols-2'}`}>
        <input
          type="text"
          name="authorName"
          placeholder="昵称"
          maxLength={100}
          required
          className="h-10 rounded-lg border border-primary/30
            bg-background-light dark:bg-background-dark/50
            px-4 text-sm
            placeholder-text-light/60 dark:placeholder-text-dark/60
            focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary
            transition"
        />
        <input
          type="email"
          name="authorEmail"
          placeholder="邮箱（选填）"
          maxLength={255}
          className="h-10 rounded-lg border border-primary/30
            bg-background-light dark:bg-background-dark/50
            px-4 text-sm
            placeholder-text-light/60 dark:placeholder-text-dark/60
            focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary
            transition"
        />
        <textarea
          name="content"
          placeholder="写下你的想法..."
          maxLength={2000}
          rows={isReply ? 3 : 4}
          required
          className={`w-full rounded-lg border border-primary/30
            bg-background-light dark:bg-background-dark/50
            p-4 text-sm
            placeholder-text-light/60 dark:placeholder-text-dark/60
            focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary
            transition ${isReply ? '' : 'sm:col-span-2'}`}
        />
      </div>

      {/* 验证码区域 */}
      <div className="mt-4 flex items-center gap-3">
        <div
          className="flex-shrink-0 rounded-lg border border-primary/30
            bg-background-light dark:bg-background-dark/50 p-1"
          dangerouslySetInnerHTML={{ __html: captchaSvg }}
        />
        <input
          type="text"
          name="captchaAnswer"
          placeholder="验证码答案"
          maxLength={10}
          required
          className="h-10 w-24 rounded-lg border border-primary/30
            bg-background-light dark:bg-background-dark/50
            px-4 text-sm text-center
            placeholder-text-light/60 dark:placeholder-text-dark/60
            focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary
            transition"
        />
        <button
          type="button"
          onClick={fetchCaptcha}
          className="text-sm text-text-light/70 dark:text-text-dark/70
            hover:text-primary transition-colors"
          title="刷新验证码"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path
              fillRule="evenodd"
              d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H4.598a.75.75 0 00-.75.75v3.634a.75.75 0 001.5 0v-2.033l.312.311a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm-10.624-2.85a5.5 5.5 0 019.201-2.465l.312.31H11.77a.75.75 0 000 1.5h3.634a.75.75 0 00.75-.75V3.535a.75.75 0 00-1.5 0v2.033l-.312-.311A7 7 0 002.63 8.395a.75.75 0 001.45.39z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {state?.error && (
        <p className="mt-2 text-sm text-red-500">{state.error}</p>
      )}

      <div className="mt-4 flex items-center gap-3">
        <SubmitButton isReply={isReply} />
        {isReply && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full px-4 py-2 text-sm
              text-text-light/70 dark:text-text-dark/70
              hover:text-text-light dark:hover:text-text-dark transition-colors"
          >
            取消
          </button>
        )}
      </div>
    </form>
  );
}

function SubmitButton({ isReply }: { isReply: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-cta-light px-6 py-2 text-sm font-semibold
        text-white transition-colors duration-300
        hover:bg-cta-light/80 disabled:opacity-50
        dark:bg-cta-dark dark:hover:bg-cta-dark/80"
    >
      {pending ? '提交中...' : isReply ? '回复' : '发表评论'}
    </button>
  );
}
