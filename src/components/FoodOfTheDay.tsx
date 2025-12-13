import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight } from 'lucide-react';
import { OptimizedImage } from './OptimizedImage';
import { fixImageUrl } from '@/utils/fixImage';

interface FoodItem {
    id: string;
    name: string;
    origin: string;
    rating: number;
    imageUrl: string;
    description: string;
}

interface FoodOfTheDayProps {
    foods: FoodItem[];
}

export function FoodOfTheDay({ foods }: FoodOfTheDayProps) {
    const [dailyFood, setDailyFood] = useState<FoodItem | null>(null);

    useEffect(() => {
        if (foods.length === 0) return;

        // Get food based on today's date (changes daily)
        const today = new Date();
        const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
        const index = dayOfYear % foods.length;

        setDailyFood(foods[index]);
    }, [foods]);

    if (!dailyFood) return null;

    return (
        <div className="w-full bg-gradient-to-br from-amber-50 to-orange-50 border-y border-amber-200 py-12 mb-8">
            <div className="container mx-auto px-4">
                <div className="flex items-center gap-2 mb-4 justify-center">
                    <Sparkles className="h-6 w-6 text-amber-600" />
                    <h2 className="text-2xl md:text-3xl font-bold text-center">
                        Makanan Hari Ini
                    </h2>
                    <Sparkles className="h-6 w-6 text-amber-600" />
                </div>
                <p className="text-center text-muted-foreground mb-6">
                    Rekomendasi spesial untuk Anda hari ini
                </p>

                <Card className="max-w-3xl mx-auto overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
                    <div className="grid md:grid-cols-2 gap-0">
                        <div className="relative h-64 md:h-full bg-muted">
                            <OptimizedImage
                                src={fixImageUrl(dailyFood.name, dailyFood.imageUrl)}
                                alt={dailyFood.name}
                                className="w-full h-full"
                                priority={true}
                            />
                        </div>
                        <div className="p-6 md:p-8 flex flex-col justify-center">
                            <h3 className="text-3xl font-bold mb-3">{dailyFood.name}</h3>
                            <p className="text-muted-foreground mb-2 flex items-center gap-2">
                                📍 {dailyFood.origin}
                            </p>
                            <p className="text-muted-foreground mb-2 flex items-center gap-2">
                                ⭐ {dailyFood.rating.toFixed(1)} / 5.0
                            </p>
                            <p className="text-sm text-foreground/80 mb-6 line-clamp-3">
                                {dailyFood.description}
                            </p>
                            <Button asChild size="lg" className="w-full md:w-auto">
                                <Link to={`/food/${dailyFood.id}`} className="flex items-center gap-2">
                                    Lihat Detail
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
