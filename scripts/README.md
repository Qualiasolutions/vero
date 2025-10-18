# Stripe Product Sync Scripts

## Overview

This directory contains automation scripts for syncing products between your CSV files and Stripe.

## Scripts

### `sync-stripe-products.js`

Automatically syncs products from CSV to Stripe, ensuring all products have the required metadata for your Next.js website.

## Quick Start

### 1. Install Dependencies (if not already installed)

```bash
cd /home/qualiasolutions/Desktop/Projects/websites/vero-new
bun install stripe
```

### 2. Set Environment Variables

Make sure your `.env` file has:

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_CURRENCY=eur
```

### 3. Test Run (Dry Run)

Preview what changes will be made without actually making them:

```bash
node scripts/sync-stripe-products.js --dry-run
```

### 4. Sync All Products

Apply the changes:

```bash
node scripts/sync-stripe-products.js
```

## Usage Examples

### Sync a specific product by SKU

```bash
node scripts/sync-stripe-products.js --sku=30731
```

### Use a different CSV file

```bash
node scripts/sync-stripe-products.js --csv=./products_latest.csv
```

### Dry run for specific product

```bash
node scripts/sync-stripe-products.js --dry-run --sku=30731
```

## What the Script Does

1. ✅ Reads products from CSV file
2. ✅ Searches Stripe for each product by SKU
3. ✅ Creates missing products with proper metadata
4. ✅ Updates existing products with correct metadata (slug, category, sku)
5. ✅ Creates default prices for products without prices
6. ✅ Handles images where available

## Required Metadata

For products to appear on your website, they need:

- **slug** - URL identifier (e.g., `mini-jcw-gp2-r56`)
- **category** - Product category (`collection` or `pre-order`)
- **sku** - Product SKU code (e.g., `30731`)

## Troubleshooting

### Products still not showing on website?

1. **Clear cache**: `rm -rf .next` and restart dev server
2. **Check Stripe**: Verify products have metadata in Stripe Dashboard
3. **Check logs**: Look for errors in the script output

### Script fails with "Module not found"?

```bash
bun install stripe
```

### Rate limiting errors?

The script has built-in 100ms delays. If you still hit limits, the script will continue and you can re-run it for failed products.

## Success Indicators

After running the script successfully, you should see:

- ✅ All 73 products in Stripe
- ✅ Each product has `slug`, `category`, and `sku` metadata
- ✅ Each product has at least one price
- ✅ Products appear on your website at `/product/[slug]`

## Maintenance

### When to run this script?

- After updating the CSV with new products
- When products aren't appearing on the website
- After manually creating products in Stripe (to add metadata)
- Monthly, as a maintenance task

### Recommended workflow

1. Update CSV file
2. Run dry run: `node scripts/sync-stripe-products.js --dry-run`
3. Review output
4. Apply changes: `node scripts/sync-stripe-products.js`
5. Verify on website

## Support

For issues or questions, check:

1. Script output for specific error messages
2. Stripe Dashboard logs
3. Next.js server logs
4. Browser console for frontend errors

---

Last updated: 2025-10-17
