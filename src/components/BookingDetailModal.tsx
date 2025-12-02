"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, User, Phone, FileText, CreditCard, Hash } from "lucide-react";
import { format } from "date-fns";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useSession } from "next-auth/react";

interface BookingDetailModalProps {
    booking: any;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onStatusUpdate?: () => void; // Callback to refresh data after update
}

export function BookingDetailModal({ booking, open, onOpenChange, onStatusUpdate }: BookingDetailModalProps) {
    const { data: session } = useSession();
    const [updating, setUpdating] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(booking?.status || "pending");

    // Sync selectedStatus when booking changes
    useEffect(() => {
        if (booking) {
            setSelectedStatus(booking.status);
        }
    }, [booking]);

    if (!booking) return null;

    const isAdmin = session?.user?.role === "Admin" || session?.user?.role === "SuperAdmin";

    // Debug log
    console.log("Session:", session);
    console.log("User role:", session?.user?.role);
    console.log("Is Admin:", isAdmin);

    const handleStatusUpdate = async () => {
        if (!isAdmin || selectedStatus === booking.status) return;

        setUpdating(true);
        try {
            const res = await fetch(`/api/admin/bookings/${booking.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: selectedStatus }),
            });

            if (res.ok) {
                alert("Status updated successfully!");
                onStatusUpdate?.();
                onOpenChange(false);
            } else {
                const error = await res.json();
                alert(`Failed to update status: ${error.error || "Unknown error"}`);
            }
        } catch (error) {
            console.error("Status update error:", error);
            alert("An error occurred while updating status");
        } finally {
            setUpdating(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case "confirmed": return "bg-green-500 hover:bg-green-600";
            case "pending": return "bg-yellow-500 hover:bg-yellow-600";
            case "cancelled": return "bg-red-500 hover:bg-red-600";
            case "completed": return "bg-blue-500 hover:bg-blue-600";
            case "paid": return "bg-blue-500 hover:bg-blue-600";
            default: return "bg-gray-500 hover:bg-gray-600";
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount || 0);
    };

    // Handle both singular and plural (Supabase join) property names
    const destination = booking.destination || booking.destinations;
    const customerName = booking.customer_name || booking.profiles?.name || "N/A";
    const customerPhone = booking.customer_phone || booking.profiles?.phone || "N/A";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center justify-between mr-8">
                        <DialogTitle className="text-xl">Booking Details</DialogTitle>
                        <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                        </Badge>
                    </div>
                    <DialogDescription>
                        Booking Reference: <span className="font-mono font-medium text-foreground">{booking.booking_number || "N/A"}</span>
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {/* Admin Status Update */}
                    {isAdmin && (
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
                            <h4 className="font-semibold text-sm">Admin Actions</h4>
                            <div className="flex gap-2 items-end">
                                <div className="flex-1">
                                    <label className="text-xs text-muted-foreground mb-1 block">Update Status</label>
                                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="paid">Paid</SelectItem>
                                            <SelectItem value="confirmed">Confirmed</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                            <SelectItem value="cancelled">Cancelled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button
                                    onClick={handleStatusUpdate}
                                    disabled={updating || selectedStatus === booking.status}
                                    size="sm"
                                >
                                    {updating ? "Updating..." : "Update"}
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Destination Info */}
                    <div className="flex gap-4 p-4 bg-muted/50 rounded-lg">
                        <div className="w-24 h-24 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                            {destination?.image_url ? (
                                <img
                                    src={destination.image_url}
                                    alt={destination.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                    <MapPin className="w-8 h-8" />
                                </div>
                            )}
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-bold text-lg">{destination?.title || "Unknown Destination"}</h3>
                            <div className="flex items-center text-sm text-muted-foreground">
                                <MapPin className="w-3.5 h-3.5 mr-1" />
                                {destination?.location || "Indonesia"}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                                <Calendar className="w-3.5 h-3.5 mr-1" />
                                {booking.start_date ? format(new Date(booking.start_date), "EEEE, d MMMM yyyy") : "Date not set"}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Customer Info */}
                        <div className="space-y-3">
                            <h4 className="font-semibold flex items-center gap-2">
                                <User className="w-4 h-4" /> Customer Information
                            </h4>
                            <div className="space-y-2 text-sm border rounded-md p-3">
                                <div className="grid grid-cols-3 gap-2">
                                    <span className="text-muted-foreground">Name:</span>
                                    <span className="col-span-2 font-medium">{customerName}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <span className="text-muted-foreground">Phone:</span>
                                    <span className="col-span-2 font-medium">{customerPhone}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <span className="text-muted-foreground">Guests:</span>
                                    <span className="col-span-2 font-medium flex items-center gap-1">
                                        <Users className="w-3.5 h-3.5" />
                                        {booking.participants || booking.number_of_people || 1} People
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="space-y-3">
                            <h4 className="font-semibold flex items-center gap-2">
                                <CreditCard className="w-4 h-4" /> Payment Details
                            </h4>
                            <div className="space-y-2 text-sm border rounded-md p-3">
                                <div className="grid grid-cols-3 gap-2">
                                    <span className="text-muted-foreground">Total:</span>
                                    <span className="col-span-2 font-bold text-lg text-primary">
                                        {formatCurrency(booking.total_price)}
                                    </span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <span className="text-muted-foreground">Status:</span>
                                    <span className="col-span-2 capitalize">{booking.payment_status}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <span className="text-muted-foreground">Method:</span>
                                    <span className="col-span-2">{booking.payment_method || "-"}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    {booking.notes && (
                        <div className="space-y-2">
                            <h4 className="font-semibold flex items-center gap-2">
                                <FileText className="w-4 h-4" /> Special Requests / Notes
                            </h4>
                            <div className="bg-muted p-3 rounded-md text-sm italic">
                                "{booking.notes}"
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
