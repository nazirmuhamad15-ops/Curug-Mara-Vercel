import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Force dynamic to ensure fresh data on every request
export const dynamic = 'force-dynamic';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const slug = (await params).slug;

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            global: {
                fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' }),
            },
        }
    );

    try {
        const { data, error } = await supabase
            .from("page_contents")
            .select("*")
            .eq("page_slug", slug);

        if (error) throw error;

        // Transform array to object keyed by section_key for easier frontend use
        const contentMap = data.reduce((acc: any, item: any) => {
            acc[item.section_key] = item.content;
            return acc;
        }, {});

        return NextResponse.json(contentMap);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
