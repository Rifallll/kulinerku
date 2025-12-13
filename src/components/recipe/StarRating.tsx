import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
    recipeId: string;
    size?: "sm" | "md" | "lg";
    showCount?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({ recipeId, size = "md", showCount = true }) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [totalRatings, setTotalRatings] = useState(0);
    const [averageRating, setAverageRating] = useState(0);

    const sizeClasses = {
        sm: "h-4 w-4",
        md: "h-6 w-6",
        lg: "h-8 w-8"
    };

    useEffect(() => {
        // Load ratings from localStorage
        const stored = localStorage.getItem(`recipe_ratings_${recipeId}`);
        if (stored) {
            const data = JSON.parse(stored);
            setRating(data.userRating || 0);
            setTotalRatings(data.total || 0);
            setAverageRating(data.average || 0);
        }
    }, [recipeId]);

    const handleRating = (value: number) => {
        setRating(value);

        // Calculate new average
        const newTotal = totalRatings + 1;
        const newAverage = ((averageRating * totalRatings) + value) / newTotal;

        setTotalRatings(newTotal);
        setAverageRating(newAverage);

        // Save to localStorage
        localStorage.setItem(`recipe_ratings_${recipeId}`, JSON.stringify({
            userRating: value,
            total: newTotal,
            average: newAverage
        }));
    };

    return (
        <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onClick={() => handleRating(star)}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(0)}
                        className="transition-transform hover:scale-110 focus:outline-none"
                    >
                        <Star
                            className={`${sizeClasses[size]} ${star <= (hover || rating)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "fill-gray-200 text-gray-300"
                                } transition-colors`}
                        />
                    </button>
                ))}
            </div>
            {showCount && (
                <div className="text-sm text-gray-600">
                    {averageRating > 0 ? (
                        <span>
                            <strong>{averageRating.toFixed(1)}</strong> dari 5 ({totalRatings} rating)
                        </span>
                    ) : (
                        <span className="text-gray-400">Belum ada rating</span>
                    )}
                </div>
            )}
        </div>
    );
};

export default StarRating;
