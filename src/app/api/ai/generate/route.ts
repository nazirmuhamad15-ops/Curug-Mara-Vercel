
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { prompt, type } = body;

        if (!prompt || !type) {
            return NextResponse.json({ error: "Missing prompt or type" }, { status: 400 });
        }

        // 3️⃣ API key – must be present in .env.local
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error("❌ GEMINI_API_KEY is missing");
            return NextResponse.json(
                { error: "Server configuration error – missing GEMINI_API_KEY" },
                { status: 500 }
            );
        }

        // 4️⃣ Build system prompt based on requested type (Indonesian)
        let systemPrompt = "";
        if (type === "destination") {
            systemPrompt = `Anda adalah penulis profesional untuk Web Advneture Curug Mara. Tuliskan deskripsi pendek dan panjang menarik dan SEO‑friendly (sekitar 200 kata) tentang destinasi wisata  "${prompt}". Fokus pada keindahan alam, petualangan, dan relaksasi.`;
        } else if (type === "blog") {
            systemPrompt = `Saya adalah blogger Travel Profesional . Buat artikel blog Adventure Curug Mara yang menarik (sekitar 500 kata) tentang: "${prompt}". seakan-akan kamu copywriter profesional,hilangakn simbol **, lalu kalimat peembuka nya buat senatural mungkin,buatlah beberapa paragraf yg rapih, sebab kamu copy writer profesional`;
        } else {
            systemPrompt = prompt; // fallback
        }

        // 5️⃣ Initialise Gemini – preview model 1.5 flash
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // 6️⃣ Generate content
        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ content: text });
    } catch (error: any) {
        console.error("🛑 AI Generation Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to generate content. Please try again." },
            { status: 500 }
        );
    }
}