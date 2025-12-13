import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, MapPin, Star, Utensils, Brain, Sparkles } from 'lucide-react';
import { getProvinceFromOrigin } from '@/utils/provinceMapping';

interface FoodItem {
    id: string;
    name: string;
    type: string;
    origin: string;
    rating: number;
}

interface AnalyticsData {
    totalItems: number;
    avgRating: number;
    totalRegions: number;
    totalCategories: number;
    trending: { name: string; rating: number }[];
    regionalData: { name: string; makanan: number; minuman: number }[];
    ratingData: { range: string; count: number }[];
    insights: string[];
}

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];

export default function AnalyticsDashboard() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

    const fetchAnalytics = async () => {
        try {
            setLoading(true);

            // Fetch all food items
            const { data: items, error } = await supabase
                .from('food_items')
                .select('*');

            if (error) throw error;

            // Process items with province grouping using centralized function
            const processedItems = items.map(item => ({
                ...item,
                origin: getProvinceFromOrigin(item.origin)
            })); // Keep all items including "Indonesia"

            // Calculate analytics
            const totalItems = processedItems.length;
            const avgRating = processedItems.reduce((sum, item) => sum + item.rating, 0) / totalItems;

            // Unique regions (exclude generic entries like "Indonesia" and "Unknown")
            const regions = new Set(
                processedItems
                    .map(item => item.origin)
                    .filter(origin => origin !== 'Indonesia' && origin !== 'Unknown')
            );
            const totalRegions = regions.size;

            // Unique categories
            const categories = new Set(processedItems.map(item => item.type));
            const totalCategories = categories.size;

            // Top 10 trending (highest rated)
            const trending = processedItems
                .sort((a, b) => b.rating - a.rating)
                .slice(0, 10)
                .map(item => ({
                    name: item.name.length > 20 ? item.name.substring(0, 20) + '...' : item.name,
                    rating: item.rating
                }));

            // Regional distribution with type breakdown
            const regionalCounts: Record<string, { makanan: number; minuman: number }> = {};
            processedItems.forEach(item => {
                const region = item.origin || 'Unknown'; // Handle empty origin
                if (!regionalCounts[region]) {
                    regionalCounts[region] = { makanan: 0, minuman: 0 };
                }

                // Group logic: If it's specifically "Minuman", count as Minuman.
                // EVERYTHING else (Makanan, Snack, Dessert, etc) counts as Makanan
                // This ensures the chart total equals the database total
                if (item.type === 'Minuman') {
                    regionalCounts[region].minuman++;
                } else {
                    regionalCounts[region].makanan++;
                }
            });

            const regionalData = Object.entries(regionalCounts)
                .filter(([name]) => name !== 'Indonesia') // Exclude generic "Indonesia" from chart
                .sort((a, b) => (b[1].makanan + b[1].minuman) - (a[1].makanan + a[1].minuman))
                // Show ALL provinces, no limit
                .map(([name, counts]) => ({
                    name,
                    makanan: counts.makanan,
                    minuman: counts.minuman
                }));

            // Rating distribution
            const ratingRanges = [
                { range: '0-2', count: 0 },
                { range: '2-3', count: 0 },
                { range: '3-4', count: 0 },
                { range: '4-4.5', count: 0 },
                { range: '4.5-5', count: 0 }
            ];

            items.forEach(item => {
                if (item.rating < 2) ratingRanges[0].count++;
                else if (item.rating < 3) ratingRanges[1].count++;
                else if (item.rating < 4) ratingRanges[2].count++;
                else if (item.rating < 4.5) ratingRanges[3].count++;
                else ratingRanges[4].count++;
            });

            // AI-generated insights
            const insights = generateInsights(processedItems, avgRating, totalRegions);

            setData({
                totalItems,
                avgRating,
                totalRegions,
                totalCategories,
                trending,
                regionalData,
                ratingData: ratingRanges,
                insights
            });

            setLastUpdate(new Date());
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const generateInsights = (items: FoodItem[], avgRating: number, totalRegions: number): string[] => {
        const insights: string[] = [];

        // Insight 1: Top rated item
        const topItem = items.reduce((max, item) => item.rating > max.rating ? item : max);
        insights.push(`🏆 "${topItem.name}" memiliki rating tertinggi (${topItem.rating.toFixed(1)}/5.0)`);

        // Insight 2: Most popular region
        const regionCounts: Record<string, number> = {};
        items.forEach(item => {
            regionCounts[item.origin] = (regionCounts[item.origin] || 0) + 1;
        });
        const topRegion = Object.entries(regionCounts).sort((a, b) => b[1] - a[1])[0];
        insights.push(`📍 ${topRegion[0]} memiliki ${topRegion[1]} makanan terdaftar`);

        // Insight 3: Average rating trend
        if (avgRating >= 4.5) {
            insights.push(`⭐ Kualitas sangat baik! Rata-rata rating ${avgRating.toFixed(2)}/5.0`);
        } else if (avgRating >= 4.0) {
            insights.push(`✨ Kualitas bagus! Rata-rata rating ${avgRating.toFixed(2)}/5.0`);
        }

        // Insight 4: Diversity
        insights.push(`🗺️ Platform mencakup ${totalRegions} daerah di Indonesia`);

        // Insight 5: Category distribution
        const makanan = items.filter(i => i.type === 'Makanan').length;
        const minuman = items.filter(i => i.type === 'Minuman').length;
        const ratio = (makanan / minuman).toFixed(1);
        insights.push(`🍽️ Rasio Makanan:Minuman = ${ratio}:1`);

        return insights;
    };

    useEffect(() => {
        fetchAnalytics();

        // Auto-refresh every 5 minutes
        const interval = setInterval(fetchAnalytics, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Memuat analytics...</p>
                </div>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
                    <Brain className="w-10 h-10 text-primary" />
                    Analytics Dashboard
                </h1>
                <p className="text-muted-foreground">
                    Real-time insights powered by AI • Last updated: {lastUpdate.toLocaleTimeString('id-ID')}
                </p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                        <Utensils className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.totalItems}</div>
                        <p className="text-xs text-muted-foreground">Makanan & Minuman</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
                        <Star className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.avgRating.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">dari 5.0</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Regions</CardTitle>
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.totalRegions}</div>
                        <p className="text-xs text-muted-foreground">Provinsi Indonesia</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 gap-6 mb-6">
                {/* Regional Distribution - FULL WIDTH */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="w-5 h-5" />
                            Makanan Khas Indonesia
                        </CardTitle>
                        <CardDescription>Kuliner tradisional dari seluruh provinsi Indonesia</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={1400}>
                            <BarChart data={data.regionalData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={150} fontSize={12} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="makanan" fill="#FF6B6B" name="Makanan" />
                                <Bar dataKey="minuman" fill="#4ECDC4" name="Minuman" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Trending Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            Top 10 Trending
                        </CardTitle>
                        <CardDescription>Makanan dengan rating tertinggi</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={data.trending}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" angle={-45} textAnchor="end" height={120} fontSize={11} />
                                <YAxis domain={[0, 5]} />
                                <Tooltip />
                                <Bar dataKey="rating" fill="#FF6B6B" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Rating Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Star className="w-5 h-5 text-yellow-500" />
                            Distribusi Rating
                        </CardTitle>
                        <CardDescription>Sebaran rating makanan</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={data.ratingData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="range" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" fill="#4ECDC4" name="Jumlah Items" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row 3 - AI Insights */}
            <div className="grid grid-cols-1 gap-6 mb-6">
                {/* AI Insights */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-yellow-500" />
                            AI Insights
                        </CardTitle>
                        <CardDescription>Analisis otomatis dari data</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {data.insights.map((insight, index) => (
                                <div key={index} className="flex items-start gap-2 p-3 bg-muted rounded-lg">
                                    <div className="text-sm">{insight}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
