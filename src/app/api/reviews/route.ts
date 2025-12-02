import { createAdminClient } from "@/lib/supabase-admin";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";


export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const destination_id = searchParams.get("destination_id");

    if (!destination_id) {
        return NextResponse.json({ error: "Destination ID required" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
        .from("reviews")
        .select("*, profiles(name, avatar_url)")
        .eq("destination_id", destination_id)
        .order("created_at", { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { destination_id, rating, comment } = body;

        if (!destination_id || !rating || !comment) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const supabase = createAdminClient();
        const { data, error } = await supabase
            .from("reviews")
            // @ts-ignore
            .insert({
                user_id: session.user.id,
                destination_id,
                rating,
                comment,
            })
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
}
