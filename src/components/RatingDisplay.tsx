import React from 'react';
import { Star, StarHalf } from 'lucide-react';

interface RatingDisplayProps {
    averageRating: number;
    totalReviews: number;
    size?: 'sm' | 'md' | 'lg';
    showCount?: boolean;
}

export const RatingDisplay: React.FC<RatingDisplayProps> = ({
    averageRating,
    totalReviews,
    size = 'md',
    showCount = true
}) => {
    const sizeClasses = {
        sm: 'h-3 w-3',
        md: 'h-4 w-4',
        lg: 'h-5 w-5'
    };

    const textSizeClasses = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base'
    };

    const iconSize = sizeClasses[size];
    const textSize = textSizeClasses[size];

    const renderStars = () => {
        const stars = [];
        const fullStars = Math.floor(averageRating);
        const hasHalfStar = averageRating % 1 >= 0.5;

        // Full stars
        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <Star
                    key={`full-${i}`}
                    className={`${iconSize} fill-yellow-400 text-yellow-400`}
                />
            );
        }

        // Half star
        if (hasHalfStar && fullStars < 5) {
            stars.push(
                <StarHalf
                    key="half"
                    className={`${iconSize} fill-yellow-400 text-yellow-400`}
                />
            );
        }

        // Empty stars
        const emptyStars = 5 - Math.ceil(averageRating);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(
                <Star
                    key={`empty-${i}`}
                    className={`${iconSize} text-gray-300`}
                />
            );
        }

        return stars;
    };

    if (totalReviews === 0) {
        return (
            <div className="flex items-center gap-1 text-gray-400">
                <Star className={`${iconSize} text-gray-300`} />
                <span className={`${textSize}`}>No reviews yet</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
                {renderStars()}
            </div>
            <span className={`${textSize} font-medium text-gray-700`}>
                {averageRating.toFixed(1)}
            </span>
            {showCount && (
                <span className={`${textSize} text-gray-500`}>
                    ({totalReviews})
                </span>
            )}
        </div>
    );
};
