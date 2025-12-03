import { createAdminClient } from "@/lib/supabase-admin";
import { NextResponse } from "next/server";

export async function GET() {
    const supabase = createAdminClient();

    // List users from Auth
    const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();

    if (authError) {
        return NextResponse.json({ error: authError.message }, { status: 500 });
    }

    // Get profiles
    const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("*");

    if (profileError) {
        return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    // Combine data
    const result = users.map(user => {
        const profile = (profiles as any[])?.find(p => p.id === user.id);
        return {
            auth_id: user.id,
            email: user.email,
            provider: user.app_metadata.provider,
            has_profile: !!profile,
            profile_data: profile || null
        };
    });

    return NextResponse.json({
        total_users: users.length,
        users: result
    });
}
