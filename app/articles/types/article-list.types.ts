export interface ArticleListItem {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  publishedAt: number | null;
  thumbnailUrl: string | null;
  categories: CategoryTag[];
  commentCount: number;
}

export interface CategoryTag {
  id: number;
  name: string;
  slug: string;
  articleCount?: number;
}

export type SortType = 'latest' | 'comments';

export interface ArticleListSearchParams {
  page?: string;
  category?: string;
  sort?: string;
}
