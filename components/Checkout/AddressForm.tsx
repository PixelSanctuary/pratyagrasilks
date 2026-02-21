'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { shippingAddressSchema, ShippingAddress } from '@/lib/validations/checkout';
import { useState, useEffect } from 'react';
import {
    GetCountries,
    GetState,
    GetCity,
} from 'react-country-state-city';
import 'react-country-state-city/dist/react-country-state-city.css';

interface AddressFormProps {
    onSubmit: (data: ShippingAddress) => void;
    defaultValues?: Partial<ShippingAddress>;
}

export default function AddressForm({ onSubmit, defaultValues }: AddressFormProps) {
    const [countriesList, setCountriesList] = useState<any[]>([]);
    const [stateList, setStateList] = useState<any[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<any>(null);
    const [selectedState, setSelectedState] = useState<any>(null);

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<ShippingAddress>({
        resolver: zodResolver(shippingAddressSchema),
        defaultValues: {
            country: 'India',
            ...defaultValues,
        },
    });

    const watchCountry = watch('country');

    // Load countries on mount
    useEffect(() => {
        GetCountries().then((result: any) => {
            setCountriesList(result);
            // Set India as default
            const india = result.find((c: any) => c.name === 'India');
            if (india && !defaultValues?.country) {
                setSelectedCountry(india);
                setValue('country', india.name);
            }
        });
    }, []);

    // Load states when country changes
    useEffect(() => {
        if (selectedCountry) {
            GetState(selectedCountry.id).then((result: any) => {
                setStateList(result);
            });
        } else {
            setStateList([]);
            setValue('state', '');
        }
    }, [selectedCountry]);

    const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const countryName = e.target.value;
        const country = countriesList.find((c) => c.name === countryName);
        setSelectedCountry(country);
        setValue('country', countryName);
        setValue('state', ''); // Reset state when country changes
        setSelectedState(null);
    };

    const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const stateName = e.target.value;
        const state = stateList.find((s) => s.name === stateName);
        setSelectedState(state);
        setValue('state', stateName);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Address</h2>

                <div className="space-y-4">
                    {/* Full Name */}
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium mb-1">
                            Full Name *
                        </label>
                        <input
                            {...register('fullName')}
                            type="text"
                            id="fullName"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                            placeholder="John Doe"
                            maxLength={100}
                        />
                        {errors.fullName && (
                            <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                        )}
                    </div>

                    {/* Email & Phone */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-1">
                                Email *
                            </label>
                            <input
                                {...register('email')}
                                type="email"
                                id="email"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                                placeholder="john@example.com"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium mb-1">
                                Phone Number * (with country code)
                            </label>
                            <input
                                {...register('phone')}
                                type="tel"
                                id="phone"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                                placeholder="+919876543210"
                            />
                            {errors.phone && (
                                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Address Line 1 */}
                    <div>
                        <label htmlFor="addressLine1" className="block text-sm font-medium mb-1">
                            Address Line 1 *
                        </label>
                        <input
                            {...register('addressLine1')}
                            type="text"
                            id="addressLine1"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                            placeholder="House No., Building Name, Street"
                            maxLength={200}
                        />
                        {errors.addressLine1 && (
                            <p className="mt-1 text-sm text-red-600">{errors.addressLine1.message}</p>
                        )}
                    </div>

                    {/* Address Line 2 */}
                    <div>
                        <label htmlFor="addressLine2" className="block text-sm font-medium mb-1">
                            Address Line 2 (Optional)
                        </label>
                        <input
                            {...register('addressLine2')}
                            type="text"
                            id="addressLine2"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                            placeholder="Apartment, Suite, Landmark"
                            maxLength={200}
                        />
                    </div>

                    {/* Country */}
                    <div>
                        <label htmlFor="country" className="block text-sm font-medium mb-1">
                            Country *
                        </label>
                        <select
                            {...register('country')}
                            id="country"
                            onChange={handleCountryChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                        >
                            <option value="">Select Country</option>
                            {countriesList.map((country) => (
                                <option key={country.id} value={country.name}>
                                    {country.name}
                                </option>
                            ))}
                        </select>
                        {errors.country && (
                            <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
                        )}
                    </div>

                    {/* City, State, Postal Code */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="city" className="block text-sm font-medium mb-1">
                                City *
                            </label>
                            <input
                                {...register('city')}
                                type="text"
                                id="city"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                                placeholder="Mumbai"
                                maxLength={100}
                            />
                            {errors.city && (
                                <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="state" className="block text-sm font-medium mb-1">
                                State / Province {stateList.length > 0 && '*'}
                            </label>
                            {stateList.length > 0 ? (
                                <select
                                    {...register('state')}
                                    id="state"
                                    onChange={handleStateChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                                >
                                    <option value="">Select State</option>
                                    {stateList.map((state) => (
                                        <option key={state.id} value={state.name}>
                                            {state.name}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    {...register('state')}
                                    type="text"
                                    id="state"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                                    placeholder="State / Province (if applicable)"
                                    maxLength={100}
                                />
                            )}
                            {errors.state && (
                                <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="postalCode" className="block text-sm font-medium mb-1">
                                Postal / ZIP Code *
                            </label>
                            <input
                                {...register('postalCode')}
                                type="text"
                                id="postalCode"
                                maxLength={10}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                                placeholder="400001"
                            />
                            {errors.postalCode && (
                                <p className="mt-1 text-sm text-red-600">{errors.postalCode.message}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold text-lg hover:bg-primary-light transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                {isSubmitting ? 'Processing...' : 'Continue to Review'}
            </button>
        </form>
    );
}
