import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, ArrowLeft, CheckCircle, XCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";

export default async function BookingDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!user) {
        return <div>Please log in to view this booking.</div>;
    }

    const { data: booking } = await supabase
        .from("bookings")
        .select("*, destination:destinations(*)")
        .eq("id", id)
        .single();

    if (!booking) {
        notFound();
    }

    // Verify ownership (optional but recommended)
    // const { data: profile } = await supabase.from("profiles").select("id").eq("email", user.email).single();
    // if (booking.user_id !== profile?.id) { return <div>Unauthorized</div>; }

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "confirmed": return "bg-green-500";
            case "pending": return "bg-yellow-500";
            case "cancelled": return "bg-red-500";
            case "completed": return "bg-blue-500";
            default: return "bg-gray-500";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case "confirmed": return <CheckCircle className="w-5 h-5 text-green-500" />;
            case "pending": return <Clock className="w-5 h-5 text-yellow-500" />;
            case "cancelled": return <XCircle className="w-5 h-5 text-red-500" />;
            case "completed": return <CheckCircle className="w-5 h-5 text-blue-500" />;
            default: return <Clock className="w-5 h-5 text-gray-500" />;
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/bookings">
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold">Booking Details</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-xl text-primary">
                                        {booking.destination?.title}
                                    </CardTitle>
                                    <div className="flex items-center gap-2 text-muted-foreground mt-1">
                                        <MapPin className="w-4 h-4" />
                                        {booking.destination?.location}
                                    </div>
                                </div>
                                <Badge className={getStatusColor(booking.status)}>
                                    {booking.status}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <div className="text-sm text-muted-foreground">Booking Date</div>
                                    <div className="flex items-center gap-2 font-medium">
                                        <Calendar className="w-4 h-4" />
                                        {format(new Date(booking.date), "MMMM d, yyyy")}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-sm text-muted-foreground">Guests</div>
                                    <div className="flex items-center gap-2 font-medium">
                                        <Users className="w-4 h-4" />
                                        {booking.guests} People
                                    </div>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h3 className="font-semibold mb-2">Itinerary</h3>
                                <p className="text-sm text-muted-foreground">
                                    {booking.destination?.description || "No description available."}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {booking.destination?.image_url && (
                        <div className="rounded-lg overflow-hidden h-64 w-full">
                            <img
                                src={booking.destination.image_url}
                                alt={booking.destination.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Price per person</span>
                                <span>Rp {booking.destination?.pricing?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Guests</span>
                                <span>x {booking.guests}</span>
                            </div>
                            <div className="border-t pt-2 flex justify-between items-center font-bold text-lg">
                                <span>Total</span>
                                <span>Rp {booking.total_price?.toLocaleString()}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Need Help?</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                If you have any questions about your booking, please contact our support team.
                            </p>
                            <Button className="w-full" variant="outline" asChild>
                                <Link href="/contact">Contact Support</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
