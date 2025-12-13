import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboard } from '@/hooks/useDashboard';
import { useFoodHistory } from '@/hooks/useFoodHistory';
import {
    TrendingUp, Heart, Eye, MessageCircle, Trophy,
    Calendar, ArrowUpRight, Loader2, Star
} from 'lucide-react';
import { OptimizedImage } from '@/components/OptimizedImage';
import { fixImageUrl } from '@/utils/fixImage';

export default function Dashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { stats, activities, badges, loading } = useDashboard();
    const { recentlyViewed } = useFoodHistory();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
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

    const getBadgeColor = (level: string) => {
        switch (level) {
            case 'platinum': return 'from-cyan-400 to-blue-500';
            case 'gold': return 'from-yellow-400 to-orange-500';
            case 'silver': return 'from-gray-300 to-gray-400';
            case 'bronze': return 'from-orange-400 to-orange-600';
            default: return 'from-gray-200 to-gray-300';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">

            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
                <div className="container mx-auto px-4 py-12 max-w-7xl">
                    <h1 className="text-4xl md:text-5xl font-bold mb-3">
                        Selamat Datang, <span className="text-yellow-300">{user?.email?.split('@')[0]}</span>! 👋
                    </h1>
                    <p className="text-xl text-indigo-100">
                        Mari jelajahi dunia kuliner Indonesia bersama!
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-7xl">

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">

                    {/* Reviews Card */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-rose-500 hover:shadow-xl transition-all transform hover:-translate-y-1">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl">
                                <Star className="h-6 w-6 text-white" />
                            </div>
                            <TrendingUp className="h-5 w-5 text-rose-500" />
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">
                            {stats.total_reviews}
                        </h3>
                        <p className="text-gray-600 text-sm font-medium">Total Reviews</p>
                    </div>

                    {/* Favorites Card */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-red-500 hover:shadow-xl transition-all transform hover:-translate-y-1">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl">
                                <Heart className="h-6 w-6 text-white" />
                            </div>
                            <TrendingUp className="h-5 w-5 text-red-500" />
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">
                            {stats.total_favorites}
                        </h3>
                        <p className="text-gray-600 text-sm font-medium">Favorites</p>
                    </div>

                    {/* Foods Explored Card */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-indigo-500 hover:shadow-xl transition-all transform hover:-translate-y-1">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                                <Eye className="h-6 w-6 text-white" />
                            </div>
                            <TrendingUp className="h-5 w-5 text-indigo-500" />
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">
                            {stats.total_foods_viewed}
                        </h3>
                        <p className="text-gray-600 text-sm font-medium">Foods Explored</p>
                    </div>

                    {/* Member Since Card */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-emerald-500 hover:shadow-xl transition-all transform hover:-translate-y-1">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl">
                                <Calendar className="h-6 w-6 text-white" />
                            </div>
                            <TrendingUp className="h-5 w-5 text-emerald-500" />
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">
                            {getMemberDays()}
                        </h3>
                        <p className="text-gray-600 text-sm font-medium">Days as Member</p>
                    </div>

                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column - Badges & Recently Viewed */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Achievements & Badges */}
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                    <Trophy className="h-6 w-6 text-yellow-500" />
                                    Achievements & Badges
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {badges.map((badge) => (
                                    <div
                                        key={badge.id}
                                        className={`relative p-6 rounded-xl border-2 ${badge.unlocked
                                                ? 'border-transparent bg-gradient-to-br ' + getBadgeColor(badge.level) + ' text-white'
                                                : 'border-gray-200 bg-gray-50'
                                            } transition-all hover:scale-105`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={`text-4xl ${!badge.unlocked && 'grayscale opacity-30'}`}>
                                                {badge.icon}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className={`font-bold mb-1 ${badge.unlocked ? 'text-white' : 'text-gray-900'}`}>
                                                    {badge.name}
                                                </h3>
                                                <p className={`text-sm mb-2 ${badge.unlocked ? 'text-white/90' : 'text-gray-600'}`}>
                                                    {badge.description}
                                                </p>

                                                {/* Progress Bar */}
                                                {badge.maxProgress && (
                                                    <div className="mt-3">
                                                        <div className={`flex justify-between text-xs mb-1 ${badge.unlocked ? 'text-white/80' : 'text-gray-500'}`}>
                                                            <span>{badge.progress}/{badge.maxProgress}</span>
                                                            <span>{Math.floor((badge.progress / badge.maxProgress) * 100)}%</span>
                                                        </div>
                                                        <div className={`w-full h-2 rounded-full ${badge.unlocked ? 'bg-white/30' : 'bg-gray-200'}`}>
                                                            <div
                                                                className={`h-2 rounded-full ${badge.unlocked ? 'bg-white' : 'bg-indigo-500'}`}
                                                                style={{ width: `${Math.min((badge.progress / badge.maxProgress) * 100, 100)}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {badge.unlocked && (
                                            <div className="absolute top-3 right-3">
                                                <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-bold text-white">
                                                    {badge.level.toUpperCase()}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recently Viewed */}
                        {recentlyViewed.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-lg p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        🕒 Recently Viewed
                                    </h2>
                                    <Link
                                        to="/history"
                                        className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1"
                                    >
                                        See All <ArrowUpRight className="h-4 w-4" />
                                    </Link>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {recentlyViewed.slice(0, 4).map((food) => (
                                        <Link
                                            key={food.id}
                                            to={`/food/${food.food_id}`}
                                            className="group"
                                        >
                                            <div className="relative rounded-xl overflow-hidden aspect-square mb-2 border-2 border-transparent group-hover:border-indigo-500 transition-all">
                                                <OptimizedImage
                                                    src={fixImageUrl(food.food_name, food.food_image)}
                                                    alt={food.food_name}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                            <p className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-indigo-600">
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
                        <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-4">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <MessageCircle className="h-6 w-6 text-indigo-600" />
                                Recent Activity
                            </h2>

                            {activities.length > 0 ? (
                                <div className="space-y-4">
                                    {activities.map((activity) => (
                                        <div
                                            key={activity.id}
                                            className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${activity.activity_type === 'review' ? 'bg-rose-100 text-rose-600' :
                                                    activity.activity_type === 'favorite' ? 'bg-red-100 text-red-600' :
                                                        activity.activity_type === 'comment' ? 'bg-indigo-100 text-indigo-600' :
                                                            'bg-purple-100 text-purple-600'
                                                }`}>
                                                {activity.activity_type === 'review' && <Star className="h-5 w-5" />}
                                                {activity.activity_type === 'favorite' && <Heart className="h-5 w-5" />}
                                                {activity.activity_type === 'comment' && <MessageCircle className="h-5 w-5" />}
                                                {activity.activity_type === 'view' && <Eye className="h-5 w-5" />}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-gray-900">
                                                    {activity.activity_type === 'review' && 'Reviewed '}
                                                    {activity.activity_type === 'favorite' && 'Added to favorites '}
                                                    {activity.activity_type === 'comment' && 'Commented on '}
                                                    {activity.activity_type === 'view' && 'Viewed '}
                                                    <span className="font-semibold text-indigo-600">
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
                                <div className="text-center py-12">
                                    <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500">No activity yet</p>
                                    <p className="text-sm text-gray-400 mt-1">Start exploring foods!</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
