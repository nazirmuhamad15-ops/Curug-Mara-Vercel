import { createAdminClient } from "@/lib/supabase-admin";
import { NextResponse } from "next/server";

export async function GET() {
    const supabase = createAdminClient();

    const categories = [
        { name: "Nature", slug: "nature", description: "Explore the beauty of nature" },
        { name: "Adventure", slug: "adventure", description: "Thrilling adventures" },
        { name: "Family", slug: "family", description: "Fun for the whole family" },
        { name: "Relaxation", slug: "relaxation", description: "Chill and relax" },
    ];

    const { data, error } = await supabase
        .from("categories")
        .upsert(categories, { onConflict: "slug" })
        .select();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Categories seeded", data });
}
