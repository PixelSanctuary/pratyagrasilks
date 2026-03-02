'use client';

import { useCart } from '@/lib/context/CartContext';
import { ShoppingBag } from 'lucide-react';

interface Props {
    shippingCost: number;
    estimatedDays: string;
}

export default function OrderSummary({ shippingCost, estimatedDays }: Props) {
    const { items } = useCart();

    const subtotal = items.reduce((sum, item) => sum + item.product.price, 0);
    const total = subtotal + shippingCost;

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm sticky top-24">
            <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                Order Summary
            </h2>

            {/* Items */}
            <div className="space-y-3 mb-5">
                {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                        {/* Thumbnail */}
                        {item.product.images?.[0] && (
                            <img
                                src={item.product.images[0]}
                                alt={item.product.name}
                                className="w-14 h-14 object-cover rounded-lg border border-gray-100 flex-shrink-0"
                            />
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {item.product.name}
                            </p>
                            {item.product.sku && (
                                <p className="text-xs text-gray-400">{item.product.sku}</p>
                            )}
                        </div>
                        <p className="text-sm font-semibold text-primary-dark flex-shrink-0">
                            ₹{item.product.price.toLocaleString('en-IN')}
                        </p>
                    </div>
                ))}
            </div>

            {/* Totals */}
            <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between text-sm text-gray-600">
                    <span>Shipping</span>
                    <span>
                        {shippingCost === 0
                            ? <span className="text-green-600 font-medium">To be calculated</span>
                            : `₹${shippingCost.toLocaleString('en-IN')}`}
                    </span>
                </div>

                {estimatedDays && (
                    <div className="flex justify-between text-xs text-gray-400">
                        <span>Estimated delivery</span>
                        <span>{estimatedDays}</span>
                    </div>
                )}

                <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-100">
                    <span>Total</span>
                    <span className="text-primary-dark">₹{total.toLocaleString('en-IN')}</span>
                </div>
            </div>

            {/* Trust badges */}
            <div className="mt-5 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 text-center">
                    🔒 Secure checkout · All sarees are authentic & handcrafted
                </p>
            </div>
        </div>
    );
}
