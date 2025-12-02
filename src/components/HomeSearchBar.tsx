"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GlassContainer } from "@/components/GlassContainer";
import { Search, Calendar, MapPin } from "lucide-react";

export function HomeSearchBar() {
    const router = useRouter();
    const [location, setLocation] = useState("");
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");

    const handleSearch = () => {
        // Redirect to destinations page with search query
        if (location) {
            router.push(`/destinations?search=${encodeURIComponent(location)}`);
        } else {
            router.push("/destinations");
        }
    };

    return (
        <section className="relative -mt-20 z-20 px-4">
            <div className="container mx-auto">
                <GlassContainer className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl">
                            <MapPin className="w-5 h-5 text-primary" />
                            <input
                                type="text"
                                placeholder="Where to?"
                                className="flex-1 outline-none bg-transparent"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            />
                        </div>
                        <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl">
                            <Calendar className="w-5 h-5 text-primary" />
                            <input
                                type="date"
                                placeholder="Check‑in"
                                className="flex-1 outline-none bg-transparent"
                                value={checkIn}
                                onChange={(e) => setCheckIn(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl">
                            <Calendar className="w-5 h-5 text-primary" />
                            <input
                                type="date"
                                placeholder="Check‑out"
                                className="flex-1 outline-none bg-transparent"
                                value={checkOut}
                                onChange={(e) => setCheckOut(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={handleSearch}
                            className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                        >
                            <Search className="w-5 h-5" />
                            Search
                        </button>
                    </div>
                </GlassContainer>
            </div>
        </section>
    );
}
