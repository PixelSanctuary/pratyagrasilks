import { Metadata } from 'next';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { queryProductsByCategory } from '@/lib/utils/product-queries';

export const metadata: Metadata = {
    title: 'Handloom Sarees for Daily Wear | Comfortable & Authentic | Kandangi Sarees',
    description: 'Discover handloom sarees perfect for daily wear — Chettinad cotton, Mangalgiri cotton & Venkatagiri cotton. Breathable, authentic, and handpicked from weavers.',
    keywords: [
        'handloom sarees for daily wear',
        'daily wear handloom sarees',
        'comfortable handloom sarees',
        'chettinad cotton daily wear',
        'mangalgiri cotton daily wear',
        'affordable handloom sarees',
        'Kandangi Sarees daily wear',
    ],
    openGraph: {
        title: 'Handloom Sarees for Daily Wear | Kandangi Sarees',
        description: 'Breathable, authentic handloom sarees for every day — Chettinad cotton, Mangalgiri cotton & Venkatagiri cotton, handpicked from weavers.',
        url: 'https://kandangisarees.com/handloom-sarees-daily-wear',
        siteName: 'Kandangi Sarees',
        locale: 'en_IN',
        type: 'website',
    },
    alternates: {
        canonical: 'https://kandangisarees.com/handloom-sarees-daily-wear',
    },
};

const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Handloom Sarees for Daily Wear',
    description: 'Breathable, authentic handloom sarees for everyday wear — Chettinad cotton, Mangalgiri cotton & Venkatagiri cotton.',
    url: 'https://kandangisarees.com/handloom-sarees-daily-wear',
    provider: {
        '@type': 'Organization',
        name: 'Kandangi Sarees',
        url: 'https://kandangisarees.com',
    },
};

const dailyWearCategories = [
    {
        slug: 'chettinad-cotton',
        displayName: 'Chettinad Cotton',
        why: 'Bold checks, vibrant colour, and a weave that gets softer with every wash. Chettinad cotton is one of the most wearable handlooms in India — easy to drape, easy to carry all day.',
    },
    {
        slug: 'mangalgiri-cotton',
        displayName: 'Mangalgiri Cotton',
        why: 'The nizam border gives Mangalgiri cotton a polished look without any effort. The double-warp construction keeps it crisp through a full day. Works as well in the office as it does at home.',
    },
    {
        slug: 'venkatagiri-cotton',
        displayName: 'Venkatagiri Cotton',
        why: 'Ultra-fine weave, feather-light drape, and delicate jamdani motifs. Venkatagiri cotton is the daily-wear choice for women who want the elegance of a handloom without any heaviness.',
    },
];

export default async function HandloomDailyWearPage() {
    const results = await Promise.all(
        dailyWearCategories.map((cat) => queryProductsByCategory(cat.slug))
    );
    const categoryProducts = Object.fromEntries(
        dailyWearCategories.map((cat, i) => [cat.slug, results[i].slice(0, 4)])
    );

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
            />

            <div className="min-h-screen">
                {/* Hero */}
                <div className="bg-gradient-to-r from-primary to-primary-dark text-white py-16 md:py-24">
                    <div className="container mx-auto px-4">
                        <nav className="mb-6 text-sm">
                            <ol className="flex items-center space-x-2 text-white/80">
                                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                                <li>/</li>
                                <li className="text-white font-medium">Handloom Sarees for Daily Wear</li>
                            </ol>
                        </nav>
                        <h1 className="text-4xl font-bold font-playfair mb-4">
                            Handloom Sarees for Daily Wear — Authentic, Breathable, Handpicked
                        </h1>
                        <p className="text-xl text-white/80 max-w-3xl">
                            Not every handloom saree is meant for weddings. The best daily wear sarees are lightweight, easy to drape, and comfortable enough to wear all day — without looking like you settled for something less.
                        </p>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-12">

                    {/* Category sections */}
                    {dailyWearCategories.map((cat) => {
                        const products = categoryProducts[cat.slug] ?? [];
                        return (
                            <section key={cat.slug} className="mb-16">
                                <div className="flex flex-wrap items-center justify-between mb-6">
                                    <h2 className="text-3xl font-bold font-playfair text-primary">
                                        {cat.displayName}
                                    </h2>
                                    <Link
                                        href={`/collection/${cat.slug}`}
                                        className="text-accent hover:text-accent-hover font-medium flex items-center"
                                    >
                                        View full collection
                                        <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>
                                <p className="text-gray-700 leading-relaxed mb-6 max-w-3xl">{cat.why}</p>
                                {products.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {products.map((product) => (
                                            <ProductCard key={product.id} product={product} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                                        <p className="text-gray-500 mb-4">No {cat.displayName} sarees currently available.</p>
                                        <Link href={`/collection/${cat.slug}`} className="text-accent font-medium hover:underline">
                                            Check back soon →
                                        </Link>
                                    </div>
                                )}
                            </section>
                        );
                    })}

                    {/* Why cotton for daily wear */}
                    <section className="bg-white rounded-lg shadow-md p-8 mb-12">
                        <h2 className="text-2xl font-bold font-playfair text-primary mb-4">
                            Why Handloom Cotton for Daily Wear?
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Cotton handlooms breathe. Silk retains heat. For a full working day in India — especially in the south — a well-woven cotton saree is more comfortable than any silk. And a handloom cotton is more beautiful than any mill-made alternative.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                            The Chettinad, Mangalgiri, and Venkatagiri cotton weaves we carry are specifically chosen for their suitability for daily wear — lightweight, well-structured, and drape easily without constant readjustment.
                        </p>
                    </section>

                    {/* Related links */}
                    <section className="bg-accent-light rounded-lg p-8 mb-12">
                        <h2 className="text-2xl font-semibold font-playfair text-primary mb-4">
                            Also Worth Exploring
                        </h2>
                        <div className="flex flex-wrap gap-3">
                            <Link href="/sarees-under-5000" className="inline-block px-5 py-2 bg-white border border-accent text-accent rounded-full font-medium hover:bg-accent hover:text-white transition-colors">
                                Sarees Under ₹5,000
                            </Link>
                            <Link href="/weave-guide" className="inline-block px-5 py-2 bg-white border border-accent text-accent rounded-full font-medium hover:bg-accent hover:text-white transition-colors">
                                Weave Guide
                            </Link>
                            <Link href="/collection" className="inline-block px-5 py-2 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition-colors">
                                Browse All Collections →
                            </Link>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
