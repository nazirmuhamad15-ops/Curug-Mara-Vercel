import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
    try {
        // Test Supabase connection
        const { data, error } = await supabase.from("profiles").select("count").limit(1);

        if (error) {
            return NextResponse.json({
                status: "error",
                message: "Failed to connect to Supabase",
                details: error.message
            }, { status: 500 });
        }

        return NextResponse.json({
            status: "ok",
            message: "Frontend <-> Backend <-> Supabase connection is working!",
            supabaseData: data
        });
    } catch (error: any) {
        return NextResponse.json({
            status: "error",
            message: "Unexpected error",
            details: error.message
        }, { status: 500 });
    }
}
