-- Run this in the Supabase SQL Editor to grant CASHIER role the necessary
-- read/write permissions on vendors and products tables.

-- ── 1. Vendors: CASHIER read-only ───────────────────────────────────────────
CREATE POLICY "vendors_cashier_select"
    ON public.vendors
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'CASHIER'
        )
    );

-- ── 2. Products: CASHIER can read ALL products (including is_online=false) ──
CREATE POLICY "products_cashier_select"
    ON public.products
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'CASHIER'
        )
    );

-- ── 3. Products: CASHIER can INSERT new products ─────────────────────────────
CREATE POLICY "products_cashier_insert"
    ON public.products
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'CASHIER'
        )
    );

-- ── 4. Products: CASHIER can UPDATE products ─────────────────────────────────
--    Price stripping is enforced in the updateProduct server action.
--    No DELETE policy — RLS default-deny + assertAdminOnly() in server action.
CREATE POLICY "products_cashier_update"
    ON public.products
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'CASHIER'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'CASHIER'
        )
    );
