"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Target, Users, Award, Heart, Leaf, Map } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function AboutPage() {
    const [heroContent, setHeroContent] = useState<any>({});
    const [storyContent, setStoryContent] = useState<any>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const res = await fetch("/api/content/about", {
                    cache: "no-store",
                    headers: { "Pragma": "no-cache" }
                });
                const data = await res.json();

                if (res.ok) {
                    if (data.hero) setHeroContent(data.hero);
                    if (data.story) setStoryContent(data.story);
                }
            } catch (error) {
                console.error("Failed to fetch about content:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4 overflow-hidden bg-white">
                <div className="container mx-auto text-center relative z-10">
                    {loading ? (
                        <div className="space-y-4 animate-pulse">
                            <div className="h-12 bg-gray-200 w-1/2 mx-auto rounded"></div>
                            <div className="h-6 bg-gray-200 w-3/4 mx-auto rounded"></div>
                        </div>
                    ) : (
                        <>
                            <h1 className="text-4xl md:text-5xl font-bold mb-6">
                                {heroContent.title || "Tentang"} <span className="text-primary">{heroContent.subtitle ? "" : "Adventure Curug Mara"}</span>
                            </h1>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                                {heroContent.subtitle || "Menghubungkan para petualang dengan keajaiban alam tersembunyi Indonesia sejak 2020. Kami percaya setiap perjalanan adalah cerita baru."}
                            </p>
                        </>
                    )}
                </div>
            </section>

            {/* Photo Grid / Story */}
            <section className="px-4 pb-20">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="grid grid-cols-2 gap-4">
                            {loading ? (
                                <>
                                    <div className="h-64 bg-gray-200 rounded-2xl animate-pulse transform translate-y-8"></div>
                                    <div className="h-64 bg-gray-200 rounded-2xl animate-pulse"></div>
                                </>
                            ) : (
                                <>
                                    <img
                                        src={heroContent.background_image || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop"}
                                        alt="Adventure 1"
                                        className="rounded-2xl shadow-lg w-full h-64 object-cover transform translate-y-8"
                                    />
                                    <img
                                        src="https://images.unsplash.com/photo-1533240332313-0db49b459ad6?q=80&w=1000&auto=format&fit=crop"
                                        alt="Adventure 2"
                                        className="rounded-2xl shadow-lg w-full h-64 object-cover"
                                    />
                                </>
                            )}
                        </div>
                        <div>
                            {loading ? (
                                <div className="space-y-4 animate-pulse">
                                    <div className="h-8 bg-gray-200 w-1/3 rounded"></div>
                                    <div className="h-24 bg-gray-200 rounded"></div>
                                    <div className="h-24 bg-gray-200 rounded"></div>
                                </div>
                            ) : (
                                <>
                                    <SectionHeader title={storyContent.title || "Cerita Kami"} className="mb-6" />
                                    <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                                        {storyContent.paragraph1 || "Adventure Curug Mara lahir dari kecintaan terhadap harta karun alam Indonesia yang tersembunyi. Bermula dari sekelompok teman yang menjelajahi air terjun di Jawa Barat, kini kami tumbuh menjadi operator tur petualangan terpercaya yang melayani ribuan pelancong."}
                                    </p>
                                    <p className="text-gray-600 text-lg leading-relaxed">
                                        {storyContent.paragraph2 || "Kami percaya bahwa petualangan terbaik adalah yang menghubungkan Anda dengan alam, budaya lokal, dan sesama penjelajah. Setiap paket wisata kami dirancang dengan cermat, mengutamakan keselamatan, dan keberlanjutan lingkungan."}
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="px-4 py-20 bg-white">
                <div className="container mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Nilai-Nilai Kami</h2>
                        <p className="text-gray-600">Apa yang membuat kami berbeda dari yang lain</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Award,
                                title: "Keunggulan Layanan",
                                description: "Kami berkomitmen memberikan pengalaman terbaik di setiap perjalanan Anda."
                            },
                            {
                                icon: Users,
                                title: "Komunitas Lokal",
                                description: "Memberdayakan masyarakat sekitar sebagai pemandu dan mitra lokal."
                            },
                            {
                                icon: Leaf,
                                title: "Ramah Lingkungan",
                                description: "Menjaga kelestarian alam dengan prinsip 'Leave No Trace' di setiap aktivitas."
                            },
                        ].map((value, idx) => (
                            <div key={idx} className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-lg transition-shadow text-center">
                                <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center shadow-sm mb-6 text-primary">
                                    <value.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                                <p className="text-gray-600">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
