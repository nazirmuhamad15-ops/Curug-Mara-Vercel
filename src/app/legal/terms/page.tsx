"use client";

import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlassContainer } from "@/components/GlassContainer";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Navbar />

            <section className="pt-32 pb-20 px-4">
                <div className="container mx-auto max-w-4xl">
                    <h1 className="text-5xl font-bold mb-6 text-center">
                        Terms & <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Conditions</span>
                    </h1>
                    <p className="text-center text-muted-foreground mb-12">Last updated: November 23, 2025</p>

                    <GlassContainer className="p-8 md:p-12">
                        <div className="prose prose-lg max-w-none">
                            <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
                            <p className="text-muted-foreground mb-6">
                                By accessing and using Adventure Curug Mara's services, you accept and agree to be bound by these Terms and Conditions.
                            </p>

                            <h2 className="text-2xl font-bold mb-4">2. Booking and Payment</h2>
                            <p className="text-muted-foreground mb-6">
                                All bookings are subject to availability. Full payment is required to confirm your booking. We accept various payment methods as indicated during checkout.
                            </p>

                            <h2 className="text-2xl font-bold mb-4">3. Cancellation Policy</h2>
                            <p className="text-muted-foreground mb-6">
                                Cancellations made 7+ days before tour: Full refund. 3-7 days before: 50% refund. Less than 3 days: No refund. Rescheduling is free up to 24 hours before departure.
                            </p>

                            <h2 className="text-2xl font-bold mb-4">4. Participant Responsibilities</h2>
                            <p className="text-muted-foreground mb-6">
                                Participants must follow guide instructions, maintain appropriate fitness levels for chosen tours, and inform us of any medical conditions that may affect participation.
                            </p>

                            <h2 className="text-2xl font-bold mb-4">5. Liability</h2>
                            <p className="text-muted-foreground mb-6">
                                While we take all reasonable precautions, adventure activities carry inherent risks. Participants assume responsibility for their own safety and well-being.
                            </p>

                            <h2 className="text-2xl font-bold mb-4">6. Changes to Terms</h2>
                            <p className="text-muted-foreground">
                                We reserve the right to modify these terms at any time. Continued use of our services constitutes acceptance of modified terms.
                            </p>
                        </div>
                    </GlassContainer>
                </div>
            </section>

            <Footer />
        </div>
    );
}
