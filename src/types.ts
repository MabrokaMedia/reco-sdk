/**
 * Reco SDK Types
 * 
 * Core type definitions for the Reco recommendation API SDK.
 * These types can be imported and used by any project that uses this SDK.
 */

// =============================================================================
// Configuration Types
// =============================================================================

/**
 * SDK configuration options
 */
export interface RecoOptions {
  /** API key for authentication */
  apiKey: string;
  /** Project ID (required unless baseUrl is provided) */
  projectId?: string;
  /** Custom base URL (overrides default) */
  baseUrl?: string;
  /** Request timeout in milliseconds (default: 10000) */
  timeout?: number;
}

// =============================================================================
// Item Types
// =============================================================================

/**
 * Item attributes - flexible key-value pairs for item metadata
 */
export type RecoItemAttributes = Record<string, string | number | boolean | string[] | number[] | null | undefined>;

/**
 * Item entity representing a recommendable item
 */
export interface RecoItem {
  /** Unique item identifier */
  item_id: string;
  /** Item attributes/metadata */
  attributes?: RecoItemAttributes;
  /** Whether the item is available for recommendations */
  available?: boolean;
  /** ISO 8601 timestamp of item creation */
  created_at?: string;
}

// =============================================================================
// User Types
// =============================================================================

/**
 * User attributes - flexible key-value pairs for user metadata
 */
export type RecoUserAttributes = Record<string, string | number | boolean | string[] | number[] | null | undefined>;

/**
 * User entity representing a user who receives recommendations
 */
export interface RecoUser {
  /** Unique user identifier */
  user_id: string;
  /** User attributes/metadata */
  attributes?: RecoUserAttributes;
  /** ISO 8601 timestamp of user creation */
  created_at?: string;
}

// =============================================================================
// Interaction Types
// =============================================================================

/**
 * Interaction context - flexible key-value pairs for interaction metadata
 * Examples: device info, location, session data, currency codes, etc.
 */
export type RecoInteractionContext = Record<string, string | number | boolean | null | undefined>;

/**
 * Interaction entity representing a user-item interaction
 */
export interface RecoInteraction {
  /** User ID who performed the interaction */
  user_id: string;
  /** Item ID that was interacted with */
  item_id: string;
  /** Interaction type (e.g., "view", "click", "purchase", "ad_revenue") */
  type: string;
  /** Numeric value associated with the interaction (e.g., rating, price, revenue) */
  value: number;
  /** ISO 8601 timestamp of the interaction */
  timestamp?: string;
  /** Additional context/metadata for the interaction */
  context?: RecoInteractionContext;
}

// =============================================================================
// Recommendation Types
// =============================================================================

/**
 * Request parameters for getting recommendations
 */
export interface RecommendationRequest {
  /** User ID to get recommendations for */
  user_id: string;
  /** Maximum number of recommendations to return */
  limit?: number;
  /** Filter expressions (DSL-based filters) */
  filter_expressions?: string[];
  /** Variables to use in filter expressions */
  filter_variables?: Record<string, string | number | boolean>;
  /** Booster expressions to modify scores */
  booster_expressions?: string[];
  /** Pagination cursor */
  cursor?: string;
  /** @deprecated Use filter_expressions instead */
  filters?: Record<string, any>;
}

/**
 * Recommended item with score
 */
export interface RecommendedItem extends RecoItem {
  /** Recommendation score (higher = more relevant) */
  score?: number;
}

/**
 * Response from recommendations endpoint
 */
export interface RecommendationResponse {
  /** List of recommended items */
  recommendations: RecommendedItem[];
  /** Raw items array (alternative accessor) */
  items?: RecommendedItem[];
  /** Unique ID for this recommendation request */
  recommendation_id?: string;
  /** Pagination cursor for next page */
  next_cursor?: string;
  /** Total count of available recommendations */
  total_count?: number;
}

// =============================================================================
// API Response Types
// =============================================================================

/**
 * Generic API response wrapper
 */
export interface RecoApiResponse<T> {
  /** Response data */
  data?: T;
  /** Error message if request failed */
  error?: string;
  /** HTTP status code */
  status?: number;
}

/**
 * Batch operation result
 */
export interface RecoBatchResult {
  /** Number of items successfully processed */
  success_count: number;
  /** Number of items that failed to process */
  error_count: number;
  /** Error details for failed items */
  errors?: Array<{
    id: string;
    error: string;
  }>;
}
