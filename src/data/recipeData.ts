// Combined recipe data from manual ingredients database
import FOOD_INGREDIENTS from "@/data/foodIngredients";

// Type definition for recipe
export interface Recipe {
    id: string;
    name: string;
    ingredients: string[];
    source: string;
    cookTime: string;
    cookMinutes: number; // For timer default
    servings: number;
    difficulty: "Mudah" | "Sedang" | "Sulit";
    category: string;
    imageUrl: string;
}

// Cook times for different recipes (in minutes)
const cookTimes: Record<string, number> = {
    "Rendang": 180,
    "Gulai": 60,
    "Opor Ayam": 45,
    "Sate": 30,
    "Sate Maranggi": 25,
    "Sate Ayam": 20,
    "Sate Padang": 40,
    "Sate Lilit": 20,
    "Nasi Goreng": 15,
    "Nasi Uduk": 30,
    "Nasi Kuning": 35,
    "Soto Ayam": 60,
    "Soto Betawi": 90,
    "Rawon": 120,
    "Ayam Goreng": 40,
    "Tempe Goreng": 10,
    "Tahu Goreng": 10,
    "Perkedel Kentang": 30,
    "Bakwan Sayur": 20,
    "Sayur Lodeh": 35,
    "Sayur Asem": 40,
    "Gado-Gado": 25,
    "Pecel": 20,
    "Sambal Terasi": 10,
    "Sambal Matah": 5,
    "Bakso": 45,
    "Mie Goreng": 15,
    "Tongseng Kambing": 60,
    "Es Cendol": 30,
    "Klepon": 25,
    "Onde-Onde": 30
};

// Get cook time for recipe
const getCookTime = (name: string): { text: string; minutes: number } => {
    for (const [key, minutes] of Object.entries(cookTimes)) {
        if (name.toLowerCase().includes(key.toLowerCase())) {
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            const text = hours > 0
                ? `${hours} jam ${mins > 0 ? mins + ' menit' : ''}`
                : `${mins} menit`;
            return { text, minutes };
        }
    }
    return { text: "30 menit", minutes: 30 };
};

// Helper to determine category based on name
const getCategory = (name: string): string => {
    const n = name.toLowerCase();
    if (n.includes("sate")) return "Sate & Bakar";
    if (n.includes("nasi")) return "Nasi";
    if (n.includes("soto") || n.includes("sop") || n.includes("rawon") || n.includes("tongseng")) return "Sup & Kuah";
    if (n.includes("sayur") || n.includes("pecel") || n.includes("gado") || n.includes("karedok")) return "Sayuran";
    if (n.includes("sambal")) return "Sambal";
    if (n.includes("es ") || n.includes("bajigur") || n.includes("wedang")) return "Minuman";
    if (n.includes("klepon") || n.includes("onde") || n.includes("cendol") || n.includes("dadar")) return "Dessert";
    if (n.includes("bakwan") || n.includes("lemper") || n.includes("risoles") || n.includes("pastel")) return "Camilan";
    if (n.includes("goreng") || n.includes("perkedel")) return "Gorengan";
    if (n.includes("rendang") || n.includes("gulai") || n.includes("opor")) return "Gulai & Kari";
    if (n.includes("bakso") || n.includes("mie")) return "Mie & Bakso";
    return "Makanan Utama";
};

// Helper to determine difficulty based on cook time
const getDifficulty = (minutes: number): "Mudah" | "Sedang" | "Sulit" => {
    if (minutes <= 20) return "Mudah";
    if (minutes <= 60) return "Sedang";
    return "Sulit";
};

// Manual recipes from ingredients database
export const ALL_RECIPES: Recipe[] = Object.entries(FOOD_INGREDIENTS).map(([name, ingredients], idx) => {
    const { text, minutes } = getCookTime(name);
    return {
        id: `manual-${idx}`,
        name,
        ingredients,
        source: "Database",
        cookTime: text,
        cookMinutes: minutes,
        servings: 4,
        difficulty: getDifficulty(minutes),
        category: getCategory(name),
        imageUrl: `https://placehold.co/600x400/f97316/white?text=${encodeURIComponent(name)}`
    };
});

// Helper to find recipe by ID
export const findRecipeById = (id: string): Recipe | undefined => {
    return ALL_RECIPES.find(r => r.id === id);
};

// Get recipes by category
export const getRecipesByCategory = (category: string): Recipe[] => {
    if (category === "Semua") return ALL_RECIPES;
    return ALL_RECIPES.filter(r => r.category === category);
};

// Search recipes
export const searchRecipes = (query: string): Recipe[] => {
    const q = query.toLowerCase();
    return ALL_RECIPES.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.ingredients.some(i => i.toLowerCase().includes(q))
    );
};

export default ALL_RECIPES;
