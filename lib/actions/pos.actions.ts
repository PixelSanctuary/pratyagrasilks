'use server';

import { createClient } from '@supabase/supabase-js';

export interface PosActionItem {
    productId: string;
    name: string;
    sku: string;
    quantity: number;
    unitPrice: number;
}

export interface PosOrderResult {
    success: boolean;
    orderId?: string;
    orderNumber?: string;
    customerId?: string;
    grandTotal?: number;
    error?: string;
}

function getServiceClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );
}

async function resolveWalkInCustomer(
    supabase: ReturnType<typeof getServiceClient>
): Promise<{ customerId: string; addressId: string } | { error: string }> {
    const walkInEmail = 'pos-walkin@pratyagrasilks.internal';

    let customerId: string;
    const { data: existing } = await supabase
        .from('customers')
        .select('id')
        .eq('email', walkInEmail)
        .single();

    if (existing) {
        customerId = existing.id;
    } else {
        const { data: created, error } = await supabase
            .from('customers')
            .insert({ email: walkInEmail, full_name: 'POS Walk-in Customer', phone: '0000000000' })
            .select('id')
            .single();
        if (error || !created) return { error: 'Failed to resolve walk-in customer' };
        customerId = created.id;
    }

    let addressId: string;
    const { data: existingAddr } = await supabase
        .from('addresses')
        .select('id')
        .eq('customer_id', customerId)
        .limit(1)
        .single();

    if (existingAddr) {
        addressId = existingAddr.id;
    } else {
        const { data: createdAddr, error } = await supabase
            .from('addresses')
            .insert({
                customer_id: customerId,
                full_name: 'POS In-Store',
                address_line1: 'In-Store Purchase',
                city: 'Varanasi',
                state: 'Uttar Pradesh',
                postal_code: '221001',
                country: 'India',
                phone: '0000000000',
                is_default: false,
            })
            .select('id')
            .single();
        if (error || !createdAddr) return { error: 'Failed to resolve in-store address' };
        addressId = createdAddr.id;
    }

    return { customerId, addressId };
}

export async function processOfflineSale(
    cartItems: PosActionItem[],
    paymentMethod: 'CASH' | 'UPI' | 'CARD',
    customerId?: string
): Promise<PosOrderResult> {
    try {
        const supabase = getServiceClient();

        const grandTotal = cartItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
        const orderNumber = `POS-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

        // If customerId provided, use it; otherwise fallback to generic walk-in customer
        let finalCustomerId = customerId;
        let addressId: string | undefined;

        if (!finalCustomerId) {
            const customerResult = await resolveWalkInCustomer(supabase);
            if ('error' in customerResult) return { success: false, error: customerResult.error };
            finalCustomerId = customerResult.customerId;
            addressId = customerResult.addressId;
        } else {
            // For CRM customers, use a generic "POS In-Store" address if not already linked
            const { data: existingAddr } = await supabase
                .from('addresses')
                .select('id')
                .eq('customer_id', finalCustomerId)
                .limit(1)
                .single();

            if (existingAddr) {
                addressId = existingAddr.id;
            } else {
                const { data: createdAddr, error } = await supabase
                    .from('addresses')
                    .insert({
                        customer_id: finalCustomerId,
                        full_name: 'POS In-Store',
                        address_line1: 'In-Store Purchase',
                        city: 'Varanasi',
                        state: 'Uttar Pradesh',
                        postal_code: '221001',
                        country: 'India',
                        phone: '0000000000',
                        is_default: false,
                    })
                    .select('id')
                    .single();
                if (error || !createdAddr) addressId = '';
                else addressId = createdAddr.id;
            }
        }

        // Create order
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
                customer_id: finalCustomerId,
                order_number: orderNumber,
                total_amount: grandTotal,
                shipping_cost: 0,
                shipping_address_id: addressId || null,
                status: 'delivered',
                payment_method: paymentMethod,
                payment_status: 'completed',
            })
            .select('id, order_number')
            .single();

        if (orderError || !order) {
            return { success: false, error: orderError?.message || 'Failed to create order' };
        }

        // Create order items
        const orderItems = cartItems.map(item => ({
            order_id: order.id,
            product_id: item.productId,
            product_name: item.name,
            product_sku: item.sku,
            quantity: item.quantity,
            unit_price: item.unitPrice,
            total_price: item.unitPrice * item.quantity,
        }));

        const { error: itemsError } = await supabase.from('order_items').insert(orderItems);

        if (itemsError) {
            // Rollback order
            await supabase.from('orders').delete().eq('id', order.id);
            return { success: false, error: itemsError.message };
        }

        // Mark products as sold — remove from online listing and mark out of stock
        const productIds = cartItems.map(i => i.productId);
        await supabase
            .from('products')
            .update({ in_stock: false, is_online: false })
            .in('id', productIds);

        return {
            success: true,
            orderId: order.id,
            orderNumber: order.order_number,
            customerId: finalCustomerId,
            grandTotal,
        };
    } catch (err) {
        console.error('processOfflineSale error:', err);
        return { success: false, error: 'Internal server error' };
    }
}
