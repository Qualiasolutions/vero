# Database Migrations

This directory contains SQL migrations for the Veromodels Supabase database.

## Setup Instructions

### 1. Run the Initial Migration

Open your Supabase project dashboard:
1. Go to **SQL Editor**
2. Open `001_setup_cart_tables.sql`
3. Copy and paste the entire file into the SQL editor
4. Click **Run** to execute

This will create:
- `cart_items` table (for shopping cart)
- `orders` table (for completed orders)
- `newsletter` table (for email subscriptions)
- Row Level Security (RLS) policies
- Indexes for performance
- Helper functions and views

### 2. Verify the Setup

Run these verification queries in the SQL editor:

```sql
-- Check if tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('cart_items', 'orders', 'newsletter');

-- Check RLS policies
SELECT tablename, policyname, cmd FROM pg_policies 
WHERE tablename IN ('cart_items', 'orders', 'newsletter');

-- View active carts
SELECT * FROM active_carts LIMIT 10;
```

### 3. Test Cart Operations

```sql
-- Test insert
INSERT INTO cart_items (session_id, product_id, quantity) 
VALUES ('test-session-123', 'prod_test123', 2);

-- Test select
SELECT * FROM cart_items WHERE session_id = 'test-session-123';

-- Test update
UPDATE cart_items 
SET quantity = 3 
WHERE session_id = 'test-session-123' AND product_id = 'prod_test123';

-- Test delete
DELETE FROM cart_items WHERE session_id = 'test-session-123';
```

## Maintenance

### Clean Up Old Guest Carts

Run this function periodically (recommended: daily via cron job):

```sql
SELECT cleanup_expired_carts();
```

This removes guest carts older than 30 days.

### Set Up Automated Cleanup (Optional)

If you have pg_cron enabled:

```sql
-- Schedule daily cleanup at 2 AM
SELECT cron.schedule(
    'cleanup-old-carts',
    '0 2 * * *',
    $$SELECT cleanup_expired_carts();$$
);
```

## Monitoring

### View Cart Statistics

```sql
-- Active carts summary
SELECT 
    COUNT(DISTINCT session_id) as total_carts,
    SUM(item_count) as total_items,
    SUM(total_quantity) as total_quantity
FROM active_carts;
```

### View Order Statistics

```sql
-- Recent orders
SELECT * FROM order_stats 
WHERE order_date >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY order_date DESC;

-- Order status breakdown
SELECT status, COUNT(*) as count, SUM(total) as revenue
FROM orders
GROUP BY status;
```

## Troubleshooting

### Issue: RLS Policies Not Working

Check if RLS is enabled:
```sql
SELECT tablename, rowsecurity FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('cart_items', 'orders', 'newsletter');
```

### Issue: Duplicate Cart Items

The `unique_cart_item` constraint prevents duplicates. Use UPSERT instead:
```sql
INSERT INTO cart_items (session_id, product_id, quantity)
VALUES ('session-123', 'prod_abc', 1)
ON CONFLICT (session_id, product_id)
DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity;
```

### Issue: Performance Slow

Check if indexes exist:
```sql
SELECT tablename, indexname FROM pg_indexes 
WHERE schemaname = 'public' 
AND tablename IN ('cart_items', 'orders');
```

## Need Help?

- Supabase Docs: https://supabase.com/docs/guides/database
- RLS Guide: https://supabase.com/docs/guides/auth/row-level-security
