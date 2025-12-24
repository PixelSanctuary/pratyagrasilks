"use client";

import { useState } from "react";
import toast from 'react-hot-toast';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to submit contact form');
            }

            setSubmitted(true);
            setFormData({ name: "", email: "", subject: "", message: "" });
            setTimeout(() => setSubmitted(false), 5000);
        } catch (error) {
            console.error("Form submission error:", error);
            toast.error(error instanceof Error ? error.message : 'Failed to submit contact form. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-primary via-primary/90 to-primary2 text-white py-16 md:py-24 px-4">
                <div className="absolute inset-0 bg-[url('https://images.pixieset.com/859010601/81a0497a2dc07dd574c5b5ed8423ae49-large.jpg')] bg-no-repeat bg-cover opacity-15"></div>
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h1 className="font-playfair text-4xl md:text-6xl font-bold mb-6">
                        Get in Touch
                    </h1>
                    <p className="text-lg md:text-xl opacity-95">
                        We'd love to hear from you. Our team is here to help with any questions.
                    </p>
                </div>
            </section>

            {/* Contact Information & Form */}
            <section className="py-16 md:py-24 px-4 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Contact Information */}
                        <div>
                            <h2 className="font-playfair text-3xl font-bold text-primary mb-8">
                                Contact Information
                            </h2>

                            <div className="space-y-8">
                                <div>
                                    <h3 className="font-semibold text-lg text-gray-900 mb-2">Email</h3>
                                    <a
                                        href="mailto:info@pratyagrasilks.com"
                                        className="text-primary hover:text-primary2 text-lg transition-colors"
                                    >
                                        info@pratyagrasilks.com
                                    </a>
                                    <p className="text-textSecondary mt-2">We'll respond within 24 hours</p>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-lg text-gray-900 mb-2">Phone</h3>
                                    <a
                                        href="tel:+919876543210"
                                        className="text-primary hover:text-primary2 text-lg transition-colors"
                                    >
                                        +91 73588 66646
                                    </a>
                                    <p className="text-textSecondary mt-2">Mon-Fri: 9:00 AM - 6:00 PM IST</p>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-lg text-gray-900 mb-2">Office Address</h3>
                                    <p className="text-lg leading-relaxed">
                                        Pratyagra Silks<br />
                                        143, Karuppa Gounder Street<br />
                                        Coimbatore, Tamil Nadu 641001<br />
                                        India
                                    </p>
                                </div>

                                <div className="bg-primary/5 rounded-lg p-6">
                                    <h3 className="font-semibold text-lg text-primary mb-2">Business Hours</h3>
                                    <ul className=" space-y-1">
                                        <li><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM IST</li>
                                        <li><strong>Saturday:</strong> 10:00 AM - 4:00 PM IST</li>
                                        <li><strong>Sunday:</strong> Closed</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div>
                            <h2 className="font-playfair text-3xl font-bold text-primary mb-8">
                                Send us a Message
                            </h2>

                            {submitted && (
                                <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-4 rounded-lg">
                                    <p className="font-semibold">Thank you for your message!</p>
                                    <p>We'll get back to you as soon as possible.</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block  font-semibold mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="Your name"
                                        maxLength={34}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block  font-semibold mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="your@email.com"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block  font-semibold mb-2">
                                        Subject *
                                    </label>
                                    <select
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                                    >
                                        <option value="">Select a subject</option>
                                        <option value="product-inquiry">Product Inquiry</option>
                                        <option value="order-status">Order Status</option>
                                        <option value="return-exchange">Return/Exchange</option>
                                        <option value="shipping-delivery">Shipping & Delivery</option>
                                        <option value="general">General Inquiry</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="message" className="block  font-semibold mb-2">
                                        Message *
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={5}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="Tell us more about your inquiry..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-primary/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Sending..." : "Send Message"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 md:py-24 px-4 bg-gray-50">
                <div className="max-w-4xl mx-auto">
                    <h2 className="font-playfair text-3xl md:text-5xl font-bold text-primary text-center mb-12">
                        Frequently Asked Questions
                    </h2>

                    <div className="space-y-6">
                        <details className="bg-white rounded-lg shadow-md p-6 cursor-pointer">
                            <summary className="font-semibold text-lg text-primary">
                                How long does delivery take?
                            </summary>
                            <p className=" mt-4 leading-relaxed">
                                We typically deliver within 5-7 business days for orders within India. International orders may take 10-15 business days depending on customs clearance.
                            </p>
                        </details>

                        <details className="bg-white rounded-lg shadow-md p-6 cursor-pointer">
                            <summary className="font-semibold text-lg text-primary">
                                What's your return policy?
                            </summary>
                            <p className=" mt-4 leading-relaxed">
                                We offer a 30-day return policy for unused sarees in original condition. Check our <a href="/returns" className="text-primary hover:underline">Returns & Exchanges</a> page for more details.
                            </p>
                        </details>

                        <details className="bg-white rounded-lg shadow-md p-6 cursor-pointer">
                            <summary className="font-semibold text-lg text-primary">
                                Do you offer wholesale/bulk orders?
                            </summary>
                            <p className=" mt-4 leading-relaxed">
                                Yes! We work with boutiques, shops, and organizations. Please contact us at info@pratyagrasilks.com with your bulk requirements.
                            </p>
                        </details>

                        <details className="bg-white rounded-lg shadow-md p-6 cursor-pointer">
                            <summary className="font-semibold text-lg text-primary">
                                Are your sarees authentic?
                            </summary>
                            <p className=" mt-4 leading-relaxed">
                                Absolutely! Every saree is handwoven by master artisans. We source directly from traditional weaving communities across India and guarantee authenticity.
                            </p>
                        </details>
                    </div>
                </div>
            </section>
        </div>
    );
}
