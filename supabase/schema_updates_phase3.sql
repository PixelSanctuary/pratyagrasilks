-- ============================================================================
-- Database Schema Updates for Phase 3 Requirements
-- ============================================================================
-- Run this SQL in Supabase SQL Editor to add new features:
-- - Inventory tracking with quantity
-- - Razorpay payment integration
-- - Location-based shipping
-- - Google OAuth support
-- ============================================================================

-- ============================================================================
-- 1. INVENTORY TRACKING
-- ============================================================================

-- Add stock quantity to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS low_stock_threshold INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS track_inventory BOOLEAN DEFAULT true;

-- Update existing products to have stock quantity
UPDATE products 
SET stock_quantity = 100, 
    track_inventory = true
WHERE stock_quantity IS NULL;

-- Create index for stock queries
CREATE INDEX IF NOT EXISTS idx_products_stock_quantity ON products(stock_quantity);

-- Function to check and update stock status
CREATE OR REPLACE FUNCTION update_product_stock_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.track_inventory THEN
        NEW.in_stock = (NEW.stock_quantity > 0);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update in_stock based on quantity
DROP TRIGGER IF EXISTS trigger_update_stock_status ON products;
CREATE TRIGGER trigger_update_stock_status
    BEFORE INSERT OR UPDATE OF stock_quantity ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_product_stock_status();

-- ============================================================================
-- 2. RAZORPAY PAYMENT INTEGRATION
-- ============================================================================

-- Add Razorpay fields to orders table
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT,
ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT,
ADD COLUMN IF NOT EXISTS razorpay_signature TEXT,
ADD COLUMN IF NOT EXISTS payment_verified_at TIMESTAMPTZ;

-- Create index for payment tracking
CREATE INDEX IF NOT EXISTS idx_orders_razorpay_order_id ON orders(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_orders_razorpay_payment_id ON orders(razorpay_payment_id);

-- ============================================================================
-- 3. LOCATION-BASED SHIPPING
-- ============================================================================

-- Create shipping zones table
CREATE TABLE IF NOT EXISTS shipping_zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    states TEXT[] NOT NULL,
    base_charge NUMERIC(10, 2) NOT NULL DEFAULT 0,
    per_kg_charge NUMERIC(10, 2) DEFAULT 0,
    free_shipping_threshold NUMERIC(10, 2),
    estimated_days TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default shipping zones for India
INSERT INTO shipping_zones (name, states, base_charge, per_kg_charge, free_shipping_threshold, estimated_days) VALUES
    (
        'Zone 1 - Metro Cities',
        ARRAY['Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'West Bengal'],
        100.00,
        20.00,
        2000.00,
        '3-5 business days'
    ),
    (
        'Zone 2 - Major Cities',
        ARRAY['Gujarat', 'Rajasthan', 'Uttar Pradesh', 'Madhya Pradesh', 'Telangana', 'Kerala', 'Punjab', 'Haryana'],
        150.00,
        25.00,
        2500.00,
        '5-7 business days'
    ),
    (
        'Zone 3 - Other States',
        ARRAY['Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Himachal Pradesh', 'Jharkhand', 'Odisha', 'Uttarakhand'],
        200.00,
        30.00,
        3000.00,
        '7-10 business days'
    ),
    (
        'Zone 4 - Remote Areas',
        ARRAY['Arunachal Pradesh', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Sikkim', 'Tripura', 'Jammu and Kashmir', 'Ladakh'],
        300.00,
        40.00,
        5000.00,
        '10-14 business days'
    )
ON CONFLICT DO NOTHING;

-- Add shipping fields to orders table
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS shipping_zone_id UUID REFERENCES shipping_zones(id),
ADD COLUMN IF NOT EXISTS shipping_charge NUMERIC(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS subtotal NUMERIC(10, 2),
ADD COLUMN IF NOT EXISTS estimated_delivery_days TEXT;

-- Create index for shipping zones
CREATE INDEX IF NOT EXISTS idx_orders_shipping_zone ON orders(shipping_zone_id);

-- Trigger for shipping zones updated_at
CREATE TRIGGER update_shipping_zones_updated_at BEFORE UPDATE ON shipping_zones
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 4. GOOGLE OAUTH SUPPORT
-- ============================================================================

-- Add OAuth provider fields to customers table
ALTER TABLE customers
ADD COLUMN IF NOT EXISTS auth_provider TEXT DEFAULT 'email',
ADD COLUMN IF NOT EXISTS auth_provider_id TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false;

-- Create index for OAuth lookups
CREATE INDEX IF NOT EXISTS idx_customers_auth_provider ON customers(auth_provider, auth_provider_id);

-- ============================================================================
-- 5. INVENTORY RESERVATION (For Cart to Order Flow)
-- ============================================================================

-- Create inventory reservations table
CREATE TABLE IF NOT EXISTS inventory_reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    reserved_by UUID REFERENCES customers(id) ON DELETE CASCADE,
    session_id TEXT,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for reservations
CREATE INDEX IF NOT EXISTS idx_reservations_product_id ON inventory_reservations(product_id);
CREATE INDEX IF NOT EXISTS idx_reservations_expires_at ON inventory_reservations(expires_at);
CREATE INDEX IF NOT EXISTS idx_reservations_reserved_by ON inventory_reservations(reserved_by);

-- Function to clean up expired reservations
CREATE OR REPLACE FUNCTION cleanup_expired_reservations()
RETURNS void AS $$
BEGIN
    DELETE FROM inventory_reservations
    WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 6. STOCK DEDUCTION ON ORDER CREATION
-- ============================================================================

-- Function to deduct stock when order is created
CREATE OR REPLACE FUNCTION deduct_stock_on_order()
RETURNS TRIGGER AS $$
DECLARE
    item RECORD;
BEGIN
    -- Only deduct stock for new orders with 'pending' or 'processing' status
    IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND OLD.status != NEW.status AND NEW.status IN ('pending', 'processing')) THEN
        -- Deduct stock for each order item
        FOR item IN 
            SELECT product_id, quantity 
            FROM order_items 
            WHERE order_id = NEW.id
        LOOP
            UPDATE products
            SET stock_quantity = stock_quantity - item.quantity
            WHERE id = item.product_id AND track_inventory = true;
        END LOOP;
    END IF;
    
    -- Restore stock if order is cancelled
    IF TG_OP = 'UPDATE' AND OLD.status != 'cancelled' AND NEW.status = 'cancelled' THEN
        FOR item IN 
            SELECT product_id, quantity 
            FROM order_items 
            WHERE order_id = NEW.id
        LOOP
            UPDATE products
            SET stock_quantity = stock_quantity + item.quantity
            WHERE id = item.product_id AND track_inventory = true;
        END LOOP;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to manage stock on order changes
DROP TRIGGER IF EXISTS trigger_manage_stock_on_order ON orders;
CREATE TRIGGER trigger_manage_stock_on_order
    AFTER INSERT OR UPDATE OF status ON orders
    FOR EACH ROW
    EXECUTE FUNCTION deduct_stock_on_order();

-- ============================================================================
-- 7. UPDATE RLS POLICIES
-- ============================================================================

-- Shipping zones: Public read access
ALTER TABLE shipping_zones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active shipping zones" ON shipping_zones
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admin can manage shipping zones" ON shipping_zones
    FOR ALL USING (auth.role() = 'service_role');

-- Inventory reservations: Users can manage their own
ALTER TABLE inventory_reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own reservations" ON inventory_reservations
    FOR SELECT USING (auth.uid()::text = reserved_by::text);

CREATE POLICY "Users can create own reservations" ON inventory_reservations
    FOR INSERT WITH CHECK (auth.uid()::text = reserved_by::text);

CREATE POLICY "Users can delete own reservations" ON inventory_reservations
    FOR DELETE USING (auth.uid()::text = reserved_by::text);

-- ============================================================================
-- 8. SAMPLE DATA UPDATES
-- ============================================================================

-- Update existing products with stock quantities
UPDATE products SET 
    stock_quantity = 50,
    low_stock_threshold = 5,
    track_inventory = true
WHERE sku LIKE 'KSS-%' OR sku LIKE 'BSS-%';

UPDATE products SET 
    stock_quantity = 100,
    low_stock_threshold = 10,
    track_inventory = true
WHERE sku LIKE 'TDM-%' OR sku LIKE 'CSD-%';

UPDATE products SET 
    stock_quantity = 75,
    low_stock_threshold = 8,
    track_inventory = true
WHERE sku LIKE 'PSS-%' OR sku LIKE 'RSF-%' OR sku LIKE 'MSS-%';

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================
-- Schema updates complete!
-- New features added:
-- ✅ Inventory tracking with automatic stock management
-- ✅ Razorpay payment integration fields
-- ✅ Location-based shipping zones
-- ✅ Google OAuth support
-- ✅ Inventory reservation system
-- ✅ Automatic stock deduction on orders
-- ============================================================================
