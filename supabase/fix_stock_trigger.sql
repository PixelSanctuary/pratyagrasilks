-- Fix for stock deduction trigger
-- The issue: The trigger on orders table fires before order_items are created
-- Solution: Create trigger on order_items table instead

-- 1. Drop the old trigger on orders
DROP TRIGGER IF EXISTS trigger_simple_stock_management ON orders;
DROP FUNCTION IF EXISTS simple_deduct_stock_on_order();

-- 2. Create new function to deduct stock when order item is created
CREATE OR REPLACE FUNCTION deduct_stock_on_order_item()
RETURNS TRIGGER AS $$
BEGIN
    -- Deduct stock when order item is created
    UPDATE products
    SET stock_quantity = GREATEST(stock_quantity - 1, 0)
    WHERE id = NEW.product_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Create trigger on order_items table
DROP TRIGGER IF EXISTS trigger_deduct_stock_on_order_item ON order_items;
CREATE TRIGGER trigger_deduct_stock_on_order_item
    AFTER INSERT ON order_items
    FOR EACH ROW
    EXECUTE FUNCTION deduct_stock_on_order_item();

-- 4. Create function to restore stock when order is cancelled
CREATE OR REPLACE FUNCTION restore_stock_on_cancel()
RETURNS TRIGGER AS $$
DECLARE
    item RECORD;
BEGIN
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

-- 5. Create trigger on orders table for cancellation
DROP TRIGGER IF EXISTS trigger_restore_stock_on_cancel ON orders;
CREATE TRIGGER trigger_restore_stock_on_cancel
    AFTER UPDATE OF status ON orders
    FOR EACH ROW
    EXECUTE FUNCTION restore_stock_on_cancel();

-- ============================================================================
-- Migration Complete
-- ============================================================================
-- Changes made:
-- ✅ Moved stock deduction trigger to order_items table (fires when item is added)
-- ✅ Created separate trigger for stock restoration on order cancellation
-- ✅ Stock will now be deducted immediately when order items are created
-- ============================================================================
