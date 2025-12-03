import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";


export async function POST(request: Request) {
    try {
        const { name, email, subject, message } = await request.json();

        // Validation
        if (!name || !email || !subject || !message) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Invalid email address" },
                { status: 400 }
            );
        }

        // Use Service Role Key to bypass RLS for public contact form submissions
        const supabaseAdmin = createAdminClient();

        // Save to database
        const { data, error } = await supabaseAdmin
            .from("contact_messages")
            // @ts-ignore
            .insert([
                {
                    name,
                    email,
                    subject,
                    message,
                    status: "new",
                },
            ])
            .select()
            .single();

        if (error) {
            console.error("Database error:", error);
            return NextResponse.json(
                { error: "Failed to save message" },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Thank you! We'll get back to you soon.",
                data,
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Contact form error:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
