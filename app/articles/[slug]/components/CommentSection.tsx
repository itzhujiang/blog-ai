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
        <div className="h-8 w-32 animate-pulse rounded bg-primary/10" />
        <div className="mt-6 space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="h-10 w-10 animate-pulse rounded-full bg-primary/10" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-24 animate-pulse rounded bg-primary/10" />
                <div className="h-16 animate-pulse rounded-lg bg-primary/5" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mt-16 sm:mt-24">
      <h2 className="text-2xl font-bold text-[#5a472b] dark:text-text-dark mb-6">
        评论 ({total})
      </h2>

      <div className="space-y-8">
        {/* 发表评论表单 */}
        <CommentForm
          articleId={articleId}
          onSubmitSuccess={handleReplySuccess}
        />

        {/* 错误提示 */}
        {error && (
          <div className="text-center py-8">
            <p className="text-sm text-red-500 mb-3">{error}</p>
            <button
              type="button"
              onClick={fetchComments}
              className="text-sm text-primary hover:underline"
            >
              重试
            </button>
          </div>
        )}

        {/* 评论列表 */}
        {!error && comments.length === 0 && (
          <p className="py-8 text-center text-sm text-text-light/60 dark:text-text-dark/60">
            暂无评论，来发表第一条评论吧
          </p>
        )}

        {!error && comments.length > 0 && (
          <div className="space-y-6">
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
    </section>
  );
}
