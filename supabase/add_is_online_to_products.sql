-- ============================================================================
-- POS Phase Migration: Add is_online toggle to products table
-- Run this in the Supabase SQL Editor
-- ============================================================================

-- 1. Add the column (safe: idempotent)
ALTER TABLE products
    ADD COLUMN IF NOT EXISTS is_online BOOLEAN NOT NULL DEFAULT true;

-- 2. Backfill: all existing products default to online (already done by DEFAULT,
--    but explicit for clarity)
UPDATE products SET is_online = true WHERE is_online IS NULL;

-- 3. Index for fast public-facing queries
CREATE INDEX IF NOT EXISTS idx_products_is_online ON products(is_online);

-- 4. Drop the old public read policy and replace with is_online-aware version
DROP POLICY IF EXISTS "Public can view in-stock products" ON products;

CREATE POLICY "Public can view online in-stock products" ON products
    FOR SELECT
    USING (in_stock = true AND is_online = true);

-- Admin policy stays unchanged (service_role bypasses RLS anyway,
-- but this ensures the named policy is explicit)
-- "Admin can manage products" already covers FOR ALL with service_role

-- ============================================================================
-- Done. Existing products remain online. New physical-only sarees can be
-- toggled to is_online = false from the Admin UI.
-- ============================================================================
