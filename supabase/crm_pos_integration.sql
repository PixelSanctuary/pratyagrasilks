-- ============================================================
-- Pratyagra Silks — Unified CRM & POS Integration
-- Production-ready single migration file
-- Run ONCE in Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- ── STEP 1: Extend customers table for unified CRM ───────────────────────────
--   Adds POS fields while keeping existing e-commerce structure

ALTER TABLE public.customers
    ALTER COLUMN email DROP NOT NULL;
-- email is now optional (NULL for POS walk-in customers)

ALTER TABLE public.customers
    ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'ONLINE'
    CHECK (source IN ('ONLINE', 'POS', 'BOTH'));
-- Tracks customer origin: ONLINE (e-commerce signup), POS (phone lookup), or BOTH

ALTER TABLE public.customers
    ADD COLUMN IF NOT EXISTS total_spent NUMERIC(12, 2) DEFAULT 0;
-- Lifetime value across all orders (auto-updated by trigger)

ALTER TABLE public.customers
    ADD COLUMN IF NOT EXISTS total_orders INTEGER DEFAULT 0;
-- Total order count (auto-updated by trigger)

ALTER TABLE public.customers
    ADD COLUMN IF NOT EXISTS last_purchase TIMESTAMPTZ;
-- Latest purchase timestamp (useful for recency sorting & analytics)

-- Create index on phone for fast POS customer lookups
CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers(phone)
    WHERE phone IS NOT NULL;

-- Create composite index for loyalty analytics
CREATE INDEX IF NOT EXISTS idx_customers_source_total_spent
    ON public.customers(source, total_spent DESC);


-- ── STEP 2: Clean up orders table (remove temporary phone column if it exists) ──

ALTER TABLE public.orders
    DROP COLUMN IF EXISTS customer_phone;
-- Use customer_id FK instead for unified customer tracking


-- ── STEP 3: Trigger to auto-update customer metrics on order creation ─────────
--   Updates total_spent, total_orders, last_purchase, and source on every order

CREATE OR REPLACE FUNCTION public.update_customer_stats_on_order()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    UPDATE public.customers
    SET
        total_orders = total_orders + 1,
        total_spent = total_spent + NEW.total_amount,
        last_purchase = NEW.created_at,
        -- Auto-promote customer source if they cross channels
        source = CASE
            WHEN source = 'ONLINE' AND NEW.order_number LIKE 'POS-%' THEN 'BOTH'
            WHEN source = 'POS' AND NEW.order_number NOT LIKE 'POS-%' THEN 'BOTH'
            ELSE source
        END,
        updated_at = NOW()
    WHERE id = NEW.customer_id;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_customer_stats_on_order ON public.orders;

CREATE TRIGGER update_customer_stats_on_order
    AFTER INSERT ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.update_customer_stats_on_order();


-- ── STEP 4: Trigger to auto-update customers.updated_at ──────────────────────

CREATE OR REPLACE FUNCTION public.set_updated_at_customers()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS customers_updated_at ON public.customers;

CREATE TRIGGER customers_updated_at
    BEFORE UPDATE ON public.customers
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_customers();


-- ── STEP 5: Data migration ───────────────────────────────────────────────────
--   Backfill source = 'ONLINE' for all existing e-commerce customers

UPDATE public.customers
SET source = COALESCE(source, 'ONLINE')
WHERE source IS NULL;

-- Backfill total_spent from existing orders (e-commerce customers)
UPDATE public.customers c
SET total_spent = COALESCE(
    (SELECT SUM(o.total_amount) FROM public.orders o WHERE o.customer_id = c.id),
    0
)
WHERE c.source = 'ONLINE'
  AND c.total_spent = 0;

-- Backfill total_orders from existing orders
UPDATE public.customers c
SET total_orders = COALESCE(
    (SELECT COUNT(*) FROM public.orders o WHERE o.customer_id = c.id),
    0
)
WHERE c.source = 'ONLINE'
  AND c.total_orders = 0;

-- Backfill last_purchase from most recent order
UPDATE public.customers c
SET last_purchase = (
    SELECT MAX(o.created_at)
    FROM public.orders o
    WHERE o.customer_id = c.id
)
WHERE c.source = 'ONLINE'
  AND c.last_purchase IS NULL;


-- ── STEP 6: Analytics views (optional - for dashboards) ──────────────────────

CREATE OR REPLACE VIEW public.customer_lifetime_value AS
SELECT
    id,
    email,
    phone,
    full_name,
    source,
    total_spent,
    total_orders,
    CASE
        WHEN total_orders = 0 THEN 0
        ELSE total_spent / total_orders
    END AS avg_order_value,
    last_purchase,
    created_at,
    EXTRACT(DAY FROM NOW() - last_purchase) AS days_since_purchase
FROM public.customers
WHERE source IN ('POS', 'BOTH')
ORDER BY total_spent DESC;

CREATE OR REPLACE VIEW public.pos_customers AS
SELECT
    id,
    phone,
    full_name,
    total_spent,
    total_orders,
    last_purchase,
    created_at
FROM public.customers
WHERE source IN ('POS', 'BOTH')
ORDER BY last_purchase DESC;


-- ── STEP 7: Verification & Cleanup queries ─────────────────────────────────
/*
Run these queries AFTER executing the migration to verify setup:

-- 1. Verify columns were added:
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'customers' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Verify triggers created:
SELECT tgname, tgfoid::regprocedure
FROM pg_trigger
WHERE tgrelid = 'public.customers'::regclass AND tgname != 'RI_ConstraintTrigger'
ORDER BY tgname;

-- 3. Verify indexes:
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'customers' AND schemaname = 'public';

-- 4. View sample customer data:
SELECT
    id, email, phone, full_name, source,
    total_spent, total_orders, last_purchase, created_at
FROM public.customers
LIMIT 10;

-- 5. View POS customers (simple):
SELECT * FROM public.pos_customers LIMIT 10;

-- 6. View customer LTV analytics:
SELECT * FROM public.customer_lifetime_value LIMIT 10;

-- 7. Count customers by source:
SELECT source, COUNT(*) as count, SUM(total_spent) as total_revenue
FROM public.customers
GROUP BY source;
*/
