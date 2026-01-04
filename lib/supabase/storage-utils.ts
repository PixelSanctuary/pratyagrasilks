import { createClient } from './client';

/**
 * Upload a product image to Supabase Storage
 * @param file - The image file to upload (should be compressed)
 * @returns Public URL of the uploaded image
 */
export async function uploadProductImage(file: File): Promise<string> {
    const supabase = createClient();

    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const fileExt = file.name.split('.').pop();
    const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = `products/${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
        .from('saree-images')
        .upload(filePath, file, {
            cacheControl: '31536000', // 1 year cache
            upsert: false,
        });

    if (error) {
        console.error('Upload error:', error);
        throw new Error(`Failed to upload image: ${error.message}`);
    }

    // Get public URL
    const {
        data: { publicUrl },
    } = supabase.storage.from('saree-images').getPublicUrl(filePath);

    return publicUrl;
}

/**
 * Delete a product image from Supabase Storage
 * @param imageUrl - The public URL of the image to delete
 */
export async function deleteProductImage(imageUrl: string): Promise<void> {
    const supabase = createClient();

    // Extract file path from URL
    const urlParts = imageUrl.split('/');
    const bucketIndex = urlParts.indexOf('saree-images');
    if (bucketIndex === -1) {
        throw new Error('Invalid image URL');
    }

    const filePath = urlParts.slice(bucketIndex + 1).join('/');

    const { error } = await supabase.storage.from('saree-images').remove([filePath]);

    if (error) {
        console.error('Delete error:', error);
        throw new Error(`Failed to delete image: ${error.message}`);
    }
}

/**
 * Upload multiple product images
 * @param files - Array of image files to upload
 * @returns Array of public URLs
 */
export async function uploadMultipleProductImages(files: File[]): Promise<string[]> {
    const uploadPromises = files.map((file) => uploadProductImage(file));
    return Promise.all(uploadPromises);
}
