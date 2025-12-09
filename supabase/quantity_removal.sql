-- ============================================================================
-- Remove Quantity Functionality - Database Migration
-- ============================================================================
-- This migration removes quantity-related features since each saree is unique
-- Run this in Supabase SQL Editor
-- ============================================================================

-- 1. Update all products to have stock_quantity of 1 (in stock) or 0 (out of stock)
UPDATE products 
SET stock_quantity = CASE 
    WHEN in_stock = true THEN 1 
    ELSE 0 
END;

-- 2. Drop low_stock_threshold column (no longer needed)
ALTER TABLE products 
DROP COLUMN IF EXISTS low_stock_threshold;

-- 3. Drop track_inventory column (always track as boolean in_stock)
ALTER TABLE products 
DROP COLUMN IF EXISTS track_inventory;

-- 4. Drop inventory tracking trigger
DROP TRIGGER IF EXISTS trigger_update_stock_status ON products;
DROP FUNCTION IF EXISTS update_product_stock_status();

-- 5. Drop stock deduction trigger (we'll handle this differently)
DROP TRIGGER IF EXISTS trigger_manage_stock_on_order ON orders;
DROP FUNCTION IF EXISTS deduct_stock_on_order();

-- 6. Drop inventory_reservations table (no longer needed)
DROP TABLE IF EXISTS inventory_reservations CASCADE;

-- 7. Remove quantity column from cart_items table
ALTER TABLE cart_items 
DROP COLUMN IF EXISTS quantity;

-- 8. Update order_items to default quantity to 1
ALTER TABLE order_items 
ALTER COLUMN quantity SET DEFAULT 1;

-- 9. Create simple trigger to update in_stock based on stock_quantity
CREATE OR REPLACE FUNCTION update_in_stock_status()
RETURNS TRIGGER AS $$
BEGIN
    NEW.in_stock = (NEW.stock_quantity > 0);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_in_stock ON products;
CREATE TRIGGER trigger_update_in_stock
    BEFORE INSERT OR UPDATE OF stock_quantity ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_in_stock_status();

-- 10. Create function to handle stock deduction on order (simple version)
CREATE OR REPLACE FUNCTION simple_deduct_stock_on_order()
RETURNS TRIGGER AS $$
DECLARE
    item RECORD;
BEGIN
    -- Deduct stock when order is created or moves to processing
    IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND OLD.status != NEW.status AND NEW.status IN ('pending', 'processing')) THEN
        FOR item IN 
            SELECT product_id FROM order_items WHERE order_id = NEW.id
        LOOP
            UPDATE products
            SET stock_quantity = GREATEST(stock_quantity - 1, 0)
            WHERE id = item.product_id;
        END LOOP;
    END IF;
    
    -- Restore stock if order is cancelled
    IF TG_OP = 'UPDATE' AND OLD.status != 'cancelled' AND NEW.status = 'cancelled' THEN
        FOR item IN 
            SELECT product_id FROM order_items WHERE order_id = NEW.id
        LOOP
            UPDATE products
            SET stock_quantity = LEAST(stock_quantity + 1, 1)
            WHERE id = item.product_id;
        END LOOP;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_simple_stock_management ON orders;
CREATE TRIGGER trigger_simple_stock_management
    AFTER INSERT OR UPDATE OF status ON orders
    FOR EACH ROW
    EXECUTE FUNCTION simple_deduct_stock_on_order();

-- 11. Remove is_active column from products (redundant with in_stock)
ALTER TABLE products DROP COLUMN IF EXISTS is_active;

-- 12. Drop the old RLS policy that might use is_active
DROP POLICY IF EXISTS "Public can view in-stock products" ON products;

-- 13. Create new RLS policy using only in_stock
CREATE POLICY "Public can view available products" ON products
    FOR SELECT USING (in_stock = true);

-- 14. Add comment
COMMENT ON COLUMN products.stock_quantity IS 'Stock quantity: 1 = available, 0 = sold out (each saree is unique)';
COMMENT ON COLUMN products.in_stock IS 'Automatically set based on stock_quantity via trigger';

-- ============================================================================
-- Migration Complete
-- ============================================================================
-- Changes made:
-- ✅ Set all products to stock_quantity 1 or 0
-- ✅ Removed low_stock_threshold column
-- ✅ Removed track_inventory column
-- ✅ Removed is_active column (redundant with in_stock)
-- ✅ Removed inventory_reservations table
-- ✅ Removed quantity column from cart_items
-- ✅ Simplified stock management triggers
-- ✅ Updated RLS policy to use only in_stock
-- ============================================================================
