'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Barcode from 'react-barcode';

interface BulkBarcodeWrapperProps {
    products: Array<{ id: string; name: string; sku: string; price: number }>;
}

const fmt = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
});

export default function BulkBarcodeWrapper({ products }: BulkBarcodeWrapperProps) {
    // Portal requires document.body — guard against SSR
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);
    if (!mounted) return null;

    return createPortal(
        <>
            <style>{`
                @media print {
                    /* Hide everything except our label root (direct child of body via portal) */
                    body > *:not(#bulk-label-print-root) { display: none !important; }

                    #bulk-label-print-root {
                        display: block !important;
                        position: static !important;
                        left: auto !important;
                        top: auto !important;
                    }

                    .bulk-label {
                        width: 50mm;
                        height: 25mm;
                        overflow: hidden;
                        break-after: page;
                        page-break-after: always;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: space-between;
                        padding: 3px 4px;
                        box-sizing: border-box;
                        background: white;
                    }

                    @page { size: 50mm 25mm; margin: 0; }
                }
            `}</style>

            {/* Positioned off-screen on screen; revealed at left:0 by print CSS above */}
            <div
                id="bulk-label-print-root"
                style={{ position: 'fixed', left: '-9999px', top: 0 }}
            >
                {products.map((product) => (
                    <div key={product.id} className="bulk-label">
                        <p style={{
                            fontSize: '6px', fontWeight: 700, color: '#550c72',
                            letterSpacing: '0.08em', textTransform: 'uppercase',
                            margin: 0, lineHeight: 1,
                        }}>
                            ✦ Pratyagra Silks ✦
                        </p>
                        <p style={{
                            fontSize: '5.5px', fontWeight: 600, color: '#221D10',
                            textAlign: 'center', overflow: 'hidden',
                            textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                            maxWidth: '180px', margin: 0, lineHeight: 1.1,
                        }}>
                            {product.name}
                        </p>
                        <Barcode
                            value={product.sku}
                            width={0.9} height={28} fontSize={5}
                            margin={0} displayValue={true} textMargin={1}
                            background="#ffffff" lineColor="#000000" format="CODE128"
                        />
                        <p style={{
                            fontSize: '7px', fontWeight: 700, color: '#D97706',
                            letterSpacing: '0.04em', margin: 0, lineHeight: 1,
                        }}>
                            {fmt.format(product.price)}
                        </p>
                    </div>
                ))}
            </div>
        </>,
        document.body
    );
}
