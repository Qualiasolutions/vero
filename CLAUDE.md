# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Your Next Store (YNS) is a Next.js 15 e-commerce boilerplate tightly integrated with Stripe for payment processing. It's built with React 19, TypeScript, and uses Bun as the package manager and runtime.

## Development Commands

### Package Management & Installation
```bash
bun install                    # Install dependencies
```

### Development Server
```bash
bun run dev                   # Start development server with Turbo
```

### Building & Production
```bash
bun run build                 # Build for production
bun run start                 # Start production server
```

### Code Quality & Testing
```bash
bun run lint                  # Run Biome linter/formatter (auto-fix)
bun run test                  # Run Vitest tests
tsgo                         # TypeScript type checking (use tsgo command)
```

### Docker
```bash
bun run docker:build        # Build Docker image
bun run docker:run          # Run Docker container
```

## Architecture & Structure

### Core Technologies
- **Framework**: Next.js 15 with App Router
- **Runtime**: React 19 with React Compiler enabled
- **TypeScript**: Strict configuration with path aliases
- **Styling**: Tailwind CSS v4 with Radix UI components
- **State Management**: React Context for cart functionality
- **Payment Processing**: Stripe integration via commerce-kit
- **Testing**: Vitest with Testing Library
- **Linting**: Biome (replaces ESLint/Prettier)

### Directory Structure
```
src/
├── app/                     # Next.js App Router pages
│   ├── (store)/            # Store route group with layout
│   ├── api/                # API routes (auth, chat, webhooks)
│   └── login/              # Authentication pages
├── actions/                # Server actions
├── context/                # React Context providers (cart, modals)
├── i18n/                   # Internationalization (client/server)
├── lib/                    # Utilities, types, auth, search
├── ui/                     # Reusable UI components
│   ├── shadcn/             # Shadcn/ui components
│   ├── checkout/           # Checkout-specific components
│   ├── nav/                # Navigation components
│   └── products/           # Product-related components
└── store.config.ts         # Store configuration (categories, contact info)
```

### Key Architectural Patterns
- **Route Groups**: `(store)` group for main store pages with shared layout
- **Server Components**: Extensive use for performance optimization
- **Server Actions**: Form handling and data mutations
- **Dynamic Routes**: `[slug]` for products and categories
- **Catch-all Routes**: `[...segments]` for flexible routing
- **Parallel Routing**: Modal implementations using `@modal` slots

### Path Aliases
- `@/*` → `./src/*`
- `@ui/*` → `./src/ui/*`
- `@/components/ui/*` → `./src/ui/shadcn/*`

## Environment Configuration

### Required Environment Variables
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_CURRENCY` - Currency code (e.g., "usd")
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `NEXT_PUBLIC_URL` - Store URL (optional on Vercel)

### Optional Environment Variables
- `ENABLE_STRIPE_TAX` - Enable Stripe Tax calculations
- `STRIPE_WEBHOOK_SECRET` - For Stripe webhook handling
- `NEXT_PUBLIC_UMAMI_WEBSITE_ID` - Analytics tracking
- `NEXT_PUBLIC_NEWSLETTER_ENDPOINT` - Newsletter signup endpoint
- `NEXT_PUBLIC_LANGUAGE` - Locale (defaults to "en-US")
- `SECRET` - JWT signing secret for authentication (required for auth features)
- `EMAIL` - Admin email for authentication
- `PASSWORD` - Admin password for authentication
- `DOCKER` - Set to `1` when building for Docker deployment

## Code Style & Standards

### Biome Configuration
- **Indentation**: Tabs, width 2
- **Line Width**: 110 characters
- **Quotes**: Double quotes for JS/JSX
- **Trailing Commas**: Always
- **Semicolons**: Always required
- **Arrow Parentheses**: Always

### TypeScript Standards
- Strict mode enabled with additional strictness (`noUncheckedIndexedAccess`)
- No unused locals enforced
- Import type enforcement for type-only imports
- Path aliases configured for clean imports

## Testing

- **Framework**: Vitest with React Testing Library
- **Setup**: Global test setup in `src/setup-tests.ts`
- **Pattern**: `**/?(*.)test.?(c|m)[jt]s?(x)`
- **Mocking**: Automatic mock clearing/resetting between tests

## Commerce Integration

### Stripe Integration
- Products managed in Stripe Dashboard with metadata
- Required metadata: `slug` (for URLs)
- Optional metadata: `category`, `order`, `variant`
- Webhooks handle payment events and cache revalidation

### Search Functionality
- Simple search implementation for products
- Search functionality in `src/lib/search/`

## Commerce & Cart Patterns

### Cart State Management
- Cart uses **optimistic updates** via `useOptimistic` hook in `src/context/cart-context.tsx`
- Three-layer cart flow:
  1. Optimistic UI update (instant feedback)
  2. Server action execution (`addToCartAction`, `updateCartItemAction`, `removeFromCartAction`)
  3. Automatic rollback on failure via `useEffect` synchronization
- Cart state is persisted via cookies using `src/lib/cart-cookies.ts`
- Import cart functionality via: `import { useCart } from "@/context/cart-context"`

### Commerce Kit Integration
- Commerce operations use the `commerce-kit` abstraction layer (`src/lib/commerce.ts`)
- Zero-config setup: reads `STRIPE_SECRET_KEY` and `STRIPE_CURRENCY` from environment
- Use `commerce.products()`, `commerce.cart()` methods for all Stripe operations
- Never call Stripe SDK directly; always go through Commerce Kit

### Store Configuration
- All store-level config in `src/store.config.ts` (categories, brands, social, contact, features)
- Categories are UI-driven; actual product categorization happens via Stripe metadata
- Feature flags control optional functionality (preorders, wishlist, reviews, newsletter)

## Authentication & Authorization

- JWT-based authentication using `jose` library (`src/lib/auth.ts`)
- Session duration: 24 hours with automatic renewal when < 1 hour remaining
- Protected routes defined in `src/middleware.ts` via `ProtectedPaths` array
- Auth credentials stored in environment variables: `EMAIL` and `PASSWORD`
- Login redirects to `/orders`, logout redirects to `/login`
- Middleware only runs on paths matching the `matcher` config

## Product Data Architecture

### Product Metadata Flow
Products are managed entirely in Stripe Dashboard with specific metadata:
- **Required**: `slug` - URL identifier (can be shared across variants)
- **Optional**:
  - `category` - Matches categories in `store.config.ts`
  - `order` - Sort order (lower = first)
  - `variant` - Variant identifier for product variations

### Variants Implementation
- Products with identical `slug` metadata are grouped as variants
- Each variant is a separate Stripe product with its own price, description, and images
- Variants rendered on same product page at `/product/[slug]`
- All variants of a product should share the same `category` for consistent browsing

## Key Development Notes

- Use server components by default, client components only when necessary
- Leverage Next.js 15 features: React Compiler, Turbo dev server, MDX support
- Commerce Kit handles Stripe integration abstractions - never call Stripe SDK directly
- Internationalization ready with message files in `/messages`
- Docker-ready with standalone output mode (`DOCKER=1` env variable)
- Git hooks configured with Husky for commit linting
- Development server runs in background - don't use `bun run dev`, just ask about checking if needed
- Use `structuredClone()` when passing Stripe SDK data from server to client components (eliminates class instances)