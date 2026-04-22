export { shippingAddressSchema, type ShippingAddress } from './form.schemas';

// Flexible postal code validation based on country
const postalCodeRegex = {
    IN: /^\d{6}$/,
    US: /^\d{5}(-\d{4})?$/,
    GB: /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i,
    CA: /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i,
    default: /^[A-Z0-9\s-]{3,10}$/i,
};

export function validatePostalCode(postalCode: string, countryCode: string): boolean {
    const regex = postalCodeRegex[countryCode as keyof typeof postalCodeRegex] || postalCodeRegex.default;
    return regex.test(postalCode);
}

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
