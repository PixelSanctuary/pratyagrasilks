-- ── Inventory tracking columns ───────────────────────────────────────────────
ALTER TABLE products ADD COLUMN IF NOT EXISTS low_stock_threshold INTEGER DEFAULT 5;
ALTER TABLE products ADD COLUMN IF NOT EXISTS track_inventory BOOLEAN DEFAULT true;

CREATE OR REPLACE FUNCTION update_product_stock_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.track_inventory THEN
        NEW.in_stock = (NEW.stock_quantity > 0);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_stock_status ON products;
CREATE TRIGGER trigger_update_stock_status
    BEFORE INSERT OR UPDATE OF stock_quantity ON products
    FOR EACH ROW EXECUTE FUNCTION update_product_stock_status();

-- ── Razorpay fields on orders ─────────────────────────────────────────────────
ALTER TABLE orders ADD COLUMN IF NOT EXISTS razorpay_order_id      TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS razorpay_payment_id    TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS razorpay_signature     TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_verified_at   TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_orders_razorpay_order_id   ON orders(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_orders_razorpay_payment_id ON orders(razorpay_payment_id);

-- ── Shipping zones ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS shipping_zones (
    id                       UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    name                     TEXT        NOT NULL,
    states                   TEXT[]      NOT NULL,
    base_charge              NUMERIC(10,2) NOT NULL DEFAULT 0,
    per_kg_charge            NUMERIC(10,2) DEFAULT 0,
    free_shipping_threshold  NUMERIC(10,2),
    estimated_days           TEXT,
    is_active                BOOLEAN     DEFAULT true,
    created_at               TIMESTAMPTZ DEFAULT NOW(),
    updated_at               TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO shipping_zones (name, states, base_charge, per_kg_charge, free_shipping_threshold, estimated_days) VALUES
    ('Zone 1 - Metro Cities',
     ARRAY['Delhi','Maharashtra','Karnataka','Tamil Nadu','West Bengal'],
     100.00, 20.00, 2000.00, '3-5 business days'),
    ('Zone 2 - Major Cities',
     ARRAY['Gujarat','Rajasthan','Uttar Pradesh','Madhya Pradesh','Telangana','Kerala','Punjab','Haryana'],
     150.00, 25.00, 2500.00, '5-7 business days'),
    ('Zone 3 - Other States',
     ARRAY['Andhra Pradesh','Assam','Bihar','Chhattisgarh','Goa','Himachal Pradesh','Jharkhand','Odisha','Uttarakhand'],
     200.00, 30.00, 3000.00, '7-10 business days'),
    ('Zone 4 - Remote Areas',
     ARRAY['Arunachal Pradesh','Manipur','Meghalaya','Mizoram','Nagaland','Sikkim','Tripura','Jammu and Kashmir','Ladakh'],
     300.00, 40.00, 5000.00, '10-14 business days')
ON CONFLICT DO NOTHING;

ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_zone_id         UUID REFERENCES shipping_zones(id);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_charge          NUMERIC(10,2) DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS subtotal                 NUMERIC(10,2);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS estimated_delivery_days TEXT;

CREATE INDEX IF NOT EXISTS idx_orders_shipping_zone ON orders(shipping_zone_id);

CREATE TRIGGER update_shipping_zones_updated_at
    BEFORE UPDATE ON shipping_zones
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── Google OAuth columns on customers ────────────────────────────────────────
ALTER TABLE customers ADD COLUMN IF NOT EXISTS auth_provider    TEXT DEFAULT 'email';
ALTER TABLE customers ADD COLUMN IF NOT EXISTS auth_provider_id TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS avatar_url       TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS email_verified   BOOLEAN DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_customers_auth_provider ON customers(auth_provider, auth_provider_id);

-- ── Inventory reservations ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS inventory_reservations (
    id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id  UUID        NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity    INTEGER     NOT NULL CHECK (quantity > 0),
    reserved_by UUID        REFERENCES customers(id) ON DELETE CASCADE,
    session_id  TEXT,
    expires_at  TIMESTAMPTZ NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reservations_product_id  ON inventory_reservations(product_id);
CREATE INDEX IF NOT EXISTS idx_reservations_expires_at  ON inventory_reservations(expires_at);
CREATE INDEX IF NOT EXISTS idx_reservations_reserved_by ON inventory_reservations(reserved_by);

CREATE OR REPLACE FUNCTION cleanup_expired_reservations()
RETURNS void AS $$
BEGIN
    DELETE FROM inventory_reservations WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- ── Stock deduction trigger ───────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION deduct_stock_on_order()
RETURNS TRIGGER AS $$
DECLARE item RECORD;
BEGIN
    IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND OLD.status != NEW.status AND NEW.status IN ('pending','processing')) THEN
        FOR item IN SELECT product_id, quantity FROM order_items WHERE order_id = NEW.id LOOP
            UPDATE products SET stock_quantity = stock_quantity - item.quantity
            WHERE id = item.product_id AND track_inventory = true;
        END LOOP;
    END IF;
    IF TG_OP = 'UPDATE' AND OLD.status != 'cancelled' AND NEW.status = 'cancelled' THEN
        FOR item IN SELECT product_id, quantity FROM order_items WHERE order_id = NEW.id LOOP
            UPDATE products SET stock_quantity = stock_quantity + item.quantity
            WHERE id = item.product_id AND track_inventory = true;
        END LOOP;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_manage_stock_on_order ON orders;
CREATE TRIGGER trigger_manage_stock_on_order
    AFTER INSERT OR UPDATE OF status ON orders
    FOR EACH ROW EXECUTE FUNCTION deduct_stock_on_order();

-- ── RLS ───────────────────────────────────────────────────────────────────────
ALTER TABLE shipping_zones          ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_reservations  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active shipping zones" ON shipping_zones
    FOR SELECT USING (is_active = true);
CREATE POLICY "Admin can manage shipping zones" ON shipping_zones
    FOR ALL TO authenticated USING (is_admin_role()) WITH CHECK (is_admin_role());
CREATE POLICY "Service role manages shipping zones" ON shipping_zones
    FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Users can view own reservations"   ON inventory_reservations FOR SELECT USING (auth.uid() = reserved_by);
CREATE POLICY "Users can create own reservations" ON inventory_reservations FOR INSERT WITH CHECK (auth.uid() = reserved_by);
CREATE POLICY "Users can delete own reservations" ON inventory_reservations FOR DELETE USING (auth.uid() = reserved_by);
