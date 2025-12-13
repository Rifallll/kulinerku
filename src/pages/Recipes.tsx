"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Clock, ChefHat, Filter, X, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import ALL_RECIPES from "@/data/recipeData";

const CATEGORIES = [
  "Semua",
  "Sate & Bakar",
  "Nasi",
  "Sup & Kuah",
  "Gulai & Kari",
  "Sayuran",
  "Gorengan",
  "Sambal",
  "Camilan",
  "Dessert",
  "Minuman",
  "Makanan Utama"
];

const Recipes = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Show loading while checking auth
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Filtered recipes
  const filteredRecipes = useMemo(() => {
    return ALL_RECIPES.filter(recipe => {
      const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.ingredients.some((ing: string) => ing.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === "Semua" || recipe.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="h-8 w-8 text-yellow-300" />
              <span className="bg-yellow-300 text-primary px-3 py-1 rounded-full text-sm font-bold">
                MEMBER ONLY
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-black">
              🍳 Kumpulan Resep Indonesia
            </h1>
            <p className="text-lg md:text-xl text-black">
              {ALL_RECIPES.length}+ resep masakan Indonesia dengan bahan-bahan lengkap
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">

        {/* Search & Filter */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">

            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Cari resep atau bahan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-base"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  <X className="h-5 w-5 text-gray-400 hover:text-black" />
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="h-12 px-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Menampilkan <strong>{filteredRecipes.length}</strong> resep
            {selectedCategory !== "Semua" && ` dalam kategori "${selectedCategory}"`}
          </div>
        </div>

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRecipes.map((recipe: any) => (
            <div
              key={recipe.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border hover:shadow-xl transition-all duration-300 group"
            >
              {/* Image */}
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                <img
                  src={recipe.imageUrl}
                  alt={recipe.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${recipe.difficulty === 'Mudah' ? 'bg-green-500' :
                    recipe.difficulty === 'Sedang' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}>
                    {recipe.difficulty}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="mb-3">
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">
                    {recipe.category}
                  </span>
                </div>

                <h3 className="text-lg font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                  {recipe.name}
                </h3>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{recipe.cookTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ChefHat className="h-4 w-4" />
                    <span>{recipe.servings} porsi</span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2 font-semibold">Bahan ({recipe.ingredients.length}):</p>
                  <div className="flex flex-wrap gap-1">
                    {recipe.ingredients.slice(0, 3).map((ing: string, idx: number) => (
                      <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {ing.split(' ')[0]}
                      </span>
                    ))}
                    {recipe.ingredients.length > 3 && (
                      <span className="text-xs text-gray-500 px-2 py-1">
                        +{recipe.ingredients.length - 3} lagi
                      </span>
                    )}
                  </div>
                </div>

                <Link to={`/recipe/${recipe.id}`}>
                  <Button className="w-full" variant="outline">
                    Lihat Resep
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredRecipes.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-gray-500 mb-4">Tidak ada resep yang cocok</p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("Semua");
              }}
              variant="outline"
            >
              Reset Filter
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recipes;