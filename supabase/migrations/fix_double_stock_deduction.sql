-- Fix Double Stock Deduction Issue
-- This migration disables the redundant trigger to prevent stock being deducted twice
-- 
-- Strategy: Keep deduct_stock_on_order_item() trigger (fires on order_items INSERT)
--           Disable deduct_stock_on_order() trigger (fires on orders UPDATE)
--
-- Reason: Stock should be deducted immediately when order items are created,
--         not when order status changes (which happens during Stripe webhook)

-- ============================================================================
-- 1. DROP REDUNDANT TRIGGER
-- ============================================================================

-- Remove the trigger that fires on order status changes
DROP TRIGGER IF EXISTS trigger_manage_stock_on_order ON orders;

-- Optionally drop the function if not used elsewhere
-- Commenting out to preserve for potential future use
-- DROP FUNCTION IF EXISTS deduct_stock_on_order();

-- ============================================================================
-- 2. VERIFY ACTIVE TRIGGERS
-- ============================================================================

-- The following triggers should remain active:
-- ✅ trigger_deduct_stock_on_order_item (on order_items table)
--    - Deducts stock when order items are inserted
-- ✅ trigger_restore_stock_on_cancel (on orders table)
--    - Restores stock when order is cancelled

-- ============================================================================
-- 3. UPDATE STOCK RESTORATION LOGIC
-- ============================================================================

-- Ensure the restore function uses correct quantity from order_items
CREATE OR REPLACE FUNCTION restore_stock_on_cancel()
RETURNS TRIGGER AS $$
DECLARE
    item RECORD;
BEGIN
    -- Restore stock if order is cancelled
    IF TG_OP = 'UPDATE' AND OLD.status != 'cancelled' AND NEW.status = 'cancelled' THEN
        FOR item IN 
            SELECT product_id, quantity FROM order_items WHERE order_id = NEW.id
        LOOP
            UPDATE products
            SET stock_quantity = stock_quantity + item.quantity
            WHERE id = item.product_id;
        END LOOP;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger to ensure it uses the updated function
DROP TRIGGER IF EXISTS trigger_restore_stock_on_cancel ON orders;
CREATE TRIGGER trigger_restore_stock_on_cancel
    AFTER UPDATE OF status ON orders
    FOR EACH ROW
    EXECUTE FUNCTION restore_stock_on_cancel();

-- ============================================================================
-- 4. UPDATE STOCK DEDUCTION LOGIC TO USE QUANTITY
-- ============================================================================

-- Update the deduct_stock_on_order_item function to use actual quantity
CREATE OR REPLACE FUNCTION deduct_stock_on_order_item()
RETURNS TRIGGER AS $$
BEGIN
    -- Deduct stock when order item is created
    -- Use the quantity from the order item, not hardcoded 1
    UPDATE products
    SET stock_quantity = GREATEST(stock_quantity - NEW.quantity, 0)
    WHERE id = NEW.product_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger
DROP TRIGGER IF EXISTS trigger_deduct_stock_on_order_item ON order_items;
CREATE TRIGGER trigger_deduct_stock_on_order_item
    AFTER INSERT ON order_items
    FOR EACH ROW
    EXECUTE FUNCTION deduct_stock_on_order_item();

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- Changes made:
-- ✅ Disabled trigger_manage_stock_on_order (prevents double deduction)
-- ✅ Updated deduct_stock_on_order_item() to use actual quantity
-- ✅ Updated restore_stock_on_cancel() to use actual quantity
-- ✅ Stock now deducted once when order_items are created
-- ✅ Stock restored when order is cancelled
-- ============================================================================
