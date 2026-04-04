'use client';

import { useRef } from 'react';
import Barcode from 'react-barcode';
import { Printer } from 'lucide-react';

interface BarcodeLabelProps {
    productName: string;
    sku: string;
    price: number;
}

export default function BarcodeLabel({ productName, sku, price }: BarcodeLabelProps) {
    const labelRef = useRef<HTMLDivElement>(null);

    const formattedPrice = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(price);

    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            {/*
             * ─────────────────────────────────────────────────────────────
             *  PRINT STYLES — injected via <style> so they live alongside
             *  the component and don't require a separate CSS file.
             *  Target: 50mm × 25mm thermal label paper.
             * ─────────────────────────────────────────────────────────────
             */}
            <style>{`
                @media print {
                    /* Hide everything on the page */
                    body > * {
                        display: none !important;
                    }

                    /* Show only the label element */
                    #thermal-label-print-root {
                        display: block !important;
                        position: fixed;
                        inset: 0;
                        margin: 0;
                        padding: 0;
                    }

                    #thermal-label {
                        display: flex !important;
                        width: 50mm;
                        height: 25mm;
                        overflow: hidden;
                        page-break-after: avoid;
                        box-shadow: none !important;
                        border: none !important;
                    }

                    @page {
                        size: 50mm 25mm;
                        margin: 0;
                    }

                    /* Boost barcode contrast for thermal heads */
                    #thermal-label svg rect[fill="#ffffff"],
                    #thermal-label svg rect[fill="white"] {
                        fill: #ffffff !important;
                    }
                    #thermal-label svg rect[fill="#000000"],
                    #thermal-label svg rect[fill="black"] {
                        fill: #000000 !important;
                    }
                }
            `}</style>

            {/* ── Screen Preview Card ─────────────────────────────────── */}
            <div className="flex flex-col items-start gap-4">

                {/* The actual label — this is what gets printed */}
                <div id="thermal-label-print-root">
                    <div
                        id="thermal-label"
                        ref={labelRef}
                        className="flex flex-col items-center justify-between bg-white border-2 border-gray-300 rounded-lg shadow-md"
                        style={{
                            width: '189px',   /* 50mm @ 96dpi ≈ 189px */
                            height: '94px',   /* 25mm @ 96dpi ≈ 94px */
                            padding: '3px 4px',
                            fontFamily: 'monospace',
                        }}
                    >
                        {/* Brand name */}
                        <p
                            style={{
                                fontSize: '6px',
                                fontWeight: 700,
                                letterSpacing: '0.08em',
                                textTransform: 'uppercase',
                                color: '#550c72',
                                lineHeight: 1,
                                margin: 0,
                            }}
                        >
                            ✦ Pratyagra Silks ✦
                        </p>

                        {/* Saree name */}
                        <p
                            style={{
                                fontSize: '5.5px',
                                fontWeight: 600,
                                color: '#221D10',
                                textAlign: 'center',
                                lineHeight: 1.1,
                                maxWidth: '180px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                margin: 0,
                            }}
                        >
                            {productName}
                        </p>

                        {/* Barcode */}
                        <Barcode
                            value={sku}
                            width={0.9}
                            height={28}
                            fontSize={5}
                            margin={0}
                            displayValue={true}
                            textMargin={1}
                            background="#ffffff"
                            lineColor="#000000"
                            format="CODE128"
                        />

                        {/* Price */}
                        <p
                            style={{
                                fontSize: '7px',
                                fontWeight: 700,
                                color: '#D97706',
                                letterSpacing: '0.04em',
                                margin: 0,
                                lineHeight: 1,
                            }}
                        >
                            {formattedPrice}
                        </p>
                    </div>
                </div>

                {/* Print button — hidden during print */}
                <button
                    id="btn-print-label"
                    type="button"
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-light transition-colors shadow-sm print:hidden"
                >
                    <Printer className="w-4 h-4" />
                    Print Label
                </button>

                <p className="text-xs text-gray-400 print:hidden">
                    50mm × 25mm · CODE128 · Thermal label
                </p>
            </div>
        </>
    );
}
