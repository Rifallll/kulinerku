"use client";

import React from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Search, MapPin, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Fuse from "fuse.js";
import { fixImageUrl } from "@/utils/fixImage";
import { PROVINCE_IMAGES, DEFAULT_PROVINCE_IMAGE } from "@/data/provinceImages";



import { CITY_TO_PROVINCE, getProvinceFromOrigin, normalizeRegionName } from "@/utils/provinceMapping";

// Define FoodItem interface
interface FoodItem {
  id: string;
  name: string;
  type: string;
  origin: string;
  rating: number;
  description: string;
  imageUrl: string;
  mostIconic?: string;
}

interface RegionData {
  name: string;
  count: number;
  imageUrl: string;
}

const Regions = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [sortBy, setSortBy] = React.useState<"name" | "count">("count");
  const [selectedLetter, setSelectedLetter] = React.useState<string | null>(null);

  // Generates alphabet A-Z
  const alphabet = React.useMemo(() => {
    return Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
  }, []);

  // Fetch food items
  const {
    data: foodItems,
    isLoading,
    isError,
    error,
  } = useQuery<FoodItem[], Error>({
    queryKey: ["allFoodItemsRegions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("food_items")
        .select("*")
        .neq('id', '00000000-0000-0000-0000-000000000000');
      if (error) throw error;
      return data as FoodItem[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Derived Regions Data
  const regionsData = React.useMemo(() => {
    if (!foodItems) return [];

    const regionMap = new Map<string, RegionData>();

    // Use case-insensitive map for deduplication
    const normalizedKeyMap = new Map<string, string>(); // lowercase -> canonical name

    foodItems.forEach((item) => {
      // Use centralized function to get province
      let regionName = getProvinceFromOrigin(item.origin);

      // Skip generic "Indonesia" origin
      if (regionName === 'Indonesia') {
        return;
      }

      // Create case-insensitive key
      const key = regionName.toLowerCase();

      // Use first occurrence's capitalization
      if (!normalizedKeyMap.has(key)) {
        normalizedKeyMap.set(key, regionName);
      }

      const canonicalName = normalizedKeyMap.get(key)!;

      const existing = regionMap.get(canonicalName);

      if (existing) {
        existing.count += 1;
      } else {
        regionMap.set(canonicalName, {
          name: canonicalName,
          count: 1,
          imageUrl: item.imageUrl || "/placeholder-food.jpg",
        });
      }
    });

    return Array.from(regionMap.values());
  }, [foodItems]);

  // Fuse.js for fuzzy search
  const fuse = React.useMemo(() => {
    return new Fuse(regionsData, {
      keys: ["name"],
      threshold: 0.3,
    });
  }, [regionsData]);

  // Filtering and Sorting
  const filteredRegions = React.useMemo(() => {
    let result = regionsData;

    // Search
    if (searchTerm.trim()) {
      result = fuse.search(searchTerm).map((r) => r.item);
    }

    // Alphabet Filter
    if (selectedLetter) {
      result = result.filter(r => r.name.toUpperCase().startsWith(selectedLetter));
    }

    // Sort
    return result.sort((a, b) => {
      if (sortBy === "count") {
        return b.count - a.count; // Descending count
      } else {
        return a.name.localeCompare(b.name); // A-Z
      }
    });
  }, [regionsData, searchTerm, sortBy, fuse, selectedLetter]);

  const handleRegionClick = (regionName: string) => {
    navigate(`/?region=${encodeURIComponent(regionName)}`);
  };

  const toggleLetter = (letter: string) => {
    if (selectedLetter === letter) {
      setSelectedLetter(null);
    } else {
      setSelectedLetter(letter);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header / Hero for Regions */}
      <div className="relative bg-muted/30 py-16 px-4">
        <div className="container mx-auto text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-foreground">
            Jelajahi Rasa Nusantara
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Temukan kekayaan kuliner dari setiap sudut Indonesia. Dari Sabang sampai Merauke, setiap daerah memiliki cerita rasanya sendiri.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto mt-8 relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Cari daerah atau provinsi..."
                className="pl-12 pr-4 py-6 w-full rounded-full border-2 border-primary/20 focus:border-primary text-lg shadow-sm bg-background transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <main className="flex-grow container mx-auto px-4 py-12">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4 border-b pb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary" />
            Daftar Daerah ({regionsData.length})
          </h2>

          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground font-medium">Urutkan:</span>
            <div className="flex bg-muted rounded-full p-1">
              <button
                onClick={() => setSortBy("count")}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
                  sortBy === "count" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Terbanyak
              </button>
              <button
                onClick={() => setSortBy("name")}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
                  sortBy === "name" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                A - Z
              </button>
            </div>
          </div>
        </div>

        {/* Alphabet Filter Bar */}
        <div className="flex flex-wrap gap-2 justify-center mb-8 px-4 notranslate" translate="no">
          <button
            onClick={() => setSelectedLetter(null)}
            className={cn(
              "px-3 py-1 text-sm font-bold rounded-md transition-all notranslate",
              !selectedLetter ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
            translate="no"
          >
            ALL
          </button>
          {alphabet.map(letter => (
            <button
              key={letter}
              onClick={() => toggleLetter(letter)}
              className={cn(
                "w-8 h-8 flex items-center justify-center text-sm font-medium rounded-full transition-all notranslate",
                selectedLetter === letter
                  ? "bg-primary text-primary-foreground shadow-md ring-2 ring-offset-2 ring-primary"
                  : "bg-background border border-muted-foreground/20 hover:border-primary hover:text-primary"
              )}
              translate="no"
            >
              <span className="notranslate" translate="no">{letter}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <span className="text-muted-foreground animate-pulse">Sedang memetakan kuliner...</span>
          </div>
        ) : isError ? (
          <div className="text-center py-20 bg-destructive/5 rounded-xl border border-destructive/20">
            <p className="text-destructive font-semibold text-lg mb-2">Gagal memuat data daerah</p>
            <p className="text-muted-foreground">{error?.message}</p>
          </div>
        ) : filteredRegions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredRegions.map((region, index) => (
              <div
                key={index}
                onClick={() => handleRegionClick(region.name)}
                className="group cursor-pointer rounded-2xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 overflow-hidden relative h-[250px] flex flex-col justify-end"
              >
                {/* Background Image with Overlay */}
                <div className="absolute inset-0">
                  <img
                    src={PROVINCE_IMAGES[region.name] || DEFAULT_PROVINCE_IMAGE}
                    alt={`Pemandangan ${region.name}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity group-hover:via-black/50" />
                </div>

                {/* Content */}
                <div className="relative p-6 z-10">
                  <div className="flex justify-between items-end">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary-foreground transition-colors">
                        {region.name}
                      </h3>
                      <p className="text-sm text-gray-300 font-medium flex items-center gap-1">
                        {region.count} Kuliner
                      </p>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 text-white">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-muted/20 rounded-3xl border border-dashed">
            <p className="text-xl text-muted-foreground font-medium">
              Tidak ada daerah yang cocok dengan "{searchTerm}"
            </p>
            <button
              onClick={() => setSearchTerm("")}
              className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
            >
              Lihat Semua Daerah
            </button>
          </div>
        )}
      </main >
    </div >
  );
};

export default Regions;