import React, { useState, useMemo } from "react";
import { Users, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PortionSliderProps {
    defaultServings: number;
    ingredients: string[];
    onPortionChange?: (newServings: number, adjustedIngredients: string[]) => void;
}

// Parse ingredient to extract quantity
const parseIngredient = (ingredient: string): { quantity: number | null; unit: string; name: string } => {
    // Match patterns like "500 gram", "3 sdm", "5 siung", etc.
    const match = ingredient.match(/^(\d+(?:[.,]\d+)?)\s*(\w+)?\s*(.*)$/);

    if (match) {
        return {
            quantity: parseFloat(match[1].replace(",", ".")),
            unit: match[2] || "",
            name: match[3] || match[2] || ingredient
        };
    }

    return { quantity: null, unit: "", name: ingredient };
};

// Format adjusted ingredient
const formatIngredient = (parsed: { quantity: number | null; unit: string; name: string }, multiplier: number): string => {
    if (parsed.quantity === null) {
        return parsed.name;
    }

    const newQuantity = parsed.quantity * multiplier;
    const formatted = newQuantity % 1 === 0 ? newQuantity.toString() : newQuantity.toFixed(1);

    if (parsed.unit) {
        return `${formatted} ${parsed.unit} ${parsed.name}`.trim();
    }
    return `${formatted} ${parsed.name}`.trim();
};

const PortionSlider: React.FC<PortionSliderProps> = ({
    defaultServings,
    ingredients,
    onPortionChange
}) => {
    const [servings, setServings] = useState(defaultServings);

    const multiplier = servings / defaultServings;

    const adjustedIngredients = useMemo(() => {
        return ingredients.map((ing) => {
            const parsed = parseIngredient(ing);
            return formatIngredient(parsed, multiplier);
        });
    }, [ingredients, multiplier]);

    const handleChange = (delta: number) => {
        const newServings = Math.max(1, Math.min(12, servings + delta));
        setServings(newServings);
        onPortionChange?.(newServings, adjustedIngredients);
    };

    return (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-800">Porsi</span>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleChange(-1)}
                        disabled={servings <= 1}
                        className="h-8 w-8 border-green-300 hover:bg-green-100"
                    >
                        <Minus className="h-4 w-4" />
                    </Button>

                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                        <span className="text-2xl font-bold text-green-700">{servings}</span>
                        <span className="text-sm text-green-600">orang</span>
                    </div>

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleChange(1)}
                        disabled={servings >= 12}
                        className="h-8 w-8 border-green-300 hover:bg-green-100"
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Slider */}
            <input
                type="range"
                min="1"
                max="12"
                value={servings}
                onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setServings(val);
                    onPortionChange?.(val, adjustedIngredients);
                }}
                className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer accent-green-600"
            />

            <div className="flex justify-between text-xs text-green-600 mt-1">
                <span>1</span>
                <span>6</span>
                <span>12</span>
            </div>

            {multiplier !== 1 && (
                <p className="text-xs text-green-600 mt-3 text-center">
                    Bahan telah disesuaikan ({multiplier.toFixed(1)}x dari resep asli)
                </p>
            )}
        </div>
    );
};

export default PortionSlider;
