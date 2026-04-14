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
    const font = "'Segoe UI', Arial, sans-serif";

    return (
        <>
            <style>{`
                @media print {
                    body > * { visibility: hidden !important; }
                    #pos-receipt-print,
                    #pos-receipt-print * { visibility: visible !important; }
                    /* Target: EPSON — A5 (148×210mm) — 14px margins */
                    #pos-receipt-print {
                        position: fixed !important;
                        left: 0 !important;
                        top: 0 !important;
                        width: 100% !important;
                        max-width: 100% !important;
                        padding: 14px !important;
                        margin: 0 auto !important;
                    }
                    @page {
                        size: A5 portrait;
                        margin: 14px;
                    }
                    .receipt-table {
                        width: 100%;
                        border-collapse: collapse;
                        font-size: 13px;
                    }
                    .receipt-table th {
                        background-color: #f5f0f8 !important;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .row-alt {
                        background-color: #faf9fb !important;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .total-row {
                        background-color: #550c72 !important;
                        color: #fff !important;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                }
            `}</style>

            {/* Off-screen on screen; positioned via print CSS above */}
            <div
                id="pos-receipt-print"
                style={{
                    position: 'fixed',
                    left: '-9999px',
                    top: 0,
                    fontFamily: font,
                    fontSize: '13px',
                    color: '#000',
                    lineHeight: 1.5,
                    width: '520px',   /* A5 usable at 96dpi ≈ 531px */
                    margin: '0 auto',
                    background: '#fff',
                }}
            >
                {/* ── Header ──────────────────────────────────────────────── */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                    {/* Left: store details */}
                    <div>
                        <div style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '0.5px', color: '#550c72', lineHeight: 1.1 }}>
                            PRATYAGRA SILKS
                        </div>
                        <div style={{ fontSize: '12px', color: '#444', marginTop: '4px', lineHeight: 1.5 }}>
                            NO 178, 2nd Floor A Ramachandra Road<br />
                            RS Puram, Coimbatore – 641002<br />
                            Tel: +91 73588 66646<br />
                            GSTIN: 33ABIFP4964F1Z3
                        </div>
                    </div>

                    {/* Right: invoice label + meta */}
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '18px', fontWeight: 700, color: '#550c72', letterSpacing: '1px' }}>
                            TAX INVOICE
                        </div>
                        <div style={{ fontSize: '12px', color: '#444', marginTop: '6px', lineHeight: 1.6 }}>
                            <div><strong>Order #:</strong> {data.orderNumber}</div>
                            <div><strong>Date:</strong> {data.date}</div>
                            <div>
                                <span style={{
                                    display: 'inline-block',
                                    background: '#550c72',
                                    color: '#fff',
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    padding: '2px 8px',
                                    borderRadius: '4px',
                                    marginTop: '2px',
                                    letterSpacing: '0.5px',
                                }}>
                                    {data.paymentMethod}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ borderTop: '2px solid #550c72', marginBottom: '14px' }} />

                {/* ── Items Table ──────────────────────────────────────────── */}
                <table className="receipt-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                        <tr style={{ background: '#f5f0f8' }}>
                            <th style={{ padding: '7px 6px', textAlign: 'left', fontSize: '12px', fontWeight: 700, width: '5%', borderBottom: '1px solid #ddd' }}>#</th>
                            <th style={{ padding: '7px 6px', textAlign: 'left', fontSize: '12px', fontWeight: 700, width: '35%', borderBottom: '1px solid #ddd' }}>Item</th>
                            <th style={{ padding: '7px 6px', textAlign: 'left', fontSize: '12px', fontWeight: 700, width: '20%', borderBottom: '1px solid #ddd' }}>SKU</th>
                            <th style={{ padding: '7px 6px', textAlign: 'center', fontSize: '12px', fontWeight: 700, width: '8%', borderBottom: '1px solid #ddd' }}>Qty</th>
                            <th style={{ padding: '7px 6px', textAlign: 'right', fontSize: '12px', fontWeight: 700, width: '16%', borderBottom: '1px solid #ddd' }}>Rate (₹)</th>
                            <th style={{ padding: '7px 6px', textAlign: 'right', fontSize: '12px', fontWeight: 700, width: '16%', borderBottom: '1px solid #ddd' }}>Amount (₹)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.items.map((item, idx) => (
                            <tr key={idx} className={idx % 2 === 1 ? 'row-alt' : ''} style={{ background: idx % 2 === 1 ? '#faf9fb' : '#fff' }}>
                                <td style={{ padding: '7px 6px', borderBottom: '1px solid #eee', color: '#666', fontSize: '12px' }}>{idx + 1}</td>
                                <td style={{ padding: '7px 6px', borderBottom: '1px solid #eee', fontWeight: 600 }}>{item.name}</td>
                                <td style={{ padding: '7px 6px', borderBottom: '1px solid #eee', color: '#666', fontSize: '12px' }}>{item.sku}</td>
                                <td style={{ padding: '7px 6px', borderBottom: '1px solid #eee', textAlign: 'center' }}>{item.quantity}</td>
                                <td style={{ padding: '7px 6px', borderBottom: '1px solid #eee', textAlign: 'right' }}>{fmtR(item.unitPrice)}</td>
                                <td style={{ padding: '7px 6px', borderBottom: '1px solid #eee', textAlign: 'right', fontWeight: 600 }}>{fmtR(item.unitPrice * item.quantity)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* ── Tax Summary ──────────────────────────────────────────── */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '14px' }}>
                    <div style={{ width: '260px', fontSize: '13px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #eee' }}>
                            <span style={{ color: '#555' }}>Total MRP (Incl. GST)</span>
                            <span style={{ fontWeight: 600 }}>{fmtR(data.grandTotal)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #eee' }}>
                            <span style={{ color: '#555' }}>Taxable Value</span>
                            <span>{fmtR(data.taxableValue)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #eee' }}>
                            <span style={{ color: '#555' }}>CGST @ 2.5%</span>
                            <span>{fmtR(data.cgst)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                            <span style={{ color: '#555' }}>SGST @ 2.5%</span>
                            <span>{fmtR(data.sgst)}</span>
                        </div>

                        {/* Grand Total */}
                        <div
                            className="total-row"
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                background: '#550c72',
                                color: '#fff',
                                padding: '10px 10px',
                                borderRadius: '6px',
                                marginTop: '8px',
                            }}
                        >
                            <span style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.5px' }}>GRAND TOTAL</span>
                            <span style={{ fontSize: '22px', fontWeight: 800 }}>{fmtR(data.grandTotal)}</span>
                        </div>
                    </div>
                </div>

                {/* ── Footer ───────────────────────────────────────────────── */}
                <div style={{ borderTop: '1px solid #ddd', marginTop: '20px', paddingTop: '12px', textAlign: 'center', fontSize: '11px', color: '#666' }}>
                    <div style={{ fontWeight: 600, color: '#550c72', fontSize: '12px' }}>
                        Thank you for shopping with Pratyagra Silks!
                    </div>
                    <div style={{ marginTop: '4px', fontStyle: 'italic' }}>
                        Reviving Tradition with a New Touch
                    </div>
                    <div style={{ marginTop: '6px', fontSize: '10px', color: '#999' }}>
                        * All prices are inclusive of GST &nbsp;|&nbsp; Goods once sold cannot be returned
                    </div>
                </div>
            </div>
        </>
    );
}
