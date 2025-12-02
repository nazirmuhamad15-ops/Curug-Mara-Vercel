"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Users,
    MapPin,
    Calendar,
    DollarSign,
    Loader2,
    TrendingUp,
    ArrowRight
} from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RevenueLineChart } from "@/components/admin/charts/RevenueLineChart";
import { BookingStatusPieChart } from "@/components/admin/charts/BookingStatusPieChart";

interface DashboardStats {
    totalBookings: number;
    activeUsers: number;
    totalDestinations: number;
    revenue: number;
}

interface RecentBooking {
    id: string;
    booking_number: string;
    created_at: string;
    status: string;
    profiles: {
        name: string | null;
        email: string | null;
    } | null;
    destinations: {
        title: string;
    } | null;
}

export default function AdminDashboard() {
    const supabase = createClientComponentClient();
    const [stats, setStats] = useState<DashboardStats>({
        totalBookings: 0,
        activeUsers: 0,
        totalDestinations: 0,
        revenue: 0,
    });
    const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
    const [revenueChartData, setRevenueChartData] = useState<any[]>([]);
    const [statusChartData, setStatusChartData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDashboardData() {
            try {
                // Fetch Stats
                try {
                    const statsRes = await fetch("/api/admin/stats");
                    if (statsRes.ok) {
                        const statsData = await statsRes.json();
                        setStats(statsData.stats || {
                            totalBookings: 0,
                            activeUsers: 0,
                            totalDestinations: 0,
                            revenue: 0,
                        });
                        setRevenueChartData(statsData.revenueChartData || []);
                        setStatusChartData(statsData.statusChartData || []);
                    } else {
                        const errorText = await statsRes.text();
                        console.error("Failed to fetch stats:", statsRes.status, statsRes.statusText, errorText);
                    }
                } catch (error) {
                    console.error("Error fetching stats:", error);
                }

                // Fetch Recent Bookings
                try {
                    const bookingsRes = await fetch("/api/admin/bookings/recent");
                    if (bookingsRes.ok) {
                        const bookingsData = await bookingsRes.json();
                        setRecentBookings(bookingsData.bookings || []);
                    } else {
                        const errorText = await bookingsRes.text();
                        console.error("Failed to fetch recent bookings:", bookingsRes.status, bookingsRes.statusText, errorText);
                    }
                } catch (error) {
                    console.error("Error fetching recent bookings:", error);
                }

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard Admin</h1>
                <div className="text-sm text-muted-foreground">
                    {format(new Date(), "EEEE, dd MMMM yyyy", { locale: id })}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(stats.revenue)}
                        </div>
                        <p className="text-xs text-muted-foreground">+20.1% dari bulan lalu</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Booking</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalBookings}</div>
                        <p className="text-xs text-muted-foreground">+180 booking baru</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Destinasi Aktif</CardTitle>
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalDestinations}</div>
                        <p className="text-xs text-muted-foreground">Paket wisata tersedia</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pengguna Aktif</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.activeUsers}</div>
                        <p className="text-xs text-muted-foreground">+19 pengguna baru</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            {/* Charts Section */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Tren Pendapatan (30 Hari Terakhir)</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[350px]">
                            <RevenueLineChart data={revenueChartData} />
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Status Booking</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[350px]">
                            <BookingStatusPieChart data={statusChartData} />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Bookings */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Booking Terbaru</CardTitle>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/admin/bookings">
                            Lihat Semua <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="space-y-8">
                        {recentBookings.map((booking) => (
                            <div key={booking.id} className="flex items-center">
                                <div className="ml-4 space-y-1">
                                    <p className="text-sm font-medium leading-none">{booking.profiles?.name || "Guest"}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {booking.destinations?.title} • {booking.booking_number}
                                    </p>
                                </div>
                                <div className="ml-auto font-medium">
                                    <span className={`px-2 py-1 rounded-full text-xs ${booking.status === 'paid' ? 'bg-green-100 text-green-800' :
                                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
