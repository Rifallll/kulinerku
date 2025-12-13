import React, { useEffect } from 'react';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/contexts/AuthContext';
import FoodCard from '@/components/FoodCard';
import { Heart, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Favorites() {
    const { favorites, count, loading } = useFavorites();
    const { user } = useAuth();
    const navigate = useNavigate();

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!user && !loading) {
            navigate('/login');
        }
    }, [user, loading, navigate]);

    // Show loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    // Must be authenticated to see this page
    if (!user) {
        return null;
    }

    if (count === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <Heart className="h-24 w-24 text-gray-300 mb-4" />
                <h1 className="text-3xl font-bold mb-2">Belum Ada Favorit</h1>
                <p className="text-muted-foreground mb-6 text-center max-w-md">
                    Klik ikon ❤️ pada makanan yang kamu suka untuk menambahkannya ke favorit
                </p>
                <Button asChild>
                    <Link to="/">Jelajahi Makanan</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
                    <Heart className="h-8 w-8 fill-red-500 text-red-500" />
                    Makanan Favorit
                </h1>
                <p className="text-muted-foreground">
                    Kamu punya {count} makanan favorit
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((food) => (
                    <FoodCard
                        key={food.id}
                        id={food.food_id}
                        name={food.food_name}
                        type={food.food_category || ""}
                        origin={food.food_region || ""}
                        rating={0}
                        description=""
                        imageUrl={food.food_image || ""}
                    />
                ))}
            </div>
        </div>
    );
}
