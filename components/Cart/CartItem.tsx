'use client';

import { CartItem } from '@/lib/context/CartContext';
import Image from 'next/image';
import { Trash2 } from 'lucide-react';

interface CartItemComponentProps {
    item: CartItem;
    onRemove: (productId: string) => void;
}

export default function CartItemComponent({
    item,
    onRemove,
}: CartItemComponentProps) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(price);
    };

    const imageUrl = item.product.images && item.product.images.length > 0
        ? item.product.images[0]
        : '/placeholder-product.jpg';

    return (
        <div className="flex gap-4 py-4 border-b">
            {/* Product Image */}
            <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                <Image
                    src={imageUrl}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                />
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                    {item.product.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                    {formatPrice(item.product.price)}
                </p>
            </div>

            {/* Price & Remove */}
            <div className="flex flex-col items-end justify-between">
                <button
                    onClick={() => onRemove(item.product.id)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                    aria-label="Remove item"
                >
                    <Trash2 className="w-4 h-4" />
                </button>

                <p className="text-sm font-semibold text-gray-900">
                    {formatPrice(item.product.price)}
                </p>
            </div>
        </div>
    );
}
