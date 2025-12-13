"use client";

import React from "react";
import { useSearchParams } from "react-router-dom";
import HeroSection from "@/components/HeroSection";
import FoodList from "@/components/FoodList";
import { Loader2, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Fuse from "fuse.js";
import { supabase } from "@/lib/supabase";
import CategoryPills from "@/components/CategoryPills";

interface FoodItem {
  id: string;
  name: string;
  type: string; // This corresponds to 'category'
  origin: string; // This corresponds to 'region'
  rating: number;
  description: string;
  imageUrl: string;
  mostIconic?: string;
  reviews?: number;
}

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // State
  const [foodItems, setFoodItems] = React.useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Filters
  const [selectedCategory, setSelectedCategory] = React.useState(searchParams.get("category") || "Semua");
  const [selectedRegion, setSelectedRegion] = React.useState(searchParams.get("region") || "Semua");
  const [sortBy, setSortBy] = React.useState("Pilihan");
  const [searchTerm, setSearchTerm] = React.useState("");

  // Pagination
  const ITEMS_PER_PAGE = 9;
  const [currentPage, setCurrentPage] = React.useState(1);

  // Scroll to top of list when page changes
  const listRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (currentPage > 1 && listRef.current) {
      listRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentPage]);

  // Reset page to 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedRegion, searchTerm, sortBy]);

  // Fetch Data
  React.useEffect(() => {
    const fetchFoods = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('food_items')
          .select('*')
          .range(0, 2000) // Force fetch all
          .neq('id', '00000000-0000-0000-0000-000000000000'); // Exclude dummy if needed?

        if (error) throw error;

        if (data) {
          // Normalize data structure if needed
          const mappedData: FoodItem[] = data.map((item: any) => ({
            id: item.id,
            name: item.name,
            type: item.type || "Lainnya",
            origin: item.origin || "Indonesia",
            rating: item.rating || 4.5,
            description: item.description,
            imageUrl: item.imageUrl,
            reviews: Math.floor(Math.random() * 500) // Mock reviews for sorting
          }));
          setFoodItems(mappedData);
        }
      } catch (err: any) {
        console.error("Error fetching foods:", err);
        setError(err.message || "Gagal memuat data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFoods();
  }, []);

  // Sync URL Params
  React.useEffect(() => {
    setSelectedCategory(searchParams.get("category") || "Semua");
    setSelectedRegion(searchParams.get("region") || "Semua");
  }, [searchParams]);

  const handleCategoryClick = React.useCallback((category: string) => {
    setSelectedCategory(category);
    const newParams = new URLSearchParams(searchParams);
    if (category === "Semua") newParams.delete("category");
    else newParams.set("category", category);
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  const handleRegionClick = React.useCallback((region: string) => {
    setSelectedRegion(region);
    const newParams = new URLSearchParams(searchParams);
    if (region === "Semua") newParams.delete("region");
    else newParams.set("region", region);
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  // Derived Values
  const categories = React.useMemo(() => {
    const unique = Array.from(new Set(foodItems.map(f => f.type))).sort();
    return ["Semua", ...unique];
  }, [foodItems]);

  const regions = React.useMemo(() => {
    const unique = Array.from(new Set(foodItems.map(f => f.origin))).sort();
    return ["Semua", ...unique];
  }, [foodItems]);

  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = { Semua: foodItems.length };
    foodItems.forEach(f => {
      counts[f.type] = (counts[f.type] || 0) + 1;
    });
    return counts;
  }, [foodItems]);

  const regionsData = React.useMemo(() => {
    const counts: Record<string, number> = {};
    foodItems.forEach(f => {
      const province = f.origin.includes(',') ? f.origin.split(',')[1].trim() : f.origin;
      counts[province] = (counts[province] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [foodItems]);

  // Fuse.js
  const fuse = React.useMemo(() => {
    return new Fuse(foodItems, {
      keys: ["name", "description", "origin", "type"],
      threshold: 0.3,
      distance: 100,
    });
  }, [foodItems]);

  // Filtering Logic
  const filteredFoods = React.useMemo(() => {
    let result = foodItems;

    // Category Filter
    if (selectedCategory !== "Semua") {
      if (selectedCategory === "Makanan") {
        result = result.filter(f => f.type !== "Minuman");
      } else if (selectedCategory === "Minuman") {
        result = result.filter(f => f.type === "Minuman");
      } else {
        // Exact match for granular categories
        result = result.filter(f => f.type === selectedCategory);
      }
    }

    // Region Filter
    if (selectedRegion !== "Semua") {
      result = result.filter(f => {
        const foodProvince = f.origin.includes(',') ? f.origin.split(',')[1].trim() : f.origin;
        return foodProvince === selectedRegion;
      });
    }

    // Search
    if (searchTerm.trim()) {
      result = fuse.search(searchTerm).map(r => r.item);
    }

    // Sort
    return result.sort((a, b) => {
      if (sortBy === "Paling populer") {
        return (b.reviews || 0) - (a.reviews || 0);
      } else if (sortBy === "Rekomendasi") {
        return b.rating - a.rating;
      } else if (sortBy === "Berdasarkan abjad") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "Berdasarkan lokasi") {
        return a.origin.localeCompare(b.origin);
      }
      return 0; // Default "Pilihan" - maintain original order or no specific sort
    });

  }, [foodItems, selectedCategory, selectedRegion, searchTerm, sortBy, fuse]);

  // Handle Category Change from Pills
  const handleCategoryChange = React.useCallback((category: string) => {
    handleCategoryClick(category);
  }, [handleCategoryClick]);

  return (
    <div className="min-h-screen bg-background">
      {selectedCategory === "Semua" ? (
        <HeroSection
          onSearch={(term) => { setSearchTerm(term); setCurrentPage(1); }}
          searchTerm={searchTerm}
        />
      ) : (
        <div className="relative w-full bg-primary/5 py-16 mb-8 border-b border-border/50">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 text-foreground animate-in slide-in-from-bottom-4 duration-500">
              Kategori: <span className="text-primary">{selectedCategory}</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg animate-in slide-in-from-bottom-5 duration-700">
              Menampilkan pilihan terbaik untuk <strong>{selectedCategory}</strong> dari seluruh nusantara.
            </p>
            <div className="mt-8 flex justify-center animate-in fade-in zoom-in-50 duration-700 delay-100">
              <Button
                variant="outline"
                onClick={() => setSelectedCategory("Semua")}
                className="rounded-full px-6 border-primary/20 text-primary hover:bg-primary hover:text-white transition-all"
              >
                Kembali ke Semua
              </Button>
            </div>
          </div>

          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2"></div>
        </div>
      )}

      <main className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Advanced Category Pills - Only show when no specific category is selected */}
        {selectedCategory === "Semua" && (
          <div className="mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Mau Makan Apa Hari Ini?
              </h2>
            </div>
            <CategoryPills
              selectedCategory={selectedCategory}
              onSelectCategory={(c) => { handleCategoryClick(c); setCurrentPage(1); }}
            />
          </div>
        )}

        <div className="flex flex-col gap-8">

          {/* Main Content - Full Width */}
          <div className="w-full">
            {/* Sort Tabs */}
            <div className="flex flex-wrap items-center gap-6 mb-8 border-b pb-2 overflow-x-auto no-scrollbar">
              {["Pilihan", "Paling populer", "Rekomendasi", "Berdasarkan abjad", "Berdasarkan lokasi"].map((sortOption) => (
                <button
                  key={sortOption}
                  className={cn(
                    "whitespace-nowrap text-sm md:text-base font-semibold pb-2 border-b-2 transition-all hover:text-primary",
                    sortBy === sortOption ? "border-primary text-primary" : "border-transparent text-muted-foreground"
                  )}
                  onClick={() => { setSortBy(sortOption); setCurrentPage(1); }}
                >
                  {sortOption}
                </button>
              ))}
            </div>

            {/* Content Status */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center p-12 space-y-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse">Sedang menyiapkan hidangan...</p>
              </div>
            ) : error ? (
              <div className="text-center p-12 bg-destructive/10 rounded-xl">
                <p className="text-destructive font-semibold text-lg">{error}</p>
                <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-background border rounded hover:bg-muted">Coba Lagi</button>
              </div>
            ) : filteredFoods.length > 0 ? (
              <div ref={listRef} className="animate-in fade-in duration-500 will-change-transform scroll-mt-24">
                <FoodList foods={filteredFoods.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)} />

                {/* Pagination Controls */}
                {filteredFoods.length > ITEMS_PER_PAGE && (
                  <div className="flex justify-center items-center gap-6 mt-12 pb-12 animate-in slide-in-from-bottom-4 duration-700 delay-200">
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(prev => Math.max(prev - 1, 1));
                      }}
                      disabled={currentPage === 1}
                      className="rounded-full h-12 w-12 border-primary/20 hover:border-primary hover:bg-primary/5 shadow-sm"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>

                    <div className="flex flex-col items-center min-w-[120px]">
                      <span className="text-xl font-bold text-foreground">
                        Hal. {currentPage}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        / {Math.ceil(filteredFoods.length / ITEMS_PER_PAGE)}
                      </span>
                      <span className="text-[10px] text-muted-foreground/50 mt-1">
                        Total: {filteredFoods.length}
                      </span>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredFoods.length / ITEMS_PER_PAGE)));
                      }}
                      disabled={currentPage >= Math.ceil(filteredFoods.length / ITEMS_PER_PAGE)}
                      className="rounded-full h-12 w-12 border-primary/20 hover:border-primary hover:bg-primary/5 shadow-sm"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed">
                <p className="text-xl text-muted-foreground">Tidak ada makanan yang ditemukan dengan filter ini.</p>
                <div className="flex justify-center gap-4 mt-4">
                  <button
                    onClick={() => { setSelectedCategory("Semua"); setSelectedRegion("Semua"); setSearchTerm(""); setCurrentPage(1); }}
                    className="text-primary hover:underline font-medium"
                  >
                    Reset Semua
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;