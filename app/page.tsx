import Link from "next/link";

// Server Component - Optimized for performance and SEO
export default function Home() {
    // Placeholder featured categories data
    const categories = [
        { id: 1, name: "Kanjivaram Silk", image: "/images/kanjivaram.jpg", description: "South Indian handwoven silk sarees" },
        { id: 2, name: "Banarasi Silk", image: "/images/banarasi.jpg", description: "Classic brocade silk sarees from Varanasi" },
        { id: 3, name: "Tussar Silk", image: "/images/tussar.jpg", description: "Natural wild silk sarees with traditional patterns" },
        { id: 4, name: "Mysore Silk", image: "/images/mysore.jpg", description: "Premium pure mulberry silk sarees" },
    ];

    const benefits = [
        { title: "Authentic Craftsmanship", description: "Handwoven by skilled artisans preserving centuries-old traditions" },
        { title: "Premium Quality", description: "100% pure silk with superior weaving techniques and durability" },
        { title: "Sustainable Production", description: "Ethically sourced and produced with respect to artisans and environment" },
        { title: "Timeless Design", description: "Classic patterns that transcend trends and last generations" },
    ];

    return (
        <div className="flex flex-col">
            {/* Hero Section - Mobile-first, high-impact, SEO optimized */}
            <section className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-white py-20 md:py-32 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="font-playfair text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance leading-tight">
                        Luxury Silk Sarees | Authentic Indian Handloom Craftsmanship
                    </h1>
                    <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-balance opacity-95">
                        Discover PratyagraSilks' curated collection of handcrafted silk sarees. Each piece represents centuries of Indian artistry, tradition meets luxury, and timeless elegance for every occasion.
                    </p>
                    <Link
                        href="/collection"
                        className="inline-block bg-secondary text-primary font-semibold px-8 py-4 rounded-full text-lg hover:bg-secondary/90 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                        Explore Our Collection
                    </Link>
                </div>

                {/* Decorative element */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
            </section>

            {/* Why Choose PratyagraSilks - Trust & Credibility Section */}
            <section className="py-16 md:py-24 px-4 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <h2 className="font-playfair text-3xl md:text-5xl font-bold text-primary text-center mb-4">
                        Why Choose PratyagraSilks
                    </h2>
                    <p className="text-center text-gray-700 mb-12 max-w-2xl mx-auto text-lg">
                        Premium handwoven silk sarees from India, crafted with tradition and excellence
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
                                <h3 className="font-playfair text-xl font-bold text-primary mb-3">
                                    {benefit.title}
                                </h3>
                                <p className="text-gray-700 text-sm leading-relaxed">
                                    {benefit.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Heritage & Ethos - SEO Content Block */}
            <section className="py-16 md:py-24 px-4 bg-white">
                <div className="max-w-4xl mx-auto">
                    <h2 className="font-playfair text-3xl md:text-5xl font-bold text-primary mb-6 text-center">
                        Our Heritage & Ethos
                    </h2>
                    <div className="space-y-6 text-gray-700 leading-relaxed text-lg">
                        <p>
                            <strong>PratyagraSilks</strong> is dedicated to preserving the rich heritage of Indian handloom craftsmanship. Each silk saree in our collection is a masterpiece, meticulously woven by skilled artisans who have inherited their craft through generations. We celebrate the artistry, tradition, and cultural significance of authentic Indian textiles.
                        </p>
                        <p>
                            Our commitment to <strong>authenticity, quality, and sustainability</strong> sets us apart. We partner directly with master weavers and artisan communities across India—from the silk looms of South India producing premium Kanjivaram and Mysore silk, to the traditional weavers of Varanasi crafting exquisite Banarasi sarees. Every thread tells a story of dedication, every pattern reflects centuries of artistic excellence, and every saree embodies the timeless elegance that defines Indian culture.
                        </p>
                        <p>
                            We believe that luxury should honor tradition. When you choose a PratyagraSilks saree, you're investing in a piece of Indian heritage, supporting artisan livelihoods, and acquiring a timeless treasure that will grace generations to come.
                        </p>
                        <div className="bg-primary/5 border-l-4 border-primary p-6 mt-8">
                            <p className="font-semibold text-primary text-xl">
                                "Experience luxury that honors tradition. Experience PratyagraSilks."
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Collections */}
            <section className="py-16 md:py-24 px-4 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <h2 className="font-playfair text-3xl md:text-5xl font-bold text-primary text-center mb-4">
                        Explore Our Silk Saree Collections
                    </h2>
                    <p className="text-center text-gray-700 mb-12 max-w-2xl mx-auto text-lg">
                        Discover our handpicked range of premium silk sarees from across India
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                href={`/collection?category=${category.name.toLowerCase().replace(" ", "-")}`}
                                className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                            >
                                {/* Placeholder background with gradient */}
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

            {/* Trust & Social Proof Section */}
            <section className="py-16 md:py-24 px-4 bg-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="font-playfair text-3xl md:text-5xl font-bold text-primary mb-8">
                        Trusted by Silk Saree Enthusiasts
                    </h2>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-8">
                        <div className="text-center">
                            <p className="text-4xl font-bold text-primary">1000+</p>
                            <p className="text-gray-700 text-sm mt-2">Satisfied Customers</p>
                        </div>
                        <div className="text-center">
                            <p className="text-4xl font-bold text-primary">500+</p>
                            <p className="text-gray-700 text-sm mt-2">Premium Sarees</p>
                        </div>
                        <div className="text-center">
                            <p className="text-4xl font-bold text-primary">50+</p>
                            <p className="text-gray-700 text-sm mt-2">Artisan Partners</p>
                        </div>
                    </div>

                    <p className="text-gray-700 text-lg mb-6 max-w-2xl mx-auto">
                        Every saree is selected with meticulous care to ensure exceptional quality, authentic craftsmanship, and timeless beauty. We're committed to bringing you genuine Indian handloom excellence.
                    </p>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 md:py-24 px-4 bg-gradient-to-r from-primary to-primary/80 text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="font-playfair text-3xl md:text-5xl font-bold mb-6">
                        Begin Your Journey Into Timeless Elegance
                    </h2>
                    <p className="text-lg mb-8 opacity-95 max-w-2xl mx-auto">
                        Browse our curated collection of handwoven silk sarees. Each piece is an investment in tradition, artistry, and timeless beauty.
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
