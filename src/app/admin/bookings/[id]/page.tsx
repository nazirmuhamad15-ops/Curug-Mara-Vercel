"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, MapPin, User, CreditCard, CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

interface BookingDetail {
    id: string;
    booking_number: string;
    created_at: string;
    start_date: string;
    end_date: string;
    participants: number;
    total_price: number;
    status: string;
    payment_status: string;
    payment_method: string | null;
    notes: string | null;
    profiles: {
        name: string | null;
        email: string | null;
        phone: string | null;
    } | null;
    destinations: {
        title: string;
        location: string;
        image_url: string | null;
    } | null;
}

export default function BookingDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [booking, setBooking] = useState<BookingDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const { toast } = useToast();

    // Safely extract id
    const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

    useEffect(() => {
        async function fetchBooking() {
            if (!id) return;
            try {
                const res = await fetch(`/api/admin/bookings/${id}`);
                const data = await res.json();
                if (res.ok) {
                    // Handle array vs object for joined fields if necessary, but .single() in API should return object
                    // Supabase join returns array for 1:M but object for M:1 if configured right, but let's be safe
                    const formattedData = {
                        ...data,
                        profiles: Array.isArray(data.profiles) ? data.profiles[0] : data.profiles,
                        destinations: Array.isArray(data.destinations) ? data.destinations[0] : data.destinations
                    };
                    setBooking(formattedData);
                } else {
                    console.error("Error fetching booking:", data.error);
                }
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchBooking();
    }, [id]);

    const updateStatus = async (newStatus: string, type: "status" | "payment_status") => {
        setUpdating(true);
        try {
            const res = await fetch(`/api/admin/bookings/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ [type]: newStatus }),
            });

            if (res.ok) {
                const updated = await res.json();
                setBooking(prev => prev ? { ...prev, [type]: newStatus } : null);
                toast({
                    title: "Success",
                    description: "Status updated successfully",
                });
            } else {
                alert("Failed to update status");
            }
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Error updating status");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Loading booking details...</div>;
    }

    if (!booking) {
        return <div className="p-8 text-center">Booking not found</div>;
    }

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => router.back()}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Bookings
                </Button>
                <h1 className="text-2xl font-bold">Booking #{booking.booking_number}</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-primary" />
                                Trip Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-muted-foreground">Destination</label>
                                    <p className="font-medium text-lg">{booking.destinations?.title}</p>
                                    <p className="text-sm text-muted-foreground">{booking.destinations?.location}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground">Dates</label>
                                    <p className="font-medium">
                                        {format(new Date(booking.start_date), "MMM d, yyyy")} - {format(new Date(booking.end_date), "MMM d, yyyy")}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground">Participants</label>
                                    <p className="font-medium">{booking.participants} People</p>
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground">Total Price</label>
                                    <p className="font-medium text-lg text-primary">
                                        {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(booking.total_price)}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="w-5 h-5 text-primary" />
                                Customer Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-muted-foreground">Name</label>
                                    <p className="font-medium">{booking.profiles?.name || "N/A"}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground">Email</label>
                                    <p className="font-medium">{booking.profiles?.email || "N/A"}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground">Phone</label>
                                    <p className="font-medium">{booking.profiles?.phone || "N/A"}</p>
                                </div>
                            </div>
                            {booking.notes && (
                                <div className="mt-4 pt-4 border-t">
                                    <label className="text-sm text-muted-foreground">Customer Notes</label>
                                    <p className="mt-1">{booking.notes}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Actions */}
                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-primary" />
                                Status Management
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Booking Status</label>
                                <Select
                                    value={booking.status}
                                    onValueChange={(val) => updateStatus(val, "status")}
                                    disabled={updating}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="confirmed">Confirmed</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Payment Status</label>
                                <Select
                                    value={booking.payment_status}
                                    onValueChange={(val) => updateStatus(val, "payment_status")}
                                    disabled={updating}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="unpaid">Unpaid</SelectItem>
                                        <SelectItem value="paid">Paid</SelectItem>
                                        <SelectItem value="refunded">Refunded</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="pt-4 border-t text-sm text-muted-foreground">
                                <div className="flex justify-between py-1">
                                    <span>Created</span>
                                    <span>{format(new Date(booking.created_at), "MMM d, yyyy HH:mm")}</span>
                                </div>
                                <div className="flex justify-between py-1">
                                    <span>Payment Method</span>
                                    <span className="capitalize">{booking.payment_method || "N/A"}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
