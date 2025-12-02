import { createAdminClient } from "@/lib/supabase-admin";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status"); // published, draft, deleted

    const supabase = createAdminClient();

    // Verify Admin Role
    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId as string)
        .single();

    const userRole = (profile as any)?.role;

    if (!profile || (userRole !== "admin" && userRole !== "superadmin")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    let query = supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });

    // Filter by status
    if (status === "published") {
        query = query.not("published_at", "is", null).is("deleted_at", null);
    } else if (status === "draft") {
        query = query.is("published_at", null).is("deleted_at", null);
    } else if (status === "deleted") {
        query = query.not("deleted_at", "is", null);
    } else {
        // All (exclude deleted by default)
        query = query.is("deleted_at", null);
    }

    // Search by title
    if (search) {
        query = query.ilike("title", `%${search}%`);
    }

    const { data: posts, error } = await query;

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!posts || posts.length === 0) {
        return NextResponse.json([]);
    }

    // Manually fetch profiles
    // @ts-ignore
    const authorIds = [...new Set(posts.map(p => p.author_id).filter(Boolean))];
    const { data: profiles } = await supabase
        .from("profiles")
        .select("id, name")
        .in("id", authorIds);

    const profileMap = (profiles as any[] || []).reduce((acc: any, p) => {
        acc[p.id] = p;
        return acc;
    }, {});

    // @ts-ignore
    const formattedPosts = posts.map(p => ({
        // @ts-ignore
        ...p,
        // @ts-ignore
        profiles: profileMap[p.author_id] || { name: 'Unknown' }
    }));

    return NextResponse.json(formattedPosts);
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const supabase = createAdminClient();

        // Verify Admin Role
        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", userId as string)
            .single();

        const userRole = (profile as any)?.role;

        if (!profile || (userRole !== "admin" && userRole !== "superadmin")) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Get user ID from session
        const authorId = userId;

        const { data, error } = await supabase
            .from("blog_posts")
            .insert({
                ...body,
                author_id: authorId,
            })
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
