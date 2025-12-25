export interface RecoOptions {
  apiKey: string;
  projectId?: string;
  baseUrl?: string;
  timeout?: number;
}

export interface RecoItem {
  id: string;
  [key: string]: any;
}

export interface RecoUser {
  id: string;
  [key: string]: any;
}

export interface RecoInteraction {
  user_id: string;
  item_id: string;
  type: string;
  timestamp?: string;
  [key: string]: any;
}

export interface RecommendationRequest {
  user_id: string;
  limit?: number;
  filters?: Record<string, any>;
}

export interface RecommendationResponse {
  recommendations: RecoItem[];
  recommendation_id: string;
}
