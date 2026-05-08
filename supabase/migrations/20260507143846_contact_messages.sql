-- ── is_admin() helper ─────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN'
    );
END;
$$;

-- ── Contact messages ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_messages (
    id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name       TEXT        NOT NULL,
    email      TEXT        NOT NULL,
    subject    TEXT        NOT NULL,
    message    TEXT        NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    read       BOOLEAN     DEFAULT FALSE,
    replied    BOOLEAN     DEFAULT FALSE,
    notes      TEXT
);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_read       ON contact_messages(read);
CREATE INDEX IF NOT EXISTS idx_contact_messages_email      ON contact_messages(email);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact messages"   ON contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can view all contact messages" ON contact_messages FOR SELECT TO authenticated USING (is_admin());
CREATE POLICY "Admins can update contact messages"   ON contact_messages FOR UPDATE TO authenticated USING (is_admin());
CREATE POLICY "Admins can delete contact messages"   ON contact_messages FOR DELETE TO authenticated USING (is_admin());

COMMENT ON TABLE contact_messages IS 'Stores contact form submissions from the website';
