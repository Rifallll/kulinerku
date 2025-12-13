"use client";

import { supabase } from "@/lib/supabase";
import { FoodItem } from "@/data/foodData";

interface TheMealDBMeal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

interface TheMealDBResponse {
  meals: TheMealDBMeal[];
}

const fetchTheMealDBData = async () => {
  const response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/filter.php?a=indonesia"
  );
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data: TheMealDBResponse = await response.json();
  return data.meals || [];
};

const mapTheMealDBToFoodItem = (meal: TheMealDBMeal): Omit<FoodItem, "id"> => {
  const name = meal.strMeal;
  const imageUrl = meal.strMealThumb;

  // TheMealDB filter endpoint doesn't provide type or description directly,
  // so we'll use defaults and generate a random rating.
  const type = "DISH"; // Default type
  const origin = "Indonesia"; // Based on the API filter
  const description = `A delicious Indonesian dish: ${name}. Explore more about this amazing cuisine!`;
  const rating = parseFloat((Math.random() * (5.0 - 3.0) + 3.0).toFixed(1)); // Random rating between 3.0 and 5.0

  return {
    name,
    type,
    origin,
    rating,
    description: description.substring(0, 250), // Truncate description
    imageUrl,
    mostIconic: undefined, // Not available from TheMealDB
  };
};

export const seedSupabaseWithTheMealDB = async () => {
  const meals = await fetchTheMealDBData();

  if (meals.length === 0) {
    throw new Error("No Indonesian meals found from TheMealDB to insert.");
  }

  const itemsToInsert: Omit<FoodItem, "id">[] = meals.map(mapTheMealDBToFoodItem);

  // Clear existing data before seeding to avoid duplicates if run multiple times
  // This is optional, but good for fresh seeding.
  // const { error: deleteError } = await supabase.from("food_items").delete().neq("id", "0"); // Delete all
  // if (deleteError) {
  //   console.error("Error clearing existing food items:", deleteError);
  //   // Decide if you want to throw or continue
  // }

  const { data, error } = await supabase.from("food_items").insert(itemsToInsert);

  if (error) {
    throw error;
  }
  return data;
};