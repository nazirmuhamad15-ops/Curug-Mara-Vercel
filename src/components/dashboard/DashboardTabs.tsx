"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, Loader2, Clock, LayoutDashboard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function DashboardTabs() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    // Data State
    const [profile, setProfile] = useState<any>(null);
    const [bookings, setBookings] = useState<any[]>([]);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/signin");
        } else if (status === "authenticated") {
            fetchData();
        }
    }, [status, router]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [profileRes, bookingsRes] = await Promise.all([
                fetch("/api/user/profile"),
                fetch("/api/user/bookings")
            ]);

            if (profileRes.ok) {
                const profileData = await profileRes.json();
                setProfile(profileData);
            }

            if (bookingsRes.ok) {
                const bookingsData = await bookingsRes.json();
                setBookings(bookingsData);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Stats Calculation
    const totalBookings = bookings.length;
    const upcomingTrips = bookings.filter(b => new Date(b.start_date) > new Date() && b.status !== 'cancelled').length;
    const totalSpent = bookings
        .filter(b => b.status === 'paid' || b.status === 'confirmed' || b.status === 'completed')
        .reduce((acc, curr) => acc + curr.total_price, 0);

    if (status === "loading" || loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                    <AvatarImage src={session?.user?.image || undefined} />
                    <AvatarFallback className="text-lg bg-primary/10 text-primary">
                        {session?.user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <h1 className="text-3xl font-bold">Welcome back, {profile?.name || session?.user?.name || "Traveler"}! 👋</h1>
                    <p className="text-muted-foreground">
                        Manage your bookings and adventures.
                    </p>
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex items-center gap-2 text-lg font-semibold">
                    <LayoutDashboard className="w-5 h-5" />
                    <h2>Overview</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Upcoming Trips</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{upcomingTrips}</div>
                            <p className="text-xs text-muted-foreground">
                                Ready for your next adventure?
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalBookings}</div>
                            <p className="text-xs text-muted-foreground">
                                Lifetime adventures
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {new Intl.NumberFormat("id-ID", {
                                    style: "currency",
                                    currency: "IDR",
                                    maximumFractionDigits: 0,
                                }).format(totalSpent)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Invested in memories
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
