"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, Loader2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Link from "next/link";
import { PaymentModal } from "@/components/PaymentModal";
import { BookingDetailModal } from "@/components/BookingDetailModal";
import { ReviewModal } from "@/components/reviews/ReviewModal";
import { CreditCard, Eye, Phone } from "lucide-react";
import { generateBookingPDF } from "@/lib/pdf-generator";

export default function MyBookingsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [bookings, setBookings] = useState<any[]>([]);

    // Modal States
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<any>(null);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/signin");
        } else if (status === "authenticated") {
            fetchBookings();
        }
    }, [status, router]);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/user/bookings");
            if (res.ok) {
                const data = await res.json();
                setBookings(data);
            }
        } catch (error) {
            console.error("Error fetching bookings:", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "paid":
            case "confirmed":
            case "completed":
                return <Badge className="bg-green-500">{status}</Badge>;
            case "pending":
                return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Pending</Badge>;
            case "cancelled":
                return <Badge variant="destructive">Cancelled</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const openReviewModal = (booking: any) => {
        setSelectedBooking(booking);
        setReviewModalOpen(true);
    };

    const openPaymentModal = (booking: any) => {
        setSelectedBooking(booking);
        setPaymentModalOpen(true);
    };

    const openDetailModal = (booking: any) => {
        setSelectedBooking(booking);
        setDetailModalOpen(true);
    };

    const handleDownloadTicket = (booking: any) => {
        generateBookingPDF({
            booking_number: booking.booking_number,
            customer_name: booking.customer_name,
            destination_title: booking.destinations?.title,
            start_date: booking.start_date,
            participants: booking.participants,
            total_price: booking.total_price,
            status: booking.status,
        });
    };

    if (status === "loading" || loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">My Bookings</h1>
                <p className="text-muted-foreground">View your past and upcoming trips</p>
            </div>

            <Card>
                <CardContent className="p-6">
                    {bookings.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <p>No bookings found.</p>
                            <Link href="/destinations">
                                <Button variant="link" className="mt-2">Browse Destinations</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {bookings.map((booking) => (
                                <div key={booking.id} className="border rounded-lg p-6 flex flex-col md:flex-row justify-between gap-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-lg">
                                                {booking.destinations?.title || "Unknown Package"}
                                            </h3>
                                            {getStatusBadge(booking.status)}
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                {format(new Date(booking.start_date), "MMM d, yyyy")}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4" />
                                                {booking.booking_number}
                                            </div>
                                        </div>
                                        <p className="text-sm">
                                            {booking.participants} Participants • Total: Rp {booking.total_price.toLocaleString()}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2 flex-wrap">
                                        {/* View Details Button - Always visible */}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => openDetailModal(booking)}
                                            className="gap-2"
                                        >
                                            <Eye className="w-4 h-4" />
                                            View
                                        </Button>

                                        {/* WhatsApp Button - Always visible for COD */}
                                        <Link
                                            href={`https://wa.me/6283874065238?text=Halo, saya ingin menanyakan pesanan dengan Kode Booking: ${booking.booking_number}`}
                                            target="_blank"
                                        >
                                            <Button
                                                size="sm"
                                                className="gap-2 bg-green-600 hover:bg-green-700"
                                            >
                                                <Phone className="w-4 h-4" />
                                                WhatsApp
                                            </Button>
                                        </Link>

                                        {/* Write Review Button - Only for completed */}
                                        {booking.status === 'completed' && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => openReviewModal(booking)}
                                            >
                                                Write Review
                                            </Button>
                                        )}

                                        {/* E-Ticket Button - Always available for COD */}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="gap-2"
                                            onClick={() => handleDownloadTicket(booking)}
                                        >
                                            <Download className="w-4 h-4" />
                                            E-Ticket
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {selectedBooking && (
                <>
                    <ReviewModal
                        isOpen={reviewModalOpen}
                        onClose={() => setReviewModalOpen(false)}
                        destinationId={selectedBooking.destination_id}
                        destinationTitle={selectedBooking.destinations?.title}
                    />
                    <PaymentModal
                        booking={selectedBooking}
                        open={paymentModalOpen}
                        onOpenChange={setPaymentModalOpen}
                    />
                    <BookingDetailModal
                        booking={selectedBooking}
                        open={detailModalOpen}
                        onOpenChange={setDetailModalOpen}
                        onStatusUpdate={fetchBookings}
                    />
                </>
            )}
        </div>
    );
}
