"use client";

// Pastikan variabel lingkungan VITE_RAPIDAPI_KEY dan VITE_RAPIDAPI_HOST telah diatur.
const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY;
const RAPIDAPI_HOST = import.meta.env.VITE_RAPIDAPI_HOST;

if (!RAPIDAPI_KEY || !RAPIDAPI_HOST) {
  console.warn("Missing VITE_RAPIDAPI_KEY or VITE_RAPIDAPI_HOST environment variables. Edamam API calls may fail.");
}

interface NutrientData {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  // Anda bisa menambahkan properti nutrisi lain yang relevan di sini
}

export const fetchFoodNutrients = async (ingredients: string[]): Promise<NutrientData | null> => {
  if (!RAPIDAPI_KEY || !RAPIDAPI_HOST) {
    console.error("Edamam API keys are not configured.");
    return null;
  }

  const url = `https://${RAPIDAPI_HOST}/api/food-database/v2/nutrients`;
  const options = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': RAPIDAPI_KEY,
      'X-RapidAPI-Host': RAPIDAPI_HOST
    },
    body: JSON.stringify({
      ingredients: ingredients.map(item => ({ quantity: 1, measureURI: "http://www.edamam.com/ontologies/edamam.owl#Measure_unit", foodId: item }))
      // Catatan: foodId di sini adalah placeholder. Edamam API biasanya memerlukan foodId yang spesifik
      // atau teks bebas untuk pencarian. Untuk demo, kita asumsikan 'ingredients' adalah foodId.
      // Jika Anda ingin mencari berdasarkan teks, struktur body akan berbeda.
    })
  };

  try {
    console.log("Fetching nutrients for:", ingredients);
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error(`HTTP error! status: ${response.status}`, errorData);
      throw new Error(`Failed to fetch nutrients: ${errorData.message || response.statusText}`);
    }

    const data = await response.json();
    console.log("Edamam API response:", data);

    // Ekstrak data nutrisi yang relevan
    const totalNutrients = data.totalNutrients;
    return {
      calories: totalNutrients.ENERC_KCAL?.quantity || 0,
      protein: totalNutrients.PROCNT?.quantity || 0,
      fat: totalNutrients.FAT?.quantity || 0,
      carbs: totalNutrients.CHOCDF?.quantity || 0,
    };
  } catch (error) {
    console.error("Error fetching food nutrients:", error);
    return null;
  }
};