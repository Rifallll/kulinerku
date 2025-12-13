import React, { useState } from 'react';
import { Star, Edit2, Trash2, User } from 'lucide-react';
import { Review, useReviews } from '@/hooks/useReviews';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ReviewForm } from './ReviewForm';
import { useToast } from '@/hooks/use-toast';

interface ReviewsListProps {
    foodId: string;
    foodName: string;
    limit?: number;
}

export const ReviewsList: React.FC<ReviewsListProps> = ({ foodId, foodName, limit }) => {
    const { reviews, loading, updateReview, deleteReview } = useReviews(foodId);
    const { user } = useAuth();
    const { toast } = useToast();
    const [editingReviewId, setEditingReviewId] = useState<string | null>(null);

    const displayedReviews = limit ? reviews.slice(0, limit) : reviews;

    const handleUpdate = async (reviewId: string, rating: number, reviewText: string) => {
        try {
            await updateReview(reviewId, { rating, review_text: reviewText });
            setEditingReviewId(null);
            toast({
                title: "Review Updated",
                description: "Your review has been updated successfully",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to update review",
                variant: "destructive",
            });
        }
    };

    const handleDelete = async (reviewId: string) => {
        if (!confirm('Are you sure you want to delete this review?')) return;

        try {
            await deleteReview(reviewId, foodId);
            toast({
                title: "Review Deleted",
                description: "Your review has been removed",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to delete review",
                variant: "destructive",
            });
        }
    };

    if (loading) {
        return (
            <div className="text-center py-8 text-gray-500">
                Loading reviews...
            </div>
        );
    }

    if (reviews.length === 0) {
        return (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Star className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">No reviews yet</p>
                <p className="text-sm text-gray-500 mt-1">Be the first to review {foodName}!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {displayedReviews.map((review) => {
                const isOwnReview = user?.id === review.user_id;
                const isEditing = editingReviewId === review.id;

                if (isEditing) {
                    return (
                        <ReviewForm
                            key={review.id}
                            foodId={foodId}
                            foodName={foodName}
                            existingReview={review}
                            onSubmit={(rating, text) => handleUpdate(review.id, rating, text)}
                            onCancel={() => setEditingReviewId(null)}
                        />
                    );
                }

                return (
                    <div
                        key={review.id}
                        className="p-4 bg-white rounded-lg border hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                                    <User className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">
                                        {review.user_name || 'Anonymous'}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(review.created_at).toLocaleDateString('id-ID', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>

                            {isOwnReview && (
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => setEditingReviewId(review.id)}
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleDelete(review.id)}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`h-4 w-4 ${star <= review.rating
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'text-gray-300'
                                        }`}
                                />
                            ))}
                            <span className="ml-2 text-sm font-medium text-gray-700">
                                {review.rating}/5
                            </span>
                        </div>

                        {/* Review Text */}
                        {review.review_text && (
                            <p className="text-gray-700 text-sm leading-relaxed">
                                {review.review_text}
                            </p>
                        )}
                    </div>
                );
            })}

            {limit && reviews.length > limit && (
                <p className="text-center text-sm text-gray-500">
                    Showing {limit} of {reviews.length} reviews
                </p>
            )}
        </div>
    );
};
