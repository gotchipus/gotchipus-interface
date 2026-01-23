export type HookCategory = 'reward' | 'social' | 'defi' | 'rwa' | 'automation' | 'security';

export interface Hook {
  id: string;
  name: string;
  description: string;
  category: HookCategory;
  tags: string[];
  icon: string;
  address: string;
  network: string;
  sourceCode: string;
  abi?: string;
  explorerUrl?: string;
  creator: string;
  creatorName?: string;
  createdAt: Date;
  isAudited: boolean;
  auditReportUrl?: string;
  isVerified: boolean;
  usageCount: number;
  rating: number;
  reviewCount: number;
  features: string[];
  usageExample?: string;
  documentationUrl?: string;
  githubUrl?: string;
  hookPoints?: string[];
}

export interface HookReview {
  id: string;
  hookId: string;
  author: string;
  authorName?: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export type ViewMode = 'grid' | 'detail';

export interface HookFilters {
  category: HookCategory | 'all';
  searchQuery: string;
  sortBy: 'rating' | 'usage' | 'recent';
  onlyVerified: boolean;
  onlyAudited: boolean;
}
