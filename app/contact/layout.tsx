import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact PratyagraSilks | Customer Support & Inquiries",
    description: "Get in touch with PratyagraSilks. We're here to help with product inquiries, orders, and customer support. Contact us via email or phone.",
    keywords: ["contact pratyagrasilks", "customer support", "product inquiries", "shipping info"],
};

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
