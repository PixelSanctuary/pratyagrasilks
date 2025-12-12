import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/ui/Header";
import ConditionalFooter from "@/components/ui/ConditionalFooter";
import { CartProvider } from "@/lib/context/CartContext";
import { AuthProvider } from "@/lib/context/AuthContext";
import CartSidebar from "@/components/Cart/CartSidebar";
import { Analytics } from "@vercel/analytics/react";
import GoogleAnalytics from "@/components/GoogleAnalytics";

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
    description: "Discover exquisite handcrafted silk sarees from PratyagraSilks. Premium quality, traditional craftsmanship, and timeless elegance for every occasion.",
    keywords: ["silk sarees", "handloom sarees", "luxury sarees", "Indian sarees", "traditional sarees", "PratyagraSilks"],
    authors: [{ name: "PratyagraSilks" }],
    icons: {
        icon: "/Fav_icon.png",
    },
    openGraph: {
        title: "PratyagraSilks - Luxury Silk Sarees",
        description: "Exquisite handcrafted silk sarees with traditional craftsmanship",
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
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
            <body className="antialiased hide-scrollbar">
                <AuthProvider>
                    <CartProvider>
                        <Header />
                        <main className="min-h-screen">{children}</main>
                        <ConditionalFooter />
                        <CartSidebar />
                    </CartProvider>
                </AuthProvider>
                <GoogleAnalytics />
                <Analytics />
            </body>
        </html>
    );
}
