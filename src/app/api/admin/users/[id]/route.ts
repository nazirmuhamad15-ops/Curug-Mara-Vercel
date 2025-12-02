import { createAdminClient } from "@/lib/supabase-admin";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
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

    try {
        const body = await request.json();
        const { role } = body;

        if (!role) {
            return NextResponse.json({ error: "Role is required" }, { status: 400 });
        }

        const { data, error } = await supabase
            .from("profiles")
            // @ts-ignore
            .update({
                role,
                updated_at: new Date().toISOString()
            })
            .eq("id", id)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
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

    try {
        // Delete from profiles (Supabase)
        const { error: profileError } = await supabase
            .from("profiles")
            .delete()
            .eq("id", id);

        if (profileError) {
            return NextResponse.json({ error: profileError.message }, { status: 500 });
        }

        // Also delete from Supabase Auth if possible
        const { error: authError } = await supabase.auth.admin.deleteUser(id);

        if (authError) {
            console.error("Error deleting auth user:", authError);
            // We continue even if auth delete fails, as profile is gone
        }

        return NextResponse.json({ message: "User deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Error deleting user" }, { status: 500 });
    }
}
