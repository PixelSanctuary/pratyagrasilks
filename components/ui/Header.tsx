"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { useRouter } from "next/navigation";
import CartBadge from "@/components/Cart/CartBadge";
import { User, LogOut, Package, Heart } from "lucide-react";

export default function Header() {
    const { user, signOut } = useAuth();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const handleSignOut = async () => {
        await signOut();
        setIsUserMenuOpen(false);
        router.push('/');
    };

    return (
        <header className="sticky top-0 z-50 bg-white shadow-md">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 md:h-20">
                    {/* Logo/Brand */}
                    <Link href="/" className="flex items-center">
                        <span className="font-playfair text-2xl md:text-3xl font-bold text-primary">
                            Pratyagra Silks
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link
                            href="/collection"
                            className="hover:text-primary transition-colors font-medium"
                        >
                            Collection
                        </Link>
                        <Link
                            href="/about"
                            className="hover:text-primary transition-colors font-medium"
                        >
                            About
                        </Link>
                        <Link
                            href="/contact"
                            className="hover:text-primary transition-colors font-medium"
                        >
                            Contact
                        </Link>

                        {/* Cart Icon */}
                        <CartBadge />

                        {/* Auth Buttons / User Menu */}
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <User className="w-5 h-5" />
                                    <span className="font-medium">{user.user_metadata?.full_name || 'Account'}</span>
                                </button>

                                {/* Dropdown Menu */}
                                {isUserMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-200">
                                        <Link
                                            href="/profile"
                                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition-colors"
                                            onClick={() => setIsUserMenuOpen(false)}
                                        >
                                            <User className="w-4 h-4" />
                                            Profile
                                        </Link>
                                        <Link
                                            href="/orders"
                                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition-colors"
                                            onClick={() => setIsUserMenuOpen(false)}
                                        >
                                            <Package className="w-4 h-4" />
                                            Orders
                                        </Link>
                                        <Link
                                            href="/wishlist"
                                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition-colors"
                                            onClick={() => setIsUserMenuOpen(false)}
                                        >
                                            <Heart className="w-4 h-4" />
                                            Wishlist
                                        </Link>
                                        <button
                                            onClick={handleSignOut}
                                            className="w-full flex items-center gap-2 px-4 py-2 hover:bg-red-50 text-red-600 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/auth/login"
                                    className="text-gray-700 hover:text-primary transition-colors font-medium"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/auth/signup"
                                    className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary2 transition-colors"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button & Cart */}
                    <div className="flex md:hidden items-center space-x-4">
                        {/* Mobile Cart Icon */}
                        <CartBadge />

                        {/* Hamburger Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary rounded-md p-2"
                            aria-label="Toggle mobile menu"
                        >
                            {isMobileMenuOpen ? (
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
                {isMobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-200">
                        <div className="flex flex-col space-y-4">
                            <Link
                                href="/collection"
                                className="hover:text-primary transition-colors font-medium px-2 py-2"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Collection
                            </Link>
                            <Link
                                href="/about"
                                className="hover:text-primary transition-colors font-medium px-2 py-2"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                About
                            </Link>
                            <Link
                                href="/contact"
                                className="hover:text-primary transition-colors font-medium px-2 py-2"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Contact
                            </Link>

                            {user ? (
                                <>
                                    <Link
                                        href="/profile"
                                        className="hover:text-primary transition-colors font-medium px-2 py-2"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Profile
                                    </Link>
                                    <Link
                                        href="/orders"
                                        className="hover:text-primary transition-colors font-medium px-2 py-2"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Orders
                                    </Link>
                                    <Link
                                        href="/wishlist"
                                        className="hover:text-primary transition-colors font-medium px-2 py-2"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Wishlist
                                    </Link>
                                    <button
                                        onClick={handleSignOut}
                                        className="text-left text-red-600 hover:text-red-700 transition-colors font-medium px-2 py-2"
                                    >
                                        Sign Out
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/auth/login"
                                        className="hover:text-primary transition-colors font-medium px-2 py-2"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/auth/signup"
                                        className="bg-primary text-white text-center py-2 rounded-lg font-medium hover:bg-primary2 transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}
