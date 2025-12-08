-- ============================================================================
-- Migration Script: Update Product Categories to Silk Types
-- ============================================================================
-- This script updates existing product categories from generic types 
-- (sarees, dress-materials, etc.) to specific silk types
-- (kanjivaram-silk, banarasi-silk, etc.)
-- ============================================================================

-- Update Kanjivaram Silk products
UPDATE products 
SET category = 'kanjivaram-silk' 
WHERE sku = 'KSS-001-BLUE';

-- Update Banarasi Silk products
UPDATE products 
SET category = 'banarasi-silk' 
WHERE sku = 'BSS-002-MAR';

-- Update Tussar Silk products
UPDATE products 
SET category = 'tussar-silk' 
WHERE sku = 'TDM-003-NAT';

-- Update Mysore Silk products
UPDATE products 
SET category = 'mysore-silk' 
WHERE sku = 'MSS-008-PNK';

-- Update Patola Silk products (can be categorized under a general silk type)
-- Note: Patola is not in the main silk types list, so we'll keep it as a variant
-- or you can add it to the categories list
UPDATE products 
SET category = 'kanjivaram-silk'  -- or create a new 'patola-silk' category
WHERE sku = 'PSS-007-GRN';

-- For other products (Chanderi, Pashmina, Raw Silk), you'll need to decide
-- which silk type category they belong to, or add new categories for them

-- Optional: Add new categories to the categories table if you're using it
INSERT INTO categories (name, slug, description, display_order, is_active) VALUES
    ('Kanjivaram Silk', 'kanjivaram-silk', 'Pure mulberry silk with intricate temple designs', 1, true),
    ('Banarasi Silk', 'banarasi-silk', 'Luxurious zari work and brocade patterns', 2, true),
    ('Tussar Silk', 'tussar-silk', 'Natural texture with distinctive golden hue', 3, true),
    ('Mysore Silk', 'mysore-silk', 'Finest mulberry silk with elegant designs', 4, true),
    ('Kerala Kasavu', 'kerala-kasavu', 'Traditional gold weaving on white silk', 5, true),
    ('Muga Silk', 'muga-silk', 'Golden-hued natural silk unique to Assam', 6, true),
    ('Kani Silk', 'kani-silk', 'Intricate Kani weaving with detailed patterns', 7, true),
    ('Paithani Silk', 'paithani-silk', 'Fine silk with brilliant colors and peacock motifs', 8, true),
    ('Pochampalli Silk', 'pochampalli-silk', 'Traditional ikat technique with vibrant colors', 9, true),
    ('Baluchari Silk', 'baluchari-silk', 'Narrative motifs and mythological scenes', 10, true),
    ('Georgette Silk', 'georgette-silk', 'Elegant Georgette silk with traditional patterns', 11, true)
ON CONFLICT (slug) DO UPDATE 
SET 
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    display_order = EXCLUDED.display_order,
    is_active = EXCLUDED.is_active;

-- ============================================================================
-- Verification Query
-- ============================================================================
-- Run this to verify the updates
-- SELECT sku, name, category FROM products ORDER BY category, sku;
