"use client"; // Client Component for interactivity

import { useState } from "react";
import Link from "next/link";
import CartBadge from "@/components/Cart/CartBadge";

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <header className="sticky top-0 z-50 bg-white shadow-md">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 md:h-20">
                    {/* Logo/Brand */}
                    <Link href="/" className="flex items-center">
                        <span className="font-playfair text-2xl md:text-3xl font-bold text-primary">
                            PratyagraSilks
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link
                            href="/collection"
                            className="text-gray-700 hover:text-primary transition-colors font-medium"
                        >
                            Collection
                        </Link>
                        <Link
                            href="/about"
                            className="text-gray-700 hover:text-primary transition-colors font-medium"
                        >
                            About
                        </Link>
                        <Link
                            href="/contact"
                            className="text-gray-700 hover:text-primary transition-colors font-medium"
                        >
                            Contact
                        </Link>

                        {/* Cart Icon */}
                        <CartBadge />
                    </div>

                    {/* Mobile Menu Button & Cart */}
                    <div className="flex md:hidden items-center space-x-4">
                        {/* Mobile Cart Icon */}
                        <CartBadge />

                        {/* Hamburger Menu Button */}
                        <button
                            onClick={toggleMobileMenu}
                            className="text-gray-700 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary rounded-md p-2"
                            aria-label="Toggle mobile menu"
                        >
                            {mobileMenuOpen ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Drawer */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-200">
                        <div className="flex flex-col space-y-4">
                            <Link
                                href="/collection"
                                className="text-gray-700 hover:text-primary transition-colors font-medium px-2 py-2"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Collection
                            </Link>
                            <Link
                                href="/about"
                                className="text-gray-700 hover:text-primary transition-colors font-medium px-2 py-2"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                About
                            </Link>
                            <Link
                                href="/contact"
                                className="text-gray-700 hover:text-primary transition-colors font-medium px-2 py-2"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Contact
                            </Link>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}
