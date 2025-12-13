import React from "react";
import { Link } from "react-router-dom";
import { Clock, ChefHat } from "lucide-react";
import ALL_RECIPES from "@/data/recipeData";

interface RelatedRecipesProps {
    currentRecipeId: string;
    category: string;
    limit?: number;
}

const RelatedRecipes: React.FC<RelatedRecipesProps> = ({
    currentRecipeId,
    category,
    limit = 4
}) => {
    // Find related recipes by category, excluding current
    const related = ALL_RECIPES
        .filter(r => r.id !== currentRecipeId && r.category === category)
        .slice(0, limit);

    // If not enough in same category, fill with random others
    if (related.length < limit) {
        const others = ALL_RECIPES
            .filter(r => r.id !== currentRecipeId && !related.find(rel => rel.id === r.id))
            .slice(0, limit - related.length);
        related.push(...others);
    }

    if (related.length === 0) return null;

    return (
        <div className="mt-8">
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">🍽️</span>
                Resep Terkait
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {related.map((recipe) => (
                    <Link
                        key={recipe.id}
                        to={`/recipe/${recipe.id}`}
                        className="group bg-white rounded-xl overflow-hidden border border-slate-200 hover:shadow-lg transition-all"
                    >
                        <div className="aspect-video bg-slate-100 overflow-hidden">
                            <img
                                src={recipe.imageUrl}
                                alt={recipe.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                        </div>
                        <div className="p-3">
                            <h4 className="font-semibold text-sm text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                {recipe.name}
                            </h4>
                            <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                                <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {recipe.cookTime}
                                </span>
                                <span className="flex items-center gap-1">
                                    <ChefHat className="h-3 w-3" />
                                    {recipe.difficulty}
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default RelatedRecipes;
