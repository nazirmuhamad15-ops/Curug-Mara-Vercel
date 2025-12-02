import { createClient } from '@supabase/supabase-js';

// Hardcoding keys temporarily for debugging (will revert)
const supabaseUrl = "https://zekpaionajqjlrcixfjg.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpla3BhaW9uYWpxamxyY2l4ZmpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE5OTYwNDUsImV4cCI6MjA0NzU3MjA0NX0.u2-a1LgL-X_hWqC_kG_R-k_j_l_m_n_o_p_q_r_s_t_u"; // Placeholder, I need to find the real key from .env.local

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyContact() {
    console.log("Verifying 'contact' page content...");
    const { data, error } = await supabase
        .from('page_contents')
        .select('*')
        .eq('page_slug', 'contact');

    if (error) {
        console.error("Error fetching page_contents:", error);
    } else {
        console.log(`Found ${data.length} rows for 'contact'.`);
        data.forEach(row => {
            console.log(`Section: ${row.section_key}`);
            console.log(`Content:`, JSON.stringify(row.content, null, 2));
        });
    }
}

verifyContact();
