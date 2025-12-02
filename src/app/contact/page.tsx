"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Mail, Phone, MapPin } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";

export default function ContactPage() {
    const [infoContent, setInfoContent] = useState<any>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                // Fetch from our new dynamic API route
                const res = await fetch("/api/content/contact", {
                    cache: "no-store", // Ensure browser doesn't cache this request
                    headers: {
                        "Pragma": "no-cache",
                        "Cache-Control": "no-cache"
                    }
                });
                const data = await res.json();

                if (res.ok && data.info) {
                    setInfoContent(data.info);
                }
            } catch (error) {
                console.error("Failed to fetch contact content:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Header */}
            <section className="pt-32 pb-12 px-4 bg-white border-b border-gray-100">
                <div className="container mx-auto text-center">
                    {loading ? (
                        <div className="animate-pulse space-y-4">
                            <div className="h-10 bg-gray-200 w-64 mx-auto rounded"></div>
                            <div className="h-4 bg-gray-200 w-96 mx-auto rounded"></div>
                        </div>
                    ) : (
                        <>
                            <h1 className="text-4xl font-bold mb-4">{infoContent.title || "Hubungi Kami"}</h1>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                {infoContent.subtitle || "Punya pertanyaan? Kami siap membantu Anda. Kirimkan pesan dan kami akan membalas secepatnya."}
                            </p>
                        </>
                    )}
                </div>
            </section>

            {/* Contact Section */}
            <section className="px-4 py-12">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Contact Info Cards */}
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-1">Telepon / WhatsApp</h3>
                                    {loading ? (
                                        <div className="h-4 bg-gray-200 w-32 rounded mt-1"></div>
                                    ) : (
                                        <a
                                            href={`https://wa.me/${(infoContent.phone || "6283874065238").replace(/[^0-9]/g, "")}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline font-medium"
                                        >
                                            {infoContent.phone || "+62 812 3456 7890"}
                                        </a>
                                    )}
                                    <p className="text-xs text-gray-400 mt-1">Senin - Minggu, 08:00 - 20:00</p>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-1">Email</h3>
                                    {loading ? (
                                        <div className="h-4 bg-gray-200 w-40 rounded mt-1"></div>
                                    ) : (
                                        <p className="text-gray-600">{infoContent.email || "info@curugmara.com"}</p>
                                    )}
                                    <p className="text-xs text-gray-400 mt-1">Respon dalam 24 jam</p>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-1">Lokasi Basecamp</h3>
                                    {loading ? (
                                        <div className="h-4 bg-gray-200 w-48 rounded mt-1"></div>
                                    ) : (
                                        <p className="text-gray-600">{infoContent.address || "Curug Mara, Jawa Barat, Indonesia"}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <ContactForm />
                        </div>
                    </div>
                </div>
            </section>

            <Footer />

            {/* DEBUG SECTION */}
            <div className="bg-black text-white p-4 m-4 rounded overflow-auto">
                <h3 className="font-bold text-red-500">DEBUG INFO (Client Fetch)</h3>
                <pre className="text-xs">
                    {JSON.stringify(infoContent, null, 2)}
                </pre>
            </div>
        </div>
    );
}
