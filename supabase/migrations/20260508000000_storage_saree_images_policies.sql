-- Public read access for product images (displayed on website)
CREATE POLICY "Allow public to read images"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'saree-images');

-- Authenticated users (admins/cashiers) can upload
CREATE POLICY "Allow authenticated users to upload images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'saree-images');

-- Authenticated users can update images
CREATE POLICY "Allow authenticated users to update images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'saree-images')
WITH CHECK (bucket_id = 'saree-images');

-- Authenticated users can delete images
CREATE POLICY "Allow authenticated users to delete images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'saree-images');
