import dotenv from "dotenv";
dotenv.config();

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { message } = await req.json();
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { reply: "Maaf, fitur chat AI sedang tidak tersedia (API Key missing)." },
                { status: 500 }
            );
        }

        // Initialize Gemini with specific config from working example
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
        Kamu adalah asisten virtual (Customer Service) untuk "Adventure Curug Mara", sebuah penyedia layanan wisata alam di Subang, Jawa Barat.
        
        Tugasmu adalah menjawab pertanyaan pelanggan dengan ramah, sopan, dan membantu. Gunakan Bahasa Indonesia yang baik hilabgkan simbol *(bintang) atau lainnya rapihkan tulisan nya.
        
        Informasi Paket Wisata:
        1. Paket A (Mara Fun Trip): Rp 350.000/pax. Durasi 2 Jam. Cocok untuk pemula/keluarga. Trekking ringan, main air.
        2. Paket B (Mara Adventure): Rp 550.000/pax. Durasi 4 Hours. Best Seller. Termasuk Rappelling air terjun.
        3. Paket C (Mara Extreme): Rp 850.000/pax. Full Day. Untuk expert. Canyoning ekstrem, rappelling tinggi.
        
        Fasilitas Umum: Guide profesional, makan siang (untuk paket tertentu), asuransi, dokumentasi.
        Lokasi: Curug Mara, Subang, Jawa Barat.
        
        Jika kamu tidak tahu jawabannya, atau jika pelanggan ingin booking, arahkan mereka untuk menghubungi admin via WhatsApp di nomor 081234567890.
        
        Pertanyaan Pelanggan: ${message}
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ reply: text });
    } catch (error) {
        console.error("Gemini API Error:", error);
        return NextResponse.json(
            { reply: "Maaf, saya sedang mengalami gangguan. Silakan coba lagi nanti." },
            { status: 500 }
        );
    }
}
