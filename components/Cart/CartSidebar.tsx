'use client';

import { useCart } from '@/lib/context/CartContext';
import CartItemComponent from './CartItem';
import Link from 'next/link';
import { X, ShoppingBag } from 'lucide-react';
import { useEffect } from 'react';

export default function CartSidebar() {
    const { items, itemCount, totalPrice, removeItem, isOpen, closeCart } = useCart();

    // Prevent body scroll when cart is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(price);
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
                onClick={closeCart}
            />

            {/* Sidebar */}
            <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Shopping Cart ({itemCount})
                    </h2>
                    <button
                        onClick={closeCart}
                        className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                        aria-label="Close cart"
                    >
                        <X className="w-5 h-5 text-textSecondary" />
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-4">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                            <p className="text-gray-500 mb-4">Add some products to get started!</p>
                            <button
                                onClick={closeCart}
                                className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-light transition-colors"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {items.map((item) => (
                                <CartItemComponent
                                    key={item.id}
                                    item={item}
                                    onRemove={removeItem}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="border-t p-4 space-y-4">
                        {/* Subtotal */}
                        <div className="flex items-center justify-between text-lg font-semibold">
                            <span className="text-gray-900">Subtotal:</span>
                            <span className="text-accent-700">{formatPrice(totalPrice)}</span>
                        </div>

                        {/* Buttons */}
                        <div className="space-y-2">
                            <Link
                                href="/checkout"
                                onClick={closeCart}
                                className="block w-full bg-primary text-white text-center py-3 rounded-lg font-semibold hover:bg-primary-light transition-colors"
                            >
                                Proceed to Checkout
                            </Link>

                            <Link
                                href="/cart"
                                onClick={closeCart}
                                className="block w-full border-2 border-gray-300  text-center py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                            >
                                View Full Cart
                            </Link>
                        </div>

                        <p className="text-xs text-gray-500 text-center">
                            Shipping and taxes calculated at checkout
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}
