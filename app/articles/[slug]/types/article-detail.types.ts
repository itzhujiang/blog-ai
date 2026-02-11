export interface ArticleDetail {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  authorName: string;
  publishedAt: number | null;
  thumbnailUrl: string | null;
  categories: ArticleCategory[];
  commentCount: number;
  content: string;
}

export interface ArticleCategory {
  id: number;
  name: string;
  slug: string;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface CommentItem {
  id: number;
  authorName: string;
  content: string;
  createdAt: number;
  isAuthor: boolean;
  parentId: number | null;
  replies: CommentItem[];
}

export interface CommentApiResponse {
  comments: CommentItem[];
  total: number;
}

export interface CommentPostBody {
  articleId: number;
  parentId?: number | null;
  authorName: string;
  authorEmail?: string;
  content: string;
  captchaToken: string;
  captchaAnswer: string;
}

export interface CaptchaResponse {
  svg: string;
  token: string;
}

export interface ArticleStatsData {
  viewCount: number;
  readingTime: number;
}
