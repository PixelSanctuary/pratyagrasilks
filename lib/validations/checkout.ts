import { z } from 'zod';

// Flexible postal code validation based on country
const postalCodeRegex = {
    IN: /^\d{6}$/,                                    // India: 6 digits
    US: /^\d{5}(-\d{4})?$/,                          // USA: 5 or 5+4 digits
    GB: /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i,  // UK: Alphanumeric
    CA: /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i,              // Canada: A1A 1A1
    default: /^[A-Z0-9\s-]{3,10}$/i,                 // Default: Alphanumeric 3-10 chars
};

// Validation schema for international shipping address
export const shippingAddressSchema = z.object({
    fullName: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
    email: z.string().email('Invalid email address'),
    phone: z.string()
        .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number. Use international format with country code (e.g., +1234567890)')
        .min(10, 'Phone number must be at least 10 digits')
        .max(16, 'Phone number is too long'),
    addressLine1: z.string().min(5, 'Address must be at least 5 characters').max(200, 'Address is too long'),
    addressLine2: z.string().max(200, 'Address is too long').optional(),
    city: z.string().min(2, 'City is required').max(100, 'City name is too long'),
    state: z.string().optional(), // Optional because some countries don't have states
    postalCode: z.string()
        .min(3, 'Postal code must be at least 3 characters')
        .max(10, 'Postal code is too long')
        .regex(/^[A-Z0-9\s-]+$/i, 'Invalid postal code format'),
    country: z.string().min(1, 'Please select a country'),
});

export type ShippingAddress = z.infer<typeof shippingAddressSchema>;

// Helper function to validate postal code by country
export function validatePostalCode(postalCode: string, countryCode: string): boolean {
    const regex = postalCodeRegex[countryCode as keyof typeof postalCodeRegex] || postalCodeRegex.default;
    return regex.test(postalCode);
}

// Indian states for backward compatibility
export const INDIAN_STATES = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Delhi',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
    'Jammu and Kashmir',
    'Ladakh',
];
