-- Storage policies for saree-images bucket
-- This allows authenticated users (admins) to upload, update, and delete images

-- Enable RLS on storage.objects if not already enabled
-- (This is usually enabled by default in Supabase)

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow authenticated users to upload images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public to read images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete images" ON storage.objects;

-- Policy 1: Allow authenticated users to upload images to saree-images bucket
CREATE POLICY "Allow authenticated users to upload images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'saree-images');

-- Policy 2: Allow public read access to images (for displaying on website)
CREATE POLICY "Allow public to read images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'saree-images');

-- Policy 3: Allow authenticated users to update images
CREATE POLICY "Allow authenticated users to update images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'saree-images')
WITH CHECK (bucket_id = 'saree-images');

-- Policy 4: Allow authenticated users to delete images
CREATE POLICY "Allow authenticated users to delete images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'saree-images');

-- Verify the bucket exists and is public
-- If the bucket doesn't exist, create it:
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('saree-images', 'saree-images', true)
-- ON CONFLICT (id) DO UPDATE SET public = true;
