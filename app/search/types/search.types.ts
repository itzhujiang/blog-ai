export interface SearchResultItem {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  publishedAt: number | null;
  thumbnailUrl: string | null;
  categories: SearchCategoryTag[];
  commentCount: number;
}

export interface SearchCategoryTag {
  id: number;
  name: string;
  slug: string;
}

export type SearchSortType = 'relevance' | 'latest' | 'comments';

export interface SearchPageParams {
  q?: string;
  page?: string;
  sort?: string;
}

export interface SearchApiResponse {
  articles: SearchResultItem[];
  total: number;
  totalPages: number;
  query: string;
}
