import Link from "next/link";

// Server Component - Optimized for performance and SEO
export default function Home() {
    // Placeholder featured categories data
    const categories = [
        { id: 1, name: "Kanjivaram Silk", image: "/images/kanjivaram.jpg" },
        { id: 2, name: "Banarasi Silk", image: "/images/banarasi.jpg" },
        { id: 3, name: "Tussar Silk", image: "/images/tussar.jpg" },
        { id: 4, name: "Mysore Silk", image: "/images/mysore.jpg" },
    ];

    return (
        <div className="flex flex-col">
            {/* Hero Section - Mobile-first, high-impact */}
            <section className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-white py-20 md:py-32 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="font-playfair text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance">
                        Timeless Elegance in Every Thread
                    </h1>
                    <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-balance opacity-95">
                        Discover our curated collection of handcrafted silk sarees, where tradition meets luxury
                    </p>
                    <Link
                        href="/catalog"
                        className="inline-block bg-secondary text-primary font-semibold px-8 py-4 rounded-full text-lg hover:bg-secondary/90 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                        Explore Our Collection
                    </Link>
                </div>

                {/* Decorative element */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
            </section>

            {/* Our Ethos - SEO Content Block */}
            <section className="py-16 md:py-24 px-4 bg-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="font-playfair text-3xl md:text-5xl font-bold text-primary mb-6">
                        Our Ethos
                    </h2>
                    <div className="space-y-4 text-gray-700 leading-relaxed text-lg">
                        <p>
                            At PratyagraSilks, we believe in preserving the rich heritage of Indian handloom craftsmanship.
                            Each saree in our collection is a masterpiece, woven with dedication by skilled artisans who have
                            inherited their craft through generations.
                        </p>
                        <p>
                            We are committed to authenticity, quality, and sustainability. Every thread tells a story of
                            tradition, every pattern reflects centuries of artistic excellence, and every saree embodies
                            the timeless elegance that defines Indian culture.
                        </p>
                        <p className="font-semibold text-primary">
                            Experience luxury that honors tradition. Experience PratyagraSilks.
                        </p>
                    </div>
                </div>
            </section>

            {/* Featured Categories */}
            <section className="py-16 md:py-24 px-4 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <h2 className="font-playfair text-3xl md:text-5xl font-bold text-primary text-center mb-12">
                        Featured Collections
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                href={`/catalog?category=${category.name.toLowerCase().replace(" ", "-")}`}
                                className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                            >
                                {/* Placeholder background with gradient */}
                                <div className="aspect-[3/4] bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                                    <span className="text-primary/30 font-playfair text-2xl font-bold">
                                        {category.name}
                                    </span>
                                </div>

                                {/* Category label overlay */}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                                    <h3 className="font-playfair text-white text-xl md:text-2xl font-semibold group-hover:text-secondary transition-colors">
                                        {category.name}
                                    </h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
