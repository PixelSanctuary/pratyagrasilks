import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Our Story — Kandangi Sarees",
    description: "Learn why we started Kandangi Sarees — to simplify saree shopping by handpicking the finest handlooms from weavers across India. Discover our commitment to authentic weaves and artisan communities.",
    keywords: ["about Kandangi Sarees", "handloom sarees", "weaver-direct sarees", "artisan support", "authentic sarees"],
};

export default function AboutPage() {
    const values = [
        {
            title: "Authenticity",
            description: "Every piece is sourced directly from the weaver — hand-verified, real.",
        },
        {
            title: "Quality",
            description: "Handpicked for wearability, longevity, and the beauty that only comes from handloom.",
        },
        {
            title: "Sustainability",
            description: "Fair wages, weaver dignity, and practices that let tradition flourish for generations.",
        },
        {
            title: "Tradition",
            description: "From Kanjivaram silks to Chettinad cottons — we carry living heritage, not just fabric.",
        },
    ];

    const origins = [
        {
            name: "Kanjivaram, Tamil Nadu",
            description: "Home to the legendary Kanjivaram silk sarees — pure mulberry silk with temple borders woven by families who have passed this craft down for centuries.",
            silks: ["Kanjivaram Silk"],
            slug: "kanjivaram-silk"
        },
        {
            name: "Gadwal, Telangana",
            description: "The weaving town that perfected the combination of cotton body with silk border — Gadwal sarees are light, graceful, and built for everyday elegance.",
            silks: ["Gadwal Silk"],
            slug: "gadwal-silk"
        },
        {
            name: "Venkatagiri, Andhra Pradesh",
            description: "Famous for its ultra-fine weave and delicate jamdani motifs — Venkatagiri produces both silk and cotton sarees that are among the lightest handlooms in India.",
            silks: ["Venkatagiri Silk", "Venkatagiri Cotton"],
            slug: "venkatagiri-silk"
        },
        {
            name: "Mangalgiri, Andhra Pradesh",
            description: "Known for the distinctive nizam border and the crisp double-warp Gachi weave — Mangalgiri sarees are a staple of the Andhra handloom tradition.",
            silks: ["Mangalgiri Silk", "Mangalgiri"],
            slug: "mangalgiri-silk"
        },
        {
            name: "patola, Gujarat",
            description: "Patan produces the legendary Patola — a double-ikat saree of extraordinary technical precision that can take months to complete.",
            silks: ["Patola Silk"],
            slug: "patola-silk"
        },
        {
            name: "Chettinad, Tamil Nadu",
            description: "The bold checks and vibrant contrasting colours of Chettinad cotton sarees are instantly recognisable — a weave with real character that gets better with every wash.",
            silks: ["Chettinad Cotton"],
            slug: "chettinad-cotton"
        },
        {
            name: "Narayanapet, Telangana",
            description: "Wide zari borders on a sturdy cotton body — Narayanapet sarees carry both formal polish and everyday comfort in equal measure.",
            silks: ["Narayanapet Cotton"],
            slug: "narayanapet-cotton"
        },
    ];

    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-primary via-primary/90 to-primary-light text-white py-16 md:py-24 px-4">
                <div className="absolute inset-0 bg-[url('https://images.pixieset.com/859010601/d7c3222457a03fa54d40c17b0f874229-large.jpg')] bg-no-repeat bg-cover opacity-15"></div>
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h1 className="font-playfair text-4xl md:text-6xl font-bold mb-6">
                        Why We Started Kandangi Sarees
                    </h1>
                    <p className="text-lg md:text-xl opacity-95 max-w-2xl mx-auto">
                        To simplify saree shopping by curating the finest handlooms, so every woman finds what truly suits her — effortlessly. We nurture the roots of tradition by bringing authentic, handpicked weaves to modern wardrobes.
                    </p>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-16 md:py-24 px-4 bg-white">
                <div className="max-w-4xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 mb-12">
                        <div>
                            <h2 className="font-playfair text-3xl font-bold text-primary mb-4">
                                Our Mission
                            </h2>
                            <p className="text-lg leading-relaxed mb-4">
                                To simplify saree shopping by curating the finest handlooms, so every woman finds what truly suits her — effortlessly. We nurture the roots of tradition by bringing authentic, handpicked weaves to modern wardrobes.
                            </p>
                            <p className="text-lg leading-relaxed">
                                We work directly with weavers and artisan cooperatives across Tamil Nadu, Andhra Pradesh, Telangana, and Gujarat — ensuring every saree we carry is genuine, every artisan we work with is paid fairly, and every customer we serve gets exactly what they came for.
                            </p>
                        </div>
                        <div>
                            <h2 className="font-playfair text-3xl font-bold text-primary mb-4">
                                Our Vision
                            </h2>
                            <p className="text-lg leading-relaxed mb-4">
                                We envision Kandangi Sarees as your most trusted saree companion — where every weave is handpicked, every recommendation feels personal, and every purchase honors the artisan behind the loom.
                            </p>
                            <p className="text-lg leading-relaxed">
                                We are building a space where the handloom tradition doesn&apos;t just survive — it thrives. Where weavers are valued partners, not anonymous suppliers. And where every woman who buys a saree from us feels the warmth of that connection.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="py-16 md:py-24 px-4">
                <div className="max-w-7xl mx-auto">
                    <h2 className="font-playfair text-3xl md:text-5xl font-bold text-primary text-center mb-12">
                        What We Stand For
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="font-playfair text-xl font-bold text-primary mb-3">
                                    {value.title}
                                </h3>
                                <p className="text-sm leading-relaxed">
                                    {value.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Weaving Regions */}
            <section className="py-16 md:py-24 px-4 bg-white">
                <div className="max-w-7xl mx-auto">
                    <h2 className="font-playfair text-3xl md:text-5xl font-bold text-primary text-center mb-4">
                        Where We Source From
                    </h2>
                    <p className="text-center mb-12 max-w-2xl mx-auto text-lg">
                        We work directly with weaving communities in these regions — not through middlemen.
                    </p>

                    <div className="space-y-12">
                        {origins.map((origin, index) => (
                            <div key={index} className="flex flex-col md:flex-row gap-8 items-start">
                                <div className="md:w-1/2">
                                    <h3 className="font-playfair text-2xl font-bold text-primary mb-3">
                                        {origin.name}
                                    </h3>
                                    <p className="text-lg leading-relaxed mb-4">
                                        {origin.description}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {origin.silks.map((silk, idx) => (
                                            <span key={idx} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                                                {silk}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <Link
                                    href={`/silk/${origin.slug}`}
                                    className="w-full md:w-1/2 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg p-8 h-64 flex flex-col items-center justify-center group hover:from-primary/30 hover:to-primary/20 transition-all duration-300 hover:shadow-xl cursor-pointer border-2 border-transparent hover:border-primary/30"
                                >
                                    <div className="text-center">
                                        <div className="inline-flex items-center text-primary/50 group-hover:text-primary/80 font-semibold transition-all">
                                            <span>Explore weaves from</span>
                                        </div>
                                        <p className="text-primary/50 font-playfair text-3xl font-bold mt-1 group-hover:text-primary/80 transition-colors">
                                            {origin.name.split(",")[0]}
                                        </p>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Artisan Partnership */}
            <section className="py-16 md:py-24 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="font-playfair text-3xl md:text-5xl font-bold text-primary mb-6">
                        Supporting Weaver Communities
                    </h2>
                    <p className="text-lg leading-relaxed mb-8">
                        Every purchase at Kandangi Sarees goes directly back to the weaver. We believe in fair wages, transparent partnerships, and practices that make it possible for artisan families to continue their craft — not just survive, but thrive.
                    </p>
                    <p className="text-lg leading-relaxed mb-8">
                        When you buy a saree from us, you are not just making a purchase. You are choosing to keep a living tradition alive — and that choice matters.
                    </p>
                    <div className="bg-primary/5 border-l-4 border-primary p-6 text-left">
                        <p className="text-primary font-semibold text-lg">
                            &ldquo;Handpicked Weaves. Trusted Guidance. Real Wardrobes. That&apos;s the Kandangi Sarees promise.&rdquo;
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 md:py-24 px-4 bg-gradient-to-r from-primary to-primary-light text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="font-playfair text-3xl md:text-5xl font-bold mb-6">
                        Explore Our Collections
                    </h2>
                    <p className="text-lg mb-8 opacity-95 max-w-2xl mx-auto">
                        Authentic handloom sarees from weavers across India — handpicked for you.
                    </p>
                    <Link
                        href="/collection"
                        className="inline-block bg-secondary text-primary font-semibold px-8 py-4 rounded-full text-lg hover:bg-secondary/90 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                        Browse Collection
                    </Link>
                </div>
            </section>
        </div>
    );
}
