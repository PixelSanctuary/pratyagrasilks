-- ── Profiles table ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
    id         UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role       TEXT        NOT NULL DEFAULT 'CASHIER' CHECK (role IN ('ADMIN','CASHIER')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own"       ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_service_role_all" ON public.profiles FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ── set_updated_at helper (reused by vendors trigger) ────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

CREATE TRIGGER profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── handle_new_user: creates profile + customer on sign-up ───────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    INSERT INTO public.profiles (id, role)
    VALUES (NEW.id, 'CASHIER')
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.customers (id, email, full_name, phone)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'phone', '')
    )
    ON CONFLICT (id) DO NOTHING;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Back-fill profiles for any existing auth.users
INSERT INTO public.profiles (id, role)
SELECT id, 'CASHIER' FROM auth.users
ON CONFLICT (id) DO NOTHING;
