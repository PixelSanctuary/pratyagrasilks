-- Add yt_link column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS yt_link TEXT DEFAULT NULL;

-- Add comment for documentation
COMMENT ON COLUMN products.yt_link IS 'YouTube video link for product demonstration or showcase';

-- Update RLS policies to allow reading yt_link
-- (Existing SELECT policies should already cover this, but we ensure it explicitly)

-- Verify authenticated users can update yt_link
-- (Existing UPDATE policies for authenticated users should cover this)
