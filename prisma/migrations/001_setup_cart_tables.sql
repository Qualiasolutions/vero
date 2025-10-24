-- ============================================================================
-- Veromodels Database Setup - Cart and Core Tables
-- ============================================================================
-- This migration sets up the core tables for the Veromodels e-commerce store
-- Run this in your Supabase SQL editor
-- ============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- CART ITEMS TABLE
-- ============================================================================
-- Stores shopping cart items for both authenticated and guest users
-- Uses session_id for guest carts and user_id for authenticated users

CREATE TABLE IF NOT EXISTS cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id TEXT NOT NULL,
    product_id TEXT NOT NULL, -- Stripe product ID
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    user_id UUID DEFAULT NULL, -- NULL for guest carts, populated after login
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Prevent duplicate products in the same cart
    CONSTRAINT unique_cart_item UNIQUE (session_id, product_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_cart_items_session_id ON cart_items(session_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_created_at ON cart_items(created_at);

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_cart_items_updated_at
    BEFORE UPDATE ON cart_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ORDERS TABLE
-- ============================================================================
-- Stores completed orders with Stripe payment information

CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID DEFAULT NULL,
    email TEXT NOT NULL,
    stripe_session_id TEXT UNIQUE,
    stripe_payment_id TEXT UNIQUE,
    total INTEGER NOT NULL, -- Amount in smallest currency unit (e.g., cents, fils)
    currency TEXT NOT NULL DEFAULT 'eur',
    status TEXT NOT NULL DEFAULT 'pending' 
        CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
    items JSONB NOT NULL, -- Snapshot of cart items at checkout
    shipping_address JSONB,
    billing_address JSONB,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for orders
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_session_id ON orders(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Auto-update updated_at for orders
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- NEWSLETTER SUBSCRIPTIONS TABLE
-- ============================================================================
-- Stores email subscribers for marketing campaigns

CREATE TABLE IF NOT EXISTS newsletter (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL UNIQUE,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for newsletter lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_active ON newsletter(active);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
-- Security policies to control data access

-- Enable RLS on all tables
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter ENABLE ROW LEVEL SECURITY;

-- Cart Items Policies
-- Allow users to read/write their own cart items (by session_id)
CREATE POLICY "Users can view own cart items"
    ON cart_items FOR SELECT
    USING (true); -- We rely on session_id matching in application logic

CREATE POLICY "Users can insert own cart items"
    ON cart_items FOR INSERT
    WITH CHECK (true); -- Application handles session_id

CREATE POLICY "Users can update own cart items"
    ON cart_items FOR UPDATE
    USING (true); -- Application handles session_id

CREATE POLICY "Users can delete own cart items"
    ON cart_items FOR DELETE
    USING (true); -- Application handles session_id

-- Orders Policies
-- Users can view their own orders
CREATE POLICY "Users can view own orders"
    ON orders FOR SELECT
    USING (
        auth.uid() IS NULL OR -- Allow unauthenticated read for order confirmation
        user_id = auth.uid() OR
        email = auth.jwt()->>'email'
    );

-- Only system can insert orders (via service role)
CREATE POLICY "System can insert orders"
    ON orders FOR INSERT
    WITH CHECK (true); -- Service role bypasses RLS anyway

-- Newsletter Policies
-- Anyone can subscribe
CREATE POLICY "Anyone can subscribe to newsletter"
    ON newsletter FOR INSERT
    WITH CHECK (true);

-- Only subscribers can view their subscription
CREATE POLICY "Users can view own subscription"
    ON newsletter FOR SELECT
    USING (email = auth.jwt()->>'email' OR auth.uid() IS NULL);

-- ============================================================================
-- MAINTENANCE FUNCTIONS
-- ============================================================================

-- Function to clean up expired guest carts (older than 30 days)
CREATE OR REPLACE FUNCTION cleanup_expired_carts()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM cart_items
    WHERE user_id IS NULL 
        AND created_at < NOW() - INTERVAL '30 days';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- You can schedule this function to run daily via pg_cron or call it manually:
-- SELECT cleanup_expired_carts();

-- ============================================================================
-- HELPER VIEWS
-- ============================================================================

-- View for active carts with item counts
CREATE OR REPLACE VIEW active_carts AS
SELECT 
    session_id,
    user_id,
    COUNT(*) as item_count,
    SUM(quantity) as total_quantity,
    MAX(updated_at) as last_updated
FROM cart_items
GROUP BY session_id, user_id;

-- View for order statistics
CREATE OR REPLACE VIEW order_stats AS
SELECT 
    DATE_TRUNC('day', created_at) as order_date,
    COUNT(*) as order_count,
    SUM(total) as total_revenue,
    AVG(total) as avg_order_value,
    status
FROM orders
GROUP BY DATE_TRUNC('day', created_at), status
ORDER BY order_date DESC;

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

-- Grant appropriate permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON cart_items TO authenticated;
GRANT SELECT ON orders TO authenticated;
GRANT INSERT ON newsletter TO anon, authenticated;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- Run these to verify the setup:

-- Check if tables exist
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public' 
-- AND table_name IN ('cart_items', 'orders', 'newsletter');

-- Check RLS policies
-- SELECT * FROM pg_policies 
-- WHERE tablename IN ('cart_items', 'orders', 'newsletter');

-- Test cart items insert
-- INSERT INTO cart_items (session_id, product_id, quantity) 
-- VALUES ('test-session-123', 'prod_test123', 1);

-- Test cleanup function
-- SELECT cleanup_expired_carts();
