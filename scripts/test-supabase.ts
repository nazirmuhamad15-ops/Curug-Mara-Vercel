
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load env vars from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error("Missing Supabase env vars (need SERVICE_ROLE_KEY)");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function test() {
    console.log("Testing Supabase connection...");
    console.log("URL:", supabaseUrl);

    try {
        // List users to get a valid ID
        console.log("\nListing users...");
        const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

        if (listError) {
            console.error("Error listing users:", listError);
        } else if (users && users.length > 0) {
            const userId = users[0].id;
            console.log(`Found user: ${userId}`);

            // Try to insert into public.users with this ID and NULL phone
            console.log(`Attempting insert into public.users with existing ID: ${userId} and NULL phone`);
            const { error: insertError } = await supabase
                .from("users")
                .insert({
                    id: userId,
                    full_name: "Test User Existing",
                    phone: null
                });

            if (insertError) {
                console.log("Insert into public.users failed:", insertError.message);
                console.log("Details:", JSON.stringify(insertError, null, 2));
            } else {
                console.log("Insert into public.users succeeded! (Cleaning up...)");
                await supabase.from("users").delete().eq("id", userId);
            }
        } else {
            console.log("No users found. Cannot test insert with valid ID.");
        }

    } catch (e) {
        console.error("Exception:", e);
    }
}

test();
