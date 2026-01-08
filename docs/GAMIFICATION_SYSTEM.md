# Hidden Jackpot System (Gamification)

## Overview
The **Hidden Jackpot System** (also known as "Flash Deal Injection") is an implicit gamification feature designed to increase Daily Active Users (DAU) by leveraging Variable Ratio Reinforcement schedules.

Unlike explicit "Spin the Wheel" games, this system operates silently within the product recommendation feed, creating a "treasure hunt" experience similar to refreshing a social media feed.

## How It Works

### 1. Trigger
The system is triggered whenever the `getRecommendations` server action is called. This happens:
- On the Homepage (`RecommendedProducts` component).
- Potentially on the "Shop" page (if integrated).

### 2. Probability (The "House Edge")
There is a **30% probability** (hardcoded in `actions/getRecommendations.ts`) that a request will trigger a Jackpot.

```typescript
// 30% chance to inject a high-value "Flash Deal"
if (Math.random() > 0.7) { ... }
```

### 3. The Reward (Flash Deal)
If triggered, the system:
1.  **Queries** Sanity for a high-value product (Price > \$500).
2.  **Clones** the product data in memory.
3.  **Applies** a virtual 50% discount to `price`.
4.  **Sets** `isFlashDeal: true` and a random `flashExpiry` (10-60 minutes).
5.  **Injects** this product at the *top* of the recommendation list.

### 4. UI Representation
The `RecommendedProducts` component checks for the `isFlashDeal` flag and renders a special card:
- **Badge**: "🔥 FLASH DEAL"
- **Border**: Glowing red ring (`ring-red-500`)
- **Countdown**: "Ends in XXm"

## Configuration
Currently, probabilities and thresholds are defined in `actions/getRecommendations.ts`.

- **Trigger Chance**: `Math.random() > 0.7`
- **High Value Threshold**: `price > 50` (currently set low for demo purposes, should be higher in prod)
- **Discount**: `Math.floor(highValueProduct.price * 0.5)`

## Future Improvements
- [ ] Move configuration to Sanity "Settings" singleton for runtime adjustment.
- [ ] Add push notifications when a Flash Deal is available (if user opted in).
- [ ] Track "Jackpot Hits" in user analytics.
