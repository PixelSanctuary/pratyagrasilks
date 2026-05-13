import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
    getCategoryBySlug,
    generateCollectionSchema,
    generateFAQSchema,
    silkCategories,
} from '@/lib/seo-config';
import ProductCard from '@/components/ProductCard';
import { queryProductsByCategory } from '@/lib/utils/product-queries';

interface CategoryPageProps {
    params: {
        category: string;
    };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
    const category = getCategoryBySlug(params.category);

    if (!category) {
        return {
            title: 'Category Not Found',
        };
    }

    return {
        title: category.metaTitle,
        description: category.metaDescription,
        keywords: category.keywords,
        openGraph: {
            title: category.metaTitle,
            description: category.metaDescription,
            url: `https://kandangisarees.com/collection/${category.slug}`,
            siteName: 'Kandangi Sarees',
            locale: 'en_IN',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: category.metaTitle,
            description: category.metaDescription,
        },
        alternates: {
            canonical: `https://kandangisarees.com/collection/${category.slug}`,
        },
    };
}

export async function generateStaticParams() {
    return silkCategories.map((category) => ({
        category: category.slug,
    }));
}


export default async function CategoryPage({ params }: CategoryPageProps) {
    const category = getCategoryBySlug(params.category);

    if (!category) {
        notFound();
    }

    const products = await queryProductsByCategory(params.category);
    const schema = generateCollectionSchema(category);

    const faqData = category.faqs ?? [
        {
            question: `What makes ${category.name} special?`,
            answer: `${category.characteristics[0]}${category.characteristics[1] ? ` and ${category.characteristics[1].toLowerCase()}` : ''}. Handwoven in ${category.origin}, each saree represents centuries of weaving tradition.`,
        },
        {
            question: `How do I care for my ${category.name} saree?`,
            answer: `Dry cleaning is recommended for ${category.name} sarees. Store wrapped in muslin cloth in a cool, dry place away from direct sunlight.`,
        },
        {
            question: `What occasions are ${category.name} sarees suitable for?`,
            answer: `${category.name} sarees are perfect for weddings, festivals, formal events, and special celebrations. Their timeless craftsmanship makes them ideal for any occasion.`,
        },
        {
            question: `Do you offer customisation?`,
            answer: `We handpick from weavers and can help you find specific colours or designs. Contact us with your preferences on WhatsApp.`,
        },
    ];
    const faqSchema = generateFAQSchema(faqData);

    const relatedCategories = (category.relatedSlugs ?? [])
        .map((slug) => getCategoryBySlug(slug))
        .filter(Boolean) as typeof silkCategories;

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            <div className="min-h-screen">
                {/* Hero Section */}
                <div className="relative bg-gradient-to-r from-primary to-primary-dark text-white py-16 md:py-24">
                    <div className="container mx-auto px-4 relative z-10">
                        {/* Breadcrumb */}
                        <nav className="mb-6 text-sm">
                            <ol className="flex items-center space-x-2 text-white/80">
                                <li>
                                    <Link href="/" className="hover:text-white transition-colors">
                                        Home
                                    </Link>
                                </li>
                                <li>/</li>
                                <li>
                                    <Link href="/collection" className="hover:text-white transition-colors">
                                        Collection
                                    </Link>
                                </li>
                                <li>/</li>
                                <li className="text-white font-medium">{category.name}</li>
                            </ol>
                        </nav>

                        <h1 className="text-4xl font-bold font-playfair mb-4">
                            {category.h1 ?? category.name}
                        </h1>
                        <p className="text-xl md:text-2xl text-white/80 max-w-3xl">
                            {category.bodyOpener ?? category.description}
                        </p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="container mx-auto px-4 py-12">

                    {/* Products Section */}
                    <section className='mb-12'>
                        <div className="flex flex-wrap items-center justify-between mb-8">
                            <h2 className="text-3xl font-bold font-playfair text-gray-900">
                                Available {category.name} Sarees
                            </h2>
                            <Link
                                href={`/collection?category=${params.category}`}
                                className="text-accent hover:text-accent-hover font-medium flex items-center ml-auto"
                            >
                                View All
                                <svg
                                    className="w-5 h-5 ml-1"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </Link>
                        </div>

                        {products.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {products.slice(0, 8).map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg shadow-md p-12 text-center">
                                <p className="text-textSecondary text-lg mb-4">
                                    No {category.name} sarees are currently available.
                                </p>
                                <p className="text-gray-500">
                                    Check back soon or explore our other collections.
                                </p>
                                <Link
                                    href="/collection"
                                    className="inline-block mt-6 px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors"
                                >
                                    Browse All Collections
                                </Link>
                            </div>
                        )}
                    </section>

                    {/* About This Weave */}
                    <section className="bg-white rounded-lg shadow-md p-8 mb-12">
                        <h2 className="text-3xl font-bold font-playfair text-primary mb-6">
                            About {category.name}
                        </h2>
                        <p className="text-lg text-gray-700 leading-relaxed mb-6">
                            {category.longDescription}
                        </p>

                        <div className="grid md:grid-cols-2 gap-8 mt-8">
                            <div className="bg-accent-light rounded-lg p-6">
                                <h3 className="text-xl font-semibold text-primary mb-3">Origin</h3>
                                <p className="text-gray-700">{category.origin}</p>
                            </div>

                            <div className="bg-accent-light rounded-lg p-6">
                                <h3 className="text-xl font-semibold text-primary mb-3">Price Range</h3>
                                <p className="text-gray-700 text-2xl font-bold">{category.priceRange}</p>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h3 className="text-xl font-semibold text-primary mb-4">Key Characteristics</h3>
                            <ul className="grid md:grid-cols-2 gap-3">
                                {category.characteristics.map((char, index) => (
                                    <li key={index} className="flex items-start">
                                        <svg
                                            className="w-6 h-6 text-accent mr-3 flex-shrink-0 mt-0.5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        <span className="text-gray-700">{char}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>

                    {/* FAQ Section */}
                    <section className="mt-12 bg-white rounded-lg shadow-md p-8">
                        <h2 className="text-3xl font-bold font-playfair text-primary mb-8">
                            Frequently Asked Questions
                        </h2>
                        <div className="space-y-6">
                            {faqData.map((faq, index) => (
                                <div key={index}>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        {faq.question}
                                    </h3>
                                    <p className="text-gray-700">{faq.answer}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Related Collections */}
                    {relatedCategories.length > 0 && (
                        <section className="mt-12 bg-accent-light rounded-lg p-8">
                            <h2 className="text-2xl font-semibold font-playfair text-primary mb-4">
                                Related Collections
                            </h2>
                            <div className="flex flex-wrap gap-3">
                                {relatedCategories.map((rel) => (
                                    <Link
                                        key={rel.slug}
                                        href={`/collection/${rel.slug}`}
                                        className="inline-block px-5 py-2 bg-white border border-accent text-accent rounded-full font-medium hover:bg-accent hover:text-white transition-colors"
                                    >
                                        {rel.name}
                                    </Link>
                                ))}
                                <Link
                                    href="/weave-guide"
                                    className="inline-block px-5 py-2 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition-colors"
                                >
                                    Complete Weave Guide →
                                </Link>
                            </div>
                        </section>
                    )}

                    {/* CTA Section */}
                    <section className="mt-12 bg-gradient-to-r from-primary to-primary-dark rounded-lg p-12 text-center text-white">
                        <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-4">
                            Explore More Weave Collections
                        </h2>
                        <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                            Discover our curated handlooms — silks and cottons — handpicked from weavers across India
                        </p>
                        <Link
                            href="/collection"
                            className="inline-block bg-secondary text-primary font-semibold px-8 py-4 rounded-full text-lg hover:bg-secondary/90 transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                            Browse All Collections
                        </Link>
                    </section>
                </div>
            </div>
        </>
    );
}
