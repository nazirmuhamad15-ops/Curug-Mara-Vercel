"use client";

import { useState } from "react";
import Link from "next/link";
import { GlassContainer } from "@/components/GlassContainer";
import { MapPin, Star, Clock, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { BookingModal } from "@/components/BookingModal";

interface Destination {
    id: string;
    title: string;
    description: string;
    image_url: string;
    pricing: number;
    price?: number; // fallback
    duration: string;
    duration_days?: number;
    categories?: {
        name: string;
    };
}

interface FeaturedDestinationsProps {
    destinations: Destination[];
}

export function FeaturedDestinations({ destinations }: FeaturedDestinationsProps) {
    const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

    const handleBookNow = (e: React.MouseEvent, destination: Destination) => {
        e.preventDefault(); // Prevent Link navigation if wrapped
        setSelectedDestination(destination);
        setIsBookingModalOpen(true);
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {destinations?.map((destination) => (
                    <Link href={`/destinations/${destination.id}`} key={destination.id}>
                        <GlassContainer className="overflow-hidden group cursor-pointer h-full flex flex-col hover:shadow-2xl transition-all">
                            <div className="relative h-64 bg-gray-200 overflow-hidden">
                                {destination.image_url ? (
                                    <img
                                        src={destination.image_url}
                                        alt={destination.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                                        <MapPin className="w-12 h-12 text-primary/50" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                                <div className="absolute top-4 left-4 z-20">
                                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-sm font-semibold">
                                        {/* @ts-ignore */}
                                        {destination.categories?.name || "Adventure"}
                                    </span>
                                </div>
                                <div className="absolute top-4 right-4 z-20">
                                    <button className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white transition-colors">
                                        <Star className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-2xl font-bold text-primary">
                                        {formatCurrency(destination.pricing || destination.price || 0)}
                                    </h3>
                                    <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm">
                                        <Clock className="w-4 h-4" />
                                        <span>{destination.duration_days ? `${destination.duration_days} Days` : (destination.duration || "1 Day")}</span>
                                    </div>
                                </div>
                                <h4 className="text-xl font-semibold mb-2 line-clamp-1">{destination.title}</h4>
                                <p className="text-muted-foreground mb-4 line-clamp-2 flex-1">
                                    {destination.description}
                                </p>
                                <div className="flex items-center justify-between mt-auto pt-4 border-t">
                                    <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 fill-accent text-accent" />
                                        <span className="font-semibold">4.9</span>
                                        <span className="text-sm text-muted-foreground">(124)</span>
                                    </div>
                                    <button
                                        onClick={(e) => handleBookNow(e, destination)}
                                        className="text-primary font-semibold hover:underline flex items-center gap-1 z-30 relative"
                                    >
                                        Book Now
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </GlassContainer>
                    </Link>
                ))}
            </div>

            {selectedDestination && (
                <BookingModal
                    open={isBookingModalOpen}
                    onOpenChange={setIsBookingModalOpen}
                    destinationId={selectedDestination.id}
                    destinationTitle={selectedDestination.title}
                    pricing={selectedDestination.pricing || selectedDestination.price}
                />
            )}
        </>
    );
}
