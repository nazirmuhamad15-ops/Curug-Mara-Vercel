import { createAdminClient } from "@/lib/supabase-admin";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function GET(request: Request) {
    try {
        console.log("Fetching recent bookings...");
        const session = await getServerSession(authOptions);
        console.log("Session:", session ? "Found" : "Not found");

        if (!session || (session.user.role !== "admin" && session.user.role !== "superadmin")) {
            console.log("Unauthorized access attempt");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        console.log("Initializing admin client...");
        const supabaseAdmin = createAdminClient();

        console.log("Querying bookings...");
        // Fetch bookings without joins first to avoid relationship errors
        const { data: bookings, error } = await supabaseAdmin
            .from("bookings")
            .select(`
                id,
                booking_number,
                created_at,
                status,
                user_id,
                destination_id
            `)
            .order("created_at", { ascending: false })
            .limit(10);

        if (error) {
            console.error("Supabase query error:", error);
            throw error;
        }

        console.log("Bookings fetched successfully:", bookings?.length);

        if (!bookings || bookings.length === 0) {
            return NextResponse.json({ bookings: [] });
        }

        // Manually fetch profiles
        // @ts-ignore
        const userIds = [...new Set((bookings as any[]).map(b => b.user_id).filter(Boolean))];
        const { data: profiles } = await supabaseAdmin
            .from("profiles")
            .select("id, name, email")
            .in("id", userIds);

        // Manually fetch destinations
        // @ts-ignore
        const destinationIds = [...new Set((bookings as any[]).map(b => b.destination_id).filter(Boolean))];
        const { data: destinations } = await supabaseAdmin
            .from("destinations")
            .select("id, title")
            .in("id", destinationIds);

        // Create lookup maps
        const profileMap = (profiles as any[] || []).reduce((acc: any, p) => {
            acc[p.id] = p;
            return acc;
        }, {});

        const destinationMap = (destinations as any[] || []).reduce((acc: any, d) => {
            acc[d.id] = d;
            return acc;
        }, {});

        // Combine data
        // @ts-ignore
        const formattedBookings = (bookings as any[]).map(b => ({
            id: b.id,
            booking_number: b.booking_number,
            created_at: b.created_at,
            status: b.status,
            // @ts-ignore
            profiles: profileMap[b.user_id] || { name: 'Unknown', email: 'unknown' },
            // @ts-ignore
            destinations: b.destination_id ? destinationMap[b.destination_id] : null
        }));

        return NextResponse.json({ bookings: formattedBookings });

    } catch (error: any) {
        console.error("Error fetching recent bookings:", error);
        return NextResponse.json({
            error: error.message,
            stack: error.stack,
            details: "Check server logs for more info"
        }, { status: 500 });
    }
}
