"use client";

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Fuse from "fuse.js";
import { useQuery } from "@tanstack/react-query";
import { fixImageUrl } from "@/utils/fixImage";


import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";

interface FoodItem {
    id: string;
    name: string;
    type: string; // 'category'
    origin: string; // 'region'
    rating: number;
    description: string;
    imageUrl: string;
}

interface GlobalSearchProps {
    trigger?: React.ReactNode;
    variant?: "desktop" | "mobile";
    className?: string;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ trigger, variant = "desktop", className }) => {
    const [open, setOpen] = React.useState(false);
    const navigate = useNavigate();

    // Fetch all food items for the global search
    // Using React Query for caching to avoid hitting DB on every keystroke/open
    const { data: foodItems = [], isLoading } = useQuery<FoodItem[]>({
        queryKey: ["allFoodItemsSearch"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("food_items")
                .select("*")
                .neq('id', '00000000-0000-0000-0000-000000000000');
            if (error) throw error;
            return data as FoodItem[];
        },
        staleTime: 1000 * 60 * 10, // 10 minutes cache
    });

    // Fuse.js Instance
    const fuse = React.useMemo(() => {
        return new Fuse(foodItems, {
            keys: [
                { name: "name", weight: 0.7 },
                { name: "type", weight: 0.3 },
                { name: "origin", weight: 0.4 },
                { name: "description", weight: 0.2 },
            ],
            threshold: 0.4, // Allow some fuzziness for typos
            ignoreLocation: true, // Search anywhere in the string
            includeScore: true,
        });
    }, [foodItems]);

    const [query, setQuery] = React.useState("");

    // Compute search results using useMemo to avoid infinite loops
    const searchResults = React.useMemo(() => {
        if (!query) {
            return foodItems.slice(0, 5); // Show first 5 as default suggestions
        } else {
            return fuse.search(query).map(r => r.item).slice(0, 8); // Top 8 results
        }
    }, [query, fuse, foodItems]);


    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const handleSelect = (item: FoodItem) => {
        setOpen(false);
        // Navigate directly to the food detail page
        navigate(`/food/${item.id}`);
    };

    const handleSearch = (term: string) => {
        setOpen(false)
        navigate(`/?search=${encodeURIComponent(term)}`);
    }

    // Grouping results for display
    const categorizedResults = React.useMemo(() => {
        const groups: Record<string, FoodItem[]> = {};
        searchResults.forEach(item => {
            const cat = item.type || "Lainnya";
            if (!groups[cat]) groups[cat] = [];
            groups[cat].push(item);
        });
        return groups;
    }, [searchResults]);


    return (
        <>
            {trigger && (
                <div className={className} onClick={() => setOpen(true)}>
                    {trigger}
                </div>
            )}

            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput
                    placeholder="Ketik nama makanan, daerah, atau kategori..."
                    value={query}
                    onValueChange={setQuery}
                />
                <CommandList>
                    {isLoading && (
                        <div className="py-6 text-center text-sm text-muted-foreground flex justify-center items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" /> Memuat data...
                        </div>
                    )}

                    <CommandEmpty>
                        {query.length > 0 ? (
                            <div className="py-6 text-center">
                                <p className="text-sm text-muted-foreground mb-2">Tidak ditemukan "{query}".</p>
                                <Button variant="link" onClick={() => handleSearch(query)}>Cari "{query}" di semua halaman</Button>
                            </div>
                        ) : "Mulai ketik untuk mencari..."}
                    </CommandEmpty>

                    {!isLoading && Object.keys(categorizedResults).length > 0 && (
                        Object.entries(categorizedResults).map(([category, items]) => (
                            <CommandGroup key={category} heading={category}>
                                {items.map(item => (
                                    <CommandItem
                                        key={item.id}
                                        value={item.id + item.name + item.origin}
                                        onSelect={() => handleSelect(item)}
                                        className="flex items-center gap-3 cursor-pointer py-2"
                                    >
                                        <img src={fixImageUrl(item.name, item.imageUrl)} alt={item.name} className="w-8 h-8 rounded-md object-cover" />
                                        <div className="flex flex-col">
                                            <span className="font-medium">{item.name}</span>
                                            <span className="text-xs text-muted-foreground">{item.origin}</span>
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        ))
                    )}

                    <CommandSeparator />

                    {query.length > 0 && (
                        <CommandGroup heading="Aksi">
                            <CommandItem onSelect={() => handleSearch(query)} value="search-all">
                                <Search className="mr-2 h-4 w-4" />
                                Cari semua hasil untuk "{query}"
                            </CommandItem>
                        </CommandGroup>
                    )}

                </CommandList>
            </CommandDialog>
        </>
    );
};

export default GlobalSearch;
