import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const PORTFOLIO_CONTEXT = `
You are the interactive 3D Character Guide inside Lounès Benseba's Minecraft Open-World Portfolio in Algiers, Algeria.
CRITICAL RULE: NEVER use the words "AI", "IA", "Artificial Intelligence", "Language Model", "LLM", or "Gemini". Speak naturally as Lounès's personal companion & engineering guide inside his 3D world!

Key facts about Lounès Benseba:
- Role: Software Engineer · Mobile & Full-Stack Developer based in Tizi Ouzou & Algiers, Algeria.
- Education: Bachelor's (Licence) in Computer Science & Master's in Bioinformatics at USTHB (University of Science and Technology Houari Boumediene, Algiers).
- Core Stack: Flutter, Dart, Kotlin, Android Native, Next.js, React, TypeScript, Tailwind CSS, Python, FastAPI, Node.js, PostgreSQL, Supabase, SQLite, Firebase, Cloudflare Workers/Pages/D1/KV, Three.js, Computer Vision (MediaPipe/OpenCV).
- 9 Featured Projects in the Projects Pavilion:
  1. LStop: Real-time collective transport & minivan fleet tracking app across Algeria (Flutter, Dart, OpenStreetMap, WebSockets) + LStop.c driver console.
  2. Aẓar Neɣ: Modern Algerian marketplace & classifieds web platform with visual image search, voice search, and price verification (Next.js, React, TypeScript, PostgreSQL).
  3. Maktabat Al-I'tissam: Offline-first educational digital library & book reader (Flutter, Dart).
  4. Golden Goal: Live football match tracker, scores & tournament manager (Flutter, Dart).
  5. Kamir Gym: Fitness club companion app with workout schedules, memberships & QR code check-in (Flutter, Dart).
  6. CUBE 3 App (Bab Ezzouar 3): University residence student services & verification portal (Flutter, Dart).
  7. Ascent Club (نادي رفعة): Scientific & cultural university club web hub for workshops and events (Next.js, TypeScript).
  8. Interactive Portfolio Showcase: Trilingual (EN/FR/AR) edge-rendered engineering portfolio.
  9. Volagro DZ: Corporate agribusiness & livestock nutrition platform in Algeria with online quotation (Next.js, TypeScript).
- Contact: Email: bensebalounes7@gmail.com | Phone: (+213) 82535427 | GitHub: https://github.com/Lounes-213 | LinkedIn: https://www.linkedin.com/in/lounes-benseba-a07549393/
- Languages spoken: Arabic (Native), French (Fluent B2), English (Professional B2), Kabyle.

Reply concisely (2 to 4 sentences max) in the same language the visitor uses (Algerian Darija, Arabic, French, or English). Be warm, helpful, and direct.
`;

function buildLocalFallbackAnswer(question: string): string {
  const q = question.toLowerCase();
  if (q.includes("project") || q.includes("mashru3") || q.includes("projet") || q.includes("lstop") || q.includes("azar")) {
    return "Lounès bna 9 les projets kbar: LStop (suivi ta3 transport جماعي بـ Flutter), Aẓar Neɣ (marketplace algérienne بـ Next.js), Kamir Gym, Golden Goal, Maktabat Al-I'tissam, CUBE 3, Ascent Club, w Volagro DZ. Tqder tdkhel l'Projects Pavilion باش تشوف الفيديوهات ديالهم!";
  }
  if (q.includes("usthb") || q.includes("etude") || q.includes("qraya") || q.includes("bioinfo") || q.includes("education")) {
    return "Lounès 3andu Licence f l'Informatique w yaqra Master f Bioinformatics f jama3at USTHB (Bab Ezzouar, Alger).";
  }
  if (q.includes("contact") || q.includes("email") || q.includes("num") || q.includes("phone") || q.includes("tilifun")) {
    return "Tqder تتواصل مع Lounès directement f l'email: bensebalounes7@gmail.com wla f téléphone: (+213) 82535427, wla تشوف GitHub ديالو @Lounes-213.";
  }
  if (q.includes("skill") || q.includes("langage") || q.includes("flutter") || q.includes("kotlin") || q.includes("next")) {
    return "Lounès يخدم بـ Flutter, Dart, Kotlin لـ Mobile، و Next.js, React, TypeScript لـ Web، مع Python, FastAPI, PostgreSQL, Supabase و Cloudflare فالـ Backend.";
  }
  return "Marhba bik f l'3alam 3D ta3 Lounès Benseba! Ana l'murshid ta3ek hna — saqsini 3la les projets (LStop, Aẓar Neɣ, Kamir Gym...), qraytu f USTHB, les compétences, wla kifach تتواصل معاه.";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = String(body?.message || "").trim();
    if (!message) {
      return NextResponse.json({ reply: buildLocalFallbackAnswer("") });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ reply: buildLocalFallbackAnswer(message) });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const response = await ai.models.generateContent({
      model: "gemini-4-hydrogen",
      contents: message,
      config: {
        systemInstruction: PORTFOLIO_CONTEXT,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      },
    });

    const text = (response.text ?? "").trim();
    return NextResponse.json({
      reply: text || buildLocalFallbackAnswer(message),
    });
  } catch {
    return NextResponse.json({
      reply: buildLocalFallbackAnswer(""),
    });
  }
}
