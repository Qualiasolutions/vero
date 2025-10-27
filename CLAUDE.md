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

# Run tests in watch mode
bun test --watch

# Run tests with coverage
bun test --coverage

# Prepare Husky hooks
bun prepare
```

### Database Commands
```bash
# Generate Prisma client
bunx prisma generate

# Push schema changes to database
bunx prisma db push

# Open Prisma Studio (database GUI)
bunx prisma studio

# Check migration status
bunx prisma migrate status
```

### Testing Commands
```bash
# Run E2E tests with Playwright
bunx playwright test

# Run E2E tests with UI
bunx playwright test --ui

# Generate E2E test code
bunx playwright codegen http://localhost:3000
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
- **biome.json**: Linting and formatting rules (strict TypeScript, tab indentation)
- **vitest.config.ts**: Unit testing configuration with jsdom environment
- **playwright.config.ts**: E2E testing configuration for multiple browsers
- **commitlint.config.ts**: Conventional commit enforcement

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
- Use TypeScript strictly - no `any` types (enforced by Biome)
- Follow the existing component naming conventions
- Separate business logic from UI components
- Use conventional commits (enforced by commitlint)
- React Compiler is enabled for automatic optimizations

### Styling
- Use Tailwind CSS classes consistently
- Leverage shadcn/ui components for consistency
- Follow the existing color scheme and spacing patterns
- Mobile-first responsive design

### Testing
- Unit tests for utilities and business logic with Vitest
- Component tests for UI components with Testing Library
- Integration tests in `tests/integration/`
- E2E tests with Playwright in `tests/e2e/`
- Test setup includes mocks for Next.js components in `src/setup-tests.ts`
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

## Security Best Practices

### Environment Variables
- **NEVER** commit `.env`, `.env.local`, or `.env.production.local` files
- Use `.env.example` as a template only
- Store production secrets in Vercel/hosting environment variables
- Rotate API keys immediately if accidentally exposed
- Prefix client-side variables with `NEXT_PUBLIC_`

### Authentication & Authorization
- Always verify user authentication in Server Actions
- Use Row Level Security (RLS) in Supabase
- Never trust client-side data - validate server-side
- Implement proper session management
- Use Supabase Auth for authentication

### Input Validation
- Validate all user inputs with Zod schemas
- Sanitize HTML content to prevent XSS
- Use parameterized queries (Prisma handles this)
- Never use `eval()` or execute user-provided code
- Validate file uploads (type, size, content)

### API Security
- Verify Stripe webhook signatures
- Implement rate limiting (Upstash Redis is installed)
- Use HTTPS in production
- Set proper CORS headers
- Validate Content-Type headers

### Data Protection
- Never log sensitive data (passwords, credit cards, tokens)
- Use the `logger` utility (filters sensitive data)
- Encrypt sensitive data at rest
- Use Stripe for payment processing (never store card details)
- Implement proper error messages (don't expose internals)

### Code Security
- Keep dependencies updated (`bun update`)
- Run security audits (`bun audit` or `npm audit`)
- Use TypeScript strict mode
- Enable all ESLint/Biome security rules
- Review code changes for security issues

## Troubleshooting Guide

### Common Issues

#### Database Connection Errors
**Symptom**: `Can't reach database server` or `Connection timeout`

**Solutions**:
1. Verify `DATABASE_URL` in `.env.local`
2. Check PostgreSQL is running: `pg_isready`
3. Test connection: `bunx prisma db push`
4. Verify firewall/network settings
5. Check Supabase dashboard for service status

#### Stripe Webhook Not Working
**Symptom**: Orders not created, webhooks timing out

**Solutions**:
1. Verify webhook endpoint in Stripe Dashboard
2. Check `STRIPE_WEBHOOK_SECRET` matches
3. Test locally with Stripe CLI:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
4. Check webhook logs in Stripe Dashboard
5. Verify webhook signature validation code
6. Check server logs for error details

#### Build Errors
**Symptom**: Build fails with TypeScript or module errors

**Solutions**:
1. Clear Next.js cache: `rm -rf .next`
2. Regenerate Prisma client: `bunx prisma generate`
3. Clear node_modules: `rm -rf node_modules && bun install`
4. Check TypeScript errors: `bunx tsc --noEmit`
5. Verify all environment variables are set
6. Check for circular dependencies

#### Authentication Issues
**Symptom**: Users can't sign in, sessions expire immediately

**Solutions**:
1. Verify Supabase URL and keys in `.env.local`
2. Check Supabase Auth settings in dashboard
3. Clear browser cookies and localStorage
4. Check middleware.ts for auth logic
5. Verify email verification settings
6. Test with Supabase Auth UI

#### Environment Variables Not Loading
**Symptom**: `undefined` or validation errors for env vars

**Solutions**:
1. Restart dev server after changing `.env.local`
2. Don't use quotes in .env files: `KEY=value` not `KEY="value"`
3. Check `src/env.mjs` for validation errors
4. Verify variable names match exactly (case-sensitive)
5. Check for typos in variable names
6. Clear `.next` cache and rebuild

#### Hydration Errors
**Symptom**: React hydration mismatch warnings

**Solutions**:
1. Ensure server and client render the same HTML
2. Check for browser-only APIs in Server Components
3. Use `useEffect` for client-only code
4. Verify dates/times use consistent timezone
5. Check for non-serializable data in props
6. Use `suppressHydrationWarning` sparingly

#### Slow Performance
**Symptom**: Pages load slowly, high response times

**Solutions**:
1. Check database query performance
2. Enable caching where appropriate
3. Optimize images with Next.js Image
4. Use React Server Components for data fetching
5. Implement pagination for large lists
6. Profile with Vercel Speed Insights
7. Check for N+1 queries in database
8. Use `loading.tsx` for better UX

### Debugging Tips

#### Enable Verbose Logging
```typescript
// In development, the logger shows all messages
// Set NODE_ENV=development for detailed logs
```

#### Check Server Logs
```bash
# Local development
# Logs appear in terminal where `bun dev` is running

# Vercel production
# View logs in Vercel Dashboard > Deployments > Logs
```

#### Debug Stripe Issues
```bash
# Test Stripe locally
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Test payment
stripe trigger payment_intent.succeeded
```

#### Database Inspection
```bash
# Open Prisma Studio
bunx prisma studio

# Check database directly
psql $DATABASE_URL

# View migration status
bunx prisma migrate status
```

#### Network Issues
```bash
# Check if ports are in use
lsof -i :3000

# Test API endpoints
curl http://localhost:3000/api/auth/check

# Check DNS resolution
nslookup your-domain.com
```

### Performance Optimization

#### Image Optimization
- Use Next.js `<Image>` component
- Serve images from CDN (Vercel Blob, Cloudinary)
- Use modern formats (WebP, AVIF)
- Implement lazy loading
- Optimize image sizes for different viewports

#### Database Optimization
- Add indexes for frequently queried fields
- Use database connection pooling
- Implement caching for product data
- Paginate large result sets
- Use `select` to fetch only needed fields

#### React Optimization
- Use React Server Components by default
- Implement code splitting with `next/dynamic`
- Memoize expensive calculations
- Use `useCallback` and `useMemo` appropriately
- Implement virtual scrolling for long lists

#### Caching Strategy
- Enable Next.js caching for static pages
- Use `revalidate` for ISR (Incremental Static Regeneration)
- Implement Redis caching for frequently accessed data
- Cache Stripe product data locally
- Use Vercel Edge Config for feature flags

### Getting Help

1. **Check Documentation**: Read README.md, CLAUDE.md, API.md
2. **Search Issues**: Check GitHub Issues for similar problems
3. **View Logs**: Check server logs for detailed error messages
4. **Ask for Help**: Create a GitHub Issue with reproduction steps
5. **Community**: Join Next.js, Stripe, or Supabase Discord communities