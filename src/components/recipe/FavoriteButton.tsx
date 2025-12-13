import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";

interface FavoriteButtonProps {
    recipeId: string;
    recipeName: string;
    size?: "sm" | "md" | "lg";
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ recipeId, recipeName, size = "md" }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const sizeClasses = {
        sm: "h-5 w-5",
        md: "h-6 w-6",
        lg: "h-8 w-8"
    };

    const buttonSizes = {
        sm: "p-2",
        md: "p-3",
        lg: "p-4"
    };

    useEffect(() => {
        const favorites = JSON.parse(localStorage.getItem("recipe_favorites") || "[]");
        setIsFavorite(favorites.some((f: any) => f.id === recipeId));
    }, [recipeId]);

    const toggleFavorite = () => {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 300);

        const favorites = JSON.parse(localStorage.getItem("recipe_favorites") || "[]");

        if (isFavorite) {
            // Remove from favorites
            const updated = favorites.filter((f: any) => f.id !== recipeId);
            localStorage.setItem("recipe_favorites", JSON.stringify(updated));
            setIsFavorite(false);
        } else {
            // Add to favorites
            favorites.push({
                id: recipeId,
                name: recipeName,
                addedAt: new Date().toISOString()
            });
            localStorage.setItem("recipe_favorites", JSON.stringify(favorites));
            setIsFavorite(true);
        }
    };

    return (
        <button
            onClick={toggleFavorite}
            className={`${buttonSizes[size]} rounded-full transition-all duration-300 ${isFavorite
                    ? "bg-red-50 hover:bg-red-100"
                    : "bg-gray-100 hover:bg-gray-200"
                } ${isAnimating ? "scale-125" : "scale-100"}`}
            title={isFavorite ? "Hapus dari favorit" : "Tambah ke favorit"}
        >
            <Heart
                className={`${sizeClasses[size]} transition-all duration-300 ${isFavorite
                        ? "fill-red-500 text-red-500"
                        : "fill-transparent text-gray-400"
                    } ${isAnimating ? "animate-ping" : ""}`}
            />
        </button>
    );
};

export default FavoriteButton;
