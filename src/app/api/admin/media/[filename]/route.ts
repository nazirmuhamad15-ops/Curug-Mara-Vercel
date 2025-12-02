import { createAdminClient } from "@/lib/supabase-admin";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ filename: string }> }
) {
    const { filename } = await params;
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id as string;
    const supabase = createAdminClient();

    // Verify Admin Role
    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();

    const userRole = (profile as any)?.role;

    if (!profile || (userRole !== "admin" && userRole !== "superadmin")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete from storage
    const { error: storageError } = await supabase
        .storage
        .from("media")
        .remove([filename]);

    if (storageError) {
        return NextResponse.json({ error: storageError.message }, { status: 500 });
    }

    // Delete from media table
    await supabase
        .from("media")
        .delete()
        .eq("filename", filename);

    return NextResponse.json({ success: true });
}
