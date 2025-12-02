
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

async function testSignup() {
    console.log("Testing Admin User Creation...");
    const email = `test-${Date.now()}@example.com`;
    const password = "password123";
    const name = "Test User";

    try {
        console.log(`Creating user: ${email}`);
        const { data: user, error: createError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: {
                name,
                full_name: name,
                username: email.split('@')[0]
            }
        });

        if (createError) {
            console.error("User Creation Error:", createError);
            fs.writeFileSync('signup_script_error.log', JSON.stringify(createError, null, 2));
        } else {
            console.log("User created successfully:", user.user?.id);

            // Cleanup
            console.log("Cleaning up...");
            await supabase.auth.admin.deleteUser(user.user!.id);
            console.log("User deleted.");
        }

    } catch (e) {
        console.error("Exception:", e);
    }
}

testSignup();
