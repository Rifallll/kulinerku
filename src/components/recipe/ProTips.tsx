import React, { useState } from "react";
import { ChefHat, Lightbulb, AlertTriangle, CheckCircle, Timer } from "lucide-react";

interface ProTipsProps {
    recipeName: string;
    ingredients: string[];
}

// Generate pro tips based on recipe and ingredients
const generateProTips = (recipeName: string, ingredients: string[]): {
    preparation: string[];
    cooking: string[];
    common_mistakes: string[];
    plating: string[];
} => {
    const tips = {
        preparation: [] as string[],
        cooking: [] as string[],
        common_mistakes: [] as string[],
        plating: [] as string[]
    };

    const hasIngredient = (keyword: string) =>
        ingredients.some(i => i.toLowerCase().includes(keyword));

    // Preparation tips
    if (hasIngredient("daging") || hasIngredient("ayam")) {
        tips.preparation.push("Keluarkan daging dari kulkas 30 menit sebelum dimasak agar suhu merata");
        tips.preparation.push("Potong daging berlawanan arah serat untuk hasil lebih empuk");
    }
    if (hasIngredient("bawang")) {
        tips.preparation.push("Dinginkan bawang di kulkas sebelum dipotong untuk mengurangi air mata");
    }
    if (hasIngredient("santan")) {
        tips.preparation.push("Kocok santan sebelum digunakan agar lemak dan air tercampur rata");
    }
    tips.preparation.push("Siapkan semua bahan (mise en place) sebelum mulai memasak");

    // Cooking tips
    if (hasIngredient("bumbu") || hasIngredient("bawang")) {
        tips.cooking.push("Tumis bumbu dengan api kecil-sedang untuk mengeluarkan aroma maksimal");
    }
    if (hasIngredient("santan")) {
        tips.cooking.push("Masukkan santan di akhir dan aduk terus agar tidak pecah");
        tips.cooking.push("Jangan ditutup saat memasak santan untuk mencegah pecah");
    }
    if (hasIngredient("daging")) {
        tips.cooking.push("Jangan terlalu sering membalik daging - biarkan satu sisi matang dulu");
    }
    tips.cooking.push("Selalu koreksi rasa di akhir sebelum diangkat");
    tips.cooking.push("Gunakan api yang tepat - api besar untuk menumis, api kecil untuk merebus");

    // Common mistakes
    if (hasIngredient("santan")) {
        tips.common_mistakes.push("Santan pecah karena terlalu lama dimasak dengan api besar");
    }
    if (hasIngredient("bawang putih")) {
        tips.common_mistakes.push("Bawang putih gosong karena ditumis terlalu lama - akan pahit");
    }
    tips.common_mistakes.push("Terlalu sering mengaduk - biarkan bumbu 'dimemarkan'");
    tips.common_mistakes.push("Menambah garam sebelum mencicipi - selalu tes rasa dulu");
    tips.common_mistakes.push("Api terlalu besar saat menumis bumbu halus");

    // Plating tips
    tips.plating.push("Sajikan di piring yang sudah dihangatkan untuk menjaga suhu");
    tips.plating.push("Tambahkan garnish segar seperti daun bawang atau cabai iris");
    tips.plating.push("Bersihkan tepi piring sebelum disajikan untuk tampilan rapi");
    if (recipeName.toLowerCase().includes("nasi")) {
        tips.plating.push("Bentuk nasi menggunakan mangkuk kecil untuk tampilan menarik");
    }

    return tips;
};

const ProTips: React.FC<ProTipsProps> = ({ recipeName, ingredients }) => {
    const [activeTab, setActiveTab] = useState<"preparation" | "cooking" | "mistakes" | "plating">("preparation");
    const tips = generateProTips(recipeName, ingredients);

    const tabs = [
        { id: "preparation", label: "Persiapan", icon: Timer },
        { id: "cooking", label: "Memasak", icon: ChefHat },
        { id: "mistakes", label: "Hindari", icon: AlertTriangle },
        { id: "plating", label: "Penyajian", icon: CheckCircle }
    ];

    const getCurrentTips = () => {
        switch (activeTab) {
            case "preparation": return tips.preparation;
            case "cooking": return tips.cooking;
            case "mistakes": return tips.common_mistakes;
            case "plating": return tips.plating;
        }
    };

    return (
        <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl border border-violet-200 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-violet-200 flex items-center gap-3">
                <div className="h-10 w-10 bg-violet-600 rounded-full flex items-center justify-center">
                    <Lightbulb className="h-5 w-5 text-white" />
                </div>
                <div>
                    <h3 className="font-bold text-violet-900">Tips Pro</h3>
                    <p className="text-xs text-violet-600">Rahasia chef profesional</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-violet-200">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex-1 py-2 px-1 text-xs font-medium transition-colors flex flex-col items-center gap-1 ${activeTab === tab.id
                                ? "bg-violet-100 text-violet-900 border-b-2 border-violet-600"
                                : "text-violet-600 hover:bg-violet-50"
                            }`}
                    >
                        <tab.icon className="h-4 w-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tips Content */}
            <div className="p-4">
                <ul className="space-y-3">
                    {getCurrentTips().slice(0, 4).map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${activeTab === "mistakes"
                                    ? "bg-red-100 text-red-600"
                                    : "bg-violet-100 text-violet-600"
                                }`}>
                                {activeTab === "mistakes" ? "!" : idx + 1}
                            </span>
                            <p className="text-sm text-violet-800">{tip}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ProTips;
