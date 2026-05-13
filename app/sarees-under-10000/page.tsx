import { Metadata } from 'next';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { queryProductsByMaxPrice } from '@/lib/utils/product-queries';

export const metadata: Metadata = {
    title: 'Sarees Under ₹10,000 — Handloom Silk & Cotton | Kandangi Sarees',
    description: 'Shop handloom sarees under ₹10,000 — Gadwal, Venkatagiri, Mangalgiri & more. Authentic weaves, weaver-direct pricing. Explore the range.',
    keywords: [
        'sarees under 10000',
        'handloom sarees under 10000',
        'silk sarees under 10000',
        'affordable silk sarees india',
        'gadwal sarees under 10000',
        'Kandangi Sarees under 10000',
    ],
    openGraph: {
        title: 'Sarees Under ₹10,000 — Handloom Silk & Cotton | Kandangi Sarees',
        description: 'Handloom sarees under ₹10,000 — Gadwal, Venkatagiri, Mangalgiri & more. Weaver-direct pricing.',
        url: 'https://kandangisarees.com/sarees-under-10000',
        siteName: 'Kandangi Sarees',
        locale: 'en_IN',
        type: 'website',
    },
    alternates: {
        canonical: 'https://kandangisarees.com/sarees-under-10000',
    },
};

const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Handloom Sarees Under ₹10,000',
    description: 'Handloom sarees under ₹10,000 — Gadwal, Venkatagiri, Mangalgiri & more. Authentic weaves at weaver-direct prices.',
    url: 'https://kandangisarees.com/sarees-under-10000',
    provider: {
        '@type': 'Organization',
        name: 'Kandangi Sarees',
        url: 'https://kandangisarees.com',
    },
};

export default async function SareesUnder10000Page() {
    const products = await queryProductsByMaxPrice(10000);

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
                                <li className="text-white font-medium">Sarees Under ₹10,000</li>
                            </ol>
                        </nav>
                        <h1 className="text-4xl font-bold font-playfair mb-4">
                            Handloom Sarees Under ₹10,000 — Silk, Cotton & Everything Between
                        </h1>
                        <p className="text-xl text-white/80 max-w-3xl">
                            This range is where handloom silk becomes genuinely accessible. Gadwal, Mangalgiri, and Venkatagiri silks — all weaver-direct, all authentic, all under ₹10,000.
                        </p>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-12">

                    {/* Products */}
                    <section className="mb-16">
                        {products.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {products.slice(0, 12).map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg shadow-md p-12 text-center">
                                <p className="text-gray-500 text-lg mb-4">
                                    No sarees under ₹10,000 are currently listed. Check back soon.
                                </p>
                                <Link href="/collection" className="inline-block mt-4 px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors">
                                    Browse All Collections
                                </Link>
                            </div>
                        )}
                    </section>

                    {/* Content Sections */}
                    <section className="bg-white rounded-lg shadow-md p-8 mb-12">
                        <h2 className="text-3xl font-bold font-playfair text-primary mb-4">Best Silks Under ₹10,000</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Gadwal silk, Mangalgiri silk, and Venkatagiri silk are all available comfortably under ₹10,000. Each is a genuine handloom weave — not a fabric printed to look like silk, but a saree woven by hand on a traditional loom by an artisan who inherited this craft.
                        </p>
                        <Link href="/collection/gadwal-silk" className="text-accent font-medium hover:underline">
                            Explore Gadwal silk sarees →
                        </Link>
                    </section>

                    <section className="bg-white rounded-lg shadow-md p-8 mb-12">
                        <h2 className="text-3xl font-bold font-playfair text-primary mb-4">Cottons Under ₹10,000</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Premium cotton handlooms — Narayanapet with wide zari borders, Chettinad with bold checks, Mangalgiri cotton with its signature nizam border — all fall within this range and offer daily wear elegance without compromise.
                        </p>
                    </section>

                    <section className="bg-white rounded-lg shadow-md p-8 mb-12">
                        <h2 className="text-3xl font-bold font-playfair text-primary mb-4">Occasion Guide</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Gadwal and Mangalgiri silks are festival-ready. Venkatagiri silks are refined enough for weddings and formal occasions. Narayanapet cottons work beautifully for family gatherings and pujas. All handpicked.
                        </p>
                    </section>

                    <section className="bg-white rounded-lg shadow-md p-8 mb-12">
                        <h2 className="text-3xl font-bold font-playfair text-primary mb-4">Weaver-Direct Pricing Explained</h2>
                        <p className="text-gray-700 leading-relaxed">
                            When you buy from Kandangi Sarees, there is no wholesaler between you and the weaver. We visit the weavers directly, handpick each piece, and bring it to you. The cost savings from cutting out the supply chain middlemen are passed directly to you. That is how an authentic Gadwal silk saree costs under ₹10,000.
                        </p>
                    </section>

                    {/* Related Collections */}
                    <section className="bg-accent-light rounded-lg p-8 mb-12">
                        <h2 className="text-2xl font-semibold font-playfair text-primary mb-4">
                            Best Picks in This Range
                        </h2>
                        <div className="flex flex-wrap gap-3">
                            <Link href="/collection/gadwal-silk" className="inline-block px-5 py-2 bg-white border border-accent text-accent rounded-full font-medium hover:bg-accent hover:text-white transition-colors">
                                Gadwal Silk
                            </Link>
                            <Link href="/collection/mangalgiri-silk" className="inline-block px-5 py-2 bg-white border border-accent text-accent rounded-full font-medium hover:bg-accent hover:text-white transition-colors">
                                Mangalgiri Silk
                            </Link>
                            <Link href="/collection/venkatagiri-silk" className="inline-block px-5 py-2 bg-white border border-accent text-accent rounded-full font-medium hover:bg-accent hover:text-white transition-colors">
                                Venkatagiri Silk
                            </Link>
                            <Link href="/weave-guide" className="inline-block px-5 py-2 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition-colors">
                                Complete Weave Guide →
                            </Link>
                        </div>
                    </section>

                    <section className="bg-gradient-to-r from-primary to-primary-dark rounded-lg p-12 text-center text-white">
                        <h2 className="text-3xl font-bold font-playfair mb-4">Looking for a Tighter Budget?</h2>
                        <p className="text-white/80 text-lg mb-8">
                            We have a great selection of handloom sarees under ₹5,000 — cottons, Khadi, and lightweight silks.
                        </p>
                        <Link
                            href="/sarees-under-5000"
                            className="inline-block bg-secondary text-primary font-semibold px-8 py-4 rounded-full text-lg hover:bg-secondary/90 transition-all duration-300 shadow-lg"
                        >
                            Sarees Under ₹5,000
                        </Link>
                    </section>
                </div>
            </div>
        </>
    );
}
