'use client';

import AddressForm from './AddressForm';
import { ShippingAddress } from '@/lib/validations/checkout';

interface ShippingFormProps {
    onSubmit: (data: ShippingAddress) => void;
    defaultValues?: Partial<ShippingAddress>;
}

export default function ShippingForm({ onSubmit, defaultValues }: ShippingFormProps) {
    return <AddressForm onSubmit={onSubmit} defaultValues={defaultValues} />;
}
