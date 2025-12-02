import { createAdminClient } from "@/lib/supabase-admin";
import { NextResponse } from "next/server";
import { db } from "../../../../db";
import { profiles, users } from "@/db/schema";
import { eq } from "drizzle-orm";


export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password, name } = body;

        if (!email || !password || !name) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const supabase = createAdminClient();

        // 1. Create Auth User (Supabase)
        const { data: user, error: createError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: false,
            user_metadata: { name, full_name: name }
        });

        if (createError) {
            console.error("Supabase Auth Error:", createError);
            return NextResponse.json({ error: createError.message }, { status: 400 });
        }

        if (!user || !user.user) {
            return NextResponse.json({ error: "User creation failed" }, { status: 500 });
        }

        const userId = user.user.id;

        // 2. Create Profile (Drizzle)
        try {
            await db.insert(profiles).values({
                id: userId,
                name: name,
                role: "customer",
                avatarUrl: "",
                createdAt: new Date(),
                updatedAt: new Date()
            } as any);
        } catch (dbError: any) {
            console.error("Drizzle Profile Error:", dbError);
            // If profile exists (race condition?), try update
            if (dbError.code === '23505') {
                await db.update(profiles)
                    .set({ name: name })
                    .where(eq(profiles.id, userId));
            }
        }

        // 3. Create User (Drizzle - Optional/Legacy)
        try {
            await db.insert(users).values({
                id: userId,
                fullName: name,
                phone: null,
                createdAt: new Date(),
                updatedAt: new Date()
            } as any);
        } catch (dbError) {
            console.warn("Drizzle User Insert Error (Non-fatal):", dbError);
        }

        return NextResponse.json({ user });

    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
