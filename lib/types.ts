// Core TypeScript interfaces for PratyagraSilks e-commerce

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    images: string[];
    inStock: boolean;
    sku: string;
    material: string;
    dimensions?: string;
    weight?: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface CartItem {
    productId: string;
    product: Product;
    addedAt: Date;
}

export interface Order {
    id: string;
    userId: string;
    items: CartItem[];
    totalAmount: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    shippingAddress: {
        fullName: string;
        addressLine1: string;
        addressLine2?: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
        phone: string;
    };
    paymentMethod: string;
    paymentStatus: 'pending' | 'completed' | 'failed';
    createdAt: Date;
    updatedAt: Date;
    deliveredAt?: Date;
}

export interface WishlistItem {
    id: string;
    customerId: string;
    productId: string;
    product: Product;
    createdAt: Date;
}
