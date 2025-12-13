import React from "react";
import { Flame, Beef, Wheat, Droplets } from "lucide-react";

interface NutritionCardProps {
    recipeName: string;
    ingredients: string[];
    servings: number;
}

// Nutrition database per 100g or per item
const nutritionDB: Record<string, { cal: number; protein: number; carbs: number; fat: number }> = {
    // Meats
    "daging sapi": { cal: 250, protein: 26, carbs: 0, fat: 15 },
    "daging": { cal: 250, protein: 26, carbs: 0, fat: 15 },
    "ayam": { cal: 200, protein: 25, carbs: 0, fat: 10 },
    "kambing": { cal: 280, protein: 25, carbs: 0, fat: 20 },
    "ikan": { cal: 150, protein: 22, carbs: 0, fat: 5 },
    "udang": { cal: 100, protein: 20, carbs: 1, fat: 1 },
    "telur": { cal: 155, protein: 13, carbs: 1, fat: 11 },

    // Carbs
    "nasi": { cal: 130, protein: 3, carbs: 28, fat: 0 },
    "beras": { cal: 130, protein: 3, carbs: 28, fat: 0 },
    "mie": { cal: 138, protein: 5, carbs: 25, fat: 2 },
    "kentang": { cal: 77, protein: 2, carbs: 17, fat: 0 },
    "tepung": { cal: 364, protein: 10, carbs: 76, fat: 1 },

    // Proteins (plant)
    "tahu": { cal: 76, protein: 8, carbs: 2, fat: 4 },
    "tempe": { cal: 193, protein: 19, carbs: 9, fat: 11 },
    "kacang tanah": { cal: 567, protein: 26, carbs: 16, fat: 49 },
    "kacang": { cal: 347, protein: 24, carbs: 63, fat: 1 },

    // Fats
    "santan": { cal: 230, protein: 2, carbs: 6, fat: 24 },
    "minyak": { cal: 884, protein: 0, carbs: 0, fat: 100 },
    "kelapa": { cal: 354, protein: 3, carbs: 15, fat: 33 },

    // Vegetables
    "sayur": { cal: 25, protein: 2, carbs: 5, fat: 0 },
    "kangkung": { cal: 19, protein: 3, carbs: 3, fat: 0 },
    "bayam": { cal: 23, protein: 3, carbs: 4, fat: 0 },
    "wortel": { cal: 41, protein: 1, carbs: 10, fat: 0 },
    "kol": { cal: 25, protein: 1, carbs: 6, fat: 0 },
    "tauge": { cal: 31, protein: 3, carbs: 6, fat: 0 },
    "tomat": { cal: 18, protein: 1, carbs: 4, fat: 0 },

    // Sauces & condiments
    "kecap": { cal: 60, protein: 5, carbs: 9, fat: 0 },
    "gula": { cal: 387, protein: 0, carbs: 100, fat: 0 },
    "garam": { cal: 0, protein: 0, carbs: 0, fat: 0 }
};

// Calculate nutrition from ingredients
const calculateNutrition = (ingredients: string[]): { cal: number; protein: number; carbs: number; fat: number } => {
    let total = { cal: 0, protein: 0, carbs: 0, fat: 0 };

    ingredients.forEach(ing => {
        const lower = ing.toLowerCase();

        // Parse quantity from ingredient (e.g., "500 gram daging" -> 500)
        const match = lower.match(/(\d+)\s*(gram|g|kg|ml|liter)/);
        let multiplier = 1; // default 100g equivalent

        if (match) {
            const amount = parseInt(match[1]);
            const unit = match[2];
            if (unit === "kg" || unit === "liter") {
                multiplier = amount * 10; // 1kg = 10 x 100g
            } else {
                multiplier = amount / 100; // convert to 100g units
            }
        }

        // Find matching nutrition data
        for (const [key, nutrition] of Object.entries(nutritionDB)) {
            if (lower.includes(key)) {
                total.cal += Math.round(nutrition.cal * multiplier);
                total.protein += Math.round(nutrition.protein * multiplier);
                total.carbs += Math.round(nutrition.carbs * multiplier);
                total.fat += Math.round(nutrition.fat * multiplier);
                break; // Only count once per ingredient
            }
        }
    });

    // Minimum values if nothing matched
    if (total.cal === 0) {
        total = { cal: 300, protein: 15, carbs: 20, fat: 10 };
    }

    return total;
};

const NutritionCard: React.FC<NutritionCardProps> = ({ recipeName, ingredients, servings }) => {
    const totalNutrition = calculateNutrition(ingredients);

    // Per serving
    const perServing = {
        cal: Math.round(totalNutrition.cal / servings),
        protein: Math.round(totalNutrition.protein / servings),
        carbs: Math.round(totalNutrition.carbs / servings),
        fat: Math.round(totalNutrition.fat / servings)
    };

    return (
        <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gray-900 text-white p-3">
                <h3 className="font-bold">Nutrition Facts</h3>
                <p className="text-xs text-gray-400">Per porsi ({servings} porsi total)</p>
            </div>

            {/* Calories */}
            <div className="p-4 border-b-4 border-gray-900">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Flame className="h-5 w-5 text-orange-500" />
                        <span className="font-bold">Kalori</span>
                    </div>
                    <span className="text-2xl font-black">{perServing.cal}</span>
                </div>
                <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-orange-500"
                        style={{ width: `${Math.min((perServing.cal / 500) * 100, 100)}%` }}
                    />
                </div>
            </div>

            {/* Macros */}
            <div className="p-4 space-y-3">
                {/* Protein */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Beef className="h-4 w-4 text-red-500" />
                        <span className="text-sm">Protein</span>
                    </div>
                    <span className="font-bold">{perServing.protein}g</span>
                </div>

                {/* Carbs */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Wheat className="h-4 w-4 text-amber-500" />
                        <span className="text-sm">Karbohidrat</span>
                    </div>
                    <span className="font-bold">{perServing.carbs}g</span>
                </div>

                {/* Fat */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Droplets className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">Lemak</span>
                    </div>
                    <span className="font-bold">{perServing.fat}g</span>
                </div>
            </div>

            {/* Total */}
            <div className="p-3 bg-gray-100 text-center text-xs text-gray-500">
                Total resep: {totalNutrition.cal} kal
            </div>
        </div>
    );
};

export default NutritionCard;
