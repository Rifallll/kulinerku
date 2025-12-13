"use client";

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Award, Loader2 } from "lucide-react";
import FoodCard from "@/components/FoodCard";
import { supabase } from "@/lib/supabase";

const BestFood = () => {
  const [foods, setFoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBestFoods();
  }, []);

  const fetchBestFoods = async () => {
    try {
      // Fetch data that matches the 'Best Food' criteria
      // Ideally we would flag them, but for now we order by highest rating
      // or we could filter by the exact names in our list if we wanted to be strict.
      // But user wants to manage them, so ordering by rating desc is best.
      const { data, error } = await supabase
        .from('food_items')
        .select('*')
        .eq('mostIconic', 'STAR') // Fetch only curated items
        .order('name', { ascending: true });

      if (error) throw error;
      setFoods(data || []);
    } catch (error) {
      console.error('Error fetching best foods:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-12">
      {/* Hero Section */}
      <div className="bg-primary/10 py-12 px-4 mb-8">
        <div className="container mx-auto text-center">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="bg-primary/20 p-4 rounded-full ring-4 ring-primary/10">
              <Award className="h-10 w-10 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-bold mb-3">50 Makanan Terbaik Indonesia</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Koleksi kuliner legendaris nusantara yang wajib dicoba (Data Real-time).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Food Grid */}
      <div className="container mx-auto px-4 max-w-6xl">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {foods.map((food, index) => (
              <FoodCard
                key={food.id || index}
                id={food.id}
                name={food.name}
                type={food.type || "Kuliner"}
                origin={food.origin || "Indonesia"}
                rating={food.rating}
                description={food.description}
                imageUrl={food.imageUrl}
              />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">Ingin menjelajahi lebih banyak?</p>
          <Button asChild size="lg">
            <Link to="/regions">Lihat Kuliner per Daerah</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BestFood;