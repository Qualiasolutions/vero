# Veromodels - Premium Die-Cast Model Cars Store

> A modern, high-performance e-commerce platform for 1:18 scale die-cast model cars built with Next.js 15, TypeScript, and Stripe.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat-square&logo=typescript)
![Stripe](https://img.shields.io/badge/Stripe-Latest-purple?style=flat-square&logo=stripe)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss)

## 🚀 Quick Start

### Prerequisites

- **Node.js**: ^20.11.1 or ^22.0.0
- **Bun**: ^1.3.0 (recommended) or npm/pnpm
- **PostgreSQL**: For Prisma database
- **Stripe Account**: For payments
- **Supabase Account**: For authentication

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vero-new
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your credentials:
   ```bash
   # Stripe (Required)
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   STRIPE_CURRENCY=eur
   
   # Supabase (Required)
   NEXT_PUBLIC_SUPABASE_URL=https://...supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   SUPABASE_SERVICE_ROLE_KEY=eyJ...
   
   # Database (Required)
   DATABASE_URL=postgresql://...
   
   # App URL (Required for Stripe redirects)
   NEXT_PUBLIC_URL=http://localhost:3000
   
   # Optional
   ENABLE_STRIPE_TAX=false
   NEXT_PUBLIC_UMAMI_WEBSITE_ID=...
   ```

4. **Set up the database**
   ```bash
   bunx prisma generate
   bunx prisma db push
   ```

5. **Run the development server**
   ```bash
   bun dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to see your store.

## 📦 Project Structure

```
vero-new/
├── src/
│   ├── app/                    # Next.js App Router pages & API routes
│   │   ├── (store)/           # Public store pages (homepage, products, etc.)
│   │   ├── api/               # API endpoints (webhooks, auth, etc.)
│   │   └── auth/              # Authentication pages
│   ├── actions/               # Server Actions (cart, checkout, auth)
│   ├── components/            # Business-specific React components
│   ├── context/               # React Context providers (cart, favorites)
│   ├── lib/                   # Core utilities and services
│   │   ├── stripe.ts         # Stripe client setup
│   │   ├── supabase.ts       # Supabase client setup
│   │   ├── logger.ts         # Structured logging utility
│   │   ├── email.ts          # Email service
│   │   └── product-service.ts # Product data management
│   ├── ui/                    # Reusable UI components
│   │   └── shadcn/           # shadcn/ui components
│   ├── middleware.ts          # Request middleware (auth, i18n)
│   ├── store.config.ts        # Store configuration
│   └── env.mjs               # Environment variable validation
├── prisma/
│   └── schema.prisma         # Database schema
├── public/                    # Static assets
├── tests/                     # Test files
├── biome.json                # Biome linter & formatter config
├── tsconfig.json             # TypeScript configuration
└── next.config.ts            # Next.js configuration
```

## 🛠️ Development

### Available Commands

```bash
# Development
bun dev              # Start dev server with Turbopack (fast!)
bun build            # Build for production
bun start            # Start production server

# Code Quality
bun lint             # Run Biome linter & formatter
bun test             # Run tests with Vitest

# Database
bunx prisma studio   # Open Prisma Studio (database GUI)
bunx prisma generate # Generate Prisma client
bunx prisma db push  # Push schema changes to database

# Docker
bun docker:build     # Build Docker image
bun docker:run       # Run Docker container
```

### Development Workflow

1. **Create a new feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the coding guidelines (see [CLAUDE.md](./CLAUDE.md))

3. **Run linting and tests**
   ```bash
   bun lint
   bun test
   ```

4. **Commit with conventional commits**
   ```bash
   git commit -m "feat: add new product filter"
   ```

5. **Push and create a PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## 🎨 Tech Stack

### Core
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Bun](https://bun.sh/)** - Fast package manager and runtime

### Styling
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Utility-first CSS
- **[shadcn/ui](https://ui.shadcn.com/)** - Beautiful UI components
- **[Radix UI](https://www.radix-ui.com/)** - Accessible primitives

### Backend & Data
- **[Prisma](https://www.prisma.io/)** - Type-safe database ORM
- **[PostgreSQL](https://www.postgresql.org/)** - Relational database
- **[Supabase](https://supabase.com/)** - Authentication & realtime

### Payments
- **[Stripe](https://stripe.com/)** - Payment processing
- **[commerce-kit](https://commerce-kit.vercel.app/)** - Stripe integration helpers

### Code Quality
- **[Biome](https://biomejs.dev/)** - Fast linter & formatter
- **[Vitest](https://vitest.dev/)** - Unit testing framework
- **[Playwright](https://playwright.dev/)** - E2E testing (configured)

## 🔐 Security

### Environment Variables

**⚠️ CRITICAL**: Never commit `.env`, `.env.local`, or `.env.production.local` files!

- Use `.env.example` as a template
- Store production secrets in Vercel/Hosting provider environment variables
- Rotate keys immediately if accidentally exposed

### Best Practices

1. **API Keys**: Always use `NEXT_PUBLIC_` prefix for client-side variables
2. **Webhooks**: Verify Stripe webhook signatures
3. **Authentication**: Use Supabase Auth with RLS (Row Level Security)
4. **Input Validation**: Validate all user inputs with Zod schemas
5. **Logging**: Use the `logger` utility (never log sensitive data)

## 📧 Email Configuration

Email notifications are currently stubbed. To enable:

1. **Choose an email provider** (Resend, SendGrid, AWS SES)
2. **Update `src/lib/email.ts`** with your provider's SDK
3. **Add API keys** to environment variables
4. **Test** order confirmations and shipping notifications

Example with Resend:
```typescript
// src/lib/email.ts
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);
```

## 🧪 Testing

### Unit Tests
```bash
bun test                    # Run all tests
bun test --watch           # Watch mode
bun test --coverage        # Generate coverage report
```

### E2E Tests (Playwright)
```bash
bunx playwright test       # Run E2E tests
bunx playwright test --ui  # Run with UI
bunx playwright codegen    # Generate test code
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy** - Vercel will auto-deploy on push to main

### Manual Deployment

```bash
bun build
bun start
```

### Docker Deployment

```bash
bun docker:build
bun docker:run
```

## 📊 Monitoring & Analytics

- **Vercel Analytics**: Page views and performance metrics
- **Stripe Dashboard**: Payment and order analytics
- **Logger**: Structured logging in production (see `src/lib/logger.ts`)

### Adding Sentry (Recommended)

1. Install Sentry:
   ```bash
   bun add @sentry/nextjs
   ```

2. Initialize Sentry:
   ```bash
   bunx @sentry/wizard -i nextjs
   ```

3. Add DSN to `.env.local`:
   ```bash
   NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
   ```

## 🎯 Key Features

- ✅ Server-side rendering with Next.js 15
- ✅ Type-safe database queries with Prisma
- ✅ Secure authentication with Supabase
- ✅ Stripe payment integration
- ✅ Shopping cart with optimistic updates
- ✅ Product search and filtering
- ✅ Responsive design (mobile-first)
- ✅ SEO optimized (metadata, sitemap, structured data)
- ✅ Order confirmation emails (stub - needs configuration)
- ✅ Admin dashboard (basic)
- ✅ Multi-currency support
- ✅ Internationalization ready (i18n structure in place)

## 📝 Configuration

### Store Settings

Edit `src/store.config.ts` to customize:
- Store name and description
- Categories and brands
- Contact information
- Social media links
- Feature flags

### Stripe Products

Products are managed in the Stripe Dashboard:
1. Create products with metadata:
   - `slug`: URL-friendly identifier
   - `category`: Product category
   - `brand`: Product brand
   - `featured`: Mark as featured (true/false)
2. Set prices (supports multiple currencies)
3. Add product images

## 🤝 Contributing

1. Read [CLAUDE.md](./CLAUDE.md) for coding guidelines
2. Follow the development workflow above
3. Write tests for new features
4. Ensure all tests and linting pass
5. Submit a PR with a clear description

## 📚 Additional Documentation

- [CLAUDE.md](./CLAUDE.md) - Comprehensive coding guidelines
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment instructions
- [CHANGELOG.md](./CHANGELOG.md) - Version history
- [docs/](./docs/) - Additional documentation

## 🐛 Troubleshooting

### Common Issues

**1. Database connection errors**
- Verify `DATABASE_URL` in `.env.local`
- Run `bunx prisma db push` to sync schema
- Check PostgreSQL is running

**2. Stripe webhook not working**
- Use Stripe CLI for local testing: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
- Verify `STRIPE_WEBHOOK_SECRET` matches
- Check webhook signature validation

**3. Build errors**
- Clear Next.js cache: `rm -rf .next`
- Regenerate Prisma client: `bunx prisma generate`
- Check TypeScript errors: `bunx tsc --noEmit`

**4. Environment variables not loading**
- Restart dev server after changing `.env.local`
- Verify variables don't have quotes in .env files
- Check `src/env.mjs` for validation errors

## 📄 License

AGPL-3.0-only - See LICENSE file for details

## 💬 Support

- Email: info@veromodels.com
- Issues: [GitHub Issues](https://github.com/your-repo/issues)
- Documentation: [Wiki](https://github.com/your-repo/wiki)

---

**Built with ❤️ for die-cast model car enthusiasts**
