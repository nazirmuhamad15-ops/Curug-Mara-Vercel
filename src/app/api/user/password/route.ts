import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { createAdminClient } from "@/lib/supabase-admin";
import { hash } from "bcryptjs";

export async function PATCH(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { password } = body;

        if (!password || password.length < 6) {
            return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
        }

        const supabaseAdmin = createAdminClient();

        // Update password using Supabase Admin
        const { error } = await supabaseAdmin.auth.admin.updateUserById(
            session.user.id as string,
            { password: password }
        );

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ message: "Password updated successfully" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Invalid request" }, { status: 400 });
    }
}
