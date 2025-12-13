import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Review } from '@/hooks/useReviews';

interface ReviewFormProps {
    foodId: string;
    foodName: string;
    existingReview?: Review | null;
    onSubmit: (rating: number, reviewText: string) => Promise<void>;
    onCancel?: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
    foodId,
    foodName,
    existingReview,
    onSubmit,
    onCancel
}) => {
    const [rating, setRating] = useState(existingReview?.rating || 0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewText, setReviewText] = useState(existingReview?.review_text || '');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (rating === 0) {
            alert('Please select a rating');
            return;
        }

        setSubmitting(true);
        try {
            await onSubmit(rating, reviewText);
            if (!existingReview) {
                // Reset form for new reviews
                setRating(0);
                setReviewText('');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-lg border">
            <div>
                <label className="block text-sm font-medium mb-2">
                    {existingReview ? 'Update Your Rating' : 'Rate This Food'}
                </label>
                <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="transition-transform hover:scale-110"
                        >
                            <Star
                                className={`h-8 w-8 ${star <= (hoverRating || rating)
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                            />
                        </button>
                    ))}
                    {rating > 0 && (
                        <span className="ml-2 text-sm font-medium text-gray-700">
                            {rating} / 5
                        </span>
                    )}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">
                    Your Review (Optional)
                </label>
                <Textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder={`Share your thoughts about ${foodName}...`}
                    maxLength={500}
                    rows={4}
                    className="resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                    {reviewText.length} / 500 characters
                </p>
            </div>

            <div className="flex gap-2">
                <Button
                    type="submit"
                    disabled={submitting || rating === 0}
                    className="flex-1"
                >
                    {submitting ? 'Submitting...' : existingReview ? 'Update Review' : 'Submit Review'}
                </Button>
                {onCancel && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={submitting}
                    >
                        Cancel
                    </Button>
                )}
            </div>
        </form>
    );
};
