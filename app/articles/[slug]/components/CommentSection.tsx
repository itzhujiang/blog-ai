'use client';

import { useCallback, useEffect, useState } from 'react';

import type { CommentItem as CommentItemType } from '../types';

import { CommentForm } from './CommentForm';
import { CommentItem } from './CommentItem';

/**
 * 将扁平评论列表构建为嵌套树
 */
function buildCommentTree(
  flat: Omit<CommentItemType, 'replies'>[],
): CommentItemType[] {
  const map = new Map<number, CommentItemType>();
  const roots: CommentItemType[] = [];

  // 初始化所有节点
  for (const c of flat) {
    map.set(c.id, { ...c, replies: [] });
  }

  // 构建树
  for (const c of flat) {
    const node = map.get(c.id)!;
    if (c.parentId && map.has(c.parentId)) {
      map.get(c.parentId)!.replies.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

interface CommentSectionProps {
  articleId: number;
}

export function CommentSection({ articleId }: CommentSectionProps) {
  const [comments, setComments] = useState<CommentItemType[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);

  const fetchComments = useCallback(async () => {
    try {
      setError('');
      const res = await fetch(`/api/comments?articleId=${articleId}`);
      if (!res.ok) throw new Error('加载失败');
      const data = await res.json();
      const tree = buildCommentTree(data.comments);
      setComments(tree);
      setTotal(data.total);
    } catch {
      setError('评论加载失败');
    } finally {
      setLoading(false);
    }
  }, [articleId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  function handleReplySuccess() {
    setReplyingTo(null);
    fetchComments();
  }

  // 骨架屏
  if (loading) {
    return (
      <section className="mt-16 sm:mt-24">
        <div className="mb-7 h-8 w-32 animate-pulse rounded bg-primary/10" />
        <div className="space-y-6 sm:space-y-7">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-3 sm:gap-4">
              <div className="comment-avatar-shell animate-pulse">
                <div className="h-10 w-10 rounded-full bg-primary/10" />
              </div>
              <div className="comment-state-card flex-1 animate-pulse text-left">
                <div className="h-4 w-28 rounded bg-primary/10" />
                <div className="mt-3 h-4 w-20 rounded bg-primary/10" />
                <div className="mt-4 h-16 rounded-xl bg-primary/10" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mt-16 sm:mt-24">
      <h2 className="mb-6 text-2xl font-bold text-[#5a472b] dark:text-text-dark sm:mb-8">
        评论 ({total})
      </h2>

      <div className="space-y-8 sm:space-y-10">
        <CommentForm
          articleId={articleId}
          onSubmitSuccess={handleReplySuccess}
        />

        <div className="border-t border-primary/12 pt-8 dark:border-primary/18 sm:pt-10">
          {error && (
            <div className="comment-state-card">
              <p className="text-sm text-red-500">{error}</p>
              <button
                type="button"
                onClick={fetchComments}
                className="mt-3 text-sm font-medium text-primary transition-colors hover:text-[#c08c58]"
              >
                重试
              </button>
            </div>
          )}

          {!error && comments.length === 0 && (
            <div className="comment-state-card">
              <p className="text-sm text-text-light/75 dark:text-text-dark/70">
                暂无评论，来发表第一条评论吧
              </p>
            </div>
          )}

          {!error && comments.length > 0 && (
            <div className="space-y-6 sm:space-y-7">
              {comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  articleId={articleId}
                  onReplySuccess={handleReplySuccess}
                  replyingTo={replyingTo}
                  onReplyClick={setReplyingTo}
                  onCancelReply={() => setReplyingTo(null)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
