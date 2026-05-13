'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import FilterSidebar, { FilterState } from '@/components/FilterSidebar';
import SkeletonCard from '@/components/ui/SkeletonCard';
import { Product } from '@/lib/types';
import { silkCategories } from '@/lib/seo-config';

const QUICK_CHIPS = [
    { label: 'All Weaves', value: '' },
    { label: 'Silks', value: 'silks' },
    { label: 'Cottons', value: 'cottons' },
    ...silkCategories.map((c) => ({ label: c.name, value: c.slug })),
];

const PAGE_SIZE = 50;

function CollectionContent() {
    const searchParams = useSearchParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [offset, setOffset] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<FilterState>({
        category: searchParams.get('category') || '',
        minPrice: 0,
        maxPrice: 0,
        search: '',
    });

    const buildParams = useCallback(
        (currentOffset: number) => {
            const params = new URLSearchParams();
            if (filters.category && filters.category !== 'silks' && filters.category !== 'cottons') {
                params.append('category', filters.category);
            }
            if (filters.minPrice > 0) params.append('minPrice', filters.minPrice.toString());
            if (filters.maxPrice > 0) params.append('maxPrice', filters.maxPrice.toString());
            if (filters.search) params.append('search', filters.search);
            if (currentOffset > 0) params.append('offset', currentOffset.toString());
            params.append('limit', PAGE_SIZE.toString());
            return params.toString();
        },
        [filters]
    );

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        setOffset(0);
        try {
            const response = await fetch(`/api/products?${buildParams(0)}`);
            if (!response.ok) throw new Error('Failed to fetch products');
            const data = await response.json();
            const list: Product[] = data.products || [];

            // Client-side filter for broad group chips
            const filtered = filterByGroup(list, filters.category);
            setProducts(filtered);
            setHasMore(list.length >= PAGE_SIZE);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, [buildParams, filters.category]);

    const loadMore = async () => {
        const nextOffset = offset + PAGE_SIZE;
        setLoadingMore(true);
        try {
            const response = await fetch(`/api/products?${buildParams(nextOffset)}`);
            if (!response.ok) throw new Error('Failed to load more');
            const data = await response.json();
            const list: Product[] = data.products || [];
            const filtered = filterByGroup(list, filters.category);
            setProducts((prev) => [...prev, ...filtered]);
            setOffset(nextOffset);
            setHasMore(list.length >= PAGE_SIZE);
        } catch {
            // silently fail — existing products remain
        } finally {
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [filters]);

    const handleFilterChange = (newFilters: FilterState) => setFilters(newFilters);

    const handleChipClick = (value: string) => {
        setFilters((prev) => ({ ...prev, category: value }));
    };

    return (
        <div className="min-h-screen">
            {/* Page header */}
            <div className="relative text-white py-12" style={{ background: 'linear-gradient(135deg, #5F1300 0%, #7A2B1A 100%)' }}>
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: "url('/images/sarees/backgrounds/collection_bg.webp')", opacity: 0.12 }}
                />
                <div className="container mx-auto px-4 relative z-10">
                    <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-2">
                        Handloom Saree Collection
                    </h1>
                    <p className="text-white/80">Silks and cottons — handpicked from weavers across India</p>
                </div>
            </div>

            {/* Sticky category chip bar — mobile only */}
            <div className="lg:hidden sticky top-16 z-30 bg-white border-b border-gray-100 shadow-sm">
                <div className="flex gap-2 px-4 py-3 overflow-x-auto hide-scrollbar">
                    {QUICK_CHIPS.map((chip) => {
                        const isActive = filters.category === chip.value;
                        return (
                            <button
                                key={chip.value}
                                onClick={() => handleChipClick(chip.value)}
                                className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150"
                                style={{
                                    backgroundColor: isActive ? '#E8AB16' : 'white',
                                    borderColor: isActive ? '#E8AB16' : 'rgba(95,19,0,0.3)',
                                    color: isActive ? '#1A0A00' : '#5F1300',
                                }}
                            >
                                {chip.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Main content */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar — desktop only */}
                    <aside className="hidden lg:block lg:col-span-1">
                        <FilterSidebar onFilterChange={handleFilterChange} currentFilters={filters} />
                    </aside>

                    {/* Product Grid */}
                    <main className="lg:col-span-3">
                        {/* Results count */}
                        <div className="mb-6">
                            <p className="text-sm" style={{ color: '#8C5A3C' }}>
                                {loading ? 'Loading weaves…' : `${products.length} weave${products.length !== 1 ? 's' : ''} found`}
                            </p>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                                <p className="text-red-800 font-medium mb-2">Error loading products</p>
                                <p className="text-red-600 text-sm">{error}</p>
                                <button onClick={fetchProducts} className="mt-4 px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
                                    Try Again
                                </button>
                            </div>
                        )}

                        {/* Skeleton loading */}
                        {loading && !error && (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
                            </div>
                        )}

                        {/* Products */}
                        {!loading && !error && products.length > 0 && (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {products.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>

                                {/* Load More */}
                                {hasMore && (
                                    <div className="mt-10 text-center">
                                        <button
                                            onClick={loadMore}
                                            disabled={loadingMore}
                                            className="px-8 py-3 rounded-full font-semibold text-white transition-all duration-200 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
                                            style={{ backgroundColor: '#5F1300' }}
                                        >
                                            {loadingMore ? 'Loading more…' : 'Load More Weaves'}
                                        </button>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Empty state */}
                        {!loading && !error && products.length === 0 && (
                            <div className="bg-white rounded-lg shadow-md p-12 text-center">
                                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: 'rgba(95,19,0,0.06)' }}>
                                    <svg className="w-8 h-8" style={{ color: '#8C5A3C' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold mb-2" style={{ color: '#1A0A00' }}>
                                    We&apos;re adding more weaves soon
                                </h3>
                                <p className="text-sm mb-6" style={{ color: '#8C5A3C' }}>
                                    Check back shortly — or browse our full collection.
                                </p>
                                <button
                                    onClick={() => setFilters({ category: '', minPrice: 0, maxPrice: 0, search: '' })}
                                    className="px-6 py-2.5 rounded-full font-medium text-white transition-colors"
                                    style={{ backgroundColor: '#5F1300' }}
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}

/** Client-side broad group filter for "Silks" / "Cottons" chips */
function filterByGroup(products: Product[], category: string): Product[] {
    if (!category || category === 'silks' || category === 'cottons') {
        if (category === 'silks') {
            return products.filter((p) => !p.category?.includes('cotton'));
        }
        if (category === 'cottons') {
            return products.filter((p) => p.category?.includes('cotton'));
        }
        return products;
    }
    return products;
}

export default function CollectionPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <CollectionContent />
        </Suspense>
    );
}
