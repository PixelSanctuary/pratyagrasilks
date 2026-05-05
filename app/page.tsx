import Link from "next/link";
import NewArrivals from "@/components/home/NewArrivals";

// Server Component - Optimized for performance and SEO
export default function Home() {
    // Kandangi Sarees featured weave categories — links to /silk/[slug]
    const categories = [
        { id: 1, slug: "kanjivaram-silk", name: "Kanjivaram Silk", description: "Pure mulberry silk with temple borders — the gold standard of South Indian weaving." },
        { id: 2, slug: "gadwal-silk", name: "Gadwal Silk", description: "Cotton body, silk border — the perfect everyday elegance from Telangana." },
        { id: 3, slug: "chettinad-cotton", name: "Chettinad Cotton", description: "Bold checks, vibrant colours, a durable weave that only gets better with wear." },
        { id: 4, slug: "venkatagiri-silk", name: "Venkatagiri Silk", description: "Feather-light weave with delicate jamdani motifs from Andhra Pradesh." },
        { id: 5, slug: "patola-silk", name: "Patola Silk", description: "Double ikat from Patan — one of India's most revered textile traditions." },
        { id: 6, slug: "narayanapet-cotton", name: "Narayanapet Cotton", description: "Wide zari borders on sturdy cotton — from festivals to family gatherings." },
        { id: 7, slug: "pen-kalamkari", name: "Pen Kalamkari", description: "Hand-painted with bamboo pen and natural dyes — each piece genuinely one-of-a-kind." },
        { id: 8, slug: "mangalgiri-cotton", name: "Mangalgiri", description: "Nizam border on crisp cotton — a daily-wear saree that still looks considered." },
    ];

    const benefits = [
        { title: "Weaver-Direct Sourcing", description: "Every saree comes straight from the loom — no middlemen, no compromise." },
        { title: "Curated for Real Women", description: "We handpick every piece for wearability, beauty, and true value." },
        { title: "Rooted in Heritage", description: "Our weaves support artisan communities and preserve living traditions." },
        { title: "Warmth in Every Thread", description: "From everyday cottons to bridal silks — we simplify the search so you find what suits you." },
    ];

    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative py-20 md:py-32 px-4 text-white overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary-light opacity-90"></div>
                <div className="absolute inset-0 bg-[url('https://images.pixieset.com/859010601/ab207e7a5cbdc26b65405f930546fb35-large.jpg')] bg-no-repeat bg-cover opacity-15"></div>
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <h1 className="font-playfair text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance leading-tight drop-shadow-lg">
                        Handpicked for You, Rooted in Tradition.
                    </h1>
                    <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-balance opacity-95 drop-shadow">
                        Your trusted guide to authentic handloom sarees — curated from the hands that weave them, delivered to women who value what&apos;s real.
                    </p>
                    <Link
                        href="/collection"
                        className="inline-block bg-secondary text-primary font-semibold px-8 py-4 rounded-full text-lg hover:bg-secondary/90 transition-all duration-300 transform hover:scale-105 shadow-xl"
                    >
                        Explore Our Collection
                    </Link>
                </div>

                {/* Decorative fade */}
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent z-10"></div>
            </section>

            {/* New Arrivals — "Fresh from the Loom" */}
            <NewArrivals />

            {/* Why Choose Kandangi Sarees */}
            <section className="py-16 md:py-24 px-4">
                <div className="max-w-7xl mx-auto">
                    <h2 className="font-playfair text-3xl md:text-5xl font-bold text-primary text-center mb-4">
                        Why Kandangi Sarees
                    </h2>
                    <p className="text-center mb-12 max-w-2xl mx-auto text-lg">
                        We don&apos;t just sell sarees. We handpick every piece, stand behind every thread, and guide you to a weave that&apos;s genuinely right for you.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
                                <h3 className="font-playfair text-xl font-bold text-primary mb-3">
                                    {benefit.title}
                                </h3>
                                <p className="text-sm leading-relaxed">
                                    {benefit.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Collections */}
            <section className="p-4">
                <div className="max-w-7xl mx-auto">
                    <h2 className="font-playfair text-3xl md:text-5xl font-bold text-primary text-center mb-4">
                        Explore Our Weaves
                    </h2>
                    <p className="text-center mb-12 max-w-2xl mx-auto text-lg">
                        Handpicked silks and cottons from across India — each one chosen for a reason.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                href={`/silk/${category.slug}`}
                                className="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                                {/* Gradient background placeholder — images to be added in Phase 2 */}
                                <div className="aspect-[3/4] bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                                    <span className="text-primary/30 font-playfair text-2xl font-bold text-center px-4">
                                        {category.name}
                                    </span>
                                </div>

                                {/* Category label overlay */}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                                    <h3 className="font-playfair text-white text-xl md:text-2xl font-semibold group-hover:text-secondary transition-colors mb-2">
                                        {category.name}
                                    </h3>
                                    <p className="text-white/80 text-sm">
                                        {category.description}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Story */}
            <section className="py-16 md:py-24 px-4">
                <div className="max-w-4xl mx-auto">
                    <h2 className="font-playfair text-3xl md:text-5xl font-bold text-primary mb-6 text-center">
                        Handpicked for You, Rooted in Tradition.
                    </h2>
                    <div className="space-y-6 leading-relaxed text-lg">
                        <p>
                            <strong>Kandangi Sarees</strong> was built for women who know what they want in a saree — but don&apos;t always have the time or the right guide to find it. We handpick every weave directly from artisan communities across Tamil Nadu, Andhra Pradesh, Telangana, and Gujarat. No middlemen. No compromise.
                        </p>
                        <p>
                            From the bold checks of a Chettinad cotton to the precise double-ikat of a Patola, every saree in our collection has been chosen for its <strong>authenticity, wearability, and honest craft</strong>. We believe the best sarees aren&apos;t the most expensive ones — they&apos;re the ones that feel right from the moment you wear them.
                        </p>
                        <p>
                            When you buy from Kandangi Sarees, you&apos;re not just buying a saree. You&apos;re supporting the weaver behind the loom, the family behind the craft, and the tradition that has survived for generations because women like you chose to keep it alive.
                        </p>
                        <div className="bg-primary/5 border-l-4 border-primary p-6 mt-8">
                            <p className="font-semibold text-primary text-xl">
                                &ldquo;Handpicked Weaves. Trusted Guidance. Real Wardrobes. That&apos;s the Kandangi Sarees promise.&rdquo;
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials — kept disabled per Phase 1 scope */}
            {false && <section className="py-16 md:py-24 px-4 bg-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="font-playfair text-3xl md:text-5xl font-bold text-primary mb-8">
                        Trusted by Saree Lovers
                    </h2>
                </div>
            </section>}

            {/* CTA Section */}
            <section className="py-16 md:py-24 px-4 bg-gradient-to-r from-primary to-primary-light text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="font-playfair text-3xl md:text-5xl font-bold mb-6">
                        Pick Your Saree Effortlessly.
                    </h2>
                    <p className="text-lg mb-8 opacity-95 max-w-2xl mx-auto">
                        Browse our curated collection of authentic handlooms across silk and cotton. Handpicked from weavers. Made for you.
                    </p>
                    <Link
                        href="/collection"
                        className="inline-block bg-secondary text-primary font-semibold px-8 py-4 rounded-full text-lg hover:bg-secondary/90 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                        Shop Now
                    </Link>
                </div>
            </section>
        </div>
    );
}
