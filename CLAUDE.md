# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Your Next Store (YNS) is a Next.js 15 e-commerce boilerplate tightly integrated with Stripe for payment processing. It's built with React 19, TypeScript, and uses Bun as the package manager and runtime.

## Prerequisites & Environment Setup

### System Requirements
- **Node.js**: Version 20+ (as specified in package.json engines)
- **Package Manager**: Bun 1.0+ (recommended, but npm/yarn supported)
- **Platform**: Linux, macOS, or Windows with WSL2

### Installing Bun
```bash
curl -fsSL https://bun.sh/install | bash
```

### Environment Variables
Create a `.env` file in the root directory with required variables (see Environment Configuration section below).

**Docker Setup**: Set `DOCKER=1` in environment when building for Docker deployment.

## Development Commands

### Package Management & Installation
```bash
bun install                    # Install dependencies
```

### Development Server
```bash
bun run dev                   # Start development server with Turbo (Turbopack)
```

### Building & Production
```bash
bun run build                 # Build for production
bun run start                 # Start production server
```

### Code Quality & Testing
```bash
bun run lint                  # Run Biome linter/formatter (auto-fix)
bun run test                  # Run Vitest tests (all tests)
bun test [pattern]           # Run specific test file(s) matching pattern
tsgo                         # TypeScript type checking (use tsgo command)
```

**Testing Framework**: Vitest with React Testing Library
**Test Files**: `**/*.{test,spec}.{ts,tsx}` - Located in `__tests__` directories
**Setup**: Global test setup in `src/setup-tests.ts`
**Coverage**: Generated in `coverage/` directory with HTML output
**Environment**: jsdom with React JSX runtime automatic
**Path Aliases**: Configured to match project structure (`@/components/ui` → `src/ui/shadcn`)

### Package Management & Installation
```bash
bun install                    # Install dependencies (uses Bun package manager)
```

**Node Version**: 20+ (specified in package.json engines)
**Package Manager**: Bun 1.0+ (recommended, supports npm/yarn)
**Corepack**: Set `ENABLE_EXPERIMENTAL_COREPACK=1` for Vercel deployments

### Docker
```bash
bun run docker:build        # Build Docker image
bun run docker:run          # Run Docker container
```

### Stripe Product Sync
```bash
node scripts/sync-stripe-products.js              # Sync all products from CSV to Stripe
node scripts/sync-stripe-products.js --dry-run    # Preview changes without applying
node scripts/sync-stripe-products.js --sku=12345  # Sync specific product by SKU
node scripts/sync-stripe-products.js --csv=./path # Use custom CSV file
```

**Dependencies**: Requires `stripe` package (`bun install stripe`)
**Environment**: `STRIPE_SECRET_KEY` and `STRIPE_CURRENCY` must be set in `.env`
**Required Metadata**: Products must have `slug`, `category`, and `sku` metadata to appear on website
**Script Location**: See `scripts/README.md` for detailed usage and troubleshooting

## Architecture & Structure

### Core Technologies
- **Framework**: Next.js 15 with App Router and MDX support
- **Runtime**: React 19 with React Compiler enabled (experimental)
- **Development Server**: Turbo with Turbopack for fast development
- **TypeScript**: Strict configuration with path aliases
- **Styling**: Tailwind CSS v4 with Radix UI components
- **State Management**: React Context for cart functionality
- **Payment Processing**: Stripe integration via commerce-kit
- **Testing**: Vitest with Testing Library
- **Linting**: Biome (replaces ESLint/Prettier)
- **Package Manager**: Bun with Corepack support
- **Build**: Standalone Docker support available

### Directory Structure
```
src/
├── app/                     # Next.js App Router pages
│   ├── (store)/            # Store route group with layout
│   ├── login/              # Authentication pages
│   └── signup/             # User registration
├── actions/                # Server actions
├── components/             # Shared React components
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
- **Server Components**: Extensive use for performance optimization (use by default)
- **Server Actions**: Form handling and data mutations
- **Dynamic Routes**: `[slug]` for products and categories
- **Catch-all Routes**: `[...segments]` for flexible routing
- **Parallel Routing**: Modal implementations using `@modal` slots
- **Optimistic UI**: Cart operations use `useOptimistic` for instant feedback
- **Cookie Persistence**: Cart state maintained via cart-cookies
- **Structured Cloning**: Stripe SDK data sanitized for client components
- **React Compiler**: Experimental feature for automatic optimizations (enabled in next.config.ts)

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
- `ENABLE_EXPERIMENTAL_COREPACK` - Set to "1" for Vercel deployments

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
- **Import Type Enforcement**: Enforced for type-only imports
- **VCS Integration**: Git enabled with ignore file support
- **Lint-staged**: Runs on staged files via Husky pre-commit hooks

### TypeScript Standards
- Strict mode enabled with additional strictness (`noUncheckedIndexedAccess`)
- No unused locals enforced
- Import type enforcement for type-only imports
- Path aliases configured for clean imports
- Target: ES2022 with Node.js resolution
- Build excludes: `src/script/**/*.ts` and `scripts/**/*.ts`

## Testing

- **Framework**: Vitest with React Testing Library
- **Setup**: Global test setup in `src/setup-tests.ts`
- **Pattern**: `**/*.{test,spec}.{ts,tsx}`
- **Mocking**: Automatic mock clearing/resetting between tests
- **Coverage**: v8 provider with text, json, and html reporters
- **Environment**: jsdom with automatic JSX runtime

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

## Custom Slash Commands

This project includes three custom slash commands for maintaining design system consistency:

### `/vero-component [name] [type]`
Generate a new component following the Veromodels design system. The command guides through:
- Researching existing similar components
- Following color, spacing, and typography rules
- Using proper Vero classes (.vero-card, .vero-button, etc.)
- Including animations and responsive behavior
- Validating against design system standards

**Example**: `/vero-component FeatureCard card`

### `/design-audit [file_path]`
Audit a specific file for design system compliance. Checks:
- Color palette compliance
- Spacing consistency (Tailwind scale only)
- Typography standards
- Component pattern adherence
- Vero class usage
- Accessibility requirements
- Responsive design

**Example**: `/design-audit src/ui/products/product-card.tsx`

### `/consistency-check`
Perform project-wide consistency analysis across all components. Generates comprehensive reports on:
- Color usage consistency
- Card/button component patterns
- Typography hierarchy
- Spacing patterns
- Animation/transition consistency
- Responsive design patterns

Produces actionable prioritized fixes and refactoring recommendations.

## Key Development Notes

- Use server components by default, client components only when necessary
- Leverage Next.js 15 features: React Compiler, Turbo dev server, MDX support
- Commerce Kit handles Stripe integration abstractions - never call Stripe SDK directly
- Internationalization ready with message files in `/messages`
- Docker-ready with standalone output mode (`DOCKER=1` env variable)
- Git hooks configured with Husky for commit linting
- Development server runs in background - don't use `bun run dev`, just ask about checking if needed
- Use `structuredClone()` when passing Stripe SDK data from server to client components (eliminates class instances)

## Next.js Configuration

Key Next.js configuration in `next.config.ts`:
- **MDX Support**: Enabled via `@next/mdx` plugin
- **Docker**: Standalone output when `DOCKER=1` environment variable set
- **Images**: Optimized with AVIF/WebP formats and remote patterns for Stripe, CDN, and blob storage
- **Experimental Features**: React Compiler, PPR disabled, scroll restoration, MDX RS, inline CSS
- **Webpack**: Extension aliases for `.js/.jsx` files
- **Rewrites**: Analytics proxy to umami.is

## Stripe Product Management

Products are synced from CSV files to Stripe using the sync script in `scripts/`:
- Products require `slug` metadata to appear on the website
- Optional metadata: `category`, `order`, `sku` for organization
- Images can be included via URLs or uploaded separately
- The sync script handles creating/updating products and prices
- Script supports dry-run mode and individual product syncing by SKU
- See `scripts/README.md` for detailed usage instructions

## DESIGN SYSTEM - MANDATORY FOR ALL DEVELOPMENT

### Brand Identity
**Project**: Veromodels - Premium 1:18 Scale Die-Cast Model Cars
**Brand Personality**: Luxury, Exclusive, Premium, Collector-focused
**Design Philosophy**: Black & Gold luxury aesthetic with clean, professional presentation
**Target Audience**: Serious collectors and die-cast model enthusiasts

### Color System (USE ONLY THESE - NEVER CREATE NEW COLORS)

#### Veromodels Luxury Palette
**Gold (Primary Brand Color)**
- Primary Gold: `#D4AF37` (`--verogold`)
- Light Gold: `#E6C757` (`--verogold-light`)
- Dark Gold: `#B8941F` (`--verogold-dark`)
- Champagne: `#F5E6D3` (`--verogold-champagne`)

**Black Palette**
- Pure Black: `#0A0A0A` (`--veroblack`)
- Charcoal: `#1A1A1A` (`--veroblack-charcoal`)
- Soft Black: `#2A2A2A` (`--veroblack-soft`)

**Neutral Palette**
- White: `#FFFFFF` (`--verowhite`)
- Cream: `#FDFBF7` (`--verocream`)
- Light Gray: `#F8F9FA` (`--verogray`)
- Medium Gray: `#6C757D` (`--verogray-dark`)
- Text Primary: `#212529` (`--verotext`)

#### Shadcn Semantic Colors (from globals.css)
**Light Mode:**
- Background: `0 0% 100%` (white)
- Foreground: `222.2 84% 4.9%` (near black)
- Primary: `222.2 47.4% 11.2%` (dark blue-gray)
- Secondary: `210 40% 96.1%` (light gray)
- Muted: `210 40% 96.1%` (light gray)
- Accent: `210 40% 96.1%` (light gray)
- Destructive: `0 84.2% 60.2%` (red)
- Border: `214.3 31.8% 91.4%` (light gray)

**Category Badge Colors** (from store.config.ts)
- New Arrivals: `bg-green-500`
- Special Price: `bg-red-500`
- Limited Editions: `bg-purple-500`
- Rare Models: `bg-amber-500`
- Pre-Order: `bg-blue-500`
- Coming Soon: `bg-indigo-500`

### Typography System

**Font Family**: System font stack (`-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`)

**Font Weights**
- Light: 300 (use for headings)
- Normal: 400 (default body text)
- Medium: 500 (emphasized text)
- Semibold: 600 (buttons, labels)
- Bold: 700 (strong emphasis)

**Font Scale** (Tailwind defaults - use these classes)
- Display: `text-4xl` or `text-5xl` (36-48px)
- H1: `text-3xl` (30px)
- H2: `text-2xl` (24px)
- H3: `text-xl` (20px)
- H4: `text-lg` (18px)
- Body Large: `text-base` (16px)
- Body: `text-sm` (14px)
- Small: `text-xs` (12px)
- Caption: `text-[10px]` or `text-[11px]`

**Line Heights**
- Tight: `leading-tight` (1.25) - for headings
- Normal: `leading-normal` (1.5) - default
- Relaxed: `leading-relaxed` (1.625) - for long text

**Text Styles**
- Uppercase: Use `uppercase` with `tracking-wide` or `tracking-wider` for premium feel
- Letter Spacing: `tracking-wide` (0.025em) for buttons and labels

### Spacing System (Tailwind Scale - NEVER use arbitrary values)
- `space-1` = 4px
- `space-2` = 8px
- `space-3` = 12px
- `space-4` = 16px
- `space-5` = 20px
- `space-6` = 24px
- `space-8` = 32px
- `space-12` = 48px
- `space-16` = 64px
- `space-24` = 96px

**Common Spacing Usage:**
- Component padding: `p-4` to `p-6`
- Card padding: `p-5` or `p-6`
- Section gaps: `gap-4` to `gap-6`
- Section spacing: `py-8` to `py-12`
- Container padding: `px-4` (mobile), `px-8` to `px-12` (desktop)

### Border Radius
- Extra small: `rounded-sm` (2px)
- Small: `rounded` (4px)
- Medium: `rounded-md` (6px)
- Large: `rounded-lg` (8px)
- Extra large: `rounded-xl` (12px)
- Full: `rounded-full` (9999px)

**Component Defaults:**
- Cards: `rounded-lg` or `rounded-xl`
- Buttons: `rounded-md` or `rounded-lg`
- Badges: `rounded-md` or `rounded-full`
- Images: `rounded-lg`

### Shadows (Tailwind defaults)
- Small: `shadow-sm` - subtle card shadows
- Medium: `shadow-md` - elevated elements
- Large: `shadow-lg` - modals, popovers
- Extra large: `shadow-xl` - floating elements

### Component Patterns (MANDATORY STANDARDS)

#### Cards
**Standard Card** (`.vero-card` class):
- Background: white
- Border: `1px solid rgba(212, 175, 55, 0.15)` (subtle gold)
- Border radius: `rounded-lg` or `rounded-xl`
- Shadow: `shadow-sm` or custom gold shadow
- Hover: Lift animation (`translateY(-6px) scale(1.01)`)
- Hover border: Changes to gold (`--verogold`)

**Usage:**
```tsx
<div className="vero-card rounded-lg overflow-hidden">
  {/* Card content */}
</div>
```

#### Buttons
**Primary Button** (`.vero-button` class):
- Background: `--verogold` (#D4AF37)
- Text: white
- Font weight: 600 (semibold)
- Text transform: uppercase
- Letter spacing: `tracking-wide` (1.5px)
- Padding: `px-6 py-3` or `px-8 py-3`
- Border radius: `rounded-md`
- Hover: Darker gold with ripple effect

**Outline Button** (`.vero-button-outline` class):
- Background: transparent
- Border: `2px solid --verogold`
- Text: gold color
- Hover: Fill with gold, text becomes white

**Shadcn Button Variants:**
- Default: Primary dark background
- Outline: Border with hover background
- Ghost: Transparent with hover accent
- Link: Underline style

**Usage:**
```tsx
// Custom Vero button
<button className="vero-button px-8 py-3 rounded-md">
  Add to Cart
</button>

// Shadcn button
<Button variant="default" size="lg">
  View Details
</Button>
```

#### Gradients
**Available Gradient Classes:**
- `.vero-gradient` - White to cream
- `.vero-black-gradient` - Black to charcoal
- `.vero-luxury-gradient` - Black to gold
- `.vero-gold-gradient` - Gold to dark gold
- `.vero-text-gradient` - Gold gradient text effect (with shimmer)
- `.vero-elegant-text` - Animated shimmer gold text

#### Glass Effects
- `.vero-glass` - Light glass with backdrop blur
- `.vero-glass-dark` - Dark glass with gold border

#### Navigation
**Header** (see `src/ui/nav/nav.tsx`):
- Height: Auto (py-6)
- Background: `bg-white/95` with `backdrop-blur-md`
- Border bottom: `border-[#D4AF37]/20`
- Sticky positioning
- Logo hover: Scale + gold glow

#### Input Fields
**Standard Input** (Shadcn):
- Height: `h-9` or `h-10`
- Padding: `px-3 py-2`
- Border: `border-input`
- Border radius: `rounded-md`
- Focus: Ring with primary color

#### Layout
- Max width: 1400px (`.container` utility)
- Container padding: `px-4` to `px-12` (responsive)
- Section spacing: `py-8` to `py-12`
- Grid gaps: `gap-4` to `gap-6`

### Animation Utilities

**Available Animations:**
- `animate-fade-in` - Fade in with slide up
- `animate-shimmer` - Shimmer effect (for text/buttons)
- `animate-glow` - Pulsing glow effect
- `animate-float` - Floating animation
- `animate-lift` - Hover lift effect
- `animate-meteor` - Meteor trail animation

**Transition Standards:**
- Default: `transition-all duration-300`
- Slow: `duration-500` or `duration-700`
- Easing: `ease-in-out` or `cubic-bezier(0.4, 0, 0.2, 1)`

### Accessibility Requirements
- Minimum contrast ratio: 4.5:1 for normal text
- Color cannot be the only indicator of meaning
- Focus indicators must be visible (ring utilities)
- Interactive elements minimum 44px touch target
- Alt text required for all images

### Consistency Enforcement Rules

**CRITICAL - READ BEFORE EVERY COMPONENT CREATION:**

1. **NEVER create custom colors** - Only use the defined Vero palette or Shadcn semantic colors
2. **NEVER use arbitrary spacing** - Always use Tailwind's spacing scale
3. **ALWAYS check existing components** for pattern consistency before creating new ones
4. **ALWAYS use `.vero-*` classes** for luxury styling (cards, buttons, gradients)
5. **Test responsive behavior** at mobile, tablet, and desktop breakpoints
6. **Follow component naming** - Use descriptive names that match the Vero brand
7. **Prefer custom Vero classes** over inline Tailwind when a utility class exists
8. **Use Shadcn components** as base, then enhance with Vero styling

**Before Creating ANY Component:**
1. Review this design system section
2. Check if similar component exists in `src/ui/` or `src/components/`
3. Use existing patterns (product cards, buttons, etc.)
4. Ensure color palette compliance
5. Apply proper hover/animation effects

**File Reference Locations:**
- Custom Vero CSS classes: `src/app/globals.css` (lines 374-609)
- Full design system documentation: `DESIGN-SYSTEM.md`
- Shadcn components: `src/ui/shadcn/*`
- Product components: `src/ui/products/*`
- Navigation: `src/ui/nav/*`
- Store config: `src/store.config.ts`

**Note**: For complete design system details including all color values, typography scales, component templates, and usage examples, refer to `DESIGN-SYSTEM.md`. This section provides the essential rules for quick reference.

### Brand-Specific Guidelines

**Luxury Aesthetic:**
- Use generous white space
- Apply subtle animations and hover effects
- Maintain professional, premium feel
- Use gold sparingly as accent (not overwhelming)
- Ensure high-quality product imagery presentation

**Text Content:**
- Use professional, confident tone
- Emphasize authenticity, quality, exclusivity
- Highlight limited editions and rarity
- Focus on collector value

**Component Consistency:**
- Every product card should have favorite heart icon
- Category badges use consistent colors
- Maintain consistent image aspect ratios
- Use consistent pricing format (€XX.XX)

## Available Development Tools

### MCP Servers
This project has the following Model Context Protocol (MCP) servers configured:

#### Context7 (`mcp__context7__*`)
Access up-to-date documentation for libraries:
- `resolve-library-id`: Find Context7-compatible library IDs
- `get-library-docs`: Fetch current documentation for a library

#### Filesystem (`mcp__filesystem__*`)
Advanced filesystem operations:
- Read/write/edit files with enhanced capabilities
- Directory operations and file searching
- Supports multiple file reads in parallel

#### Playwright (`mcp__playwright__*`)
Browser automation for testing:
- Navigate and interact with web pages
- Take screenshots and snapshots
- Evaluate JavaScript, fill forms
- Capture console messages and network requests
- Useful for testing the deployed store

### When to Use Tools
- Use **Read/Write/Edit** tools for code modifications
- Use **Glob** for finding files by pattern
- Use **Grep** for searching file contents (supports regex)
- Use **Bash** for terminal operations (git, npm, docker, etc.) - NOT for reading files
- Use **Task** agent for complex multi-step searches or analyses
- Use **Playwright** tools for end-to-end testing of the live website
