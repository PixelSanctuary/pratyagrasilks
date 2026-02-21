import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/ui/Header";
import ConditionalFooter from "@/components/ui/ConditionalFooter";
import { CartProvider } from "@/lib/context/CartContext";
import { AuthProvider } from "@/lib/context/AuthContext";
import { WishlistProvider } from "@/lib/context/WishlistContext";
import CartSidebar from "@/components/Cart/CartSidebar";
import { Analytics } from "@vercel/analytics/react";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { Toaster } from "react-hot-toast";

// Font configurations
const playfair = Playfair_Display({
    subsets: ["latin"],
    variable: "--font-playfair",
    display: "swap",
});

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

export const metadata: Metadata = {
    title: "PratyagraSilks - Luxury Silk Sarees | Authentic Indian Handloom",
    description: "Discover exquisite handcrafted silk sarees from PratyagraSilks. Premium quality Kanjivaram, Banarasi, Tussar, and more. Traditional craftsmanship, timeless elegance for every occasion.",
    keywords: [
        "silk sarees",
        "handloom sarees",
        "luxury sarees",
        "Indian sarees",
        "traditional sarees",
        "PratyagraSilks",
        "buy silk sarees online",
        "authentic silk sarees",
        "kanjivaram silk sarees",
        "banarasi silk sarees",
        "tussar silk",
        "mysore silk",
        "handwoven sarees India",
        "premium silk sarees",
        "wedding sarees",
        "designer silk sarees",
    ],
    authors: [{ name: "PratyagraSilks" }],
    icons: {
        icon: [
            {
                url: "/favicon.svg",
                type: "image/svg+xml",
            },
            {
                url: "/icon.png",
                type: "image/png",
                sizes: "192x192",
            },
        ],
        apple: "/icon.png",
        shortcut: "/favicon.svg",
    },
    openGraph: {
        title: "PratyagraSilks - Luxury Silk Sarees",
        description: "Exquisite handcrafted silk sarees with traditional craftsmanship. Kanjivaram, Banarasi, Tussar, and more from India's finest weavers.",
        url: "https://pratyagrasilks.com",
        siteName: "PratyagraSilks",
        locale: "en_IN",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "PratyagraSilks - Luxury Silk Sarees",
        description: "Exquisite handcrafted silk sarees with traditional craftsmanship",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    verification: {
        google: "your-google-verification-code",
    },
    alternates: {
        canonical: "https://pratyagrasilks.com",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // Organization structured data for SEO
    const organizationSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'PratyagraSilks',
        url: 'https://pratyagrasilks.com',
        logo: 'https://pratyagrasilks.com/Fav_icon.png',
        description: 'Authentic handcrafted silk sarees from India\'s finest weavers. Premium quality Kanjivaram, Banarasi, Tussar, Mysore, and traditional silk sarees.',
        color: '#153DB3',
        brand: {
            '@type': 'Brand',
            name: 'PratyagraSilks',
            color: '#153DB3',
        },
        address: {
            '@type': 'PostalAddress',
            addressCountry: 'IN',
        },
    };

    return (
        <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
            <body className="antialiased hide-scrollbar">
                {/* Organization Structured Data */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
                />

                <AuthProvider>
                    <WishlistProvider>
                        <CartProvider>
                            <Header />
                            <main className="min-h-screen">{children}</main>
                            <ConditionalFooter />
                            <CartSidebar />
                        </CartProvider>
                    </WishlistProvider>
                </AuthProvider>
                <GoogleAnalytics />
                <Analytics />
                <Toaster position="top-right" />
            </body>
        </html>
    );
}

