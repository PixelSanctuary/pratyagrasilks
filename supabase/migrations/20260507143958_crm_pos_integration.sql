-- ── Extend customers for CRM ──────────────────────────────────────────────────
ALTER TABLE public.customers ALTER COLUMN email DROP NOT NULL;

ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS source       TEXT          DEFAULT 'ONLINE' CHECK (source IN ('ONLINE','POS','BOTH'));
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS total_spent  NUMERIC(12,2) DEFAULT 0;
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS total_orders INTEGER       DEFAULT 0;
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS last_purchase TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_customers_phone               ON public.customers(phone) WHERE phone IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_customers_source_total_spent  ON public.customers(source, total_spent DESC);

-- Clean up orders (remove legacy POS column if it exists)
ALTER TABLE public.orders DROP COLUMN IF EXISTS customer_phone;

-- ── Trigger: auto-update customer stats on new order ─────────────────────────
CREATE OR REPLACE FUNCTION public.update_customer_stats_on_order()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    UPDATE public.customers
    SET
        total_orders  = total_orders + 1,
        total_spent   = total_spent + NEW.total_amount,
        last_purchase = NEW.created_at,
        source = CASE
            WHEN source = 'ONLINE' AND NEW.order_number LIKE 'POS-%' THEN 'BOTH'
            WHEN source = 'POS'    AND NEW.order_number NOT LIKE 'POS-%' THEN 'BOTH'
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

-- ── Analytics views ───────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW public.customer_lifetime_value AS
SELECT
    id, email, phone, full_name, source,
    total_spent, total_orders,
    CASE WHEN total_orders = 0 THEN 0 ELSE total_spent / total_orders END AS avg_order_value,
    last_purchase, created_at,
    EXTRACT(DAY FROM NOW() - last_purchase) AS days_since_purchase
FROM public.customers
WHERE source IN ('POS','BOTH')
ORDER BY total_spent DESC;

CREATE OR REPLACE VIEW public.pos_customers AS
SELECT id, phone, full_name, total_spent, total_orders, last_purchase, created_at
FROM public.customers
WHERE source IN ('POS','BOTH')
ORDER BY last_purchase DESC;
