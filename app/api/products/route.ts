import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
    try {
        const supabase = createClient();
        const { searchParams } = new URL(request.url);

        // Extract query parameters
        const category = searchParams.get('category');
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const search = searchParams.get('search');
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');

        // Build query
        let query = supabase
            .from('products')
            .select('*')
            .eq('in_stock', true)
            .range(offset, offset + limit - 1);

        // Apply filters
        if (category) {
            query = query.eq('category', category);
        }

        if (minPrice) {
            query = query.gte('price', parseFloat(minPrice));
        }

        if (maxPrice) {
            query = query.lte('price', parseFloat(maxPrice));
        }

        if (search) {
            query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
        }

        // Execute query
        const { data: products, error } = await query.order('created_at', { ascending: false });

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json(
                { error: 'Failed to fetch products', details: error.message },
                { status: 500 }
            );
        }

        // Transform snake_case to camelCase for frontend
        const transformedProducts = products?.map(product => ({
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
            createdAt: product.created_at,
            updatedAt: product.updated_at,
        })) || [];

        return NextResponse.json({
            products: transformedProducts,
            count: transformedProducts.length,
            offset,
            limit,
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
