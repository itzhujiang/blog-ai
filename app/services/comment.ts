/**
 * 评论服务
 */

export interface CommentResult {
  id: number;
  authorName: string;
  content: string;
  createdAt: number;
  isAuthor: boolean;
  parentId: number | null;
}

export interface CreateCommentParams {
  articleId: number;
  parentId: number | null;
  authorName: string;
  authorEmail: string | null;
  authorPhone: string | null;
  content: string;
  authorIp: string | null;
}

/**
 * 获取文章的已审核评论列表
 */
export async function getCommentsByArticleId(
  articleId: number,
): Promise<{ comments: CommentResult[]; total: number }> {
  const { initAllModels } = await import('@/utils/models');
  const { Comment, SiteSetting } = await initAllModels();

  // 获取博主名称，用于标记 isAuthor
  const authorSetting = await SiteSetting.findOne({
    where: { settingKey: 'author_name' },
    attributes: ['settingValue'],
  });
  const blogAuthorName = authorSetting?.settingValue || '';

  const rows = await Comment.findAll({
    where: { articleId, status: 'approved' },
    order: [['createdAt', 'ASC']],
  });

  const comments: CommentResult[] = rows.map((c) => ({
    id: c.id,
    authorName: c.authorName,
    content: c.content,
    createdAt: c.createdAt
      ? parseInt(String(c.createdAt), 10)
      : Date.now(),
    isAuthor: c.authorName === blogAuthorName,
    parentId: c.parentId ?? null,
  }));

  return { comments, total: comments.length };
}

/**
 * 创建新评论（待审核状态）
 */
export async function createComment(params: CreateCommentParams) {
  const { initAllModels } = await import('@/utils/models');
  const { Comment } = await initAllModels();

  const comment = await Comment.create({
    articleId: params.articleId,
    parentId: params.parentId,
    authorName: params.authorName,
    authorEmail: params.authorEmail,
    authorPhone: params.authorPhone,
    content: params.content,
    authorIp: params.authorIp,
    status: 'pending',
  });

  return {
    id: comment.id,
    authorName: comment.authorName,
    content: comment.content,
    createdAt: comment.createdAt
      ? parseInt(String(comment.createdAt), 10)
      : Date.now(),
    status: comment.status,
  };
}
