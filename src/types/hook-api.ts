export interface ApiResponse<T> {
  code: number;
  status: string;
  data: T;
}

export interface HookApiData {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  icon: string;

  address: string;
  chain_id: number;
  source_code: string;
  abi: string;
  explorer_url: string;

  creator: string;
  creator_name: string;

  is_audited: boolean;
  audit_report_url: string;
  is_verified: boolean;

  usage_count: number;
  rating: number;
  review_count: number;

  features: string[];
  usage_example: string;
  documentation_url: string;
  github_url: string;

  hook_points: string[];
  version: string;

  created_at: string;
  updated_at: string;
}

export interface CreateHookRequest {
  name: string;
  description: string;
  category: string;
  tags: string[];
  icon: string;
  address: string;
  chain_id: number;
  source_code: string;
  abi: string;
  explorer_url: string;
  creator: string;
  creator_name: string;
  is_audited: boolean;
  audit_report_url: string;
  is_verified: boolean;
  usage_count: number;
  rating: number;
  review_count: number;
  features: string[];
  usage_example: string;
  documentation_url: string;
  github_url: string;
  hook_points: string[];
  version: string;
}

export interface GetHooksRequest {
  page: number;
}

export function apiDataToHook(data: HookApiData): any {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    category: data.category.toLowerCase() as any,
    tags: data.tags,
    icon: data.icon || '',

    address: data.address,
    network: 'Pharos Atlantic',
    sourceCode: data.source_code,
    abi: data.abi,
    explorerUrl: data.explorer_url,

    creator: data.creator,
    creatorName: data.creator_name,
    createdAt: new Date(data.created_at),

    isAudited: data.is_audited,
    auditReportUrl: data.audit_report_url,
    isVerified: data.is_verified,

    usageCount: data.usage_count,
    rating: data.rating,
    reviewCount: data.review_count,

    features: data.features,
    usageExample: data.usage_example,
    documentationUrl: data.documentation_url,
    githubUrl: data.github_url,

    hookPoints: data.hook_points,
  };
}
