"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Search, SlidersHorizontal } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { PackageCard } from "@/components/destinations/PackageCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function DestinationsPage() {
    const [destinations, setDestinations] = useState<any[]>([]);
    const [filteredDestinations, setFilteredDestinations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("Semua");
    const [searchQuery, setSearchQuery] = useState("");

    const categories = ["Semua", "Trekking", "Camping", "Waterfall", "Family", "Extreme"];

    useEffect(() => {
        fetchDestinations();
    }, []);

    useEffect(() => {
        filterDestinations();
    }, [selectedCategory, searchQuery, destinations]);

    const fetchDestinations = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("destinations")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching destinations:", error);
        } else {
            setDestinations(data || []);
        }
        setLoading(false);
    };

    const filterDestinations = () => {
        let filtered = destinations;

        // Filter by category (Assuming we add category column later, for now just mock or skip)
        // Since we replaced destinations with packages, we might not have categories yet.
        // Let's assume 'Semua' for now.
        if (selectedCategory !== "Semua") {
            // Placeholder logic if we had categories
            // filtered = filtered.filter(d => d.category === selectedCategory);
        }

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(
                (dest) =>
                    dest.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    dest.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    dest.description?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredDestinations(filtered);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Header */}
            <section className="pt-32 pb-8 px-4 bg-white border-b border-gray-100">
                <div className="container mx-auto">
                    <h1 className="text-3xl font-bold mb-4">Jelajahi Aktivitas Seru</h1>

                    {/* Search & Filter Bar */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Cari aktivitas atau lokasi..."
                                className="pl-10 bg-gray-50 border-gray-200 focus-visible:ring-primary"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                            {categories.map((cat) => (
                                <Button
                                    key={cat}
                                    variant={selectedCategory === cat ? "default" : "outline"}
                                    onClick={() => setSelectedCategory(cat)}
                                    className="rounded-full whitespace-nowrap"
                                >
                                    {cat}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="container mx-auto px-4 py-8">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-[300px] bg-gray-200 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <p className="text-gray-600">
                                Menampilkan <span className="font-bold text-gray-900">{filteredDestinations.length}</span> aktivitas
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {filteredDestinations.map((pkg) => (
                                <PackageCard
                                    key={pkg.id}
                                    id={pkg.id}
                                    title={pkg.title}
                                    image_url={pkg.image_url}
                                    price={pkg.pricing}
                                    duration={pkg.duration || "2 Jam"}
                                    location={pkg.location || "Curug Mara"}
                                    featured={pkg.featured}
                                />
                            ))}
                        </div>

                        {filteredDestinations.length === 0 && (
                            <div className="text-center py-20">
                                <p className="text-gray-500 text-lg">Tidak ada aktivitas yang ditemukan.</p>
                                <Button
                                    variant="link"
                                    onClick={() => { setSearchQuery(""); setSelectedCategory("Semua") }}
                                    className="mt-2"
                                >
                                    Reset Filter
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </section>

            <Footer />
        </div>
    );
}
