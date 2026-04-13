export interface PosReceiptData {
    orderNumber: string;
    orderId: string;
    items: Array<{
        name: string;
        sku: string;
        quantity: number;
        unitPrice: number;
    }>;
    grandTotal: number;
    taxableValue: number;
    cgst: number;
    sgst: number;
    paymentMethod: string;
    date: string;
}

const fmtR = (n: number) =>
    new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(n);

interface PosReceiptProps {
    data: PosReceiptData;
}

export default function PosReceipt({ data }: PosReceiptProps) {
    return (
        <>
            <style>{`
                @media print {
                    body * { visibility: hidden !important; }
                    #pos-receipt-print,
                    #pos-receipt-print * { visibility: visible !important; }
                    #pos-receipt-print {
                        position: fixed !important;
                        top: 0 !important;
                        left: 0 !important;
                        width: 80mm !important;
                        margin: 10px !important;
                        padding: 0 !important;
                    }
                    @page {
                        size: 80mm auto;
                        margin: 0;
                    }
                }
            `}</style>

            <div
                id="pos-receipt-print"
                style={{
                    width: '80mm',
                    fontFamily: "'Courier New', Courier, monospace",
                    fontSize: '11px',
                    color: '#000',
                    padding: '4mm 3mm',
                    lineHeight: '1.4',
                    position: 'fixed',
                    left: '-9999px',
                    top: 0,
                }}
            >
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '3mm' }}>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', letterSpacing: '1px' }}>
                        PRATYAGRA SILKS
                    </div>
                    <div style={{ fontSize: '10px', marginTop: '1mm' }}>
                        NO 178, 2nd Floor A Rammachnadra Road, RS Puram, Coimbatore - 641002
                    </div>
                    <div style={{ fontSize: '10px' }}>Tel: +91 73588 66646</div>
                    <div style={{ fontSize: '10px', marginTop: '1mm' }}>
                        GSTIN: 33ABIFP4964F1Z3
                    </div>
                </div>

                <div style={{ borderTop: '1px dashed #000', margin: '2mm 0' }} />

                {/* Order meta */}
                <div style={{ fontSize: '10px', marginBottom: '2mm' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Order #:</span>
                        <span style={{ fontWeight: 'bold' }}>{data.orderNumber}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Date:</span>
                        <span>{data.date}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Payment:</span>
                        <span style={{ fontWeight: 'bold' }}>{data.paymentMethod}</span>
                    </div>
                </div>

                <div style={{ borderTop: '1px dashed #000', margin: '2mm 0' }} />

                {/* Column headers */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    marginBottom: '1mm',
                }}>
                    <span style={{ flex: 1 }}>Item</span>
                    <span style={{ width: '8mm', textAlign: 'center' }}>Qty</span>
                    <span style={{ width: '20mm', textAlign: 'right' }}>Rate</span>
                    <span style={{ width: '20mm', textAlign: 'right' }}>Amt</span>
                </div>

                <div style={{ borderTop: '1px solid #000', marginBottom: '1mm' }} />

                {/* Items */}
                {data.items.map((item, idx) => (
                    <div key={idx} style={{ marginBottom: '2mm', fontSize: '10px' }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                        }}>
                            <span style={{ flex: 1, wordBreak: 'break-word', paddingRight: '2mm' }}>
                                {item.name}
                            </span>
                            <span style={{ width: '8mm', textAlign: 'center', flexShrink: 0 }}>
                                {item.quantity}
                            </span>
                            <span style={{ width: '20mm', textAlign: 'right', flexShrink: 0 }}>
                                {fmtR(item.unitPrice)}
                            </span>
                            <span style={{ width: '20mm', textAlign: 'right', flexShrink: 0 }}>
                                {fmtR(item.unitPrice * item.quantity)}
                            </span>
                        </div>
                        <div style={{ color: '#555', fontSize: '9px', paddingLeft: '1mm' }}>
                            SKU: {item.sku}
                        </div>
                    </div>
                ))}

                <div style={{ borderTop: '1px dashed #000', margin: '2mm 0' }} />

                {/* Tax breakdown */}
                <div style={{ fontSize: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1mm' }}>
                        <span>Total MRP (Incl. GST)</span>
                        <span>{fmtR(data.grandTotal)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1mm' }}>
                        <span>Taxable Value</span>
                        <span>{fmtR(data.taxableValue)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1mm' }}>
                        <span>CGST @ 2.5%</span>
                        <span>{fmtR(data.cgst)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1mm' }}>
                        <span>SGST @ 2.5%</span>
                        <span>{fmtR(data.sgst)}</span>
                    </div>
                </div>

                <div style={{ borderTop: '2px solid #000', margin: '2mm 0' }} />

                {/* Grand Total */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    marginBottom: '3mm',
                }}>
                    <span>GRAND TOTAL</span>
                    <span>{fmtR(data.grandTotal)}</span>
                </div>

                <div style={{ borderTop: '2px solid #000', margin: '2mm 0' }} />

                {/* Footer */}
                <div style={{ textAlign: 'center', fontSize: '10px', marginTop: '3mm' }}>
                    <div>Thank you for shopping with us!</div>
                    <div style={{ marginTop: '1mm', fontStyle: 'italic' }}>
                        Pratyagra Silks — Reviving Tradition with a New Touch
                    </div>
                    <div style={{ marginTop: '2mm', fontSize: '9px', color: '#555' }}>
                        *All prices are inclusive of GST*
                    </div>
                </div>

                {/* Bottom margin for tear */}
                <div style={{ height: '8mm' }} />
            </div>
        </>
    );
}
