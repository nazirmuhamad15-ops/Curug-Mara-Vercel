import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { createAdminClient } from "@/lib/supabase-admin";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    if (!category) {
        return NextResponse.json({ error: "Category is required" }, { status: 400 });
    }

    try {
        const { data, error } = await supabase
            .from("settings")
            .select("key, value")
            .eq("category", category);

        if (error) throw error;

        // Convert array to object { key: value }
        const settings = data.reduce((acc: any, item: any) => {
            acc[item.key] = item.value;
            return acc;
        }, {});

        return NextResponse.json(settings);
    } catch (error: any) {
        console.error("Error fetching settings:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { category, settings } = body;

        if (!category || !settings) {
            return NextResponse.json({ error: "Category and settings are required" }, { status: 400 });
        }

        // Prepare upsert data
        const upsertData = Object.entries(settings).map(([key, value]) => ({
            key,
            value,
            category,
            updated_at: new Date().toISOString(),
        }));

        // Use Service Role Key to bypass RLS for Admin updates
        const supabaseAdmin = createAdminClient();

        const { error } = await supabaseAdmin
            .from("settings")
            // @ts-ignore
            .upsert(upsertData);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Error saving settings:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
