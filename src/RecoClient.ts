import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  RecoOptions, 
  RecoItem, 
  RecoUser, 
  RecoInteraction, 
  RecommendationRequest, 
  RecommendationResponse,
  RecoBatchResult
} from './types';

/**
 * Reco SDK Client
 * 
 * Main client class for interacting with the Reco recommendation API.
 * Provides fully-typed methods for items, users, interactions, and recommendations.
 * 
 * @example
 * ```typescript
 * const client = new RecoClient({
 *   apiKey: 'your-api-key',
 *   projectId: 'your-project-id'
 * });
 * 
 * // Track an interaction
 * await client.trackInteraction({
 *   user_id: 'user-123',
 *   item_id: 'item-456',
 *   type: 'view',
 *   value: 1
 * });
 * 
 * // Get recommendations
 * const recs = await client.getRecommendations({
 *   user_id: 'user-123',
 *   limit: 10
 * });
 * ```
 */
export class RecoClient {
  private readonly client: AxiosInstance;

  /**
   * Create a new RecoClient instance
   * @param options - SDK configuration options
   * @throws Error if projectId is missing and baseUrl is not provided
   */
  constructor(options: RecoOptions) {
    let baseURL = options.baseUrl;
    
    if (!baseURL) {
      const defaultHost = 'https://reco-api.mioren.com';
      if (options.projectId) {
        baseURL = `${defaultHost}/api/v1/projects/${options.projectId}`;
      } else {
        throw new Error("RecoSDK: 'projectId' is required in options unless 'baseUrl' is explicitly provided.");
      }
    }

    this.client = axios.create({
      baseURL,
      timeout: options.timeout || 10000,
      headers: {
        'x-api-key': options.apiKey,
        'Content-Type': 'application/json',
      },
    });
  }

  // ===========================================================================
  // Validation Helpers
  // ===========================================================================

  private validateItem(item: RecoItem): void {
    if (!item.item_id) {
      throw new Error("RecoSDK: Validation Error - 'item_id' is required for item operations.");
    }
  }

  private validateUser(user: RecoUser): void {
    if (!user.user_id) {
      throw new Error("RecoSDK: Validation Error - 'user_id' is required for user operations.");
    }
  }

  private validateInteraction(interaction: RecoInteraction): void {
    if (!interaction.user_id) {
      throw new Error("RecoSDK: Validation Error - 'user_id' is required for interactions.");
    }
    if (!interaction.item_id) {
      throw new Error("RecoSDK: Validation Error - 'item_id' is required for interactions.");
    }
    if (!interaction.type) {
      throw new Error("RecoSDK: Validation Error - 'type' is required for interactions.");
    }
    if (interaction.value === undefined || interaction.value === null) {
      throw new Error("RecoSDK: Validation Error - 'value' is required for interactions.");
    }
    if (interaction.type === "impression" && interaction.value !== 0) {
      throw new Error("RecoSDK: Validation Error - Interaction type 'impression' must have value 0.");
    }
  }

  // ===========================================================================
  // Recommendation Operations
  // ===========================================================================

  /**
   * Get personalized recommendations for a user
   * @param request - Recommendation request parameters
   * @returns Promise with recommendation response
   * @throws Error if user_id is missing
   */
  async getRecommendations(request: RecommendationRequest): Promise<RecommendationResponse> {
    if (!request.user_id) {
      throw new Error("RecoSDK: Validation Error - 'user_id' is required for recommendations.");
    }
    const response: AxiosResponse<RecommendationResponse> = await this.client.post('/recommendations', request);
    return response.data;
  }

  // ===========================================================================
  // Interaction Operations
  // ===========================================================================

  /**
   * Track a single user-item interaction
   * @param interaction - The interaction to track
   * @throws Error if required fields are missing
   */
  async trackInteraction(interaction: RecoInteraction): Promise<void> {
    this.validateInteraction(interaction);
    await this.client.post('/interactions', interaction);
  }

  /**
   * Track multiple interactions in a single request
   * @param interactions - Array of interactions to track
   */
  async batchTrackInteractions(interactions: RecoInteraction[]): Promise<void> {
    if (!Array.isArray(interactions)) {
      throw new Error("RecoSDK: Validation Error - batchTrackInteractions expects an array.");
    }
    interactions.forEach(i => this.validateInteraction(i));
    await this.client.post('/interactions/bulk', { interactions });
  }

  // ===========================================================================
  // Item Operations
  // ===========================================================================

  /**
   * Create or update a single item
   * @param item - The item to upsert
   * @throws Error if item_id is missing
   */
  async upsertItem(item: RecoItem): Promise<void> {
    this.validateItem(item);
    await this.client.post('/items', item);
  }

  /**
   * Create or update multiple items in a single request
   * @param items - Array of items to upsert
   * @throws Error if any item is missing item_id
   */
  async batchUpsertItems(items: RecoItem[]): Promise<void> {
    if (!Array.isArray(items)) {
      throw new Error("RecoSDK: Validation Error - batchUpsertItems expects an array.");
    }
    items.forEach(i => this.validateItem(i));
    await this.client.post('/items/bulk', { items });
  }

  /**
   * Delete an item by ID
   * @param itemId - The item ID to delete
   * @throws Error if itemId is missing
   */
  async deleteItem(itemId: string): Promise<void> {
    if (!itemId) {
      throw new Error("RecoSDK: Validation Error - itemId is required.");
    }
    await this.client.delete(`/items/${itemId}`);
  }

  /**
   * Delete multiple items by IDs
   * @param itemIds - Array of item IDs to delete
   * @throws Error if itemIds is empty
   */
  async batchDeleteItems(itemIds: string[]): Promise<void> {
    if (!itemIds || itemIds.length === 0) {
      throw new Error("RecoSDK: Validation Error - itemIds array is required and cannot be empty.");
    }
    await this.client.post('/items/bulk-delete', { item_ids: itemIds });
  }

  // ===========================================================================
  // User Operations
  // ===========================================================================

  /**
   * Create or update a single user
   * @param user - The user to upsert
   * @throws Error if user_id is missing
   */
  async upsertUser(user: RecoUser): Promise<void> {
    this.validateUser(user);
    await this.client.post('/users', user);
  }

  /**
   * Create or update multiple users in a single request
   * @param users - Array of users to upsert
   * @throws Error if any user is missing user_id
   */
  async batchUpsertUsers(users: RecoUser[]): Promise<void> {
    if (!Array.isArray(users)) {
      throw new Error("RecoSDK: Validation Error - batchUpsertUsers expects an array.");
    }
    users.forEach(u => this.validateUser(u));
    await this.client.post('/users/bulk', { users });
  }

  /**
   * Delete a user by ID
   * @param userId - The user ID to delete
   * @throws Error if userId is missing
   */
  async deleteUser(userId: string): Promise<void> {
    if (!userId) {
      throw new Error("RecoSDK: Validation Error - userId is required.");
    }
    await this.client.delete(`/users/${userId}`);
  }

  /**
   * Delete multiple users by IDs
   * @param userIds - Array of user IDs to delete
   * @throws Error if userIds is empty
   */
  async batchDeleteUsers(userIds: string[]): Promise<void> {
    if (!userIds || userIds.length === 0) {
      throw new Error("RecoSDK: Validation Error - userIds array is required and cannot be empty.");
    }
    await this.client.post('/users/bulk-delete', { user_ids: userIds });
  }
}
