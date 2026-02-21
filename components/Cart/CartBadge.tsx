'use client';

import { useCart } from '@/lib/context/CartContext';
import { ShoppingCart } from 'lucide-react';

export default function CartBadge() {
    const { itemCount, openCart } = useCart();

    return (
        <button
            onClick={openCart}
            className="relative p-2 hover:bg-gray-100 rounded-md transition-colors"
            aria-label={`Shopping cart with ${itemCount} items`}
        >
            <ShoppingCart className="w-6 h-6 " />
            {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount > 9 ? '9+' : itemCount}
                </span>
            )}
        </button>
    );
}
