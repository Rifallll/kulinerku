"use client";

export interface FoodItem {
  id: string;
  name: string;
  type: string;
  origin: string;
  rating: number;
  description: string;
  imageUrl: string;
  mostIconic?: string;
}

// The foodItems array is removed as data will now be fetched from Supabase.
// export const foodItems: FoodItem[] = [ ... ];