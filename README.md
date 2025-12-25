# @recombe/sdk

Official TypeScript SDK for the Recombe API.

## Installation

```bash
npm install @recombe/sdk
```

## Usage

Initialise the client with your API key.

```typescript
import { RecombeClient } from '@recombe/sdk';

const client = new RecombeClient({
  apiKey: 'YOUR_API_KEY',
  baseUrl: 'https://api.recombe.ai' // Optional
});

// Get Recommendations
const recommendations = await client.getRecommendations({
  user_id: 'user-123',
  limit: 10
});

// Track Interaction
await client.trackInteraction({
  user_id: 'user-123',
  item_id: 'item-456',
  type: 'click'
});
```

## Features

- **High Performance**: Uses HTTP Keep-Alive agents by default to reuse TCP connections and reduce latency.
- **Typed**: Full TypeScript definitions for request/response objects.
