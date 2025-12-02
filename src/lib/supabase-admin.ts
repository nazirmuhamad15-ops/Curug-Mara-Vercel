import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/database";

// Note: This client should only be used in server-side contexts where
// the SUPABASE_SERVICE_ROLE_KEY is available.
// For client-side operations, use the standard supabase client.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const createAdminClient = () => {
    if (!supabaseUrl) {
        console.error("Error: NEXT_PUBLIC_SUPABASE_URL is not set");
        throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
    }
    if (!supabaseServiceRoleKey) {
        console.error("Error: SUPABASE_SERVICE_ROLE_KEY is not set");
        throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set. Admin operations require this key.");
    }

    return createClient<Database>(
        supabaseUrl,
        supabaseServiceRoleKey,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        }
    );
};
