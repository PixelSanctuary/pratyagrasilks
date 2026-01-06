-- Add shipping_cost column to orders table
-- This migration adds support for storing shipping costs separately from total_amount

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS shipping_cost NUMERIC(10, 2) DEFAULT 0 CHECK (shipping_cost >= 0);

-- Add comment for documentation
COMMENT ON COLUMN orders.shipping_cost IS 'Shipping cost for the order, stored separately from total_amount';

-- Update existing orders to have shipping_cost = 0 if NULL
UPDATE orders SET shipping_cost = 0 WHERE shipping_cost IS NULL;
