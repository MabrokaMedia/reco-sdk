import {
  RecoOptions,
  RecoItem,
  RecoUser,
  RecoInteraction,
  RecommendationRequest,
  RecommendationResponse,
} from './types';

describe('Types', () => {
  describe('RecoOptions', () => {
    it('should allow valid options with projectId', () => {
      const options: RecoOptions = {
        apiKey: 'test-api-key',
        projectId: 'test-project-id',
      };
      expect(options.apiKey).toBe('test-api-key');
      expect(options.projectId).toBe('test-project-id');
    });

    it('should allow valid options with baseUrl', () => {
      const options: RecoOptions = {
        apiKey: 'test-api-key',
        baseUrl: 'https://custom-api.example.com',
      };
      expect(options.apiKey).toBe('test-api-key');
      expect(options.baseUrl).toBe('https://custom-api.example.com');
    });

    it('should allow custom timeout', () => {
      const options: RecoOptions = {
        apiKey: 'test-api-key',
        projectId: 'test-project-id',
        timeout: 30000,
      };
      expect(options.timeout).toBe(30000);
    });

    it('should allow all optional properties', () => {
      const options: RecoOptions = {
        apiKey: 'test-api-key',
        projectId: 'test-project-id',
        baseUrl: 'https://custom-api.example.com',
        timeout: 5000,
      };
      expect(options.apiKey).toBe('test-api-key');
      expect(options.projectId).toBe('test-project-id');
      expect(options.baseUrl).toBe('https://custom-api.example.com');
      expect(options.timeout).toBe(5000);
    });
  });

  describe('RecoItem', () => {
    it('should allow valid item with only item_id', () => {
      const item: RecoItem = {
        item_id: 'item-123',
      };
      expect(item.item_id).toBe('item-123');
    });

    it('should allow item with all optional properties', () => {
      const item: RecoItem = {
        item_id: 'item-123',
        available: true,
        created_at: '2024-01-01T00:00:00Z',
        attributes: {
          category: 'electronics',
          price: 99.99,
        },
      };
      expect(item.item_id).toBe('item-123');
      expect(item.available).toBe(true);
      expect(item.created_at).toBe('2024-01-01T00:00:00Z');
      expect(item.attributes?.category).toBe('electronics');
    });

    it('should allow custom properties', () => {
      const item: RecoItem = {
        item_id: 'item-123',
        custom_field: 'custom_value',
        another_field: 123,
      };
      expect(item.custom_field).toBe('custom_value');
      expect(item.another_field).toBe(123);
    });
  });

  describe('RecoUser', () => {
    it('should allow valid user with only user_id', () => {
      const user: RecoUser = {
        user_id: 'user-456',
      };
      expect(user.user_id).toBe('user-456');
    });

    it('should allow user with all optional properties', () => {
      const user: RecoUser = {
        user_id: 'user-456',
        created_at: '2024-01-01T00:00:00Z',
        attributes: {
          age: 25,
          gender: 'male',
        },
      };
      expect(user.user_id).toBe('user-456');
      expect(user.created_at).toBe('2024-01-01T00:00:00Z');
      expect(user.attributes?.age).toBe(25);
    });

    it('should allow custom properties', () => {
      const user: RecoUser = {
        user_id: 'user-456',
        email: 'user@example.com',
        preferences: ['music', 'sports'],
      };
      expect(user.email).toBe('user@example.com');
      expect(user.preferences).toEqual(['music', 'sports']);
    });
  });

  describe('RecoInteraction', () => {
    it('should allow valid interaction with required fields', () => {
      const interaction: RecoInteraction = {
        user_id: 'user-456',
        item_id: 'item-123',
        type: 'click',
        value: 1,
      };
      expect(interaction.user_id).toBe('user-456');
      expect(interaction.item_id).toBe('item-123');
      expect(interaction.type).toBe('click');
      expect(interaction.value).toBe(1);
    });

    it('should allow interaction with optional fields', () => {
      const interaction: RecoInteraction = {
        user_id: 'user-456',
        item_id: 'item-123',
        type: 'purchase',
        value: 5,
        timestamp: '2024-01-01T12:00:00Z',
        context: {
          source: 'homepage',
          device: 'mobile',
        },
      };
      expect(interaction.timestamp).toBe('2024-01-01T12:00:00Z');
      expect(interaction.context?.source).toBe('homepage');
    });

    it('should allow impression with value 0', () => {
      const interaction: RecoInteraction = {
        user_id: 'user-456',
        item_id: 'item-123',
        type: 'impression',
        value: 0,
      };
      expect(interaction.type).toBe('impression');
      expect(interaction.value).toBe(0);
    });

    it('should allow custom properties', () => {
      const interaction: RecoInteraction = {
        user_id: 'user-456',
        item_id: 'item-123',
        type: 'view',
        value: 1,
        session_id: 'session-789',
      };
      expect(interaction.session_id).toBe('session-789');
    });
  });

  describe('RecommendationRequest', () => {
    it('should allow valid request with only user_id', () => {
      const request: RecommendationRequest = {
        user_id: 'user-456',
      };
      expect(request.user_id).toBe('user-456');
    });

    it('should allow request with limit', () => {
      const request: RecommendationRequest = {
        user_id: 'user-456',
        limit: 10,
      };
      expect(request.limit).toBe(10);
    });

    it('should allow request with filters', () => {
      const request: RecommendationRequest = {
        user_id: 'user-456',
        filters: {
          category: 'electronics',
          price_range: [0, 100],
        },
      };
      expect(request.filters?.category).toBe('electronics');
    });

    it('should allow request with filter_expressions', () => {
      const request: RecommendationRequest = {
        user_id: 'user-456',
        filter_expressions: ['category == "electronics"', 'price < 100'],
      };
      expect(request.filter_expressions).toHaveLength(2);
    });

    it('should allow request with filter_variables', () => {
      const request: RecommendationRequest = {
        user_id: 'user-456',
        filter_expressions: ['gender == $requestedGender'],
        filter_variables: {
          requestedGender: 'male',
        },
      };
      expect(request.filter_variables?.requestedGender).toBe('male');
    });

    it('should allow request with cursor for pagination', () => {
      const request: RecommendationRequest = {
        user_id: 'user-456',
        cursor: 'eyJvZmZzZXQiOjEwfQ==',
      };
      expect(request.cursor).toBe('eyJvZmZzZXQiOjEwfQ==');
    });

    it('should allow request with all options', () => {
      const request: RecommendationRequest = {
        user_id: 'user-456',
        limit: 20,
        filters: { available: true },
        filter_expressions: ['price < $maxPrice'],
        filter_variables: { maxPrice: 500 },
        cursor: 'abc123',
      };
      expect(request.user_id).toBe('user-456');
      expect(request.limit).toBe(20);
      expect(request.filters?.available).toBe(true);
      expect(request.filter_expressions).toContain('price < $maxPrice');
      expect(request.filter_variables?.maxPrice).toBe(500);
      expect(request.cursor).toBe('abc123');
    });
  });

  describe('RecommendationResponse', () => {
    it('should allow valid response with recommendations', () => {
      const response: RecommendationResponse = {
        recommendations: [
          { item_id: 'item-1' },
          { item_id: 'item-2' },
        ],
      };
      expect(response.recommendations).toHaveLength(2);
    });

    it('should allow response with items array', () => {
      const response: RecommendationResponse = {
        recommendations: [],
        items: [
          { id: 'item-1', score: 0.95 },
          { id: 'item-2', score: 0.87 },
        ],
      };
      expect(response.items).toHaveLength(2);
    });

    it('should allow response with recommendation_id', () => {
      const response: RecommendationResponse = {
        recommendations: [{ item_id: 'item-1' }],
        recommendation_id: 'rec-uuid-123',
      };
      expect(response.recommendation_id).toBe('rec-uuid-123');
    });

    it('should allow custom properties in response', () => {
      const response: RecommendationResponse = {
        recommendations: [{ item_id: 'item-1' }],
        total_count: 100,
        next_cursor: 'xyz789',
      };
      expect(response.total_count).toBe(100);
      expect(response.next_cursor).toBe('xyz789');
    });
  });
});
