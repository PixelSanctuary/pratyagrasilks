import { createClient } from '@/lib/supabase/server';
import { Product } from '@/lib/types';

/**
 * Fetches the 8 most recently added products ordered by created_at DESC
 */
export async function getNewArrivals(): Promise<Product[]> {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(8);

    if (error) {
        console.error('Error fetching new arrivals:', error);
        return [];
    }

    if (!data) return [];

    // Transform snake_case to camelCase matching Product type
    return data.map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        images: product.images || [],
        inStock: product.in_stock,
        sku: product.sku,
        material: product.material,
        dimensions: product.dimensions,
        weight: product.weight,
        yt_link: product.yt_link,
        createdAt: product.created_at,
        updatedAt: product.updated_at,
    }));
}
