-- ============================================================
-- Pratyagra Silks — Role System Update
-- Adds CUSTOMER (new default) + VENDOR (future) roles.
-- Creates user_roles lookup table for easy SELECT in dropdowns.
-- Run in Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- ── STEP 1: Lookup / reference table ─────────────────────────────────────────
--   One row per valid role. Query this table to populate role dropdowns.
--   is_admin_level = true  → role can enter the /admin area
--   is_admin_level = false → role is redirected to the storefront

CREATE TABLE IF NOT EXISTS public.user_roles (
    role            TEXT        PRIMARY KEY,
    label           TEXT        NOT NULL,
    description     TEXT,
    is_admin_level  BOOLEAN     NOT NULL DEFAULT false,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS — public read so client-side dropdowns can SELECT without auth
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_roles_public_read"
    ON public.user_roles
    FOR SELECT
    USING (true);

-- Seed all roles (idempotent via ON CONFLICT DO UPDATE)
INSERT INTO public.user_roles (role, label, description, is_admin_level)
VALUES
    ('ADMIN',    'Administrator', 'Full access to all admin features',                  true),
    ('CASHIER',  'Cashier',       'POS billing and end-of-day settlement access only',  true),
    ('CUSTOMER', 'Customer',      'Default role for all registered storefront users',   false),
    ('VENDOR',   'Vendor',        'Future: vendor portal and product listing access',   false)
ON CONFLICT (role) DO UPDATE
    SET label          = EXCLUDED.label,
        description    = EXCLUDED.description,
        is_admin_level = EXCLUDED.is_admin_level;


-- ── STEP 2: Update profiles.role column ──────────────────────────────────────

-- 2a. Drop the old inline CHECK constraint created in rbac_setup.sql
--     Postgres auto-named it "profiles_role_check"
ALTER TABLE public.profiles
    DROP CONSTRAINT IF EXISTS profiles_role_check;

-- 2b. Add FK to user_roles for referential integrity
--     ON UPDATE CASCADE: if a role key is renamed, profiles follows automatically
ALTER TABLE public.profiles
    ADD CONSTRAINT profiles_role_fkey
    FOREIGN KEY (role)
    REFERENCES public.user_roles(role)
    ON UPDATE CASCADE
    ON DELETE RESTRICT;

-- 2c. Change column default from CASHIER → CUSTOMER
ALTER TABLE public.profiles
    ALTER COLUMN role SET DEFAULT 'CUSTOMER';

-- 2d. Back-fill: any existing non-admin/non-cashier rows → CUSTOMER
--     (handles all the "CASHIER" rows that were created by the old trigger
--      for regular sign-ups before this migration)
UPDATE public.profiles
SET    role = 'CUSTOMER'
WHERE  role NOT IN ('ADMIN', 'CASHIER');


-- ── STEP 3: Update the new-user trigger to default CUSTOMER ──────────────────

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    INSERT INTO public.profiles (id, role)
    VALUES (NEW.id, 'CUSTOMER')
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$;

-- (The trigger on_auth_user_created already exists; no need to recreate it)


-- ── STEP 4: Verification queries (run these after the script) ─────────────────
/*
-- Should return 4 rows: ADMIN, CASHIER, CUSTOMER, VENDOR
SELECT * FROM public.user_roles ORDER BY is_admin_level DESC, role;

-- Should show CUSTOMER as the dominant role after back-fill
SELECT role, COUNT(*) AS total FROM public.profiles GROUP BY role ORDER BY total DESC;

-- To promote a user to ADMIN (replace with real UUID):
-- UPDATE public.profiles SET role = 'ADMIN' WHERE id = '<your-user-uuid>';

-- To create a cashier account (replace with real UUID):
-- UPDATE public.profiles SET role = 'CASHIER' WHERE id = '<cashier-user-uuid>';
*/
