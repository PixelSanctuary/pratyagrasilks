-- ============================================================================
-- PratyagraSilks E-Commerce Database Schema
-- ============================================================================
-- This schema creates all necessary tables for the e-commerce platform
-- Copy and paste this entire file into the Supabase SQL Editor
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- PRODUCTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    category TEXT NOT NULL,
    images TEXT[] DEFAULT '{}',
    in_stock BOOLEAN DEFAULT true,
    sku TEXT UNIQUE NOT NULL,
    material TEXT,
    dimensions JSONB,
    weight NUMERIC(10, 2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON products(in_stock);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

-- ============================================================================
-- CATEGORIES TABLE (Optional - for managing categories)
-- ============================================================================
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);

-- ============================================================================
-- CUSTOMERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);

-- ============================================================================
-- ADDRESSES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'India',
    phone TEXT NOT NULL,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_addresses_customer_id ON addresses(customer_id);

-- ============================================================================
-- ORDERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    order_number TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
    shipping_cost NUMERIC(10, 2) DEFAULT 0 CHECK (shipping_cost >= 0),
    shipping_address_id UUID REFERENCES addresses(id),
    payment_method TEXT,
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
    payment_id TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    delivered_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);

-- ============================================================================
-- ORDER ITEMS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    product_name TEXT NOT NULL,
    product_sku TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
    total_price NUMERIC(10, 2) NOT NULL CHECK (total_price >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- ============================================================================
-- CART TABLE (For persistent shopping carts)
-- ============================================================================
CREATE TABLE IF NOT EXISTS cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    session_id TEXT,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(customer_id, product_id),
    UNIQUE(session_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_cart_items_customer_id ON cart_items(customer_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_session_id ON cart_items(session_id);

-- ============================================================================
-- REVIEWS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    comment TEXT,
    is_verified_purchase BOOLEAN DEFAULT false,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(product_id, customer_id)
);

CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_customer_id ON reviews(customer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_is_approved ON reviews(is_approved);

-- ============================================================================
-- WISHLIST TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS wishlist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(customer_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_wishlist_customer_id ON wishlist(customer_id);

-- ============================================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to tables with updated_at column
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_addresses_updated_at BEFORE UPDATE ON addresses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;

-- Products: Public read access, admin write access
CREATE POLICY "Public can view in-stock products" ON products
    FOR SELECT USING (in_stock = true);

CREATE POLICY "Admin can manage products" ON products
    FOR ALL USING (auth.role() = 'service_role');

-- Categories: Public read access
CREATE POLICY "Public can view active categories" ON categories
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admin can manage categories" ON categories
    FOR ALL USING (auth.role() = 'service_role');

-- Customers: Users can only see their own data
CREATE POLICY "Users can view own customer data" ON customers
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own customer data" ON customers
    FOR UPDATE USING (auth.uid()::text = id::text);

-- Addresses: Users can only manage their own addresses
CREATE POLICY "Users can view own addresses" ON addresses
    FOR SELECT USING (auth.uid()::text = customer_id::text);

CREATE POLICY "Users can insert own addresses" ON addresses
    FOR INSERT WITH CHECK (auth.uid()::text = customer_id::text);

CREATE POLICY "Users can update own addresses" ON addresses
    FOR UPDATE USING (auth.uid()::text = customer_id::text);

CREATE POLICY "Users can delete own addresses" ON addresses
    FOR DELETE USING (auth.uid()::text = customer_id::text);

-- Orders: Users can only see their own orders
CREATE POLICY "Users can view own orders" ON orders
    FOR SELECT USING (auth.uid()::text = customer_id::text);

CREATE POLICY "Users can create own orders" ON orders
    FOR INSERT WITH CHECK (auth.uid()::text = customer_id::text);

-- Order Items: Users can view items from their own orders
CREATE POLICY "Users can view own order items" ON order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_items.order_id 
            AND auth.uid()::text = orders.customer_id::text
        )
    );

-- Cart Items: Users can manage their own cart
CREATE POLICY "Users can view own cart" ON cart_items
    FOR SELECT USING (auth.uid()::text = customer_id::text);

CREATE POLICY "Users can insert own cart items" ON cart_items
    FOR INSERT WITH CHECK (auth.uid()::text = customer_id::text);

CREATE POLICY "Users can update own cart items" ON cart_items
    FOR UPDATE USING (auth.uid()::text = customer_id::text);

CREATE POLICY "Users can delete own cart items" ON cart_items
    FOR DELETE USING (auth.uid()::text = customer_id::text);

-- Reviews: Public can read approved reviews
CREATE POLICY "Public can view approved reviews" ON reviews
    FOR SELECT USING (is_approved = true);

CREATE POLICY "Users can create reviews" ON reviews
    FOR INSERT WITH CHECK (auth.uid()::text = customer_id::text);

CREATE POLICY "Users can update own reviews" ON reviews
    FOR UPDATE USING (auth.uid()::text = customer_id::text);

-- Wishlist: Users can manage their own wishlist
CREATE POLICY "Users can view own wishlist" ON wishlist
    FOR SELECT USING (auth.uid()::text = customer_id::text);

CREATE POLICY "Users can insert own wishlist items" ON wishlist
    FOR INSERT WITH CHECK (auth.uid()::text = customer_id::text);

CREATE POLICY "Users can delete own wishlist items" ON wishlist
    FOR DELETE USING (auth.uid()::text = customer_id::text);

-- ============================================================================
-- SAMPLE DATA (Optional - Remove if not needed)
-- ============================================================================

-- Insert sample categories
INSERT INTO categories (name, slug, description, display_order) VALUES
    ('Sarees', 'sarees', 'Traditional and contemporary sarees', 1),
    ('Dress Materials', 'dress-materials', 'Unstitched dress materials', 2),
    ('Dupattas', 'dupattas', 'Designer dupattas and stoles', 3),
    ('Stoles', 'stoles', 'Elegant silk stoles', 4),
    ('Fabric', 'fabric', 'Premium silk fabric by meter', 5)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample products
INSERT INTO products (name, description, price, category, sku, material, in_stock, images) VALUES
    (
        'Kanjivaram Silk Saree - Royal Blue',
        'Exquisite handwoven Kanjivaram silk saree with traditional golden zari border and intricate temple motifs. Perfect for weddings and special occasions.',
        25000.00,
        'sarees',
        'KSS-001-BLUE',
        'Pure Kanjivaram Silk',
        true,
        ARRAY['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800']
    ),
    (
        'Banarasi Silk Saree - Maroon',
        'Classic Banarasi silk saree featuring elaborate zari work and floral patterns. Comes with matching blouse piece.',
        18000.00,
        'sarees',
        'BSS-002-MAR',
        'Banarasi Silk',
        true,
        ARRAY['https://images.unsplash.com/photo-1583391733956-6c78276477e5?w=800']
    ),
    (
        'Tussar Silk Dress Material',
        'Soft and comfortable Tussar silk dress material with natural texture. Includes 2.5 meters of fabric.',
        4500.00,
        'dress-materials',
        'TDM-003-NAT',
        'Tussar Silk',
        true,
        ARRAY['https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=800']
    ),
    (
        'Chanderi Silk Dupatta - Gold',
        'Lightweight Chanderi silk dupatta with golden border and delicate embroidery work.',
        3200.00,
        'dupattas',
        'CSD-004-GLD',
        'Chanderi Silk',
        true,
        ARRAY['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800']
    ),
    (
        'Pashmina Silk Stole - Cream',
        'Luxurious pashmina silk blend stole with hand-embroidered borders. Perfect for evening wear.',
        5500.00,
        'stoles',
        'PSS-005-CRM',
        'Pashmina Silk Blend',
        true,
        ARRAY['https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800']
    ),
    (
        'Raw Silk Fabric - Burgundy',
        'Premium quality raw silk fabric sold by meter. Ideal for custom tailoring.',
        1800.00,
        'fabric',
        'RSF-006-BUR',
        'Raw Silk',
        true,
        ARRAY['https://images.unsplash.com/photo-1558769132-cb1aea1c8e5d?w=800']
    ),
    (
        'Patola Silk Saree - Green',
        'Authentic double ikat Patola silk saree with geometric patterns. A collector''s piece.',
        45000.00,
        'sarees',
        'PSS-007-GRN',
        'Patola Silk',
        true,
        ARRAY['https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800']
    ),
    (
        'Mysore Silk Saree - Pink',
        'Elegant Mysore silk saree with minimalist design and rich texture. Lightweight and comfortable.',
        12000.00,
        'sarees',
        'MSS-008-PNK',
        'Mysore Silk',
        true,
        ARRAY['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800']
    )
ON CONFLICT (sku) DO NOTHING;

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================
-- Schema creation complete!
-- All tables, indexes, triggers, and RLS policies have been created.
-- Sample data has been inserted for testing.
-- ============================================================================
