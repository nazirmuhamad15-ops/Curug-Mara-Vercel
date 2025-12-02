import { createAdminClient } from "@/lib/supabase-admin";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        // Verify Cron Secret (Optional but recommended for Vercel Cron)
        const authHeader = request.headers.get('authorization');
        if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const supabase = createAdminClient();
        const now = new Date();
        const currentHour = now.getHours();

        // Only run cancellation logic if it's past 12:00 PM
        // Note: Vercel Cron can be scheduled, but this is an extra safety check
        if (currentHour < 12) {
            return NextResponse.json({ message: 'Too early to cancel bookings' });
        }

        const today = now.toISOString().split('T')[0];

        // Find unpaid bookings for today
        const { data: bookings, error: fetchError } = await supabase
            .from('bookings')
            .select('id, booking_number')
            .eq('status', 'pending')
            .eq('payment_status', 'unpaid')
            .eq('start_date', today);

        if (fetchError) {
            throw fetchError;
        }

        if (!bookings || bookings.length === 0) {
            return NextResponse.json({ message: 'No expired bookings found' });
        }

        // Cancel bookings
        const bookingIds = bookings.map(b => b.id);
        const { error: updateError } = await supabase
            .from('bookings')
            .update({ status: 'cancelled', notes: 'Auto-cancelled by system (Expired)' })
            .in('id', bookingIds);

        if (updateError) {
            throw updateError;
        }

        return NextResponse.json({
            message: `Successfully cancelled ${bookings.length} bookings`,
            cancelled_bookings: bookings.map(b => b.booking_number)
        });

    } catch (error: any) {
        console.error('Cron job error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
