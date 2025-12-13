"use client";

import { supabase } from "@/lib/supabase";
import { FoodItem } from "@/data/foodData";

interface OpenFoodFactsProduct {
  id: string;
  product_name?: string;
  product_name_en?: string;
  categories_tags?: string[];
  countries_tags?: string[];
  ingredients_text?: string;
  image_url?: string;
  image_front_url?: string;
}

const fetchOpenFoodFactsData = async (page: number = 1, pageSize: number = 50) => {
  const response = await fetch(
    `https://world.openfoodfacts.org/api/v2/search?categories_tags=en:indonesia&page=${page}&page_size=${pageSize}&fields=id,product_name,product_name_en,categories_tags,countries_tags,ingredients_text,image_url,image_front_url`
  );
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return data.products || [];
};

const mapOpenFoodFactsToFoodItem = (product: OpenFoodFactsProduct): Omit<FoodItem, "id"> | null => {
  const name = product.product_name || product.product_name_en;
  if (!name) return null;

  const type = product.categories_tags
    ? product.categories_tags
        .map(tag => tag.replace('en:', '').replace(/-/g, ' ').toUpperCase())
        .find(tag => tag.includes('FOOD') || tag.includes('DRINK') || tag.includes('DISH') || tag.includes('SNACK') || tag.includes('MEAT') || tag.includes('SAUCE') || tag.includes('RICE') || tag.includes('STEW') || tag.includes('SOUP') || tag.includes('SALAD') || tag.includes('CHICKEN')) || 'FOOD'
    : 'FOOD';

  const origin = product.countries_tags
    ? product.countries_tags
        .map(tag => tag.replace('en:', '').toUpperCase())
        .find(tag => tag.includes('INDONESIA')) || 'INDONESIA'
    : 'INDONESIA';

  const description = product.ingredients_text || `Delicious ${name} from ${origin}.`;
  const imageUrl = product.image_url || product.image_front_url || "https://via.placeholder.com/300x200?text=No+Image"; // Placeholder image

  // Generate a random rating between 3.0 and 5.0
  const rating = parseFloat((Math.random() * (5.0 - 3.0) + 3.0).toFixed(1));

  return {
    name,
    type,
    origin,
    rating,
    description: description.substring(0, 250), // Truncate description to fit
    imageUrl,
    mostIconic: undefined, // Not available from Open Food Facts
  };
};

export const seedSupabaseWithOpenFoodFacts = async (count: number = 200) => {
  let allProducts: OpenFoodFactsProduct[] = [];
  let page = 1;
  const pageSize = 50; // Fetch 50 items per page

  while (allProducts.length < count) {
    const products = await fetchOpenFoodFactsData(page, pageSize);
    if (products.length === 0) break; // No more products
    allProducts = [...allProducts, ...products];
    page++;
  }

  const itemsToInsert: Omit<FoodItem, "id">[] = [];
  for (const product of allProducts) {
    if (itemsToInsert.length >= count) break;
    const mappedItem = mapOpenFoodFactsToFoodItem(product);
    if (mappedItem) {
      itemsToInsert.push(mappedItem);
    }
  }

  if (itemsToInsert.length === 0) {
    throw new Error("No valid food items found to insert.");
  }

  const { data, error } = await supabase.from("food_items").insert(itemsToInsert);

  if (error) {
    throw error;
  }
  return data;
};