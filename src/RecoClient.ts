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
    // Default to localhost for now if not provided, or a placeholder production URL
    const baseURL = options.baseUrl || 'http://localhost:3000'; 
    
    // Optimization: Use Keep-Alive agents to reuse TCP connections
    // This significantly reduces latency for sequential requests
    const httpAgent = new http.Agent({ keepAlive: true });
    const httpsAgent = new https.Agent({ keepAlive: true });

    this.client = axios.create({
      baseURL,
      timeout: options.timeout || 10000, // Default 10s timeout
      headers: {
        'x-api-key': options.apiKey,
        'Content-Type': 'application/json',
      },
      httpAgent,
      httpsAgent,
    });
  }

  /**
   * Get recommendations for a user
   */
  async getRecommendations(req: RecommendationRequest): Promise<RecommendationResponse> {
    const response = await this.client.post<RecommendationResponse>('/recommendations', req);
    return response.data;
  }

  /**
   * Track a single interaction
   */
  async trackInteraction(interaction: RecoInteraction): Promise<void> {
    // Fire and forget: We await the call but return void. 
    // In a real high-perf scenario, you might want to not await this at all in the main thread,
    // or use a background queue. Here we keep it simple but fast via keep-alive.
    await this.client.post('/interactions', interaction);
  }

  /**
   * Sync a single item
   */
  async upsertItem(item: RecoItem): Promise<void> {
    await this.client.post('/items', item);
  }

  /**
   * Sync multiple items (Batch)
   */
  async batchUpsertItems(items: RecoItem[]): Promise<void> {
    // Assuming the API supports batch upsert at /items/batch or similar
    // If not, this would need to map over them, but let's assume a bulk endpoint exists or main endpoint handles arrays
    await this.client.post('/items/batch', { items });
  }

  /**
   * Sync a single user
   */
  async upsertUser(user: RecoUser): Promise<void> {
    await this.client.post('/users', user);
  }
}
