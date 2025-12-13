import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Search, Database } from 'lucide-react';

const DataInspector = () => {
    const [foods, setFoods] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [originCounts, setOriginCounts] = useState<Record<string, number>>({});

    const loadData = async () => {
        setLoading(true);
        try {
            // Get all foods
            const { data } = await supabase
                .from('food_items')
                .select('name, origin')
                .order('origin');

            if (data) {
                setFoods(data);

                // Count by origin
                const counts: Record<string, number> = {};
                data.forEach(item => {
                    counts[item.origin] = (counts[item.origin] || 0) + 1;
                });
                setOriginCounts(counts);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <div className="container mx-auto p-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Database className="h-5 w-5" />
                        Database Food Inspector
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Button onClick={loadData} disabled={loading} className="mb-4">
                        {loading ? 'Loading...' : 'Reload Data'}
                    </Button>

                    {/* Origin Distribution */}
                    <div className="mb-6">
                        <h3 className="font-semibold mb-2">📊 Origin Distribution ({foods.length} total items)</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {Object.entries(originCounts)
                                .sort(([, a], [, b]) => b - a)
                                .map(([origin, count]) => (
                                    <div key={origin} className="bg-gray-50 p-2 rounded text-sm">
                                        <span className="font-semibold">{origin}:</span> {count} items
                                    </div>
                                ))}
                        </div>
                    </div>

                    {/* Sample Foods */}
                    <div>
                        <h3 className="font-semibold mb-2">📋 Sample Foods (first 50)</h3>
                        <div className="max-h-96 overflow-y-auto border rounded">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-100 sticky top-0">
                                    <tr>
                                        <th className="text-left p-2">Food Name</th>
                                        <th className="text-left p-2">Current Origin</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {foods.slice(0, 50).map((food, idx) => (
                                        <tr key={idx} className="border-t hover:bg-gray-50">
                                            <td className="p-2">{food.name}</td>
                                            <td className="p-2 text-gray-600">{food.origin}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="mt-4 bg-blue-50 border border-blue-200 p-3 rounded text-sm">
                        <p className="font-semibold text-blue-800 mb-1">💡 Cara Update Origin:</p>
                        <p className="text-blue-700">
                            Kalau banyak yang origin-nya generic (Indonesia, Jawa Barat, dll),
                            gunakan tool Update Origins untuk sesuaikan ke kota spesifik.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default DataInspector;
