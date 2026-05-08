-- ── is_active ─────────────────────────────────────────────────────────────────
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
UPDATE products SET is_active = true WHERE is_active IS NULL;
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active) WHERE is_active = true;

-- ── is_online ────────────────────────────────────────────────────────────────
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_online BOOLEAN NOT NULL DEFAULT true;
UPDATE products SET is_online = true WHERE is_online IS NULL;
CREATE INDEX IF NOT EXISTS idx_products_is_online ON products(is_online);

-- Replace old public read policy with is_online-aware version
DROP POLICY IF EXISTS "Public can view in-stock products" ON products;
CREATE POLICY "Public can view online in-stock products" ON products
    FOR SELECT USING (in_stock = true AND is_online = true);

-- ── yt_link ───────────────────────────────────────────────────────────────────
ALTER TABLE products ADD COLUMN IF NOT EXISTS yt_link TEXT DEFAULT NULL;
COMMENT ON COLUMN products.yt_link IS 'YouTube video link for product demonstration or showcase';
