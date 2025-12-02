import { createAdminClient } from "@/lib/supabase-admin";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";


export async function POST(request: Request) {
    try {
        const body = await request.json();
        const session = await getServerSession(authOptions);
        const userId = session?.user?.id;
        const supabase = createAdminClient();

        const {
            destination_id,
            name,
            phone,
            start_date,
            participants,
            notes,
            payment_method = 'cash',
        } = body;

        if (!destination_id || !name || !phone || !start_date || !participants) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const { data: destination, error: destError } = await supabase
            .from("destinations")
            .select("pricing")
            .eq("id", destination_id)
            .single();

        if (destError || !destination) {
            return NextResponse.json({ error: "Destination not found" }, { status: 404 });
        }

        const total_price = (destination as any).pricing * participants;
        const booking_number = `BK-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        const { data, error } = await supabase
            .from("bookings")
            // @ts-ignore
            .insert({
                destination_id,
                customer_name: name,
                customer_phone: phone,
                start_date: start_date,
                end_date: start_date,
                participants: participants,
                notes: notes || null,
                total_price,
                status: "pending",
                payment_status: "unpaid",
                payment_method: payment_method,
                booking_number: booking_number,
                user_id: userId || null,
            })
            .select()
            .single();

        if (error) {
            console.error("Booking creation error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (err) {
        console.error("Booking API error:", err);
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
}
