# Personalized Recommendation Engine

## Overview
EasyCom uses a privacy-first, deterministic recommendation engine powered by Sanity's **GROQ (Graph-Relational Object Queries)**. It avoids the complexity and cost of external vector databases or ML pipelines while achieving sub-100ms latency.

## Architecture

### 1. Behavioral Tracking (Client-Side)
User interactions are tracked in the browser's `localStorage` using the `useUserInteractions` hook.
- **`viewedProducts`**: Array of the last 10 visited Product IDs.
- **`viewedCategories`**: Array of IDs of categories visited.

This data is **ephemeral** and stays on the client until a request is made.

### 2. scoring Algorithm (Server-Side)
When fetching recommendations, the client state is passed to the `getRecommendations` server action. A GROQ query dynamically scores products based on:

1.  **Exclusion**: Remove products already viewed. `!(_id in $viewedIds)`
2.  **Affinity Scoring**: Boost products that share categories with the user's history.
    ```groq
    | score(
      count((categories[]->_id)[@ in $likedCategories]) * 3
    )
    ```
3.  **Fallback**: If no history exists, return "Trending" (newest stock).

## Implementation Details

### Server Action: `actions/getRecommendations.ts`
This file contains the logic for both the Recommendation Engine and the [Hidden Jackpot Injection](./GAMIFICATION_SYSTEM.md).

```typescript
export async function getRecommendations(viewedProductIds, viewedCategories) {
  // ... fetch logic ...
}
```

### Components
- **`components/RecommendedProducts.tsx`**: Client component that hydrates user history and calls the server action.
- **`hooks/useUserInteractions.ts`**: Handles writing to `localStorage`.

## Performance
- **Latency**: ~120ms average response time.
- **External Dependencies**: None (Pure Sanity + Next.js).

## Troubleshooting
- **No Recommendations?** Ensure `localStorage` is not blocked and Sanity has products with Categories assigned.
- **Stale Data?** The query is real-time, but Next.js caching might interfere. We use `backendClient` which usually bypasses next-cache for server actions, but check `sanity/queries/index.ts` if issues arise.
