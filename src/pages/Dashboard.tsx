import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useDashboard } from '@/hooks/useDashboard';
import { useFoodHistory } from '@/hooks/useFoodHistory';
import { useProfile } from '@/hooks/useProfile';
import {
    Star, Heart, Eye, MessageCircle, Trophy,
    Calendar, ArrowUpRight, Loader2, Activity
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { OptimizedImage } from '@/components/OptimizedImage';
import { fixImageUrl } from '@/utils/fixImage';

export default function Dashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { profile } = useProfile();
    const { stats, activities, badges, loading } = useDashboard();
    const { recentlyViewed } = useFoodHistory();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-gray-400" />
            </div>
        );
    }

    if (!stats) return null;

    const getMemberDays = () => {
        const memberSince = new Date(stats.member_since);
        const now = new Date();
        const diff = now.getTime() - memberSince.getTime();
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12 font-sans">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Profile Completion Prompt */}
                {user && (!profile?.avatar_url || !profile?.full_name) && (
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg p-6 mb-8 text-white flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold mb-1">🔥 Lengkapi Profilmu!</h2>
                            <p className="text-indigo-100">Pasang foto keren & nama aslimu biar makin dikenal.</p>
                        </div>
                        <Button variant="secondary" onClick={() => navigate('/settings')}>
                            Lengkapi Sekarang
                        </Button>
                    </div>
                )}

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="mt-1 text-gray-500">Welcome back, {profile?.full_name || user?.email?.split('@')[0]}</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-7xl">

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

                    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-gray-100 rounded-lg">
                                <Star className="h-5 w-5 text-gray-700" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">
                            {stats.total_reviews}
                        </h3>
                        <p className="text-gray-600 text-sm">Total Reviews</p>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-gray-100 rounded-lg">
                                <Heart className="h-5 w-5 text-gray-700" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">
                            {stats.total_favorites}
                        </h3>
                        <p className="text-gray-600 text-sm">Favorites</p>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-gray-100 rounded-lg">
                                <Eye className="h-5 w-5 text-gray-700" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">
                            {stats.total_foods_viewed}
                        </h3>
                        <p className="text-gray-600 text-sm">Foods Explored</p>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-gray-100 rounded-lg">
                                <Calendar className="h-5 w-5 text-gray-700" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">
                            {getMemberDays()}
                        </h3>
                        <p className="text-gray-600 text-sm">Days as Member</p>
                    </div>

                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Achievements */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex items-center gap-2 mb-6">
                                <Trophy className="h-6 w-6 text-gray-700" />
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Achievements & Badges
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {badges.map((badge) => (
                                    <div
                                        key={badge.id}
                                        className={`p-4 rounded-lg border-2 ${badge.unlocked
                                            ? 'border-gray-900 bg-gray-50'
                                            : 'border-gray-200 bg-white'
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`text-3xl ${!badge.unlocked && 'grayscale opacity-30'}`}>
                                                {badge.icon}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-gray-900 mb-1">
                                                    {badge.name}
                                                </h3>
                                                <p className="text-sm text-gray-600 mb-2">
                                                    {badge.description}
                                                </p>

                                                {badge.maxProgress && (
                                                    <div className="mt-2">
                                                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                                                            <span>{badge.progress}/{badge.maxProgress}</span>
                                                            <span>{Math.floor((badge.progress / badge.maxProgress) * 100)}%</span>
                                                        </div>
                                                        <div className="w-full h-2 bg-gray-200 rounded-full">
                                                            <div
                                                                className="h-2 bg-gray-900 rounded-full"
                                                                style={{ width: `${Math.min((badge.progress / badge.maxProgress) * 100, 100)}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {badge.unlocked && (
                                            <div className="mt-2">
                                                <span className="inline-block bg-gray-900 text-white text-xs px-2 py-1 rounded-full">
                                                    {badge.level.toUpperCase()}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recently Viewed */}
                        {recentlyViewed.length > 0 && (
                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-bold text-gray-900">
                                        Recently Viewed
                                    </h2>
                                    <Link
                                        to="/history"
                                        className="text-gray-600 hover:text-gray-900 text-sm font-medium flex items-center gap-1"
                                    >
                                        See All <ArrowUpRight className="h-4 w-4" />
                                    </Link>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {recentlyViewed.slice(0, 4).map((food) => (
                                        <Link
                                            key={food.id}
                                            to={`/food/${food.food_id}`}
                                            className="group"
                                        >
                                            <div className="relative rounded-lg overflow-hidden aspect-square mb-2 border border-gray-200 hover:border-gray-900 transition-all">
                                                <OptimizedImage
                                                    src={fixImageUrl(food.food_name, food.food_image)}
                                                    alt={food.food_name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <p className="text-sm font-medium text-gray-900 line-clamp-2">
                                                {food.food_name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Viewed {food.view_count}x
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Right Column - Activity Feed */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <MessageCircle className="h-5 w-5 text-gray-700" />
                                Recent Activity
                            </h2>

                            {activities.length > 0 ? (
                                <div className="space-y-3">
                                    {activities.slice(0, 5).map((activity) => (
                                        <div
                                            key={activity.id}
                                            className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                                        >
                                            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                                                {activity.activity_type === 'review' && <Star className="h-4 w-4 text-gray-700" />}
                                                {activity.activity_type === 'favorite' && <Heart className="h-4 w-4 text-gray-700" />}
                                                {activity.activity_type === 'comment' && <MessageCircle className="h-4 w-4 text-gray-700" />}
                                                {activity.activity_type === 'view' && <Eye className="h-4 w-4 text-gray-700" />}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-gray-900">
                                                    {activity.activity_type === 'review' && 'Reviewed '}
                                                    {activity.activity_type === 'favorite' && 'Favorited '}
                                                    {activity.activity_type === 'comment' && 'Commented on '}
                                                    {activity.activity_type === 'view' && 'Viewed '}
                                                    <span className="font-semibold">
                                                        {activity.food_name}
                                                    </span>
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {new Date(activity.created_at).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500 text-sm">No activity yet</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
