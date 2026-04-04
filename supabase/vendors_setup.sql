-- ============================================================================
-- Pratyagra Silks — Phase 1: Vendor Database & Storage Setup
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================================

-- ── STEP 1: Create vendors table ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.vendors (
    id              UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            TEXT        NOT NULL,
    address         TEXT,
    contact_person  TEXT,
    phone           TEXT,
    -- Paths/URLs to files uploaded in the 'vendor-docs' storage bucket (max 5)
    document_urls   TEXT[]      NOT NULL DEFAULT '{}',
    -- Flexible field: store type (Artisan/City/Wholesaler), GST number, notes, etc.
    metadata        JSONB       NOT NULL DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vendors_name ON public.vendors(name);

-- Reuse the set_updated_at() function already created in rbac_setup.sql
CREATE TRIGGER vendors_updated_at
    BEFORE UPDATE ON public.vendors
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ── STEP 2: Link products → vendors ──────────────────────────────────────────
-- Nullable so existing products are not broken; populate vendor_id over time.

ALTER TABLE public.products
    ADD COLUMN IF NOT EXISTS vendor_id UUID
        REFERENCES public.vendors(id)
        ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_products_vendor_id ON public.products(vendor_id);


-- ── STEP 3: Admin helper (checks public.profiles role) ───────────────────────
-- SECURITY DEFINER + fixed search_path avoids RLS recursion.

CREATE OR REPLACE FUNCTION public.is_admin_role()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id    = auth.uid()
          AND role  = 'ADMIN'
    );
END;
$$;


-- ── STEP 4: RLS on vendors ────────────────────────────────────────────────────
-- Vendors are internal data: no public read. Only ADMINs and service_role.

ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;

-- Server-side API routes (service_role key) bypass RLS
CREATE POLICY "vendors_service_role_all"
    ON public.vendors
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Authenticated ADMINs have full CRUD
CREATE POLICY "vendors_admin_all"
    ON public.vendors
    FOR ALL
    TO authenticated
    USING  (is_admin_role())
    WITH CHECK (is_admin_role());


-- ── STEP 5: Storage bucket 'vendor-docs' ─────────────────────────────────────
-- Bucket creation must be done in the Supabase Dashboard:
--   Storage → New bucket → Name: "vendor-docs" → Private (uncheck "Public bucket")
--
-- After creating the bucket, run the storage policies below.

-- Allow authenticated users to upload into vendor-docs
CREATE POLICY "vendor_docs_authenticated_upload"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'vendor-docs');

-- Allow authenticated users to read their uploads (needed for signed URLs)
CREATE POLICY "vendor_docs_authenticated_select"
    ON storage.objects
    FOR SELECT
    TO authenticated
    USING (bucket_id = 'vendor-docs');

-- Allow authenticated users to delete their own uploads
CREATE POLICY "vendor_docs_authenticated_delete"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (bucket_id = 'vendor-docs');

-- Service role has full access (server-side operations)
CREATE POLICY "vendor_docs_service_role_all"
    ON storage.objects
    FOR ALL
    TO service_role
    USING (bucket_id = 'vendor-docs')
    WITH CHECK (bucket_id = 'vendor-docs');


-- ── STEP 6: Verification queries ─────────────────────────────────────────────
/*
-- Confirm vendors table exists
SELECT column_name, data_type FROM information_schema.columns
WHERE table_name = 'vendors' ORDER BY ordinal_position;

-- Confirm vendor_id column added to products
SELECT column_name, data_type FROM information_schema.columns
WHERE table_name = 'products' AND column_name = 'vendor_id';

-- Confirm RLS policies
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'vendors';
*/
