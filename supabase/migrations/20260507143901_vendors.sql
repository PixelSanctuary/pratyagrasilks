-- ── Vendors table ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.vendors (
    id             UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    name           TEXT        NOT NULL,
    address        TEXT,
    contact_person TEXT,
    phone          TEXT,
    document_urls  TEXT[]      NOT NULL DEFAULT '{}',
    metadata       JSONB       NOT NULL DEFAULT '{}',
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_vendors_name ON public.vendors(name);

CREATE TRIGGER vendors_updated_at
    BEFORE UPDATE ON public.vendors
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── Link products → vendors ───────────────────────────────────────────────────
ALTER TABLE public.products
    ADD COLUMN IF NOT EXISTS vendor_id UUID REFERENCES public.vendors(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_products_vendor_id ON public.products(vendor_id);

-- ── is_admin_role() for vendor RLS ────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.is_admin_role()
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
    RETURN EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN');
END;
$$;

-- ── Vendors RLS ───────────────────────────────────────────────────────────────
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "vendors_service_role_all" ON public.vendors FOR ALL TO service_role  USING (true) WITH CHECK (true);
CREATE POLICY "vendors_admin_all"        ON public.vendors FOR ALL TO authenticated USING (is_admin_role()) WITH CHECK (is_admin_role());

-- ── Storage policies for vendor-docs bucket ───────────────────────────────────
CREATE POLICY "vendor_docs_authenticated_upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'vendor-docs');
CREATE POLICY "vendor_docs_authenticated_select" ON storage.objects FOR SELECT TO authenticated USING  (bucket_id = 'vendor-docs');
CREATE POLICY "vendor_docs_authenticated_delete" ON storage.objects FOR DELETE TO authenticated USING  (bucket_id = 'vendor-docs');
CREATE POLICY "vendor_docs_service_role_all"     ON storage.objects FOR ALL    TO service_role  USING  (bucket_id = 'vendor-docs') WITH CHECK (bucket_id = 'vendor-docs');
