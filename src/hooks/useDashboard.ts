import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface UserStats {
    total_reviews: number;
    total_favorites: number;
    total_foods_viewed: number;
    total_comments: number;
    member_since: string;
    last_active: string;
    badges: Badge[];
    achievements: Record<string, any>;
}

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    level: 'bronze' | 'silver' | 'gold' | 'platinum';
    unlocked: boolean;
    progress?: number;
    maxProgress?: number;
}

export interface Activity {
    id: string;
    activity_type: 'review' | 'favorite' | 'view' | 'comment';
    food_id?: string;
    food_name?: string;
    food_image?: string;
    metadata?: Record<string, any>;
    created_at: string;
}

export function useDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState<UserStats | null>(null);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch user stats
    const fetchStats = useCallback(async () => {
        if (!user) return;

        try {
            const { data, error } = await supabase
                .from('user_stats')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (error && error.code === 'PGRST116') {
                // No stats yet, create initial record
                const { data: newStats, error: insertError } = await supabase
                    .from('user_stats')
                    .insert({
                        user_id: user.id,
                        total_reviews: 0,
                        total_favorites: 0,
                        total_foods_viewed: 0,
                        total_comments: 0,
                        badges: [],
                        achievements: {}
                    })
                    .select()
                    .single();

                if (insertError) throw insertError;
                setStats(newStats as UserStats);
            } else if (error) {
                throw error;
            } else {
                setStats(data as UserStats);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    }, [user]);

    // Fetch recent activities
    const fetchActivities = useCallback(async () => {
        if (!user) return;

        try {
            const { data, error } = await supabase
                .from('user_activities')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(50);

            if (error) throw error;

            // Map DB response to Activity interface
            const mappedActivities = (data || []).map((item: any) => {
                const rawType = (item.action_type || 'other').toLowerCase();
                let type = 'other';
                if (rawType.includes('view')) type = 'view';
                else if (rawType.includes('review')) type = 'review';
                else if (rawType.includes('favorite')) type = 'favorite';
                else if (rawType.includes('comment')) type = 'comment';

                return {
                    id: item.id,
                    activity_type: type, // Normalized type
                    food_id: item.details?.food_id,
                    food_name: item.details?.food_name || item.details?.name || 'Unknown Item',
                    food_image: item.details?.food_image,
                    metadata: item.details,
                    created_at: item.created_at
                };
            });

            setActivities(mappedActivities as Activity[]);
        } catch (error) {
            console.error('Error fetching activities:', error);
        }
    }, [user]);

    // Calculate badges based on stats
    const calculateBadges = useCallback((userStats: UserStats): Badge[] => {
        const badges: Badge[] = [];

        // Food Explorer Badge
        const foodsViewed = userStats.total_foods_viewed;
        badges.push({
            id: 'food_explorer',
            name: 'Food Explorer',
            description: 'Explore Indonesian cuisine',
            icon: '🗺️',
            level: foodsViewed >= 200 ? 'platinum' : foodsViewed >= 100 ? 'gold' : foodsViewed >= 50 ? 'silver' : 'bronze',
            unlocked: foodsViewed >= 10,
            progress: foodsViewed,
            maxProgress: foodsViewed >= 200 ? 200 : foodsViewed >= 100 ? 200 : foodsViewed >= 50 ? 100 : 50
        });

        // Reviewer Badge
        const reviews = userStats.total_reviews;
        badges.push({
            id: 'reviewer',
            name: 'Food Critic',
            description: 'Share your culinary reviews',
            icon: '⭐',
            level: reviews >= 100 ? 'platinum' : reviews >= 50 ? 'gold' : reviews >= 20 ? 'silver' : 'bronze',
            unlocked: reviews >= 5,
            progress: reviews,
            maxProgress: reviews >= 100 ? 100 : reviews >= 50 ? 100 : reviews >= 20 ? 50 : 20
        });

        // Foodie Badge
        const favorites = userStats.total_favorites;
        badges.push({
            id: 'foodie',
            name: 'Foodie Collector',
            description: 'Build your favorites collection',
            icon: '❤️',
            level: favorites >= 100 ? 'platinum' : favorites >= 50 ? 'gold' : favorites >= 20 ? 'silver' : 'bronze',
            unlocked: favorites >= 5,
            progress: favorites,
            maxProgress: favorites >= 100 ? 100 : favorites >= 50 ? 100 : favorites >= 20 ? 50 : 20
        });

        // Community Badge
        const comments = userStats.total_comments;
        badges.push({
            id: 'community',
            name: 'Community Member',
            description: 'Engage in discussions',
            icon: '💬',
            level: comments >= 100 ? 'platinum' : comments >= 50 ? 'gold' : comments >= 20 ? 'silver' : 'bronze',
            unlocked: comments >= 5,
            progress: comments,
            maxProgress: comments >= 100 ? 100 : comments >= 50 ? 100 : comments >= 20 ? 50 : 20
        });

        // Early Adopter Badge
        const memberSince = new Date(userStats.member_since);
        const isEarlyAdopter = memberSince < new Date('2025-01-01');
        badges.push({
            id: 'early_adopter',
            name: 'Early Adopter',
            description: 'Joined in the early days',
            icon: '🌟',
            level: 'gold',
            unlocked: isEarlyAdopter,
            progress: 1,
            maxProgress: 1
        });

        return badges;
    }, []);

    // Load data on mount and subscribe to changes
    useEffect(() => {
        if (user) {
            Promise.all([fetchStats(), fetchActivities()]).finally(() => {
                setLoading(false);
            });

            // Real-time subscription for stats (e.g. when Favorites count changes)
            const statsSubscription = supabase
                .channel('realtime:user_stats')
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: 'user_stats',
                        filter: `user_id=eq.${user.id}`,
                    },
                    (payload) => {
                        console.log('Stats updated:', payload);
                        fetchStats(); // Refetch to get fresh data
                    }
                )
                .subscribe();

            // Real-time subscription for activities
            const activitySubscription = supabase
                .channel('realtime:user_activities')
                .on(
                    'postgres_changes',
                    {
                        event: 'INSERT',
                        schema: 'public',
                        table: 'user_activities',
                        filter: `user_id=eq.${user.id}`,
                    },
                    (payload) => {
                        console.log('New activity:', payload);
                        fetchActivities();
                    }
                )
                .subscribe();

            return () => {
                supabase.removeChannel(statsSubscription);
                supabase.removeChannel(activitySubscription);
            };
        }
    }, [user, fetchStats, fetchActivities]);

    // Get badges whenever stats change
    const badges = stats ? calculateBadges(stats) : [];

    return {
        stats,
        activities,
        badges,
        loading,
        refreshStats: fetchStats,
        refreshActivities: fetchActivities
    };
}
