import { createAdminClient } from "@/lib/supabase-admin";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createAdminClient();

    // List files from storage bucket
    const { data, error } = await supabase
        .storage
        .from("media")
        .list();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get public URLs for each file
    const filesWithUrls = data.map(file => {
        const { data: { publicUrl } } = supabase
            .storage
            .from("media")
            .getPublicUrl(file.name);

        return {
            ...file,
            url: publicUrl
        };
    });

    return NextResponse.json(filesWithUrls);
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const supabase = createAdminClient();

        // Generate unique filename
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        // Upload to Supabase Storage
        const { data, error } = await supabase
            .storage
            .from("media")
            .upload(fileName, file, {
                cacheControl: "3600",
                upsert: false
            });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Get public URL
        const { data: { publicUrl } } = supabase
            .storage
            .from("media")
            .getPublicUrl(fileName);

        // Save to media table
        // Use session.user.id instead of supabase.auth.getUser() since we are using Better Auth
        const userId = session.user.id;

        await supabase
            .from("media")
            // @ts-ignore
            .insert({
                filename: fileName,
                original_filename: file.name,
                file_path: data.path,
                file_size: file.size,
                mime_type: file.type,
                uploaded_by: userId
            });

        return NextResponse.json({
            ...data,
            url: publicUrl
        });
    } catch (error) {
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
