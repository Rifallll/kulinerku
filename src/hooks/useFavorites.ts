import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { logActivity } from '@/utils/activityLogger';

export interface FavoriteFood {
    id: string;
    food_id: string;
    food_name: string;
    food_image?: string;
    food_category?: string;
    food_region?: string;
    created_at?: string;
}

export function useFavorites() {
    const [favorites, setFavorites] = useState<FavoriteFood[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    // Fetch user's favorites from Supabase
    const fetchFavorites = useCallback(async () => {
        if (!user) {
            setFavorites([]);
            setLoading(false);
            return;
        }

        try {
            const { data, error } = await supabase
                .from('user_favorites')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setFavorites(data || []);
        } catch (error) {
            console.error('Error fetching favorites:', error);
            setFavorites([]);
        } finally {
            setLoading(false);
        }
    }, [user]);

    // Load favorites on mount and when user changes
    useEffect(() => {
        fetchFavorites();
    }, [fetchFavorites]);

    // Add food to favorites
    const addFavorite = async (food: {
        id: string;
        name: string;
        imageUrl?: string;
        origin?: string;
        type?: string;
    }) => {
        if (!user) {
            throw new Error('Must be logged in to add favorites');
        }

        try {
            const { data, error } = await supabase
                .from('user_favorites')
                .insert({
                    user_id: user.id,
                    food_id: food.id,
                    food_name: food.name,
                    food_image: food.imageUrl,
                    food_category: food.type,
                    food_region: food.origin,
                })
                .select()
                .single();

            if (error) throw error;

            // Update local state
            setFavorites(prev => [data, ...prev]);
            return data;
        } catch (error: any) {
            // Handle duplicate error gracefully
            if (error.code === '23505') {
                console.log('Food already in favorites');
                return null;
            }
            console.error('Error adding favorite:', error);
            throw error;
        }
    };

    // Remove food from favorites
    const removeFavorite = async (foodId: string) => {
        if (!user) {
            throw new Error('Must be logged in to remove favorites');
        }

        try {
            const { error } = await supabase
                .from('user_favorites')
                .delete()
                .eq('user_id', user.id)
                .eq('food_id', foodId);

            if (error) throw error;

            // Update local state
            setFavorites(prev => prev.filter(fav => fav.food_id !== foodId));
        } catch (error) {
            console.error('Error removing favorite:', error);
            throw error;
        }
    };


    // Check if food is favorited
    const isFavorite = (foodId: string): boolean => {
        return favorites.some(fav => fav.food_id === foodId);
    };

    // Toggle favorite with Optimistic Update
    const toggleFavorite = async (food: {
        id: string;
        name: string;
        imageUrl?: string;
        origin?: string;
        type?: string;
        rating?: number;
    }) => {
        if (!user) throw new Error('Must be logged in');

        const isCurrentlyFavorite = favorites.some(f => f.food_id === food.id);
        const optimisticFavorite: FavoriteFood = {
            id: 'temp-' + Date.now(),
            food_id: food.id,
            food_name: food.name,
            food_image: food.imageUrl,
            food_category: food.type,
            food_region: food.origin,
            created_at: new Date().toISOString()
        };

        // 1. OPTIMISTIC UPDATE: Update UI immediately
        if (isCurrentlyFavorite) {
            setFavorites(prev => prev.filter(f => f.food_id !== food.id));
        } else {
            setFavorites(prev => [optimisticFavorite, ...prev]);
        }

        try {
            // 2. Perform actual API call in background
            if (isCurrentlyFavorite) {
                const { error } = await supabase
                    .from('user_favorites')
                    .delete()
                    .eq('user_id', user.id)
                    .eq('food_id', food.id);
                if (error) throw error;
            } else {
                const { data, error } = await supabase
                    .from('user_favorites')
                    .insert({
                        user_id: user.id,
                        food_id: food.id,
                        food_name: food.name,
                        food_image: food.imageUrl,
                        food_category: food.type,
                        food_region: food.origin,
                    })
                    .select()
                    .single();

                if (error) throw error;

                // Log activity
                logActivity('FAVORITE', { food_id: food.id, food_name: food.name });

                // Replace temp ID with real ID
                setFavorites(prev => prev.map(f =>
                    f.id === optimisticFavorite.id ? data : f
                ));
            }
        } catch (error) {
            // 3. ROLLBACK on error
            console.error('Error toggling favorite:', error);
            // Revert to previous state (simplest way is to refetch or toggle back)
            // Ideally we keep previous state snapshot, but fetching is safer for consistency
            fetchFavorites();
            throw error;
        }
    };

    return {
        favorites,
        loading,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        isFavorite: (foodId: string) => favorites.some(f => f.food_id === foodId),
        refreshFavorites: fetchFavorites,
        count: favorites.length,
    };
}
