"use client";

import { useState } from "react";
import Link from "next/link";
import { GlassContainer } from "@/components/GlassContainer";
import { MapPin, Star, Clock, Users } from "lucide-react";
import { BookingModal } from "@/components/BookingModal";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface DestinationCardProps {
    destination: {
        id: string;
        title: string;
        description: string;
        location: string;
        price: number;
        pricing: number;
        duration?: string;
        max_guests?: number;
        image_url?: string;
        categories?: { name: string } | null;
    };
}

export function DestinationCard({ destination }: DestinationCardProps) {
    const [bookingOpen, setBookingOpen] = useState(false);

    const handleBookNow = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent Link navigation
        e.stopPropagation();
        setBookingOpen(true);
    };

    return (
        <>
            <Link href={`/destinations/${destination.id}`}>
                <GlassContainer className="overflow-hidden group cursor-pointer hover:shadow-2xl transition-all h-20rem flex flex-col">
                    <div className="relative h-40 bg-gray-200 overflow-hidden">
                        {destination.image_url ? (
                            <img
                                src={destination.image_url}
                                alt={destination.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                                <MapPin className="w-10 h-10 text-primary/50" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                        <div className="absolute top-3 left-3 z-20">
                            <span className="px-2 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-semibold">
                                {destination.categories?.name || "Adventure"}
                            </span>
                        </div>
                        <div className="absolute bottom-3 left-3 right-3 z-20 text-white">
                            <div className="flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5" />
                                <span className="text-xs">{destination.location}</span>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-bold text-primary">
                                {formatCurrency(destination.pricing || destination.price || 0)}
                            </h3>
                            <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{destination.duration || "1 Day"}</span>
                            </div>
                        </div>
                        <h4 className="text-lg font-semibold mb-1.5 line-clamp-1">{destination.title}</h4>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2 flex-1">
                            {destination.description}
                        </p>
                        <div className="flex items-center justify-between gap-3 pt-3 border-t mt-auto">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1">
                                    <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                                    <span className="text-sm font-semibold">4.9</span>
                                </div>
                                <div className="flex items-center gap-1 text-muted-foreground">
                                    <Users className="w-3.5 h-3.5" />
                                    <span className="text-xs">Max {destination.max_guests || 10}</span>
                                </div>
                            </div>
                            <Button
                                onClick={handleBookNow}
                                className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg"
                                size="sm"
                            >
                                Book Now
                            </Button>
                        </div>
                    </div>
                </GlassContainer>
            </Link>

            <BookingModal
                open={bookingOpen}
                onOpenChange={setBookingOpen}
                destinationId={destination.id}
                destinationTitle={destination.title}
                pricing={destination.pricing}
            />
        </>
    );
}
