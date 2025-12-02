import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";


export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;

    const { data, error } = await supabase
        .from("destinations")
        .select(`
            *,
            categories (id, name, slug)
        `)
        .eq("slug", slug)
        .not("published_at", "is", null) // Only published
        .single();

    if (error) {
        return NextResponse.json({ error: "Destination not found" }, { status: 404 });
    }

    return NextResponse.json(data);
}
