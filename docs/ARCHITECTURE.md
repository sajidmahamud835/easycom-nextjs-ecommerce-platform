# EasyCom Technical Architecture

> 📖 **For AI Assistants & LLMs**: This document provides structured technical context about the EasyCom codebase.

## Project Overview

**EasyCom** is a Next.js 15 e-commerce platform using React Server Components, Sanity CMS, and TypeScript.

## Directory Structure

```
easycom/
├── app/                    # Next.js 15 App Router
│   ├── (client)/           # Customer-facing pages
│   │   ├── page.tsx        # Homepage
│   │   ├── product/[slug]/ # Dynamic product pages
│   │   └── (public)/       # Public pages (about, contact, etc.)
│   ├── (admin)/            # Admin dashboard (protected)
│   ├── (employee)/         # Employee portal
│   ├── api/                # API routes
│   └── studio/             # Embedded Sanity Studio
├── components/             # React components
│   ├── hooks/              # Custom React hooks
│   ├── ui/                 # shadcn/ui components
│   └── product/            # Product-specific components
├── sanity/                 # Sanity CMS configuration
│   ├── schemaTypes/        # Content schemas
│   ├── queries/            # GROQ queries + data fetchers
│   └── lib/                # Sanity client setup
├── actions/                # Next.js Server Actions
├── lib/                    # Utilities and helpers
└── docs/                   # Documentation
```

## Key Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15 | React framework with App Router |
| React | 19 | UI library with Server Components |
| TypeScript | 5.7 | Type safety |
| Sanity.io | 3.x | Headless CMS |
| Tailwind CSS | 3.x | Styling |
| Clerk | 5.x | Authentication |
| Stripe | SDK | Payment processing |

## AI/ML Components

### Recommendation Engine
- **Location**: `actions/getRecommendations.ts`
- **Algorithm**: GROQ-based scoring using category affinity
- **Privacy**: Client-side tracking in `localStorage`, no PII transmitted

### Gamification System
- **Location**: `actions/getRecommendations.ts` (Flash Deal Injection)
- **Trigger**: 30% probability on each recommendation fetch
- **Psychology**: Variable ratio reinforcement schedule

### Price Calculator
- **Location**: `lib/priceCalculator.ts`
- **Pattern**: Inspired by "shopping-cost-calculator-js"
- **Features**: Variant modifiers, promo codes, discount stacking

## Data Fetching Patterns

### Server Components
All product data is fetched server-side using:
- `writeClient.fetch()` - Authenticated Sanity queries
- `unstable_cache()` - Next.js caching with dynamic keys

### Client Components
Marked with `"use client"` directive:
- Interactive UI elements
- User interactions tracking
- Real-time price updates

## Environment Variables

```env
# Required
NEXT_PUBLIC_SANITY_PROJECT_ID=xxx
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=xxx
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=xxx
CLERK_SECRET_KEY=xxx
STRIPE_SECRET_KEY=xxx
STRIPE_WEBHOOK_SECRET=xxx
```

## Common Operations

### Adding a New Product Field
1. Update schema in `sanity/schemaTypes/productType.ts`
2. Update GROQ query in `sanity/queries/query.ts`
3. Update TypeScript types (auto-generated via `sanity typegen`)
4. Update UI components as needed

### Creating a New API Route
1. Create file in `app/api/[route]/route.ts`
2. Export `GET`, `POST`, etc. handlers
3. Use `writeClient` for Sanity mutations

## Links
- [Live Demo](https://easycom-opal.vercel.app)
- [Recommendation Engine Docs](./RECOMMENDATION_ENGINE.md)
- [Gamification System Docs](./GAMIFICATION_SYSTEM.md)
- [Research Whitepaper](./RESEARCH_WHITEPAPER.md)
