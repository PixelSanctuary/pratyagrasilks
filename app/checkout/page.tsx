'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/context/CartContext';
import ShippingForm from '@/components/Checkout/ShippingForm';
import OrderSummary from '@/components/Checkout/OrderSummary';
import { ShippingAddress } from '@/lib/validations/checkout';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

interface ShippingZone {
    id: string;
    name: string;
    base_charge: number;
    estimated_days: string;
}

export default function CheckoutPage() {
    const router = useRouter();
    const { items, clearCart } = useCart();
    const [shippingCost, setShippingCost] = useState(0);
    const [estimatedDays, setEstimatedDays] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    // Redirect if cart is empty
    if (items.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
                    <p className="text-textSecondary mb-4">Add some items before checking out.</p>
                    <Link
                        href="/collection"
                        className="inline-block px-6 py-3 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition-colors"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    const handleShippingSubmit = async (shippingData: ShippingAddress) => {
        setIsProcessing(true);

        try {
            // Calculate shipping based on state
            const shippingResponse = await fetch(`/api/shipping/calculate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ state: shippingData.state }),
            });

            if (!shippingResponse.ok) {
                throw new Error('Failed to calculate shipping');
            }

            const shippingInfo: ShippingZone = await shippingResponse.json();
            setShippingCost(shippingInfo.base_charge);
            setEstimatedDays(shippingInfo.estimated_days);

            // Create order
            const orderResponse = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    shippingAddress: {
                        fullName: shippingData.fullName,
                        email: shippingData.email,
                        phone: shippingData.phone,
                        addressLine1: shippingData.addressLine1,
                        addressLine2: shippingData.addressLine2,
                        city: shippingData.city,
                        state: shippingData.state,
                        pincode: shippingData.pincode,
                    },
                    items: items.map((item) => ({
                        productId: item.product.id,
                        name: item.product.name,
                        sku: item.product.sku,
                        price: item.product.price,
                    })),
                    shippingCost: shippingInfo.base_charge,
                    shippingZoneId: shippingInfo.id,
                    estimatedDeliveryDays: shippingInfo.estimated_days,
                }),
            });

            if (!orderResponse.ok) {
                const error = await orderResponse.json();
                throw new Error(error.error || 'Failed to create order');
            }

            const { orderId } = await orderResponse.json();

            // Clear cart
            clearCart();

            // Redirect to confirmation
            router.push(`/orders/${orderId}/confirmation`);
        } catch (error) {
            console.error('Checkout error:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to process order. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
                            <p className="text-textSecondary mt-1">Complete your order</p>
                        </div>
                        <Link
                            href="/cart"
                            className="flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back to Cart
                        </Link>
                    </div>
                </div>
            </div>

            {/* Checkout Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Shipping Form */}
                    <div className="lg:col-span-2">
                        <ShippingForm onSubmit={handleShippingSubmit} />
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <OrderSummary shippingCost={shippingCost} estimatedDays={estimatedDays} />
                    </div>
                </div>
            </div>

            {/* Processing Overlay */}
            {isProcessing && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
                        <p className="text-gray-900 font-medium">Processing your order...</p>
                    </div>
                </div>
            )}
        </div>
    );
}
