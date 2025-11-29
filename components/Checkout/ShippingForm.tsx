'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { shippingAddressSchema, ShippingAddress, INDIAN_STATES } from '@/lib/validations/checkout';

interface ShippingFormProps {
    onSubmit: (data: ShippingAddress) => void;
    defaultValues?: Partial<ShippingAddress>;
}

export default function ShippingForm({ onSubmit, defaultValues }: ShippingFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ShippingAddress>({
        resolver: zodResolver(shippingAddressSchema),
        defaultValues,
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Address</h2>

                <div className="space-y-4">
                    {/* Full Name */}
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name *
                        </label>
                        <input
                            {...register('fullName')}
                            type="text"
                            id="fullName"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            placeholder="John Doe"
                        />
                        {errors.fullName && (
                            <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                        )}
                    </div>

                    {/* Email & Phone */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email *
                            </label>
                            <input
                                {...register('email')}
                                type="email"
                                id="email"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                placeholder="john@example.com"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number *
                            </label>
                            <input
                                {...register('phone')}
                                type="tel"
                                id="phone"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                placeholder="9876543210"
                            />
                            {errors.phone && (
                                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Address Line 1 */}
                    <div>
                        <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700 mb-1">
                            Address Line 1 *
                        </label>
                        <input
                            {...register('addressLine1')}
                            type="text"
                            id="addressLine1"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            placeholder="House No., Building Name"
                        />
                        {errors.addressLine1 && (
                            <p className="mt-1 text-sm text-red-600">{errors.addressLine1.message}</p>
                        )}
                    </div>

                    {/* Address Line 2 */}
                    <div>
                        <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700 mb-1">
                            Address Line 2 (Optional)
                        </label>
                        <input
                            {...register('addressLine2')}
                            type="text"
                            id="addressLine2"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            placeholder="Street, Locality"
                        />
                    </div>

                    {/* City, State, Pincode */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                                City *
                            </label>
                            <input
                                {...register('city')}
                                type="text"
                                id="city"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                placeholder="Mumbai"
                            />
                            {errors.city && (
                                <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                                State *
                            </label>
                            <select
                                {...register('state')}
                                id="state"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            >
                                <option value="">Select State</option>
                                {INDIAN_STATES.map((state) => (
                                    <option key={state} value={state}>
                                        {state}
                                    </option>
                                ))}
                            </select>
                            {errors.state && (
                                <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
                                Pincode *
                            </label>
                            <input
                                {...register('pincode')}
                                type="text"
                                id="pincode"
                                maxLength={6}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                placeholder="400001"
                            />
                            {errors.pincode && (
                                <p className="mt-1 text-sm text-red-600">{errors.pincode.message}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-amber-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-amber-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                {isSubmitting ? 'Processing...' : 'Continue to Review'}
            </button>
        </form>
    );
}
