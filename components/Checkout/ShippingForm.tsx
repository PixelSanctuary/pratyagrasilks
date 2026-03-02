'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { shippingAddressSchema, ShippingAddress, INDIAN_STATES } from '@/lib/validations/checkout';
import { useState } from 'react';

interface Props {
    onSubmit: (data: ShippingAddress) => Promise<void>;
}

export default function ShippingForm({ onSubmit }: Props) {
    const [country, setCountry] = useState('India');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<ShippingAddress>({
        resolver: zodResolver(shippingAddressSchema),
        defaultValues: { country: 'India' },
    });

    const handleFormSubmit = async (data: ShippingAddress) => {
        setIsSubmitting(true);
        try {
            await onSubmit(data);
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClass =
        'w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary transition-colors text-sm';
    const errorClass = 'mt-1 text-xs text-red-600';
    const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Shipping Details</h2>

            <form onSubmit={handleSubmit(handleFormSubmit)} noValidate className="space-y-5">
                {/* Full Name */}
                <div>
                    <label htmlFor="fullName" className={labelClass}>Full Name *</label>
                    <input
                        id="fullName"
                        type="text"
                        placeholder="Priya Sharma"
                        autoComplete="name"
                        className={inputClass}
                        {...register('fullName')}
                    />
                    {errors.fullName && <p className={errorClass}>{errors.fullName.message}</p>}
                </div>

                {/* Email + Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="email" className={labelClass}>Email *</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="priya@example.com"
                            autoComplete="email"
                            className={inputClass}
                            {...register('email')}
                        />
                        {errors.email && <p className={errorClass}>{errors.email.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="phone" className={labelClass}>Phone *</label>
                        <input
                            id="phone"
                            type="tel"
                            placeholder="+919876543210"
                            autoComplete="tel"
                            className={inputClass}
                            {...register('phone')}
                        />
                        {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
                    </div>
                </div>

                {/* Address Line 1 */}
                <div>
                    <label htmlFor="addressLine1" className={labelClass}>Address Line 1 *</label>
                    <input
                        id="addressLine1"
                        type="text"
                        placeholder="House / Flat no., Street"
                        autoComplete="address-line1"
                        className={inputClass}
                        {...register('addressLine1')}
                    />
                    {errors.addressLine1 && <p className={errorClass}>{errors.addressLine1.message}</p>}
                </div>

                {/* Address Line 2 */}
                <div>
                    <label htmlFor="addressLine2" className={labelClass}>
                        Address Line 2 <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <input
                        id="addressLine2"
                        type="text"
                        placeholder="Landmark, Colony"
                        autoComplete="address-line2"
                        className={inputClass}
                        {...register('addressLine2')}
                    />
                </div>

                {/* City + Postal Code */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="city" className={labelClass}>City *</label>
                        <input
                            id="city"
                            type="text"
                            placeholder="Chennai"
                            autoComplete="address-level2"
                            className={inputClass}
                            {...register('city')}
                        />
                        {errors.city && <p className={errorClass}>{errors.city.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="postalCode" className={labelClass}>Postal Code *</label>
                        <input
                            id="postalCode"
                            type="text"
                            placeholder="600001"
                            autoComplete="postal-code"
                            className={inputClass}
                            {...register('postalCode')}
                        />
                        {errors.postalCode && <p className={errorClass}>{errors.postalCode.message}</p>}
                    </div>
                </div>

                {/* Country */}
                <div>
                    <label htmlFor="country" className={labelClass}>Country *</label>
                    <select
                        id="country"
                        className={inputClass}
                        {...register('country')}
                        onChange={(e) => {
                            setCountry(e.target.value);
                            setValue('country', e.target.value, { shouldValidate: true });
                            setValue('state', '');
                        }}
                    >
                        <option value="India">India</option>
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Canada">Canada</option>
                        <option value="Australia">Australia</option>
                        <option value="Singapore">Singapore</option>
                        <option value="UAE">UAE</option>
                        <option value="Other">Other</option>
                    </select>
                    {errors.country && <p className={errorClass}>{errors.country.message}</p>}
                </div>

                {/* State — only shown for India */}
                {country === 'India' && (
                    <div>
                        <label htmlFor="state" className={labelClass}>State *</label>
                        <select id="state" className={inputClass} {...register('state')}>
                            <option value="">Select state</option>
                            {INDIAN_STATES.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                        {errors.state && <p className={errorClass}>{errors.state.message}</p>}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="
                        w-full py-3 px-6 rounded-lg font-semibold text-white text-sm
                        bg-primary hover:bg-primary-light active:bg-primary-dark
                        disabled:opacity-60 disabled:cursor-not-allowed
                        transition-colors duration-200 shadow-sm
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary
                    "
                >
                    {isSubmitting ? 'Calculating shipping…' : 'Confirm Address & Continue to Payment'}
                </button>
            </form>
        </div>
    );
}
