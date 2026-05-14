-- Upgrade color taxonomy: replace scalar color_family with color_families TEXT[] array
-- Supports sarees with any number of color shades
ALTER TABLE products DROP COLUMN IF EXISTS color_family;
ALTER TABLE products ADD COLUMN IF NOT EXISTS color_families TEXT[] DEFAULT '{}';

-- GIN index for high-performance array containment queries (.contains / @>)
CREATE INDEX IF NOT EXISTS idx_products_color_families ON products USING GIN (color_families);

COMMENT ON COLUMN products.color_families IS 'Array of color families. Values: red, pink, orange, yellow, green, blue, purple, brown, white, black, gold, silver';
