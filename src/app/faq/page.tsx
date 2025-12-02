"use client";

import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlassContainer } from "@/components/GlassContainer";
import { ChevronDown, HelpCircle } from "lucide-react";
import { useState } from "react";

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqs = [
        {
            question: "How do I book a tour?",
            answer: "You can book a tour directly through our website by selecting your desired destination and clicking 'Book Now'. You'll be guided through a simple booking process where you can choose your dates, number of participants, and any additional services."
        },
        {
            question: "What is your cancellation policy?",
            answer: "We offer free cancellation up to 7 days before your tour date. Cancellations made 3-7 days before receive a 50% refund, and cancellations within 3 days are non-refundable. However, you can reschedule your tour free of charge up to 24 hours before departure."
        },
        {
            question: "Are your tours suitable for beginners?",
            answer: "Yes! We offer tours for all experience levels. Each tour listing clearly indicates the difficulty level. Our beginner-friendly tours include expert guides who will ensure your safety and comfort throughout the journey."
        },
        {
            question: "What should I bring on a tour?",
            answer: "We recommend bringing comfortable hiking shoes, sunscreen, insect repellent, a water bottle, and a change of clothes. Specific gear requirements vary by tour and will be detailed in your booking confirmation email."
        },
        {
            question: "Do you provide equipment?",
            answer: "Yes, all necessary safety equipment (helmets, harnesses, etc.) is provided. For camping tours, we provide tents and sleeping bags. You only need to bring personal items and clothing."
        },
        {
            question: "What is the maximum group size?",
            answer: "To ensure a quality experience, we limit our groups to 12-15 people depending on the tour. This allows for personalized attention from our guides and minimal environmental impact."
        },
        {
            question: "Are meals included?",
            answer: "Meal inclusions vary by tour. Day tours typically don't include meals, while multi-day tours include all meals as specified in the tour description. We can accommodate dietary restrictions with advance notice."
        },
        {
            question: "What happens in bad weather?",
            answer: "Safety is our top priority. If weather conditions are unsafe, we'll contact you to reschedule or offer a full refund. Minor rain doesn't typically affect tours, and we provide rain gear when needed."
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Navbar />

            {/* Header */}
            <section className="pt-32 pb-16 px-4">
                <div className="container mx-auto text-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-6">
                        <HelpCircle className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">
                        Frequently Asked <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Questions</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Find answers to common questions about our tours and services
                    </p>
                </div>
            </section>

            {/* FAQ Accordion */}
            <section className="px-4 pb-20">
                <div className="container mx-auto max-w-3xl">
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <GlassContainer key={index} className="overflow-hidden">
                                <button
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    className="w-full p-6 text-left flex items-center justify-between hover:bg-white/50 transition-colors"
                                >
                                    <span className="font-semibold text-lg pr-4">{faq.question}</span>
                                    <ChevronDown
                                        className={`w-5 h-5 flex-shrink-0 transition-transform ${openIndex === index ? "rotate-180" : ""
                                            }`}
                                    />
                                </button>
                                {openIndex === index && (
                                    <div className="px-6 pb-6">
                                        <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                                    </div>
                                )}
                            </GlassContainer>
                        ))}
                    </div>

                    {/* Still Have Questions */}
                    <GlassContainer className="mt-12 p-8 text-center">
                        <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
                        <p className="text-muted-foreground mb-6">
                            Can't find the answer you're looking for? Our support team is here to help.
                        </p>
                        <button className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-semibold hover:shadow-xl transition-all hover:-translate-y-1">
                            Contact Support
                        </button>
                    </GlassContainer>
                </div>
            </section>

            <Footer />
        </div>
    );
}
