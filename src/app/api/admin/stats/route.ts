import { createAdminClient } from "@/lib/supabase-admin";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { subDays, format, parseISO } from "date-fns";

// Initialize Supabase Admin Client
const supabaseAdmin = createAdminClient();


export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify Admin Role
    const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("role")
        .eq("id", session.user.id as string)
        .single();

    const userRole = (profile as any)?.role;

    if (!profile || (userRole !== "admin" && userRole !== "superadmin" && userRole !== "SuperAdmin")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    try {
        // 1. Fetch Counts
        const { count: bookingsCount } = await supabaseAdmin.from("bookings").select("*", { count: "exact", head: true });
        const { count: usersCount } = await supabaseAdmin.from("profiles").select("*", { count: "exact", head: true });
        const { count: destinationsCount } = await supabaseAdmin.from("destinations").select("*", { count: "exact", head: true });

        // 2. Fetch All Bookings for Revenue & Charts
        // @ts-ignore
        const { data: allBookings, error } = await supabaseAdmin
            .from("bookings")
            .select("created_at, total_price, status");

        if (error) throw error;

        // 3. Calculate Revenue
        const totalRevenue = allBookings
            // @ts-ignore
            ?.filter(b => ["paid", "completed", "confirmed"].includes(b.status.toLowerCase()))
            // @ts-ignore
            .reduce((sum, b) => sum + Number(b.total_price), 0) || 0;

        // 4. Prepare Revenue Chart Data (Last 30 Days)
        const last30Days = Array.from({ length: 30 }, (_, i) => {
            const d = subDays(new Date(), 29 - i);
            return format(d, "yyyy-MM-dd");
        });

        const revenueByDate = last30Days.map(date => {
            const dayRevenue = allBookings
                // @ts-ignore
                ?.filter(b =>
                    // @ts-ignore
                    ["paid", "completed", "confirmed"].includes(b.status.toLowerCase()) &&
                    // @ts-ignore
                    b.created_at.startsWith(date)
                )
                // @ts-ignore
                .reduce((sum, b) => sum + Number(b.total_price), 0) || 0;

            return { x: format(parseISO(date), "dd MMM"), y: dayRevenue };
        });

        // 5. Prepare Status Chart Data
        // @ts-ignore
        const statusCounts = (allBookings as any[])?.reduce((acc: any, curr) => {
            const status = curr.status.toLowerCase();
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});

        const statusData = Object.keys(statusCounts || {}).map(status => ({
            id: status,
            label: status.charAt(0).toUpperCase() + status.slice(1),
            value: statusCounts[status],
        }));

        return NextResponse.json({
            stats: {
                totalBookings: bookingsCount || 0,
                activeUsers: usersCount || 0,
                totalDestinations: destinationsCount || 0,
                revenue: totalRevenue,
            },
            revenueChartData: [{ id: "Revenue", data: revenueByDate }],
            statusChartData: statusData,
        });

    } catch (error: any) {
        console.error("Admin Stats Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
