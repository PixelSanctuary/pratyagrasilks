import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
);

/**
 * POST /api/order/verify
 *
 * Called by RazorpayButton immediately after a successful payment.
 * - Verifies the HMAC-SHA256 signature to prove payment authenticity.
 * - Updates the Supabase order status to `processing` / `completed`.
 * - Idempotent: safe to call multiple times for the same payment.
 */
export async function POST(req: NextRequest) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return NextResponse.json({ error: 'Missing payment verification fields' }, { status: 400 });
        }

        // ── 1. HMAC-SHA256 signature verification ────────────────────────────────
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            console.error('[/api/order/verify] Signature mismatch');
            return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
        }

        // ── 2. Look up the order by Razorpay order ID ────────────────────────────
        const { data: order, error: findErr } = await supabaseAdmin
            .from('orders')
            .select('id, order_number, payment_status')
            .eq('razorpay_order_id', razorpay_order_id)
            .single();

        if (findErr || !order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        // ── 3. Idempotency guard ──────────────────────────────────────────────────
        if (order.payment_status === 'completed') {
            return NextResponse.json({
                success: true,
                message: 'Already verified',
                orderId: order.id,
                orderNumber: order.order_number,
            });
        }

        // ── 4. Mark order as paid ─────────────────────────────────────────────────
        const { error: updateErr } = await supabaseAdmin
            .from('orders')
            .update({
                status: 'processing',
                payment_status: 'completed',
                razorpay_payment_id,
                razorpay_signature,
                payment_verified_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            })
            .eq('id', order.id);

        if (updateErr) {
            console.error('[/api/order/verify] DB update failed', updateErr);
            return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
        }

        console.log(`[/api/order/verify] Payment verified — order ${order.order_number}`);

        return NextResponse.json({
            success: true,
            orderId: order.id,
            orderNumber: order.order_number,
        });
    } catch (err) {
        console.error('[/api/order/verify]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
