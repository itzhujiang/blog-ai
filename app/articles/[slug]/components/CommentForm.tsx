'use client';

import React, { useCallback, useEffect, useState } from 'react';

import type { CaptchaResponse, CommentPostBody } from '../types';

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
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [authorPhone, setAuthorPhone] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [captchaSvg, setCaptchaSvg] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState('');

  const fetchCaptcha = useCallback(async () => {
    try {
      const res = await fetch('/api/captcha');
      if (!res.ok) return;
      const data: CaptchaResponse = await res.json();
      setCaptchaSvg(data.svg);
      setCaptchaToken(data.token);
      setCaptchaAnswer('');
    } catch {
      // 静默失败，用户可手动刷新
    }
  }, []);

  useEffect(() => {
    fetchCaptcha();
  }, [fetchCaptcha]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedName = authorName.trim();
    const trimmedContent = content.trim();

    if (!trimmedName || !trimmedContent) {
      setError('昵称和评论内容不能为空');
      return;
    }

    if (!captchaAnswer.trim()) {
      setError('请输入验证码答案');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const body: CommentPostBody = {
        articleId,
        authorName: trimmedName,
        content: trimmedContent,
        captchaToken,
        captchaAnswer: captchaAnswer.trim(),
      };
      if (parentId) body.parentId = parentId;
      const trimmedEmail = authorEmail.trim();
      if (trimmedEmail) body.authorEmail = trimmedEmail;
      const trimmedPhone = authorPhone.trim();
      if (trimmedPhone) body.authorPhone = trimmedPhone;

      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '提交失败');
      }

      setAuthorName('');
      setAuthorEmail('');
      setAuthorPhone('');
      setContent('');
      setCaptchaAnswer('');
      setSuccess('评论已提交，等待审核');
      onSubmitSuccess();
      fetchCaptcha();

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : '提交失败，请重试');
      fetchCaptcha();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`rounded-xl bg-primary/5 dark:bg-primary/10 shadow-sm ${
        isReply ? 'p-4' : 'p-6'
      }`}
    >
      <div className={`grid grid-cols-1 gap-4 ${isReply ? '' : 'sm:grid-cols-2'}`}>
        <input
          type="text"
          placeholder="昵称"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          maxLength={100}
          className="h-10 rounded-lg border border-primary/30
            bg-background-light dark:bg-background-dark/50
            px-4 text-sm
            placeholder-text-light/60 dark:placeholder-text-dark/60
            focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary
            transition"
        />
        <input
          type="email"
          placeholder="邮箱（选填）"
          value={authorEmail}
          onChange={(e) => setAuthorEmail(e.target.value)}
          maxLength={255}
          className="h-10 rounded-lg border border-primary/30
            bg-background-light dark:bg-background-dark/50
            px-4 text-sm
            placeholder-text-light/60 dark:placeholder-text-dark/60
            focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary
            transition"
        />
        <input
          type="tel"
          placeholder="手机号（选填）"
          value={authorPhone}
          onChange={(e) => setAuthorPhone(e.target.value)}
          maxLength={255}
          className={`h-10 rounded-lg border border-primary/30
            bg-background-light dark:bg-background-dark/50
            px-4 text-sm
            placeholder-text-light/60 dark:placeholder-text-dark/60
            focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary
            transition ${isReply ? '' : 'sm:col-span-2'}`}
        />
        <textarea
          placeholder="写下你的想法..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={2000}
          rows={isReply ? 3 : 4}
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
          placeholder="验证码答案"
          value={captchaAnswer}
          onChange={(e) => setCaptchaAnswer(e.target.value)}
          maxLength={10}
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

      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
      {success && (
        <p className="mt-2 text-sm text-emerald-600 dark:text-emerald-400">
          {success}
        </p>
      )}

      <div className="mt-4 flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-cta-light px-6 py-2 text-sm font-semibold
            text-white transition-colors duration-300
            hover:bg-cta-light/80 disabled:opacity-50
            dark:bg-cta-dark dark:hover:bg-cta-dark/80"
        >
          {submitting ? '提交中...' : isReply ? '回复' : '发表评论'}
        </button>
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
