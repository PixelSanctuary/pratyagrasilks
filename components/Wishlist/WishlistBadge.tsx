'use client';

import { useWishlist } from '@/lib/context/WishlistContext';
import { Heart } from 'lucide-react';
import Link from 'next/link';

export default function WishlistBadge() {
    const { itemCount } = useWishlist();

    return (
        <Link href="/wishlist" className="relative group">
            <div className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Heart className="w-6 h-6 text-gray-700 group-hover:text-primary transition-colors" />
                {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {itemCount > 9 ? '9+' : itemCount}
                    </span>
                )}
            </div>
        </Link>
    );
}
