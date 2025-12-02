"use client";

import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlassContainer } from "@/components/GlassContainer";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Navbar />

            <section className="pt-32 pb-20 px-4">
                <div className="container mx-auto max-w-4xl">
                    <h1 className="text-5xl font-bold mb-6 text-center">
                        Privacy <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Policy</span>
                    </h1>
                    <p className="text-center text-muted-foreground mb-12">Last updated: November 23, 2025</p>

                    <GlassContainer className="p-8 md:p-12">
                        <div className="prose prose-lg max-w-none">
                            <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
                            <p className="text-muted-foreground mb-6">
                                We collect information you provide directly to us when you create an account, make a booking, or contact us. This includes your name, email address, phone number, and payment information.
                            </p>

                            <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
                            <p className="text-muted-foreground mb-6">
                                We use the information we collect to process your bookings, communicate with you about your tours, send you updates and promotional materials (with your consent), and improve our services.
                            </p>

                            <h2 className="text-2xl font-bold mb-4">3. Information Sharing</h2>
                            <p className="text-muted-foreground mb-6">
                                We do not sell your personal information. We may share your information with service providers who help us operate our business, such as payment processors and email service providers.
                            </p>

                            <h2 className="text-2xl font-bold mb-4">4. Data Security</h2>
                            <p className="text-muted-foreground mb-6">
                                We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.
                            </p>

                            <h2 className="text-2xl font-bold mb-4">5. Your Rights</h2>
                            <p className="text-muted-foreground mb-6">
                                You have the right to access, update, or delete your personal information. Contact us at privacy@curugmara.com to exercise these rights.
                            </p>

                            <h2 className="text-2xl font-bold mb-4">6. Contact Us</h2>
                            <p className="text-muted-foreground">
                                If you have questions about this Privacy Policy, please contact us at info@curugmara.com.
                            </p>
                        </div>
                    </GlassContainer>
                </div>
            </section>

            <Footer />
        </div>
    );
}
