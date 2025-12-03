import { createAdminClient } from "@/lib/supabase-admin";
// Force rebuild - cache clear
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";


export async function GET(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const supabase = createAdminClient();

    const { data, error } = await supabase
        .from("bookings")
        .select(`
            *,
            destinations (
                title,
                image_url,
                slug
            )
        `)
        .eq("user_id", userId as string)
        .order("created_at", { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}
