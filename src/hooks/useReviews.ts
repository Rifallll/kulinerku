import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface Review {
    id: string;
    user_id: string;
    food_id: string;
    food_name: string;
    rating: number;
    review_text?: string;
    user_email?: string;
    user_name?: string;
    created_at: string;
    updated_at: string;
}

export interface ReviewStats {
    averageRating: number;
    totalReviews: number;
    ratingBreakdown: {
        5: number;
        4: number;
        3: number;
        2: number;
        1: number;
    };
}

export function useReviews(foodId?: string) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<ReviewStats>({
        averageRating: 0,
        totalReviews: 0,
        ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    });
    const { user } = useAuth();

    // Fetch reviews for a specific food
    const fetchReviews = useCallback(async (targetFoodId: string) => {
        // Handle local data persistence
        if (targetFoodId.startsWith('best-food-')) {
            const localReviewsKey = `reviews_${targetFoodId}`;
            const storedReviews = localStorage.getItem(localReviewsKey);
            const localReviews: Review[] = storedReviews ? JSON.parse(storedReviews) : [];

            setReviews(localReviews);

            // Calculate stats locally
            if (localReviews.length > 0) {
                const total = localReviews.length;
                const sum = localReviews.reduce((acc, r) => acc + r.rating, 0);
                const avg = sum / total;
                const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
                localReviews.forEach(r => {
                    breakdown[r.rating as keyof typeof breakdown]++;
                });
                setStats({
                    averageRating: Math.round(avg * 10) / 10,
                    totalReviews: total,
                    ratingBreakdown: breakdown
                });
            } else {
                setStats({
                    averageRating: 0,
                    totalReviews: 0,
                    ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
                });
            }
            setLoading(false);
            return;
        }

        try {
            const { data, error } = await supabase
                .from('food_reviews')
                .select('*')
                .eq('food_id', targetFoodId)
                .order('created_at', { ascending: false });

            if (error) throw error;

            const reviewsData = data || [];
            setReviews(reviewsData);

            // Calculate stats
            if (reviewsData.length > 0) {
                const total = reviewsData.length;
                const sum = reviewsData.reduce((acc, r) => acc + r.rating, 0);
                const avg = sum / total;

                const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
                reviewsData.forEach(r => {
                    breakdown[r.rating as keyof typeof breakdown]++;
                });

                setStats({
                    averageRating: Math.round(avg * 10) / 10,
                    totalReviews: total,
                    ratingBreakdown: breakdown
                });
            } else {
                setStats({
                    averageRating: 0,
                    totalReviews: 0,
                    ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
                });
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
            setReviews([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Load reviews on mount
    useEffect(() => {
        if (foodId) {
            fetchReviews(foodId);
        } else {
            setLoading(false);
        }
    }, [foodId, fetchReviews]);

    // Get current user's review for a food
    const getUserReview = useCallback(async (targetFoodId: string): Promise<Review | null> => {
        if (!user) return null;

        if (targetFoodId.startsWith('best-food-')) {
            const localReviewsKey = `reviews_${targetFoodId}`;
            const storedReviews = localStorage.getItem(localReviewsKey);
            const localReviews: Review[] = storedReviews ? JSON.parse(storedReviews) : [];
            const userReview = localReviews.find(r => r.user_id === user.id);
            return userReview || null;
        }

        try {
            const { data, error } = await supabase
                .from('food_reviews')
                .select('*')
                .eq('food_id', targetFoodId)
                .eq('user_id', user.id)
                .maybeSingle();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching user review:', error);
            return null;
        }
    }, [user]);

    // Add new review
    const addReview = useCallback(async (review: {
        food_id: string;
        food_name: string;
        rating: number;
        review_text?: string;
    }) => {
        if (!user) {
            throw new Error('Must be logged in to add review');
        }

        try {
            // Handle local data persistence
            if (review.food_id.startsWith('best-food-')) {
                const localReviewsKey = `reviews_${review.food_id}`;
                const storedReviews = localStorage.getItem(localReviewsKey);
                const localReviews: Review[] = storedReviews ? JSON.parse(storedReviews) : [];

                // Check duplicate
                if (localReviews.some(r => r.user_id === user.id)) {
                    throw new Error('You have already reviewed this food');
                }

                const newReview: Review = {
                    id: 'local-' + Date.now(),
                    user_id: user.id,
                    food_id: review.food_id,
                    food_name: review.food_name,
                    rating: review.rating,
                    review_text: review.review_text,
                    user_email: user.email,
                    user_name: user.email?.split('@')[0] || 'Anonymous',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };

                const updatedReviews = [newReview, ...localReviews];
                localStorage.setItem(localReviewsKey, JSON.stringify(updatedReviews));

                // Update state via fetchReviews to ensure consistency
                await fetchReviews(review.food_id);
                return newReview;
            }

            // 1. OPTIMISTIC UPDATE
            const tempReview: Review = {
                id: 'temp-' + Date.now(),
                user_id: user.id,
                food_id: review.food_id,
                food_name: review.food_name,
                rating: review.rating,
                review_text: review.review_text,
                user_email: user.email,
                user_name: user.email?.split('@')[0] || 'Anonymous',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            setReviews(prev => [tempReview, ...prev]);

            // Optimistically update stats
            setStats(prev => {
                const newTotal = prev.totalReviews + 1;
                const oldSum = prev.averageRating * prev.totalReviews;
                const newAvg = (oldSum + review.rating) / newTotal;
                return {
                    ...prev,
                    totalReviews: newTotal,
                    averageRating: Math.round(newAvg * 10) / 10,
                    ratingBreakdown: {
                        ...prev.ratingBreakdown,
                        [review.rating as 1 | 2 | 3 | 4 | 5]: prev.ratingBreakdown[review.rating as 1 | 2 | 3 | 4 | 5] + 1
                    }
                };
            });

            const { data, error } = await supabase
                .from('food_reviews')
                .insert({
                    user_id: user.id,
                    food_id: review.food_id,
                    food_name: review.food_name,
                    rating: review.rating,
                    review_text: review.review_text || null,
                    user_email: user.email,
                    user_name: user.email?.split('@')[0] || 'Anonymous'
                })
                .select()
                .single();

            if (error) throw error;

            // 2. Validate/Replace with real data
            await fetchReviews(review.food_id);
            return data;
        } catch (error: any) {
            // 3. Rollback on error
            console.error('Error adding review:', error);
            await fetchReviews(review.food_id); // Revert to consistent state

            // Handle duplicate review specific error
            if (error.code === '23505') {
                throw new Error('You have already reviewed this food');
            }
            throw error;
        }
    }, [user, fetchReviews]);

    // Update existing review
    const updateReview = useCallback(async (reviewId: string, updates: {
        rating?: number;
        review_text?: string;
    }) => {
        if (!user) {
            throw new Error('Must be logged in to update review');
        }

        try {
            const { data, error } = await supabase
                .from('food_reviews')
                .update(updates)
                .eq('id', reviewId)
                .eq('user_id', user.id)
                .select()
                .single();

            if (error) throw error;

            // Refresh reviews
            if (data) {
                await fetchReviews(data.food_id);
            }
            return data;
        } catch (error) {
            console.error('Error updating review:', error);
            throw error;
        }
    }, [user, fetchReviews]);

    // Delete review
    const deleteReview = useCallback(async (reviewId: string, targetFoodId: string) => {
        if (!user) {
            throw new Error('Must be logged in to delete review');
        }

        // Local items don't have reviews in DB
        if (targetFoodId.startsWith('best-food-')) return;

        try {
            const { error } = await supabase
                .from('food_reviews')
                .delete()
                .eq('id', reviewId)
                .eq('user_id', user.id);

            if (error) throw error;

            // Refresh reviews
            await fetchReviews(targetFoodId);
        } catch (error) {
            console.error('Error deleting review:', error);
            throw error;
        }
    }, [user, fetchReviews]);

    return {
        reviews,
        loading,
        stats,
        fetchReviews,
        getUserReview,
        addReview,
        updateReview,
        deleteReview,
    };
}
