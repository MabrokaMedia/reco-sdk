import axios, { AxiosInstance } from 'axios';
import http from 'http';
import https from 'https';
import { 
  RecoOptions, 
  RecoItem, 
  RecoUser, 
  RecoInteraction, 
  RecommendationRequest, 
  RecommendationResponse 
} from './types';

export class RecoClient {
  private client: AxiosInstance;

  constructor(options: RecoOptions) {
    // Determine Base URL
    let baseURL = options.baseUrl;
    
    // If no specific baseURL provided, construct it from default host + project ID
    if (!baseURL) {
      const defaultHost = 'https://reco-api.mioren.com';
      if (options.projectId) {
        baseURL = `${defaultHost}/api/v1/projects/${options.projectId}`;
      } else {
        baseURL = defaultHost; // Fallback, though ideally projectId should be present
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

  /**
   * Get recommendations for a user
   */
  async getRecommendations(req: RecommendationRequest): Promise<RecommendationResponse> {
    if (!req.user_id) {
       throw new Error("RecoSDK: Validation Error - 'user_id' is required for recommendations.");
    }
    const response = await this.client.post<RecommendationResponse>('/recommendations', req);
    return response.data;
  }

  /**
   * Track a single interaction
   */
  async trackInteraction(interaction: RecoInteraction): Promise<void> {
    if (!interaction.user_id || !interaction.item_id || !interaction.type) {
        throw new Error("RecoSDK: Validation Error - Interaction must have user_id, item_id, and type.");
    }
    // Fire and forget behavior (await but don't hold up if void is fine, usually we want to know if it failed though)
    await this.client.post('/interactions', interaction);
  }

  /**
   * Sync a single item
   */
  async upsertItem(item: RecoItem): Promise<void> {
    this.validateItem(item);
    await this.client.post('/items', item);
  }

  /**
   * Sync multiple items (Batch)
   */
  async batchUpsertItems(items: RecoItem[]): Promise<void> {
    if (!Array.isArray(items)) {
        throw new Error("RecoSDK: Validation Error - batchUpsertItems expects an array.");
    }
    items.forEach(i => this.validateItem(i));
    await this.client.post('/items/bulk', { items });
  }

  /**
   * Sync a single user
   */
  async upsertUser(user: RecoUser): Promise<void> {
    this.validateUser(user);
    await this.client.post('/users', user);
  }

  /**
   * Sync multiple users (Batch)
   */
  async batchUpsertUsers(users: RecoUser[]): Promise<void> {
    if (!Array.isArray(users)) {
        throw new Error("RecoSDK: Validation Error - batchUpsertUsers expects an array.");
    }
    users.forEach(u => this.validateUser(u));
    await this.client.post('/users/bulk', { users });
  }

  /**
   * Track multiple interactions (Batch)
   */
  async batchTrackInteractions(interactions: RecoInteraction[]): Promise<void> {
    await this.client.post('/interactions/bulk', { interactions });
  }

  /**
   * Delete an item
   */
  async deleteItem(itemId: string): Promise<void> {
    if (!itemId) throw new Error("RecoSDK: Validation Error - itemId is required.");
    await this.client.delete(`/items/${itemId}`);
  }

  /**
   * Bulk delete items
   */
  async batchDeleteItems(itemIds: string[]): Promise<void> {
    if (!itemIds || itemIds.length === 0) throw new Error("RecoSDK: Validation Error - itemIds array required.");
    await this.client.post('/items/bulk-delete', { item_ids: itemIds });
  }
}
