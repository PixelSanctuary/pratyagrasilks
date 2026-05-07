-- ============================================================================
-- Invoice Number Backfill — run ONCE in Supabase SQL Editor
-- Assigns INV-001, INV-002, … to all orders that have invoice_number = NULL
-- Orders are processed oldest-first so the smallest numbers go to earliest orders.
-- New orders created after this will continue the sequence automatically.
-- ============================================================================

DO $$
DECLARE
    rec RECORD;
BEGIN
    FOR rec IN
        SELECT id
        FROM orders
        WHERE invoice_number IS NULL
        ORDER BY created_at ASC
    LOOP
        UPDATE orders
        SET invoice_number = 'INV-' || LPAD(nextval('invoice_seq')::text, 3, '0')
        WHERE id = rec.id;
    END LOOP;
END;
$$;
