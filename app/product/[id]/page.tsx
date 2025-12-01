'use client';

import { Product } from '@/lib/types';
import Link from 'next/link';
import ImageGallery from '@/components/Product/ImageGallery';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/lib/context/CartContext';
import { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus } from 'lucide-react';

interface ProductDetailPageProps {
    params: { id: string };
}

async function getProduct(id: string) {
    const res = await fetch(`/api/products/${id}`, {
        cache: 'no-store',
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.product;
}

async function getRelatedProducts(id: string) {
    const res = await fetch(`/api/products/${id}/related`, {
        cache: 'no-store',
    });

    if (!res.ok) return [];
    const data = await res.json();
    return data.products;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
    const { addItem } = useCart();
    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        async function loadData() {
            const [productData, relatedData] = await Promise.all([
                getProduct(params.id),
                getRelatedProducts(params.id),
            ]);
            setProduct(productData);
            setRelatedProducts(relatedData);
            setLoading(false);
        }
        loadData();
    }, [params.id]);

    const handleAddToCart = () => {
        if (product) {
            addItem(product, quantity);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(price);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
                    <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
                    <Link href="/collection" className="text-amber-600 hover:text-amber-700 font-medium">
                        ← Back to Collection
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Breadcrumb */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-4">
                    <nav className="flex items-center space-x-2 text-sm">
                        <Link href="/" className="text-gray-500 hover:text-amber-600">
                            Home
                        </Link>
                        <span className="text-gray-400">/</span>
                        <Link href="/collection" className="text-gray-500 hover:text-amber-600">
                            Collection
                        </Link>
                        <span className="text-gray-400">/</span>
                        <Link href={`/collection?category=${product.category}`} className="text-gray-500 hover:text-amber-600 capitalize">
                            {product.category}
                        </Link>
                        <span className="text-gray-400">/</span>
                        <span className="text-gray-900 font-medium truncate max-w-xs">
                            {product.name}
                        </span>
                    </nav>
                </div>
            </div>

            {/* Product Details */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Image Gallery */}
                    <div>
                        <ImageGallery images={product.images} productName={product.name} />
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                                {product.name}
                            </h1>
                            <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                        </div>

                        {/* Price */}
                        <div className="border-t border-b py-4">
                            <p className="text-4xl font-bold text-amber-700">
                                {formatPrice(product.price)}
                            </p>
                        </div>

                        {/* Stock Status */}
                        <div>
                            {product.inStock ? (
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <span className="text-green-700 font-medium">
                                        In Stock
                                        {product.trackInventory && product.stockQuantity && (
                                            <span className="text-gray-600 ml-2">
                                                ({product.stockQuantity} available)
                                            </span>
                                        )}
                                    </span>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                    <span className="text-red-700 font-medium">Out of Stock</span>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
                            <p className=" leading-relaxed">{product.description}</p>
                        </div>

                        {/* Material & Details */}
                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                            <h3 className="font-semibold text-gray-900">Product Details</h3>

                            {product.material && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Material:</span>
                                    <span className="font-medium text-gray-900">{product.material}</span>
                                </div>
                            )}

                            {product.dimensions && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Dimensions:</span>
                                    <span className="font-medium text-gray-900">
                                        {product.dimensions.length} x {product.dimensions.width} cm
                                    </span>
                                </div>
                            )}

                            {product.weight && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Weight:</span>
                                    <span className="font-medium text-gray-900">{product.weight} kg</span>
                                </div>
                            )}

                            <div className="flex justify-between">
                                <span className="text-gray-600">Category:</span>
                                <span className="font-medium text-gray-900 capitalize">{product.category}</span>
                            </div>
                        </div>

                        {/* Quantity Selector */}
                        {product.inStock && (
                            <div>
                                <label className="block text-sm font-medium  mb-2">
                                    Quantity
                                </label>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                                        aria-label="Decrease quantity"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>

                                    <span className="w-16 text-center text-lg font-medium">
                                        {quantity}
                                    </span>

                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                                        aria-label="Increase quantity"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Add to Cart Buttons */}
                        <div className="space-y-3">
                            <button
                                onClick={handleAddToCart}
                                disabled={!product.inStock}
                                className="w-full bg-amber-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-amber-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                            </button>

                            <button className="w-full border-2 border-amber-600 text-amber-600 py-4 rounded-lg font-semibold text-lg hover:bg-amber-50 transition-colors">
                                Add to Wishlist
                            </button>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((relatedProduct: Product) => (
                                <ProductCard key={relatedProduct.id} product={relatedProduct} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
