import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Invalid email format" },
                { status: 400 }
            );
        }

        // Send password reset email using Supabase Auth
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/reset-password`,
        });

        if (error) {
            console.error("Password reset error:", error);
            // Don't reveal if email exists or not for security
            return NextResponse.json(
                { message: "If an account exists with this email, you will receive a password reset link." },
                { status: 200 }
            );
        }

        return NextResponse.json(
            { message: "Password reset email sent successfully" },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Forgot password API error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
