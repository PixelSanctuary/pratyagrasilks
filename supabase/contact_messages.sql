-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    read BOOLEAN DEFAULT FALSE,
    replied BOOLEAN DEFAULT FALSE,
    notes TEXT
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_read ON contact_messages(read);
CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON contact_messages(email);

-- Enable Row Level Security
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert contact messages
CREATE POLICY "Anyone can submit contact messages"
    ON contact_messages
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Create policy to allow admins to view all contact messages
CREATE POLICY "Admins can view all contact messages"
    ON contact_messages
    FOR SELECT
    TO authenticated
    USING (is_admin());

-- Create policy to allow admins to update contact messages (mark as read, add notes, etc.)
CREATE POLICY "Admins can update contact messages"
    ON contact_messages
    FOR UPDATE
    TO authenticated
    USING (is_admin());

-- Create policy to allow admins to delete contact messages
CREATE POLICY "Admins can delete contact messages"
    ON contact_messages
    FOR DELETE
    TO authenticated
    USING (is_admin());

-- Add comment to table
COMMENT ON TABLE contact_messages IS 'Stores contact form submissions from the website';
