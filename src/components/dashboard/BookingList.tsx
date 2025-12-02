"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Eye } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { BookingDetailModal } from "@/components/BookingDetailModal";
import { PaymentModal } from "@/components/PaymentModal";

interface BookingListProps {
    bookings: any[];
}

export function BookingList({ bookings }: BookingListProps) {
    const [selectedBooking, setSelectedBooking] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPaymentBooking, setSelectedPaymentBooking] = useState<any>(null);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "confirmed": return "bg-green-500";
            case "pending": return "bg-yellow-500";
            case "cancelled": return "bg-red-500";
            case "completed": return "bg-blue-500";
            default: return "bg-gray-500";
        }
    };

    const handleViewDetails = (booking: any) => {
        setSelectedBooking(booking);
        setIsModalOpen(true);
    };

    const handlePay = (booking: any) => {
        setSelectedPaymentBooking(booking);
        setIsPaymentModalOpen(true);
    };

    if (!bookings || bookings.length === 0) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
                    <div className="p-4 bg-muted rounded-full">
                        <Calendar className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div className="text-center space-y-2">
                        <h3 className="font-semibold text-lg">No bookings found</h3>
                        <p className="text-muted-foreground">
                            You haven't booked any trips yet.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/destinations">Browse Destinations</Link>
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <div className="grid gap-6">
                {bookings.map((booking) => (
                    <Card key={booking.id} className="overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                            <div className="w-full md:w-48 h-32 md:h-auto bg-muted relative">
                                {booking.destination?.image_url ? (
                                    <img
                                        src={booking.destination.image_url}
                                        alt={booking.destination.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center w-full h-full bg-gray-200">
                                        <MapPin className="w-8 h-8 text-gray-400" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 p-6">
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-xl">
                                                {booking.destination?.title || "Unknown Destination"}
                                            </h3>
                                            <Badge className={getStatusColor(booking.status)}>
                                                {booking.status}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                {booking.start_date ? format(new Date(booking.start_date), "MMMM d, yyyy") : "N/A"}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Users className="w-4 h-4" />
                                                {booking.participants || booking.number_of_people} Guests
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4" />
                                                {booking.destination?.location || "Indonesia"}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <div className="font-bold text-lg">
                                            Rp {booking.total_price?.toLocaleString()}
                                        </div>
                                        <div className="flex gap-2">
                                            {booking.payment_status === 'unpaid' && booking.status !== 'cancelled' && (
                                                <Button size="sm" onClick={() => handlePay(booking)}>
                                                    Pay Now
                                                </Button>
                                            )}
                                            {(booking.status === 'paid' || booking.status === 'confirmed' || booking.status === 'completed') && (
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    onClick={() => {
                                                        import("@/lib/pdf-generator").then((mod) => {
                                                            mod.generateBookingPDF({
                                                                booking_number: booking.booking_number,
                                                                customer_name: booking.customer_name || "Guest",
                                                                destination_title: booking.destination?.title || "Trip",
                                                                start_date: booking.start_date,
                                                                participants: booking.participants || booking.number_of_people,
                                                                total_price: booking.total_price,
                                                                status: booking.status
                                                            });
                                                        });
                                                    }}
                                                >
                                                    Download Ticket
                                                </Button>
                                            )}
                                            <Button variant="outline" size="sm" onClick={() => handleViewDetails(booking)}>
                                                <Eye className="w-4 h-4 mr-2" />
                                                View Details
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <BookingDetailModal
                booking={selectedBooking}
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
            />

            <PaymentModal
                booking={selectedPaymentBooking}
                open={isPaymentModalOpen}
                onOpenChange={setIsPaymentModalOpen}
            />
        </>
    );
}
