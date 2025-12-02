"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Search, MapPin, Calendar, Shield, CreditCard, Headphones } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { PackageCard } from "@/components/destinations/PackageCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
    const [heroContent, setHeroContent] = useState<any>({});
    const [packages, setPackages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Categories (Static for now)
    const categories = [
        { name: "Atraksi", icon: "🎡", href: "/destinations" },
        { name: "Tur", icon: "🗺️", href: "/destinations" },
        { name: "Hotel", icon: "🏨", href: "/destinations" },
        { name: "Transportasi", icon: "🚗", href: "/destinations" },
        { name: "Kuliner", icon: "🍽️", href: "/destinations" },
        { name: "Event", icon: "🎫", href: "/destinations" },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch Page Content (Client-side, no-cache)
                const contentRes = await fetch("/api/content/home", {
                    cache: "no-store",
                    headers: { "Pragma": "no-cache" }
                });
                const contentData = await contentRes.json();
                if (contentRes.ok && contentData.hero) {
                    setHeroContent(contentData.hero);
                }

                // 2. Fetch Packages (Direct Supabase or API - keeping direct for now but client-side)
                const supabase = createClient(
                    process.env.NEXT_PUBLIC_SUPABASE_URL!,
                    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
                );
                const { data: packagesData } = await supabase
                    .from("destinations")
                    .select("*")
                    .order("created_at", { ascending: false });

                if (packagesData) {
                    setPackages(packagesData);
                }

            } catch (error) {
                console.error("Error fetching home data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Hero Section (Klook Style) */}
            <section className="relative h-[500px] flex items-center justify-center">
                <div className="absolute inset-0 z-0">
                    {loading ? (
                        <div className="w-full h-full bg-gray-300 animate-pulse" />
                    ) : (
                        <img
                            src={heroContent.background_image || "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?q=80&w=1000&auto=format&fit=crop"}
                            alt="Hero Background"
                            className="w-full h-full object-cover brightness-75"
                        />
                    )}
                </div>
                <div className="container relative z-10 px-4 text-center text-white">
                    {loading ? (
                        <div className="space-y-4">
                            <div className="h-12 bg-white/20 w-3/4 mx-auto rounded animate-pulse" />
                            <div className="h-6 bg-white/20 w-1/2 mx-auto rounded animate-pulse" />
                        </div>
                    ) : (
                        <>
                            <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
                                {heroContent.title || "Temukan Petualanganmu Berikutnya"}
                            </h1>
                            <p className="text-lg md:text-xl mb-8 drop-shadow-md opacity-90">
                                {heroContent.subtitle || "Jelajahi keindahan alam Curug Mara dan sekitarnya"}
                            </p>
                        </>
                    )}

                    {/* Search Bar */}
                    <div className="max-w-3xl mx-auto bg-white rounded-lg p-2 shadow-xl flex flex-col md:flex-row gap-2">
                        <div className="flex-1 flex items-center px-4 border-b md:border-b-0 md:border-r border-gray-200">
                            <MapPin className="w-5 h-5 text-gray-400 mr-2" />
                            <Input
                                type="text"
                                placeholder="Mau kemana?"
                                className="border-none shadow-none focus-visible:ring-0 text-gray-800 placeholder:text-gray-400"
                            />
                        </div>
                        <div className="flex-1 flex items-center px-4">
                            <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                            <Input
                                type="text"
                                placeholder="Tanggal aktivitas"
                                className="border-none shadow-none focus-visible:ring-0 text-gray-800 placeholder:text-gray-400"
                            />
                        </div>
                        <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold px-8 rounded-md">
                            Cari
                        </Button>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                    {categories.map((cat, idx) => (
                        <Link key={idx} href={cat.href} className="flex flex-col items-center gap-2 group cursor-pointer">
                            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-3xl group-hover:shadow-md group-hover:-translate-y-1 transition-all duration-300">
                                {cat.icon}
                            </div>
                            <span className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">
                                {cat.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Popular Packages Section */}
            <section className="container mx-auto px-4 py-8">
                <SectionHeader
                    title="Paling Laris di Curug Mara"
                    subtitle="Paket wisata favorit pilihan traveler"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        [1, 2, 3].map(i => (
                            <div key={i} className="h-[400px] bg-gray-100 rounded-xl animate-pulse" />
                        ))
                    ) : (
                        packages.map((pkg) => (
                            <PackageCard
                                key={pkg.id}
                                id={pkg.id}
                                title={pkg.title}
                                image_url={pkg.image_url}
                                price={pkg.pricing} // Note: DB column is 'pricing', prop is 'price'
                                duration={pkg.duration || "2 Jam"}
                                location={pkg.location || "Curug Mara"}
                                featured={pkg.featured}
                            />
                        ))
                    )}
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="bg-white py-16 border-t border-gray-100">
                <div className="container mx-auto px-4">
                    <SectionHeader
                        title="Kenapa Memilih Kami?"
                        align="center"
                        className="mb-12"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-primary">
                                <Shield className="w-8 h-8" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Pembayaran Aman</h3>
                            <p className="text-muted-foreground text-sm">Transaksi terjamin aman dengan berbagai metode pembayaran terpercaya.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4 text-green-600">
                                <CreditCard className="w-8 h-8" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Harga Terbaik</h3>
                            <p className="text-muted-foreground text-sm">Dapatkan penawaran harga terbaik tanpa biaya tersembunyi.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-4 text-orange-600">
                                <Headphones className="w-8 h-8" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Layanan 24/7</h3>
                            <p className="text-muted-foreground text-sm">Tim support kami siap membantu perjalanan Anda kapan saja.</p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
