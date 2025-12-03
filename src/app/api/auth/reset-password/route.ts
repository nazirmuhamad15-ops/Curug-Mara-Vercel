import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
    try {
        const { password, accessToken } = await request.json();

        if (!password || !accessToken) {
            return NextResponse.json(
                { error: "Password and access token are required" },
                { status: 400 }
            );
        }

        // Validate password length
        if (password.length < 6) {
            return NextResponse.json(
                { error: "Password must be at least 6 characters" },
                { status: 400 }
            );
        }

        // Update password using Supabase Auth
        // First, set the session with the access token
        const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: '', // Not needed for password reset
        });

        if (sessionError) {
            console.error("Session error:", sessionError);
            return NextResponse.json(
                { error: "Invalid or expired reset link" },
                { status: 400 }
            );
        }

        // Update the password
        const { error: updateError } = await supabase.auth.updateUser({
            password: password,
        });

        if (updateError) {
            console.error("Password update error:", updateError);
            return NextResponse.json(
                { error: "Failed to update password" },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: "Password updated successfully" },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Reset password API error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
