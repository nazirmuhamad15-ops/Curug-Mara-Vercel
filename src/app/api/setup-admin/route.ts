import { createAdminClient } from "@/lib/supabase-admin";
import { NextResponse } from "next/server";

export async function GET() {
    const supabase = createAdminClient();
    const email = "admin@test.com";
    const password = "password123";

    // 1. Create user
    const { data: user, error: createError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { name: "Test Admin" },
    });

    if (createError) {
        // If user exists, just return success (we assume password is known or we can't change it easily here without reset)
        // Actually, we can update the password to be sure.
        if (createError.message.includes("already registered")) {
            // @ts-ignore
            const { data: existingUser } = await supabase.from("profiles").select("id").eq("email", email).single();
            if (existingUser) {
                // @ts-ignore
                await supabase.auth.admin.updateUserById(existingUser.id, { password: password });
            }
        } else {
            return NextResponse.json({ error: createError.message }, { status: 500 });
        }
    }

    // 2. Ensure profile exists and has admin role
    // The trigger should have created the profile, but we need to update the role.
    // We'll wait a bit or just upsert.

    // Fetch the user ID (either from creation or lookup)
    // @ts-ignore
    const { data: userData } = await supabase.from("profiles").select("id").eq("email", email).single();

    if (userData) {
        const { error: updateError } = await supabase
            .from("profiles")
            // @ts-ignore
            .update({ role: "admin" })
            // @ts-ignore
            .eq("id", userData.id);

        if (updateError) {
            return NextResponse.json({ error: updateError.message }, { status: 500 });
        }
    } else {
        // Should not happen if trigger works, but if it didn't:
        // We can't easily insert into profiles if we don't have the ID from createUser result (which might be null if already exists and we didn't fetch it).
        // Let's assume trigger works or user exists.
    }

    return NextResponse.json({ message: "Admin user setup complete", email, password });
}
