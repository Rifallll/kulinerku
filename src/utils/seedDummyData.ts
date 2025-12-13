"use client";

import { supabase } from "@/lib/supabase";
import { dummyFoodItems } from "@/data/dummyFoodData";
import { FoodItem } from "@/data/foodData"; // Import FoodItem interface

export const seedSupabaseWithDummyData = async () => {
  if (dummyFoodItems.length === 0) {
    throw new Error("No dummy food items found to insert.");
  }

  // Optional: Clear existing data before seeding to avoid duplicates if run multiple times
  // const { error: deleteError } = await supabase.from("food_items").delete().neq("id", "0");
  // if (deleteError) {
  //   console.error("Error clearing existing food items:", deleteError);
  //   // Decide if you want to throw or continue
  // }

  const { data, error } = await supabase.from("food_items").insert(dummyFoodItems);

  if (error) {
    throw error;
  }
  return data;
};