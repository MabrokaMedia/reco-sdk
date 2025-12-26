import axios from 'axios';
import { RecoClient } from './RecoClient';
import {
  RecoItem,
  RecoUser,
  RecoInteraction,
  RecommendationRequest,
  RecommendationResponse,
} from './types';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('RecoClient', () => {
  let mockAxiosInstance: any;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Create a mock axios instance
    mockAxiosInstance = {
      post: jest.fn().mockResolvedValue({ data: {} }),
      get: jest.fn().mockResolvedValue({ data: {} }),
      delete: jest.fn().mockResolvedValue({ data: {} }),
      put: jest.fn().mockResolvedValue({ data: {} }),
    };
    
    mockedAxios.create.mockReturnValue(mockAxiosInstance as any);
  });

  describe('Constructor', () => {
    it('should create client with projectId', () => {
      const client = new RecoClient({
        apiKey: 'test-api-key',
        projectId: 'test-project-id',
      });

      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: 'https://reco-api.mioren.com/api/v1/projects/test-project-id',
        timeout: 10000,
        headers: {
          'x-api-key': 'test-api-key',
          'Content-Type': 'application/json',
        },
      });
    });

    it('should create client with custom baseUrl', () => {
      const client = new RecoClient({
        apiKey: 'test-api-key',
        baseUrl: 'https://custom-api.example.com',
      });

      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: 'https://custom-api.example.com',
        timeout: 10000,
        headers: {
          'x-api-key': 'test-api-key',
          'Content-Type': 'application/json',
        },
      });
    });

    it('should create client with custom timeout', () => {
      const client = new RecoClient({
        apiKey: 'test-api-key',
        projectId: 'test-project-id',
        timeout: 30000,
      });

      expect(mockedAxios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          timeout: 30000,
        })
      );
    });

    it('should throw error when no projectId and no baseUrl provided', () => {
      expect(() => {
        new RecoClient({
          apiKey: 'test-api-key',
        });
      }).toThrow("RecoSDK: 'projectId' is required in options unless 'baseUrl' is explicitly provided.");
    });

    it('should prefer baseUrl over projectId when both are provided', () => {
      const client = new RecoClient({
        apiKey: 'test-api-key',
        projectId: 'test-project-id',
        baseUrl: 'https://custom-api.example.com',
      });

      expect(mockedAxios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          baseURL: 'https://custom-api.example.com',
        })
      );
    });
  });

  describe('getRecommendations', () => {
    let client: RecoClient;

    beforeEach(() => {
      client = new RecoClient({
        apiKey: 'test-api-key',
        projectId: 'test-project-id',
      });
    });

    it('should get recommendations successfully', async () => {
      const mockResponse: RecommendationResponse = {
        recommendations: [
          { item_id: 'item-1' },
          { item_id: 'item-2' },
        ],
        recommendation_id: 'rec-123',
      };
      mockAxiosInstance.post.mockResolvedValue({ data: mockResponse });

      const request: RecommendationRequest = {
        user_id: 'user-456',
        limit: 10,
      };

      const result = await client.getRecommendations(request);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/recommendations', request);
      expect(result.recommendations).toHaveLength(2);
      expect(result.recommendation_id).toBe('rec-123');
    });

    it('should throw error when user_id is missing', async () => {
      const request = { limit: 10 } as RecommendationRequest;

      await expect(client.getRecommendations(request)).rejects.toThrow(
        "RecoSDK: Validation Error - 'user_id' is required for recommendations."
      );
    });

    it('should pass filter_expressions and filter_variables', async () => {
      mockAxiosInstance.post.mockResolvedValue({ data: { recommendations: [] } });

      const request: RecommendationRequest = {
        user_id: 'user-456',
        filter_expressions: ['gender == $requestedGender'],
        filter_variables: { requestedGender: 'female' },
      };

      await client.getRecommendations(request);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/recommendations', request);
    });

    it('should handle API errors', async () => {
      mockAxiosInstance.post.mockRejectedValue(new Error('Network error'));

      await expect(client.getRecommendations({ user_id: 'user-456' })).rejects.toThrow('Network error');
    });
  });

  describe('trackInteraction', () => {
    let client: RecoClient;

    beforeEach(() => {
      client = new RecoClient({
        apiKey: 'test-api-key',
        projectId: 'test-project-id',
      });
    });

    it('should track interaction successfully', async () => {
      const interaction: RecoInteraction = {
        user_id: 'user-456',
        item_id: 'item-123',
        type: 'click',
        value: 1,
      };

      await client.trackInteraction(interaction);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/interactions', interaction);
    });

    it('should throw error when user_id is missing', async () => {
      const interaction = {
        item_id: 'item-123',
        type: 'click',
        value: 1,
      } as RecoInteraction;

      await expect(client.trackInteraction(interaction)).rejects.toThrow(
        "RecoSDK: Validation Error - Interaction must have user_id, item_id, type, and value."
      );
    });

    it('should throw error when item_id is missing', async () => {
      const interaction = {
        user_id: 'user-456',
        type: 'click',
        value: 1,
      } as RecoInteraction;

      await expect(client.trackInteraction(interaction)).rejects.toThrow(
        "RecoSDK: Validation Error - Interaction must have user_id, item_id, type, and value."
      );
    });

    it('should throw error when type is missing', async () => {
      const interaction = {
        user_id: 'user-456',
        item_id: 'item-123',
        value: 1,
      } as RecoInteraction;

      await expect(client.trackInteraction(interaction)).rejects.toThrow(
        "RecoSDK: Validation Error - Interaction must have user_id, item_id, type, and value."
      );
    });

    it('should throw error when value is undefined', async () => {
      const interaction = {
        user_id: 'user-456',
        item_id: 'item-123',
        type: 'click',
      } as RecoInteraction;

      await expect(client.trackInteraction(interaction)).rejects.toThrow(
        "RecoSDK: Validation Error - Interaction must have user_id, item_id, type, and value."
      );
    });

    it('should throw error when value is null', async () => {
      const interaction = {
        user_id: 'user-456',
        item_id: 'item-123',
        type: 'click',
        value: null as any,
      };

      await expect(client.trackInteraction(interaction)).rejects.toThrow(
        "RecoSDK: Validation Error - Interaction must have user_id, item_id, type, and value."
      );
    });

    it('should throw error when impression type has non-zero value', async () => {
      const interaction: RecoInteraction = {
        user_id: 'user-456',
        item_id: 'item-123',
        type: 'impression',
        value: 1,
      };

      await expect(client.trackInteraction(interaction)).rejects.toThrow(
        "RecoSDK: Validation Error - Interaction type 'impression' must have value 0."
      );
    });

    it('should allow impression type with value 0', async () => {
      const interaction: RecoInteraction = {
        user_id: 'user-456',
        item_id: 'item-123',
        type: 'impression',
        value: 0,
      };

      await client.trackInteraction(interaction);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/interactions', interaction);
    });

    it('should allow value 0 for non-impression types', async () => {
      const interaction: RecoInteraction = {
        user_id: 'user-456',
        item_id: 'item-123',
        type: 'view',
        value: 0,
      };

      await client.trackInteraction(interaction);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/interactions', interaction);
    });
  });

  describe('upsertItem', () => {
    let client: RecoClient;

    beforeEach(() => {
      client = new RecoClient({
        apiKey: 'test-api-key',
        projectId: 'test-project-id',
      });
    });

    it('should upsert item successfully', async () => {
      const item: RecoItem = {
        item_id: 'item-123',
        attributes: { category: 'electronics' },
      };

      await client.upsertItem(item);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/items', item);
    });

    it('should throw error when item_id is missing', async () => {
      const item = { attributes: { category: 'electronics' } } as unknown as RecoItem;

      await expect(client.upsertItem(item)).rejects.toThrow(
        "RecoSDK: Validation Error - 'item_id' is required for item operations."
      );
    });

    it('should throw error when item_id is empty string', async () => {
      const item: RecoItem = { item_id: '' };

      await expect(client.upsertItem(item)).rejects.toThrow(
        "RecoSDK: Validation Error - 'item_id' is required for item operations."
      );
    });
  });

  describe('batchUpsertItems', () => {
    let client: RecoClient;

    beforeEach(() => {
      client = new RecoClient({
        apiKey: 'test-api-key',
        projectId: 'test-project-id',
      });
    });

    it('should batch upsert items successfully', async () => {
      const items: RecoItem[] = [
        { item_id: 'item-1' },
        { item_id: 'item-2' },
        { item_id: 'item-3' },
      ];

      await client.batchUpsertItems(items);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/items/bulk', { items });
    });

    it('should throw error when items is not an array', async () => {
      await expect(client.batchUpsertItems('not-an-array' as any)).rejects.toThrow(
        "RecoSDK: Validation Error - batchUpsertItems expects an array."
      );
    });

    it('should throw error when any item is missing item_id', async () => {
      const items = [
        { item_id: 'item-1' },
        { attributes: {} } as RecoItem,
      ];

      await expect(client.batchUpsertItems(items)).rejects.toThrow(
        "RecoSDK: Validation Error - 'item_id' is required for item operations."
      );
    });

    it('should allow empty array', async () => {
      await client.batchUpsertItems([]);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/items/bulk', { items: [] });
    });
  });

  describe('upsertUser', () => {
    let client: RecoClient;

    beforeEach(() => {
      client = new RecoClient({
        apiKey: 'test-api-key',
        projectId: 'test-project-id',
      });
    });

    it('should upsert user successfully', async () => {
      const user: RecoUser = {
        user_id: 'user-456',
        attributes: { age: 25 },
      };

      await client.upsertUser(user);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/users', user);
    });

    it('should throw error when user_id is missing', async () => {
      const user = { attributes: { age: 25 } } as unknown as RecoUser;

      await expect(client.upsertUser(user)).rejects.toThrow(
        "RecoSDK: Validation Error - 'user_id' is required for user operations."
      );
    });

    it('should throw error when user_id is empty string', async () => {
      const user: RecoUser = { user_id: '' };

      await expect(client.upsertUser(user)).rejects.toThrow(
        "RecoSDK: Validation Error - 'user_id' is required for user operations."
      );
    });
  });

  describe('batchUpsertUsers', () => {
    let client: RecoClient;

    beforeEach(() => {
      client = new RecoClient({
        apiKey: 'test-api-key',
        projectId: 'test-project-id',
      });
    });

    it('should batch upsert users successfully', async () => {
      const users: RecoUser[] = [
        { user_id: 'user-1' },
        { user_id: 'user-2' },
        { user_id: 'user-3' },
      ];

      await client.batchUpsertUsers(users);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/users/bulk', { users });
    });

    it('should throw error when users is not an array', async () => {
      await expect(client.batchUpsertUsers('not-an-array' as any)).rejects.toThrow(
        "RecoSDK: Validation Error - batchUpsertUsers expects an array."
      );
    });

    it('should throw error when any user is missing user_id', async () => {
      const users = [
        { user_id: 'user-1' },
        { attributes: {} } as RecoUser,
      ];

      await expect(client.batchUpsertUsers(users)).rejects.toThrow(
        "RecoSDK: Validation Error - 'user_id' is required for user operations."
      );
    });

    it('should allow empty array', async () => {
      await client.batchUpsertUsers([]);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/users/bulk', { users: [] });
    });
  });

  describe('batchTrackInteractions', () => {
    let client: RecoClient;

    beforeEach(() => {
      client = new RecoClient({
        apiKey: 'test-api-key',
        projectId: 'test-project-id',
      });
    });

    it('should batch track interactions successfully', async () => {
      const interactions: RecoInteraction[] = [
        { user_id: 'user-1', item_id: 'item-1', type: 'click', value: 1 },
        { user_id: 'user-2', item_id: 'item-2', type: 'view', value: 1 },
      ];

      await client.batchTrackInteractions(interactions);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/interactions/bulk', { interactions });
    });

    it('should allow empty array', async () => {
      await client.batchTrackInteractions([]);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/interactions/bulk', { interactions: [] });
    });
  });

  describe('deleteItem', () => {
    let client: RecoClient;

    beforeEach(() => {
      client = new RecoClient({
        apiKey: 'test-api-key',
        projectId: 'test-project-id',
      });
    });

    it('should delete item successfully', async () => {
      await client.deleteItem('item-123');

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/items/item-123');
    });

    it('should throw error when itemId is empty', async () => {
      await expect(client.deleteItem('')).rejects.toThrow(
        "RecoSDK: Validation Error - itemId is required."
      );
    });

    it('should handle special characters in itemId', async () => {
      await client.deleteItem('item-with-special/chars');

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/items/item-with-special/chars');
    });
  });

  describe('batchDeleteItems', () => {
    let client: RecoClient;

    beforeEach(() => {
      client = new RecoClient({
        apiKey: 'test-api-key',
        projectId: 'test-project-id',
      });
    });

    it('should batch delete items successfully', async () => {
      const itemIds = ['item-1', 'item-2', 'item-3'];

      await client.batchDeleteItems(itemIds);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/items/bulk-delete', { item_ids: itemIds });
    });

    it('should throw error when itemIds is empty array', async () => {
      await expect(client.batchDeleteItems([])).rejects.toThrow(
        "RecoSDK: Validation Error - itemIds array required."
      );
    });

    it('should throw error when itemIds is undefined', async () => {
      await expect(client.batchDeleteItems(undefined as any)).rejects.toThrow(
        "RecoSDK: Validation Error - itemIds array required."
      );
    });

    it('should throw error when itemIds is null', async () => {
      await expect(client.batchDeleteItems(null as any)).rejects.toThrow(
        "RecoSDK: Validation Error - itemIds array required."
      );
    });
  });

  describe('deleteUser', () => {
    let client: RecoClient;

    beforeEach(() => {
      client = new RecoClient({
        apiKey: 'test-api-key',
        projectId: 'test-project-id',
      });
    });

    it('should delete user successfully', async () => {
      await client.deleteUser('user-456');

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/users/user-456');
    });

    it('should throw error when userId is empty', async () => {
      await expect(client.deleteUser('')).rejects.toThrow(
        "RecoSDK: Validation Error - userId is required."
      );
    });
  });

  describe('batchDeleteUsers', () => {
    let client: RecoClient;

    beforeEach(() => {
      client = new RecoClient({
        apiKey: 'test-api-key',
        projectId: 'test-project-id',
      });
    });

    it('should batch delete users successfully', async () => {
      const userIds = ['user-1', 'user-2', 'user-3'];

      await client.batchDeleteUsers(userIds);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/users/bulk-delete', { user_ids: userIds });
    });

    it('should throw error when userIds is empty array', async () => {
      await expect(client.batchDeleteUsers([])).rejects.toThrow(
        "RecoSDK: Validation Error - userIds array required."
      );
    });

    it('should throw error when userIds is undefined', async () => {
      await expect(client.batchDeleteUsers(undefined as any)).rejects.toThrow(
        "RecoSDK: Validation Error - userIds array required."
      );
    });

    it('should throw error when userIds is null', async () => {
      await expect(client.batchDeleteUsers(null as any)).rejects.toThrow(
        "RecoSDK: Validation Error - userIds array required."
      );
    });
  });

  describe('Error Handling', () => {
    let client: RecoClient;

    beforeEach(() => {
      client = new RecoClient({
        apiKey: 'test-api-key',
        projectId: 'test-project-id',
      });
    });

    it('should propagate axios errors', async () => {
      const axiosError = {
        response: {
          status: 401,
          data: { message: 'Unauthorized' },
        },
        message: 'Request failed with status code 401',
      };
      mockAxiosInstance.post.mockRejectedValue(axiosError);

      await expect(client.getRecommendations({ user_id: 'user-456' })).rejects.toEqual(axiosError);
    });

    it('should handle network errors', async () => {
      mockAxiosInstance.post.mockRejectedValue(new Error('ECONNREFUSED'));

      await expect(client.upsertItem({ item_id: 'item-123' })).rejects.toThrow('ECONNREFUSED');
    });

    it('should handle timeout errors', async () => {
      const timeoutError = new Error('timeout of 10000ms exceeded');
      mockAxiosInstance.delete.mockRejectedValue(timeoutError);

      await expect(client.deleteItem('item-123')).rejects.toThrow('timeout of 10000ms exceeded');
    });
  });
});
