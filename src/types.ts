export interface RecombeOptions {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
}

export interface RecombeItem {
  id: string;
  [key: string]: any;
}

export interface RecombeUser {
  id: string;
  [key: string]: any;
}

export interface RecombeInteraction {
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
  recommendations: RecombeItem[];
  recommendation_id: string;
}
