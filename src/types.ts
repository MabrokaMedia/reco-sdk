export interface RecoOptions {
  apiKey: string;
  projectId?: string;
  baseUrl?: string;
  timeout?: number;
}

export interface RecoItem {
  item_id: string;
  attributes?: Record<string, any>;
  available?: boolean;
  created_at?: string;
  [key: string]: any; // Allow other properties for flexibility but key ones are typed
}

export interface RecoUser {
  user_id: string;
  attributes?: Record<string, any>;
  created_at?: string;
  [key: string]: any;
}

export interface RecoInteraction {
  user_id: string;
  item_id: string;
  type: string;
  timestamp?: string; // ISO 8601
  value: number;
  context?: Record<string, any>;
  [key: string]: any;
}

export interface RecommendationRequest {
  user_id: string;
  limit?: number;
  filters?: Record<string, any>;
  filter_expressions?: string[];
  filter_variables?: Record<string, any>;
  cursor?: string;
}

export interface RecommendationResponse {
  recommendations: RecoItem[]; // This might need adjustment if the response format is different
  items?: any[]; // The raw items from response if structure differs
  recommendation_id?: string;
  [key: string]: any;
}
