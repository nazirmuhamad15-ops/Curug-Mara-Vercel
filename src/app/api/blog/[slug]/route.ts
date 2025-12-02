import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";


export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;

        const { data, error } = await supabase
            .from("blog_posts")
            .select("*")
            .eq("slug", slug)
            .not("published_at", "is", null)
            .is("deleted_at", null)
            .single();

        if (error) {
            console.error("Database error:", error);
            return NextResponse.json(
                { error: "Post not found" },
                { status: 404 }
            );
        }

        if (!data) {
            return NextResponse.json(
                { error: "Post not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(data);
    } catch (error: any) {
        console.error("Blog detail error:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
