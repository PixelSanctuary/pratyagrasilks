import { Product } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
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

    return (
        <Link href={`/product/${product.id}`} className="group">
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden bg-gray-100">
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
                </div>

                {/* Product Info */}
                <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-amber-700 transition-colors">
                        {product.name}
                    </h3>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {product.description}
                    </p>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-2xl font-bold text-amber-700">
                                {formatPrice(product.price)}
                            </p>
                            {product.material && (
                                <p className="text-xs text-gray-500 mt-1">
                                    {product.material}
                                </p>
                            )}
                        </div>

                        {product.inStock && (
                            <div className="px-4 py-2 bg-amber-600 text-white rounded-md text-sm font-medium group-hover:bg-amber-700 transition-colors min-w-fit">
                                View Details
                            </div>
                        )}
                    </div>

                    {/* Category Badge */}
                    <div className="mt-3">
                        <span className="inline-block px-3 py-1 bg-gray-100  text-xs font-medium rounded-full capitalize">
                            {product.category?.replace(/-/g, ' ')}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
