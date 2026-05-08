import type { PosActionItem } from '@/lib/actions/pos.actions';
import type { PosCustomer } from '@/lib/actions/crm.actions';

export interface WhatsAppReceiptParams {
    orderNumber: string;
    items: PosActionItem[];
    customerName?: string | null;
    grandTotal: number;
    taxableValue?: number;
    cgst?: number;
    sgst?: number;
    paymentMethod?: string;
    storeName?: string;
    storePhone?: string;
    storeGSTIN?: string;
}

export function generateWhatsAppReceipt({
    orderNumber,
    items,
    customerName,
    grandTotal,
    taxableValue,
    cgst,
    sgst,
    paymentMethod = 'Cash',
    storeName = 'Kandangi Sarees',
    storePhone = '+91-XXXXXXXXXX',
    storeGSTIN = '09XXXXXXXXXXXXX',
}: WhatsAppReceiptParams): string {
    const fmt = (n: number) =>
        new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(n);

    const now = new Date().toLocaleString('en-IN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    });

    let message = '';

    // Header
    message += `*${storeName}*\n`;
    message += `🛍️ Digital Receipt\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n\n`;

    // Order Details
    message += `📋 Order #: ${orderNumber}\n`;
    message += `📅 Date & Time: ${now}\n`;
    if (customerName) {
        message += `👤 Customer: ${customerName}\n`;
    }
    message += `💳 Payment: ${paymentMethod}\n`;
    message += `📞 Contact: ${storePhone}\n`;
    message += `🏢 GSTIN: ${storeGSTIN}\n\n`;

    // Items
    message += `*Purchased Items:*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n`;
    items.forEach((item, idx) => {
        message += `${idx + 1}. ${item.name}\n`;
        message += `   SKU: ${item.sku} | Qty: ${item.quantity}\n`;
        message += `   ₹${fmt(item.unitPrice * item.quantity)}\n\n`;
    });

    // Totals
    message += `━━━━━━━━━━━━━━━━━━━━\n`;
    if (taxableValue && cgst && sgst) {
        message += `Taxable Value: ${fmt(taxableValue)}\n`;
        message += `CGST (2.5%): ${fmt(cgst)}\n`;
        message += `SGST (2.5%): ${fmt(sgst)}\n`;
    }
    message += `*Grand Total: ${fmt(grandTotal)}*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n\n`;

    // Silk Care Tip
    message += `✨ *Silk Care Tip:*\n`;
    message += `• Wash in cold water with silk detergent\n`;
    message += `• Dry flat or hang in shade\n`;
    message += `• Iron on low heat with a cloth layer\n\n`;

    // Footer
    message += `Thank you for choosing ${storeName}!\n`;
    message += `We appreciate your visit.\n\n`;
    message += `*Authentic Varanasi Silk Sarees*\n`;

    return message;
}

export function generateWhatsAppMessage(
    customerPhone: string,
    receiptText: string
): { to: string; body: string } {
    return {
        to: `+91${customerPhone.replace(/\D/g, '').slice(-10)}`,
        body: receiptText,
    };
}

/**
 * Returns a wa.me URL with a pre-filled message for customer-facing CTAs.
 * Falls back to '#' and emits a console warning if the env var is not set.
 */
export function getWhatsAppUrl(message: string): string {
    const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
    if (!number) {
        if (process.env.NODE_ENV !== 'production') {
            console.warn(
                '[Kandangi Sarees] WhatsApp number not configured. ' +
                'Add NEXT_PUBLIC_WHATSAPP_NUMBER to .env.local'
            );
        }
        return '#';
    }
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
