import { Product } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import WishlistButton from '@/components/Wishlist/WishlistButton';

interface ProductCardProps {
    product: Product;
    showNewBadge?: boolean;
}

export default function ProductCard({ product, showNewBadge = false }: ProductCardProps) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(price);
    };

    const imageUrl = product.images && product.images.length > 0
        ? product.images[0]
        : '/placeholder-product.jpg';

    // Show "New In" badge if created within last 14 days
    const isNewArrival = (() => {
        if (!product.createdAt) return false;
        const fourteenDaysAgo = new Date();
        fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
        return new Date(product.createdAt) > fourteenDaysAgo;
    })();

    const displayNewBadge = showNewBadge || isNewArrival;

    return (
        <Link href={`/product/${product.id}`} className="group">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden bg-primary-50 silk-shimmer">
                    <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {!product.inStock && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <span className="text-white font-semibold text-lg">Out of Stock</span>
                        </div>
                    )}
                    {/* Category Badge */}
                    <div className="absolute top-2 left-2">
                        <span className="inline-block px-3 py-1 border border-slate text-slate bg-black/50 text-xs font-medium rounded-lg capitalize">
                            {product.category?.replace(/-/g, ' ')}
                        </span>
                    </div>
                    {/* New In Badge */}
                    {displayNewBadge && (
                        <div className="absolute bottom-2 left-2 mt-8">
                            <span className="inline-block px-3 py-1 border border-primary bg-primary/50 text-white text-xs font-semibold rounded-lg tracking-wide shadow-md">
                                ✦ New Arrival
                            </span>
                        </div>
                    )}
                    {/* Wishlist Button */}
                    <div className="absolute top-2 right-2 z-10">
                        <WishlistButton product={product} variant="icon-only" />
                    </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-primary-light transition-colors min-h-[56px]">
                        {product.name}
                    </h3>

                    <p className="text-sm text-textSecondary mb-3 line-clamp-2">
                        {product.description}
                    </p>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-2xl font-bold text-accent-700">
                                {formatPrice(product.price)}
                            </p>
                            {/* {product.material && (
                                <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                                    {product.material}
                                </p>
                            )} */}
                        </div>

                        {product.inStock && (
                            <div className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium group-hover:bg-primary-light transition-colors min-w-fit">
                                View Details
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}
