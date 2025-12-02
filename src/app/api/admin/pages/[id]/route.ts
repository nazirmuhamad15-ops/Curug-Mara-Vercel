import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { content, page_slug } = body;

        if (!content) {
            return NextResponse.json({ error: "Content is required" }, { status: 400 });
        }

        // Use Service Role Key to bypass RLS for Admin updates
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { error } = await supabaseAdmin
            .from("page_contents")
            .update({ content, updated_at: new Date().toISOString() })
            .eq("id", id);

        if (error) throw error;

        // Revalidate the specific page to show updated content immediately
        if (page_slug) {
            revalidatePath(`/${page_slug}`);
            revalidatePath("/"); // Revalidate home just in case
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Error updating page content:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
