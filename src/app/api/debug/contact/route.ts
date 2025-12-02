import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = 'force-dynamic';

export async function GET() {
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
            .eq("page_slug", "contact");

        if (error) throw error;

        return NextResponse.json({
            data,
            env: {
                url: process.env.NEXT_PUBLIC_SUPABASE_URL,
                hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
            }
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
