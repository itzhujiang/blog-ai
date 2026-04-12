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
  const isReply = depth > 0;
  const canReply = depth < 2;
  const cardClassName = isReply
    ? 'comment-card comment-card-reply'
    : 'comment-card';
  const threadClassName = depth >= 1
    ? 'comment-thread pl-3 sm:pl-4'
    : 'comment-thread';

  return (
    <div className="flex items-start gap-3 sm:gap-4">
      <div className="comment-avatar-shell">
        <CommentAvatar name={comment.authorName} />
      </div>
      <div className="min-w-0 flex-1">
        <div className={cardClassName}>
          <div className="comment-meta-row">
            <p className="text-sm font-semibold text-[#5a472b] dark:text-text-dark sm:text-base">
              {comment.authorName}
            </p>
            {comment.isAuthor && (
              <span className="inline-flex items-center rounded-full bg-cta-light/15 px-2.5 py-1 text-[11px] font-medium text-cta-light dark:bg-cta-dark/20 dark:text-cta-dark">
                作者
              </span>
            )}
            <p className="text-xs text-text-light/65 dark:text-text-dark/60">
              {formatRelativeTime(comment.createdAt)}
            </p>
          </div>

          <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-text-light dark:text-text-dark/90">
            {comment.content}
          </p>

          {canReply && (
            <div className="comment-action-row">
              <button
                type="button"
                onClick={() => onReplyClick(comment.id)}
                className="text-xs font-medium text-text-light/70 transition-colors hover:text-primary dark:text-text-dark/65"
              >
                回复
              </button>
            </div>
          )}
        </div>

        {isReplying && canReply && (
          <div className="mt-3 sm:mt-4">
            <CommentForm
              articleId={articleId}
              parentId={comment.id}
              onSubmitSuccess={onReplySuccess}
              onCancel={onCancelReply}
              isReply
            />
          </div>
        )}

        {comment.replies.length > 0 && (
          <div className={threadClassName}>
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
