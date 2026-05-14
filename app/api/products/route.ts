import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { SLUG_ALIASES, transformProduct } from '@/lib/utils/product-queries';

export const dynamic = 'force-dynamic';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applyFilters(q: any, { category, colorFamily, minPrice, maxPrice, search }: {
    category: string | null;
    colorFamily: string | null;
    minPrice: string | null;
    maxPrice: string | null;
    search: string | null;
}) {
    if (category) {
        const legacy = SLUG_ALIASES[category];
        q = legacy ? q.in('category', [category, legacy]) : q.eq('category', category);
    }
    if (colorFamily) q = q.contains('color_families', [colorFamily]);
    if (minPrice) q = q.gte('price', parseFloat(minPrice));
    if (maxPrice) q = q.lte('price', parseFloat(maxPrice));
    if (search)   q = q.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    return q;
}

export async function GET(request: NextRequest) {
    try {
        const supabase = createClient();
        const { searchParams } = new URL(request.url);

        const category = searchParams.get('category');
        const colorFamily = searchParams.get('color');
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const search = searchParams.get('search');
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');

        const filters = { category, colorFamily, minPrice, maxPrice, search };

        const [{ data: available, error: availError }, { data: sold, error: soldError }] =
            await Promise.all([
                applyFilters(
                    supabase.from('products').select('*')
                        .eq('is_online', true).eq('in_stock', true)
                        .order('created_at', { ascending: false })
                        .range(offset, offset + limit - 1),
                    filters
                ),
                applyFilters(
                    supabase.from('products').select('*')
                        .eq('is_online', true).eq('in_stock', false)
                        .order('updated_at', { ascending: false })
                        .limit(9),
                    filters
                ),
            ]);

        if (availError || soldError) {
            const err = availError || soldError;
            console.error('Supabase error:', err);
            return NextResponse.json(
                { error: 'Failed to fetch products', details: err!.message },
                { status: 500 }
            );
        }

        const products = [...(available ?? []), ...(sold ?? [])].map(transformProduct);

        return NextResponse.json({ products, count: products.length, offset, limit });
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
