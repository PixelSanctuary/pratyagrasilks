-- Add color_family column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS color_family TEXT DEFAULT NULL;

-- Add comment for documentation
COMMENT ON COLUMN products.color_family IS 'Base color family for filtering (e.g. red, pink, orange, yellow, green, blue, purple, brown, white, black, gold, silver)';

-- Index for efficient filtering on the collection page
CREATE INDEX IF NOT EXISTS idx_products_color_family ON products (color_family);
