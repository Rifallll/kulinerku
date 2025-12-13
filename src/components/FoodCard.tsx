"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Heart } from "lucide-react";
import { fixImageUrl, getErrorImagePlaceholder } from "../utils/fixImage";
import { translateFoodType } from "../utils/foodTypeTranslator";
import { OptimizedImage } from "./OptimizedImage";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface FoodCardProps {
  id: string;
  name: string;
  type: string;
  origin: string;
  rating: number;
  reviews?: number;
  description: string;
  imageUrl: string;
  mostIconic?: string;
}

const FoodCard: React.FC<FoodCardProps> = ({
  id,
  name,
  type,
  origin,
  rating,
  reviews,
  description,
  imageUrl,
  mostIconic,
}) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const { user } = useAuth();
  const { toast } = useToast();
  const favorite = isFavorite(id);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast({
        title: "Login Diperlukan",
        description: "Silakan login untuk menyimpan makanan favorit",
        variant: "destructive",
      });
      return;
    }

    try {
      await toggleFavorite({ id, name, imageUrl, origin, rating, type });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mengupdate favorit",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
      <div className="relative w-full aspect-video overflow-hidden bg-amber-50">
        <OptimizedImage
          src={fixImageUrl(name, imageUrl)}
          alt={name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        {user && (
          <button
            onClick={handleFavoriteClick}
            className="absolute top-2 right-2 p-2 rounded-full bg-white/70 hover:bg-white shadow-sm transition-all duration-200 hover:scale-110 z-10"
            aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              className={`h-5 w-5 transition-all ${favorite ? "fill-red-500 text-red-500" : "text-gray-600"}`}
            />
          </button>
        )}
      </div>
      <CardContent className="p-4">
        <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wide">
          {translateFoodType(type)} {/* Use translator here */}
        </span>
        <h3 className="text-xl font-bold mt-1 mb-1 text-foreground group-hover:text-primary transition-colors duration-200">
          {name}
        </h3>
        <p className="text-sm text-muted-foreground mb-2">{origin}</p>
        <div className="flex items-center text-yellow-500 mb-2">
          {Array.from({ length: Math.floor(rating) }).map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-current" />
          ))}
          <span className="ml-1 text-sm font-medium text-foreground">{rating.toFixed(1)}</span>
          {reviews && (
            <span className="ml-2 text-xs text-muted-foreground">({reviews.toLocaleString()} ulasan)</span>
          )}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{description}</p>
        <Button variant="outline" asChild className="w-full">
          <Link to={`/food/${id}`}>Lihat Detail</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default FoodCard;