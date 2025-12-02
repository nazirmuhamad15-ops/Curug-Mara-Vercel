import { createAdminClient } from "@/lib/supabase-admin";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const role = searchParams.get("role");

    const supabase = createAdminClient();

    // Fetch profiles
    let query = supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

    if (role && role !== "all") {
        query = query.eq("role", role);
    }

    const { data: profiles, error: profilesError } = await query;

    if (profilesError) {
        return NextResponse.json({ error: profilesError.message }, { status: 500 });
    }

    // Fetch auth users to get emails
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();

    if (usersError) {
        console.error("Error fetching auth users:", usersError);
        // Fallback to just profiles if auth fetch fails
        return NextResponse.json(profiles);
    }

    // Merge profiles with User data to get emails
    // @ts-ignore
    let mergedData = (profiles || []).map((profile: any) => {
        // @ts-ignore
        const authUser = users.find(u => u.id === profile.id);
        return {
            ...profile,
            // @ts-ignore
            email: authUser?.email || profile.email, // Use auth email or profile email
            // @ts-ignore
            name: profile.name || authUser?.user_metadata?.name // Use profile name or auth metadata
        };
    });

    // Filter by search if provided
    if (search) {
        const searchLower = search.toLowerCase();
        mergedData = mergedData.filter((u: any) =>
            (u.name && u.name.toLowerCase().includes(searchLower)) ||
            (u.email && u.email.toLowerCase().includes(searchLower))
        );
    }

    return NextResponse.json(mergedData);
}
