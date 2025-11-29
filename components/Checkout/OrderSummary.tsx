'use client';

import { useCart } from '@/lib/context/CartContext';
import Image from 'next/image';

interface OrderSummaryProps {
    shippingCost?: number;
    estimatedDays?: string;
}

export default function OrderSummary({ shippingCost = 0, estimatedDays }: OrderSummaryProps) {
    const { items, totalPrice } = useCart();

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(price);
    };

    const grandTotal = totalPrice + shippingCost;

    return (
        <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>

            {/* Items */}
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {items.map((item) => {
                    const imageUrl = item.product.images?.[0] || '/placeholder-product.jpg';
                    return (
                        <div key={item.id} className="flex gap-3">
                            <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                                <Image
                                    src={imageUrl}
                                    alt={item.product.name}
                                    fill
                                    className="object-cover"
                                    sizes="64px"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-medium text-gray-900 truncate">
                                    {item.product.name}
                                </h3>
                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                <p className="text-sm font-semibold text-gray-900">
                                    {formatPrice(item.product.price * item.quantity)}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Pricing */}
            <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(totalPrice)}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>
                        {shippingCost > 0 ? (
                            formatPrice(shippingCost)
                        ) : (
                            <span className="text-sm text-amber-600">To be calculated</span>
                        )}
                    </span>
                </div>

                {estimatedDays && (
                    <div className="flex justify-between text-sm text-gray-500">
                        <span>Estimated Delivery</span>
                        <span>{estimatedDays}</span>
                    </div>
                )}

                <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between text-lg font-semibold">
                        <span className="text-gray-900">Total</span>
                        <span className="text-amber-700">{formatPrice(grandTotal)}</span>
                    </div>
                </div>
            </div>

            <p className="text-xs text-gray-500 mt-4 text-center">
                Taxes included where applicable
            </p>
        </div>
    );
}
