import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";


export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const limit = parseInt(searchParams.get("limit") || "12");

    let query = supabase
        .from("destinations")
        .select(`
            *,
            categories (id, name, slug)
        `)
        .not("published_at", "is", null) // Only published
        .order("created_at", { ascending: false });

    // Filter by search
    if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,location.ilike.%${search}%`);
    }

    // Filter by category
    if (category) {
        query = query.eq("category_id", category);
    }

    // Filter by featured
    if (featured === "true") {
        query = query.eq("featured", true);
    }

    // Limit results
    if (limit) {
        query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}
