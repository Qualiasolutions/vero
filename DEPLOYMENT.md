# Veromodels Deployment Guide

This guide walks you through deploying Veromodels to Vercel with proper environment configuration and database setup.

## Prerequisites

- [Vercel CLI](https://vercel.com/docs/cli) installed: `npm i -g vercel`
- Vercel account connected to your git repository
- Supabase project set up (follow `prisma/migrations/README.md`)
- Stripe account with products configured

## Step 1: Database Setup

### 1.1 Run Supabase Migrations

1. Open your Supabase dashboard
2. Navigate to **SQL Editor**
3. Open `prisma/migrations/001_setup_cart_tables.sql`
4. Copy the entire file and paste into SQL editor
5. Click **Run** to execute

### 1.2 Verify Tables

Run this in SQL Editor to verify:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('cart_items', 'orders', 'newsletter');
```

You should see all three tables listed.

## Step 2: Configure Environment Variables

### 2.1 Production Environment Variables

Set these environment variables in your Vercel project:

```bash
# Navigate to your project directory
cd /path/to/vero-new

# Link to your Vercel project (first time only)
vercel link

# Add environment variables for PRODUCTION
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# Paste: https://your-project.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# Paste: your-anon-key-from-supabase

vercel env add SUPABASE_SERVICE_ROLE_KEY production
# Paste: your-service-role-key-from-supabase

vercel env add DATABASE_URL production
# Paste: postgresql://postgres:password@db.your-project.supabase.co:5432/postgres

vercel env add NEXT_PUBLIC_URL production
# Paste: https://your-domain.com (or https://your-project.vercel.app)

vercel env add STRIPE_SECRET_KEY production
# Paste: sk_live_... (your Stripe production secret key)

vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production
# Paste: pk_live_... (your Stripe production publishable key)

vercel env add STRIPE_CURRENCY production
# Paste: aed (or your preferred currency)

vercel env add STRIPE_WEBHOOK_SECRET production
# Paste: whsec_... (configure after deployment - see below)

vercel env add SECRET production
# Paste: your-secure-random-secret-min-32-chars
# Generate one: openssl rand -base64 32
```

### 2.2 Preview Environment Variables

Repeat the above for preview/development:
```bash
# For preview deployments
vercel env add NEXT_PUBLIC_SUPABASE_URL preview
# ... repeat for all variables
```

### 2.3 Alternative: Use Vercel Dashboard

1. Go to your project on [vercel.com](https://vercel.com)
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable for Production and Preview environments

## Step 3: Deploy to Vercel

### 3.1 Initial Deployment

```bash
# Deploy to production
vercel --prod

# Or trigger from git (recommended)
git push origin main  # Vercel will auto-deploy
```

### 3.2 Verify Deployment

1. Wait for build to complete
2. Visit your deployment URL
3. Check for any build errors in Vercel dashboard

## Step 4: Configure Stripe Webhooks

### 4.1 Create Webhook Endpoint

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Click **Add endpoint**
3. Enter URL: `https://your-domain.com/api/webhooks/stripe`
4. Select events to listen for:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Click **Add endpoint**

### 4.2 Add Webhook Secret to Vercel

1. Copy the webhook signing secret (starts with `whsec_`)
2. Add to Vercel:
```bash
vercel env add STRIPE_WEBHOOK_SECRET production
# Paste: whsec_...
```
3. Redeploy:
```bash
vercel --prod
```

## Step 5: Test the Deployment

### 5.1 Test Cart Operations

1. Visit your site
2. Add a product to cart
3. Update quantity
4. Remove item
5. Verify cart persists across page refreshes

### 5.2 Test Checkout Flow

1. Add items to cart
2. Click "Proceed to Checkout"
3. Complete Stripe checkout (use test card: `4242 4242 4242 4242`)
4. Verify order confirmation

### 5.3 Check Database

Go to Supabase → Table Editor:
- Verify `cart_items` has data during shopping
- Verify `orders` has data after checkout

## Step 6: Post-Deployment Tasks

### 6.1 Set Up Custom Domain (Optional)

1. Go to Vercel project → **Settings** → **Domains**
2. Add your custom domain
3. Configure DNS records as instructed
4. Update `NEXT_PUBLIC_URL` environment variable

### 6.2 Configure Analytics (Optional)

Already included if you have Vercel Analytics:
- Speed Insights: Automatic
- Web Analytics: Configure in Vercel dashboard

### 6.3 Set Up Monitoring

1. Enable Vercel monitoring in dashboard
2. Set up error alerts
3. Monitor function execution logs

## Troubleshooting

### Build Fails

**Issue**: Build fails with environment variable errors

**Solution**:
```bash
# Check if all required vars are set
vercel env ls

# Pull environment variables locally to test build
vercel env pull .env.production.local
bun run build
```

### Database Connection Errors

**Issue**: Can't connect to Supabase

**Solution**:
1. Verify `DATABASE_URL` is correct in Vercel
2. Check Supabase project is not paused
3. Verify IP allowlist in Supabase (allow all for Vercel)

### Stripe Webhooks Not Working

**Issue**: Orders not being created after checkout

**Solution**:
1. Check webhook endpoint URL is correct
2. Verify `STRIPE_WEBHOOK_SECRET` is set
3. Check Vercel function logs for errors
4. Test webhook with Stripe CLI:
```bash
stripe listen --forward-to https://your-domain.com/api/webhooks/stripe
```

### Cart Items Not Persisting

**Issue**: Cart resets on page refresh

**Solution**:
1. Check browser console for errors
2. Verify Supabase RLS policies are correct
3. Check `cart_items` table exists
4. Test cart actions in Supabase SQL editor

## Maintenance

### Update Dependencies

```bash
bun update
git commit -am "chore: update dependencies"
git push  # Auto-deploys to Vercel
```

### Database Cleanup

Run this monthly in Supabase SQL Editor:
```sql
SELECT cleanup_expired_carts();
```

### Monitor Performance

1. Check Vercel Analytics dashboard weekly
2. Review function execution times
3. Monitor database query performance in Supabase

## Rollback

If you need to rollback to a previous deployment:

```bash
# List recent deployments
vercel list

# Promote a previous deployment to production
vercel promote [deployment-url]
```

Or use the Vercel dashboard:
1. Go to **Deployments**
2. Find the working deployment
3. Click **•••** → **Promote to Production**

## Support

- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Stripe Docs: https://stripe.com/docs
- Next.js Docs: https://nextjs.org/docs
