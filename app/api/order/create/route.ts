import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
);

/**
 * POST /api/order/create
 *
 * Called by RazorpayButton before opening the checkout modal.
 * - Validates cart prices server-side (prevents client-side manipulation).
 * - Creates a preliminary `pending` order in Supabase.
 * - Creates a Razorpay order and returns its ID to the client.
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { shippingAddress, items, shippingCost = 0, shippingZoneId, estimatedDeliveryDays } = body;

        // ── 1. Validate request shape ────────────────────────────────────────────
        if (!shippingAddress || !items || items.length === 0) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // ── 2. Re-fetch prices from DB to prevent price tampering ────────────────
        const productIds: string[] = items.map((i: any) => i.productId);
        const { data: products, error: productErr } = await supabaseAdmin
            .from('products')
            .select('id, name, price, in_stock, sku')
            .in('id', productIds);

        if (productErr || !products || products.length !== items.length) {
            return NextResponse.json({ error: 'Could not verify product details' }, { status: 400 });
        }

        const outOfStock = products.filter((p) => !p.in_stock);
        if (outOfStock.length > 0) {
            return NextResponse.json(
                { error: `Out of stock: ${outOfStock.map((p) => p.name).join(', ')}` },
                { status: 409 }
            );
        }

        // Create a product lookup map
        const productMap = new Map(products.map((p) => [p.id, p]));

        // ── 3. Server-side total calculation ─────────────────────────────────────
        const subtotal = items.reduce((sum: number, item: any) => {
            const p = productMap.get(item.productId);
            return sum + (p ? p.price : 0);
        }, 0);
        const totalAmount = subtotal + shippingCost;

        // ── 4. Persist customer ───────────────────────────────────────────────────
        let customerId: string;
        const { data: existingCustomer } = await supabaseAdmin
            .from('customers')
            .select('id')
            .eq('email', shippingAddress.email)
            .single();

        if (existingCustomer) {
            customerId = existingCustomer.id;
        } else {
            const { data: newCustomer, error: custErr } = await supabaseAdmin
                .from('customers')
                .insert({
                    email: shippingAddress.email,
                    full_name: shippingAddress.fullName,
                    phone: shippingAddress.phone,
                })
                .select()
                .single();

            if (custErr || !newCustomer) {
                return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 });
            }
            customerId = newCustomer.id;
        }

        // ── 5. Persist shipping address ───────────────────────────────────────────
        const { data: address, error: addrErr } = await supabaseAdmin
            .from('addresses')
            .insert({
                customer_id: customerId,
                full_name: shippingAddress.fullName,
                address_line1: shippingAddress.addressLine1,
                address_line2: shippingAddress.addressLine2 || '',
                city: shippingAddress.city,
                state: shippingAddress.state || '',
                postal_code: shippingAddress.postalCode,
                country: shippingAddress.country || 'India',
                phone: shippingAddress.phone,
                is_default: false,
            })
            .select()
            .single();

        if (addrErr || !address) {
            return NextResponse.json({ error: 'Failed to save address' }, { status: 500 });
        }

        // ── 6. Create pending order in Supabase ───────────────────────────────────
        const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 9).toUpperCase()}`;

        const { data: order, error: orderErr } = await supabaseAdmin
            .from('orders')
            .insert({
                customer_id: customerId,
                order_number: orderNumber,
                total_amount: totalAmount,
                shipping_cost: shippingCost,
                shipping_address_id: address.id,
                status: 'pending',
                payment_method: 'razorpay',
                payment_status: 'pending',
                ...(shippingZoneId && { shipping_zone_id: shippingZoneId }),
                ...(estimatedDeliveryDays && { estimated_delivery_days: estimatedDeliveryDays }),
            })
            .select()
            .single();

        if (orderErr || !order) {
            return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
        }

        // ── 7. Create order items (triggers stock deduction via DB trigger) ───────
        const orderItems = items.map((item: any) => {
            const p = productMap.get(item.productId)!;
            return {
                order_id: order.id,
                product_id: p.id,
                product_name: p.name,
                product_sku: p.sku,
                quantity: 1,
                unit_price: p.price,
                total_price: p.price,
            };
        });

        const { error: itemsErr } = await supabaseAdmin.from('order_items').insert(orderItems);

        if (itemsErr) {
            // Rollback: delete the order
            await supabaseAdmin.from('orders').delete().eq('id', order.id);
            return NextResponse.json({ error: 'Failed to save order items' }, { status: 500 });
        }

        // ── 8. Create Razorpay order ──────────────────────────────────────────────
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID!,
            key_secret: process.env.RAZORPAY_KEY_SECRET!,
        });

        const rzpOrder = await razorpay.orders.create({
            amount: Math.round(totalAmount * 100), // paise
            currency: 'INR',
            receipt: order.id.slice(0, 40), // Razorpay receipt max 40 chars
            notes: {
                order_number: orderNumber,
                db_order_id: order.id,
            },
        });

        // Persist Razorpay order ID against our order
        await supabaseAdmin
            .from('orders')
            .update({ razorpay_order_id: rzpOrder.id })
            .eq('id', order.id);

        return NextResponse.json({
            success: true,
            razorpayOrderId: rzpOrder.id,
            amount: rzpOrder.amount,
            currency: rzpOrder.currency,
            dbOrderId: order.id,
            orderNumber,
        });
    } catch (err) {
        console.error('[/api/order/create]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
