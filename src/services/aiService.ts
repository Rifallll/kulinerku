// AI Service using zenmux.ai API with fallbacks
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.VITE_ZENMUX_API_KEY || "";
const BASE_URL = "https://zenmux.ai/api/v1";

// Available models to try
const MODELS = [
    "gpt-3.5-turbo",
    "gpt-4",
    "gpt-4-turbo",
    "claude-3-sonnet-20240229",
    "claude-3-haiku-20240307",
    "claude-instant-1.2"
];

export interface ChatMessage {
    role: "user" | "assistant" | "system";
    content: string;
}

const SYSTEM_PROMPT = `Kamu adalah AI Chef Indonesia yang ahli masakan Nusantara.
Jawab dalam Bahasa Indonesia yang ramah, singkat (2-3 kalimat).
Fokus pada tips memasak, substitusi bahan, dan teknik masak.`;

export async function chatWithAI(
    messages: ChatMessage[],
    recipeName?: string,
    ingredients?: string[]
): Promise<{ content: string; error?: string }> {

    if (!API_KEY) {
        return getOfflineAnswer(messages[messages.length - 1]?.content || "", recipeName || "", ingredients || []);
    }

    const contextMessage = recipeName
        ? `${SYSTEM_PROMPT}\n\nResep: ${recipeName}\nBahan: ${ingredients?.slice(0, 5).join(", ")}`
        : SYSTEM_PROMPT;

    // Try each model until one works
    for (const model of MODELS) {
        try {
            const response = await fetch(`${BASE_URL}/chat/completions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    model,
                    messages: [{ role: "system", content: contextMessage }, ...messages],
                    max_tokens: 300,
                    temperature: 0.7
                })
            });

            if (response.ok) {
                const data = await response.json();
                const content = data.choices?.[0]?.message?.content;
                if (content) {
                    console.log(`AI: Using model ${model}`);
                    return { content };
                }
            }
        } catch (e) {
            console.log(`Model ${model} failed, trying next...`);
        }
    }

    // Fallback to offline answers
    return getOfflineAnswer(messages[messages.length - 1]?.content || "", recipeName || "", ingredients || []);
}

// Offline answers when API fails
function getOfflineAnswer(question: string, recipeName: string, ingredients: string[]): { content: string } {
    const q = question.toLowerCase();
    const ingList = ingredients.slice(0, 5).join(", ");

    if (q.includes("bumbu") || q.includes("rahasia")) {
        return { content: `Rahasia ${recipeName} enak: tumis bumbu sampai harum, gunakan api sedang, dan bahan segar. Jangan terburu-buru!` };
    }
    if (q.includes("gosong") || q.includes("hangus")) {
        return { content: `Agar ${recipeName} tidak gosong: api kecil-sedang, aduk teratur, tambah sedikit air jika kering.` };
    }
    if (q.includes("ganti") || q.includes("substitusi")) {
        return { content: `Untuk ${recipeName}: santan bisa diganti susu kental, kecap manis = gula merah + kecap asin. Bumbu utama sebaiknya tidak diganti.` };
    }
    if (q.includes("tips") || q.includes("trik")) {
        return { content: `Tips ${recipeName}: siapkan semua bahan dulu, masak bumbu sampai matang, koreksi rasa di akhir.` };
    }
    if (q.includes("lama") || q.includes("waktu")) {
        return { content: `Waktu masak tergantung resep. ${recipeName} sekitar 20-60 menit. Rendang bisa 3-4 jam.` };
    }
    if (q.includes("pedas") || q.includes("cabai")) {
        return { content: `Atur kepedasan: tambah/kurangi cabai, buang biji cabai untuk pedas lebih ringan.` };
    }
    if (q.includes("simpan") || q.includes("awet")) {
        return { content: `${recipeName} tahan 2-3 hari di kulkas wadah tertutup. Bekukan untuk 1 bulan. Panaskan sebelum sajikan.` };
    }

    return { content: `${recipeName} adalah masakan Indonesia dengan bahan: ${ingList}. Tanyakan spesifik tentang tips, substitusi, atau cara masak!` };
}

export default chatWithAI;
