import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";


export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");

    let query = supabase
        .from("blog_posts")
        .select("*")
        .not("published_at", "is", null) // Only published posts
        .is("deleted_at", null) // Exclude deleted posts
        .order("published_at", { ascending: false })
        .range(offset, offset + limit - 1);

    // Filter by search
    if (search) {
        query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`);
    }

    // Filter by category
    if (category) {
        query = query.eq("category", category);
    }

    const { data, error } = await query;

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}
