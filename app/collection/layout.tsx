import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Handloom Saree Collection | Silks & Cottons | Kandangi Sarees',
    description: 'Browse handpicked handloom sarees — Kanjivaram, Gadwal, Chettinad, Venkatagiri, Khadi & more. Authentic weaves sourced directly from weavers across India.',
    keywords: [
        'handloom sarees collection',
        'buy handloom sarees online',
        'handwoven sarees india',
        'kanjivaram sarees',
        'gadwal silk sarees',
        'chettinad cotton sarees',
        'tussar silk',
        'indian handloom sarees',
        'authentic sarees from weavers',
        'traditional handloom sarees',
    ],
    openGraph: {
        title: 'Handloom Saree Collection | Kandangi Sarees',
        description: 'Handpicked handloom sarees from weavers across India — silks, cottons, and everything between.',
        url: 'https://kandangisarees.com/collection',
        siteName: 'Kandangi Sarees',
        locale: 'en_IN',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Handloom Saree Collection | Kandangi Sarees',
        description: 'Handpicked handloom sarees from weavers across India — silks, cottons, and everything between.',
    },
    alternates: {
        canonical: 'https://kandangisarees.com/collection',
    },
};

export default function CollectionLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
