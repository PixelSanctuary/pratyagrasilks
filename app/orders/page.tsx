'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, Calendar, CreditCard } from 'lucide-react';

interface Order {
    id: string;
    order_number: string;
    total_amount: number;
    status: string;
    payment_status: string;
    created_at: string;
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState('');

    const fetchOrders = async (customerEmail?: string) => {
        try {
            const url = customerEmail
                ? `/api/orders?email=${encodeURIComponent(customerEmail)}`
                : '/api/orders';

            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                setOrders(data.orders);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        fetchOrders(email);
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'shipped':
                return 'bg-blue-100 text-blue-800';
            case 'processing':
                return 'bg-yellow-100 text-yellow-800';
            case 'pending':
                return 'bg-gray-100 text-gray-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-6">
                    <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
                    <p className="text-textSecondary mt-1">View and track your orders</p>
                </div>
            </div>

            {/* Search */}
            <div className="container mx-auto px-4 py-6">
                <form onSubmit={handleSearch} className="max-w-md">
                    <label htmlFor="email" className="block text-sm font-medium  mb-2">
                        Search by Email
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-accent"
                        />
                        <button
                            type="submit"
                            className="px-6 py-2 bg-accent text-white rounded-md hover:bg-accent-hover transition-colors"
                        >
                            Search
                        </button>
                    </div>
                </form>
            </div>

            {/* Orders List */}
            <div className="container mx-auto px-4 pb-12">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h2>
                        <p className="text-textSecondary mb-6">
                            {email ? 'No orders found for this email.' : 'You haven\'t placed any orders yet.'}
                        </p>
                        <Link
                            href="/collection"
                            className="inline-block px-6 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-accent-hover transition-colors"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <Link
                                key={order.id}
                                href={`/orders/${order.id}`}
                                className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                            >
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    {/* Order Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Package className="w-5 h-5 text-gray-400" />
                                            <h3 className="font-semibold text-gray-900">
                                                Order #{order.order_number}
                                            </h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap gap-4 text-sm text-textSecondary">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                {formatDate(order.created_at)}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <CreditCard className="w-4 h-4" />
                                                {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <div className="text-right">
                                        <p className="text-sm text-textSecondary">Total</p>
                                        <p className="text-2xl font-bold text-accent-700">
                                            {formatPrice(order.total_amount)}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
