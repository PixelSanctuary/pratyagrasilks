-- ============================================================================
-- Pricing Migration — Cost-plus-margin model
-- Run in Supabase SQL Editor
-- ============================================================================

ALTER TABLE products ADD COLUMN IF NOT EXISTS purchase_price       NUMERIC(12, 2) DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS purchase_tax_percent NUMERIC(5, 2)  DEFAULT 5;
ALTER TABLE products ADD COLUMN IF NOT EXISTS profit_margin_percent NUMERIC(5, 2) DEFAULT 35;
ALTER TABLE products ADD COLUMN IF NOT EXISTS selling_tax_percent  NUMERIC(5, 2)  DEFAULT 5;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_price_overridden  BOOLEAN        DEFAULT false;
