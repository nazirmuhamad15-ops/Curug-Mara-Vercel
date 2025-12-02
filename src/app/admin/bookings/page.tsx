"use client";

import { useEffect, useState } from "react";
import { Search, Eye, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookingDetailModal } from "@/components/BookingDetailModal";
import { Input } from "@/components/ui/input";
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

interface Booking {
    id: string;
    booking_number: string;
    created_at: string;
    status: string;
    total_price: number;
    customer_name: string;
    destinations: {
        title: string;
    } | null;
}

export default function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.append("search", search);
            if (statusFilter && statusFilter !== "all") params.append("status", statusFilter);

            const res = await fetch(`/api/admin/bookings?${params.toString()}`);
            const data = await res.json();

            if (res.ok) {
                const formattedData = (data || []).map((b: any) => ({
                    ...b,
                    destination: Array.isArray(b.destinations) ? b.destinations[0] : b.destinations,
                    destinations: Array.isArray(b.destinations) ? b.destinations[0] : b.destinations
                })) as Booking[];
                setBookings(formattedData);
            } else {
                console.error("Failed to fetch bookings:", data.error);
            }
        } catch (error) {
            console.error("Error fetching bookings:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [search, statusFilter]);

    const handleViewDetails = (booking: Booking) => {
        setSelectedBooking(booking);
        setIsModalOpen(true);
    };

    return (
        <div className="p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Bookings</h1>
                    <p className="text-muted-foreground">Manage customer bookings and orders.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <CardTitle>All Bookings</CardTitle>
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search booking no..."
                                    className="pl-9"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <Select
                                value={statusFilter}
                                onValueChange={setStatusFilter}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="confirmed">Confirmed</SelectItem>
                                    <SelectItem value="paid">Paid</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Booking No</th>
                                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Customer</th>
                                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Destination</th>
                                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Date</th>
                                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Amount</th>
                                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Status</th>
                                    <th className="text-right py-3 px-4 font-medium text-sm text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={7} className="text-center py-8 text-muted-foreground">
                                            Loading...
                                        </td>
                                    </tr>
                                ) : bookings.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center py-8 text-muted-foreground">
                                            No bookings found
                                        </td>
                                    </tr>
                                ) : (
                                    bookings.map((booking) => (
                                        <tr key={booking.id} className="border-b hover:bg-gray-50">
                                            <td className="py-3 px-4 font-medium">{booking.booking_number}</td>
                                            <td className="py-3 px-4">
                                                <div className="font-medium">{booking.customer_name || "Unknown"}</div>
                                            </td>
                                            <td className="py-3 px-4">{booking.destinations?.title || "Unknown"}</td>
                                            <td className="py-3 px-4 text-sm">
                                                {format(new Date(booking.created_at), "MMM d, yyyy")}
                                            </td>
                                            <td className="py-3 px-4">
                                                {new Intl.NumberFormat("id-ID", {
                                                    style: "currency",
                                                    currency: "IDR",
                                                }).format(booking.total_price)}
                                            </td>
                                            <td className="py-3 px-4">
                                                <Select
                                                    value={booking.status}
                                                    onValueChange={async (newStatus) => {
                                                        try {
                                                            const res = await fetch(`/api/admin/bookings/${booking.id}`, {
                                                                method: "PATCH",
                                                                headers: { "Content-Type": "application/json" },
                                                                body: JSON.stringify({ status: newStatus }),
                                                            });

                                                            if (res.ok) {
                                                                fetchBookings(); // Refresh data
                                                            } else {
                                                                const error = await res.json();
                                                                alert(`Failed to update: ${error.error}`);
                                                            }
                                                        } catch (error) {
                                                            console.error("Update error:", error);
                                                            alert("Failed to update status");
                                                        }
                                                    }}
                                                >
                                                    <SelectTrigger className={`w-[130px] ${booking.status === "confirmed" || booking.status === "completed"
                                                        ? "bg-green-100 text-green-700 border-green-300"
                                                        : booking.status === "pending"
                                                            ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                                                            : booking.status === "paid"
                                                                ? "bg-blue-100 text-blue-700 border-blue-300"
                                                                : "bg-red-100 text-red-700 border-red-300"
                                                        }`}>
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
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleViewDetails(booking)}
                                                >
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    View
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <BookingDetailModal
                booking={selectedBooking}
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                onStatusUpdate={fetchBookings}
            />
        </div>
    );
}
