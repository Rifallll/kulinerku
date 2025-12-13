import React, { useState } from "react";
import { Sparkles, Lightbulb, RefreshCw, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AIAssistantProps {
    recipeName: string;
    ingredients: string[];
}

// AI-generated tips based on recipe
const generateTips = (recipeName: string, ingredients: string[]): string[] => {
    const tips: string[] = [];

    // General cooking tips based on ingredients
    if (ingredients.some(i => i.toLowerCase().includes("daging") || i.toLowerCase().includes("ayam"))) {
        tips.push("💡 Marinasi daging minimal 30 menit untuk hasil lebih empuk dan berbumbu");
    }
    if (ingredients.some(i => i.toLowerCase().includes("santan"))) {
        tips.push("🥥 Tambahkan santan di akhir memasak agar tidak pecah");
    }
    if (ingredients.some(i => i.toLowerCase().includes("bawang"))) {
        tips.push("🧅 Tumis bawang dengan api kecil-sedang agar tidak gosong");
    }
    if (ingredients.some(i => i.toLowerCase().includes("cabai"))) {
        tips.push("🌶️ Buang biji cabai jika ingin rasa tidak terlalu pedas");
    }
    if (ingredients.some(i => i.toLowerCase().includes("kunyit"))) {
        tips.push("✨ Kunyit segar memberikan warna lebih cerah dari bubuk");
    }

    // Default tips
    if (tips.length < 3) {
        tips.push("⏰ Siapkan semua bahan sebelum mulai memasak (mise en place)");
        tips.push("🧂 Koreksi rasa di akhir, tambah garam sedikit demi sedikit");
        tips.push("🍳 Gunakan api yang tepat sesuai tahap memasak");
    }

    return tips.slice(0, 4);
};

// AI substitution suggestions
const generateSubstitutions = (ingredients: string[]): { original: string; substitute: string }[] => {
    const subs: { original: string; substitute: string }[] = [];

    ingredients.forEach(ing => {
        const lower = ing.toLowerCase();
        if (lower.includes("santan")) {
            subs.push({ original: "Santan", substitute: "Susu kental manis + air atau krim kelapa" });
        }
        if (lower.includes("kecap manis")) {
            subs.push({ original: "Kecap manis", substitute: "Kecap asin + gula merah" });
        }
        if (lower.includes("daun jeruk")) {
            subs.push({ original: "Daun jeruk", substitute: "Kulit jeruk limau parut" });
        }
        if (lower.includes("lengkuas")) {
            subs.push({ original: "Lengkuas", substitute: "Jahe (dengan rasa berbeda)" });
        }
        if (lower.includes("serai")) {
            subs.push({ original: "Serai", substitute: "Kulit lemon parut" });
        }
        if (lower.includes("kemiri")) {
            subs.push({ original: "Kemiri", substitute: "Kacang macadamia atau mete" });
        }
    });

    return subs.slice(0, 3);
};

// AI recipe variations
const generateVariations = (recipeName: string): string[] => {
    const variations: string[] = [];

    if (recipeName.toLowerCase().includes("rendang")) {
        variations.push("Rendang Jamur (vegetarian)", "Rendang Paru", "Rendang Jengkol");
    } else if (recipeName.toLowerCase().includes("sate")) {
        variations.push("Sate Lilit Bali", "Sate Buntel", "Sate Taichan");
    } else if (recipeName.toLowerCase().includes("nasi goreng")) {
        variations.push("Nasi Goreng Kampung", "Nasi Goreng Seafood", "Nasi Goreng Jawa");
    } else if (recipeName.toLowerCase().includes("soto")) {
        variations.push("Soto Betawi", "Soto Lamongan", "Soto Kudus");
    } else if (recipeName.toLowerCase().includes("gulai")) {
        variations.push("Gulai Kambing", "Gulai Telur", "Gulai Nangka");
    } else {
        variations.push(`${recipeName} Pedas`, `${recipeName} Vegetarian`, `${recipeName} Spesial`);
    }

    return variations;
};

const AIAssistant: React.FC<AIAssistantProps> = ({ recipeName, ingredients }) => {
    const [activeTab, setActiveTab] = useState<"tips" | "subs" | "variations">("tips");
    const [isLoading, setIsLoading] = useState(false);

    const tips = generateTips(recipeName, ingredients);
    const substitutions = generateSubstitutions(ingredients);
    const variations = generateVariations(recipeName);

    const handleRefresh = () => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 500);
    };

    return (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="h-10 w-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-purple-900">AI Assistant</h3>
                        <p className="text-xs text-purple-600">Powered by AI</p>
                    </div>
                </div>
                <Button variant="ghost" size="icon" onClick={handleRefresh} disabled={isLoading}>
                    <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                </Button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => setActiveTab("tips")}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${activeTab === "tips"
                            ? "bg-purple-600 text-white"
                            : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                        }`}
                >
                    <Lightbulb className="h-4 w-4 inline mr-1" />
                    Tips
                </button>
                <button
                    onClick={() => setActiveTab("subs")}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${activeTab === "subs"
                            ? "bg-purple-600 text-white"
                            : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                        }`}
                >
                    🔄 Substitusi
                </button>
                <button
                    onClick={() => setActiveTab("variations")}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${activeTab === "variations"
                            ? "bg-purple-600 text-white"
                            : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                        }`}
                >
                    <ChefHat className="h-4 w-4 inline mr-1" />
                    Variasi
                </button>
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl p-4 min-h-[120px]">
                {activeTab === "tips" && (
                    <ul className="space-y-2">
                        {tips.map((tip, idx) => (
                            <li key={idx} className="text-sm text-gray-700">{tip}</li>
                        ))}
                    </ul>
                )}

                {activeTab === "subs" && (
                    <div className="space-y-3">
                        {substitutions.length > 0 ? (
                            substitutions.map((sub, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-sm">
                                    <span className="font-medium text-purple-700">{sub.original}</span>
                                    <span className="text-gray-400">→</span>
                                    <span className="text-gray-600">{sub.substitute}</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500">Tidak ada substitusi yang disarankan untuk resep ini.</p>
                        )}
                    </div>
                )}

                {activeTab === "variations" && (
                    <div className="space-y-2">
                        <p className="text-xs text-gray-500 mb-2">Variasi resep yang bisa dicoba:</p>
                        {variations.map((v, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                                <span className="text-purple-600">•</span>
                                <span className="text-sm text-gray-700">{v}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AIAssistant;
