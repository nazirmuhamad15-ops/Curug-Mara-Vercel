import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

// Prevent caching
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user.role !== "admin" && session.user.role !== "superadmin")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const supabaseAdmin = createAdminClient();

        const { data, error } = await supabaseAdmin
            .from("contact_messages")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error: any) {
        console.error("Error fetching messages:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user.role !== "admin" && session.user.role !== "superadmin")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { id, status } = body;

        if (!id || !status) {
            return NextResponse.json({ error: "ID and status are required" }, { status: 400 });
        }

        const supabaseAdmin = createAdminClient();

        const { error } = await supabaseAdmin
            .from("contact_messages")
            // @ts-ignore
            .update({ status })
            .eq("id", id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Error updating message status:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
