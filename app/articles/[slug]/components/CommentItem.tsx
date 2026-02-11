'use client';

import type { CommentItem as CommentItemType } from '../types';

import { CommentAvatar } from './CommentAvatar';
import { CommentForm } from './CommentForm';

/**
 * 格式化相对时间
 */
function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 30) return `${days}天前`;
  if (months < 12) return `${months}个月前`;
  return `${years}年前`;
}

interface CommentItemProps {
  comment: CommentItemType;
  articleId: number;
  onReplySuccess: () => void;
  replyingTo: number | null;
  onReplyClick: (_id: number) => void;
  onCancelReply: () => void;
  depth?: number;
}

export function CommentItem({
  comment,
  articleId,
  onReplySuccess,
  replyingTo,
  onReplyClick,
  onCancelReply,
  depth = 0,
}: CommentItemProps) {
  const isReplying = replyingTo === comment.id;

  return (
    <div className="flex items-start gap-4">
      <CommentAvatar name={comment.authorName} />
      <div className="flex-1 min-w-0">
        {/* 评论气泡 */}
        <div className="rounded-lg bg-primary/5 dark:bg-primary/10 p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="font-bold text-[#5a472b] dark:text-text-dark">
              {comment.authorName}
              {comment.isAuthor && (
                <span className="ml-1 rounded bg-cta-light/20 px-1.5 py-0.5
                  text-xs font-normal text-cta-light
                  dark:bg-cta-dark/20 dark:text-cta-dark">
                  作者
                </span>
              )}
            </p>
            <p className="shrink-0 text-xs text-text-light/70 dark:text-text-dark/70">
              {formatRelativeTime(comment.createdAt)}
            </p>
          </div>
          <p className="mt-2 text-sm text-text-light dark:text-text-dark/90 whitespace-pre-wrap break-words">
            {comment.content}
          </p>
        </div>

        {/* 回复按钮 */}
        {depth < 2 && (
          <button
            type="button"
            onClick={() => onReplyClick(comment.id)}
            className="mt-2 text-xs text-text-light/60 dark:text-text-dark/60
              hover:text-primary transition-colors"
          >
            回复
          </button>
        )}

        {/* 回复表单 */}
        {isReplying && (
          <div className="mt-3">
            <CommentForm
              articleId={articleId}
              parentId={comment.id}
              onSubmitSuccess={onReplySuccess}
              onCancel={onCancelReply}
              isReply
            />
          </div>
        )}

        {/* 嵌套回复 */}
        {comment.replies.length > 0 && depth < 2 && (
          <div className="mt-4 ml-4 sm:ml-8 space-y-4">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                articleId={articleId}
                onReplySuccess={onReplySuccess}
                replyingTo={replyingTo}
                onReplyClick={onReplyClick}
                onCancelReply={onCancelReply}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
