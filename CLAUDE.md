# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Veromodels** is a premium e-commerce store for 1:18 scale die-cast model cars built with Next.js 15, TypeScript, and modern web technologies. The project is based on the "yournextstore" template and customized for the Veromodels brand.

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Radix UI based)
- **Database**: Prisma with PostgreSQL
- **Authentication**: Supabase Auth
- **Payments**: Stripe
- **Package Manager**: Bun
- **Testing**: Vitest + Testing Library
- **Linting**: Biome

## Development Commands

### Core Commands
```bash
# Start development server with Turbopack
bun dev

# Build for production
bun build

# Start production server
bun start

# Run linting and auto-fix
bun lint

# Run tests
bun test

# Prepare Husky hooks
bun prepare
```

### Docker Commands
```bash
# Build Docker image
bun docker:build

# Run Docker container
bun docker:run
```

## Architecture Overview

### Store Configuration
- **src/store.config.ts**: Central store configuration including categories, brands, contact info, and feature flags
- **src/env.mjs**: Environment variable validation with Zod schemas

### Key Architectural Patterns

#### 1. Route Structure (App Router)
```
src/app/
├── (store)/           # Store routes with shared layout
│   ├── page.tsx       # Homepage
│   ├── product/[slug]/ # Dynamic product pages
│   ├── category/[slug]/ # Category pages
│   ├── checkout/      # Checkout flow
│   └── search/        # Product search
├── api/               # API routes
└── auth/              # Authentication routes
```

#### 2. State Management
- **src/context/cart-context.tsx**: Cart state management with React Context
- **src/context/favorites-context.tsx**: Wishlist/favorites management
- Server Components for data fetching with client components for interactivity

#### 3. Commerce Layer
- **src/lib/commerce.ts**: Core commerce utilities
- **src/lib/product-service.ts**: Product data management
- **src/actions/**: Server actions for cart, checkout, and auth
- **commerce-kit** package: Stripe-based commerce functionality

#### 4. Authentication
- Supabase-based authentication with middleware support
- **src/lib/supabase/**: Client, server, and middleware configurations
- Protected routes with auth checks

#### 5. UI Architecture
- **src/ui/**: Reusable UI components
- **src/ui/shadcn/**: shadcn/ui components
- **src/components/**: Business-specific components
- Design tokens in **src/design/tokens.ts**

### Data Flow

#### Product Management
- Products fetched through Stripe API with commerce-kit
- Image mapping via **src/lib/product-image-mapping.js**
- Search functionality in **src/lib/search/**
- Category-based filtering

#### Cart & Checkout
- Cart state managed via React Context + Server Actions
- Stripe Payment Intents for checkout
- Cookie-based cart persistence
- Optimistic updates for better UX

#### User Management
- Supabase authentication with JWT sessions
- User profiles and order history
- Protected customer dashboards

## Important Files & Their Roles

### Configuration
- **src/store.config.ts**: Store settings, categories, brands
- **src/env.mjs**: Environment variable validation
- **middleware.ts**: Request middleware for auth/i18n
- **tailwind.config.ts**: Tailwind configuration

### Core Libraries
- **src/lib/stripe.ts**: Stripe integration
- **src/lib/api.ts**: API utilities
- **src/lib/types.ts**: TypeScript type definitions
- **src/lib/utils.ts**: Utility functions

### Actions (Server Actions)
- **src/actions/cart-actions.ts**: Cart operations
- **src/actions/checkout-actions.ts**: Checkout process
- **src/actions/auth-actions.ts**: Authentication

## Development Guidelines

### Code Organization
- Server Components by default, Client Components only when needed
- Use TypeScript strictly - no `any` types
- Follow the existing component naming conventions
- Separate business logic from UI components

### Styling
- Use Tailwind CSS classes consistently
- Leverage shadcn/ui components for consistency
- Follow the existing color scheme and spacing patterns
- Mobile-first responsive design

### Testing
- Unit tests for utilities and business logic
- Component tests for UI components
- Test files located in `__tests__/` directories or `.test.ts` files

### Performance Considerations
- Images optimized through Next.js Image component
- Prefetching for navigation links
- Optimistic updates for cart operations
- Suspense boundaries for loading states

## Environment Setup

Required environment variables (see **src/env.mjs** for complete list):
- `STRIPE_SECRET_KEY` & `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_CURRENCY`
- `NEXT_PUBLIC_URL` (for Stripe redirects)
- Supabase credentials (`NEXT_PUBLIC_SUPABASE_URL`, etc.)
- Optional: `ENABLE_STRIPE_TAX` for tax calculation

## Common Patterns

### Adding New Products
Products are managed through Stripe dashboard. The system automatically syncs with Stripe products.

### Category Management
Categories configured in **src/store.config.ts** with proper slugs and images.

### UI Component Creation
- Use shadcn/ui as base components when possible
- Follow existing component structure in **src/ui/**
- Use TypeScript interfaces for props
- Implement responsive design

### API Routes
API routes follow Next.js App Router conventions in **src/app/api/** with proper error handling and TypeScript typing.

## Deployment

The project is configured for Vercel deployment with:
- Edge middleware support
- Environment variable validation
- Stripe webhook handling
- Supabase integration

## Testing Strategy

- Unit tests with Vitest for utilities and business logic
- Component testing with Testing Library
- E2E testing capabilities (though not currently implemented)
- Type checking as the first line of defense