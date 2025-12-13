"use client";

import { FoodItem } from "@/data/foodData";
import { showError } from "@/utils/toast"; // Import showError untuk notifikasi

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

interface GooglePlacePhoto {
  photo_reference: string;
  height: number;
  width: number;
}

interface GooglePlaceResult {
  place_id: string;
  name: string;
  formatted_address: string;
  rating?: number;
  photos?: GooglePlacePhoto[];
  types?: string[];
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

interface FetchGoogleFoodRecommendationsParams {
  query?: string;
  latitude?: number;
  longitude?: number;
  radius?: number; // Radius dalam meter, default 1500m
}

export const fetchGoogleFoodRecommendations = async ({
  query,
  latitude,
  longitude,
  radius = 1500,
}: FetchGoogleFoodRecommendationsParams): Promise<FoodItem[]> => {
  if (!GOOGLE_API_KEY) {
    showError("Google API Key tidak ditemukan. Harap tambahkan VITE_GOOGLE_API_KEY di file .env Anda.");
    throw new Error("Missing VITE_GOOGLE_API_KEY environment variable.");
  }

  let url: string;
  if (latitude !== undefined && longitude !== undefined) {
    // Use Nearby Search for location-based recommendations
    url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=restaurant&key=${GOOGLE_API_KEY}`;
  } else if (query && query.trim()) {
    // Fallback to Text Search if only a query is provided
    url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${GOOGLE_API_KEY}`;
  } else {
    return []; // Don't perform search if no query or location is provided
  }

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json();
      showError(`Google Places API error: ${errorData.error_message || response.statusText}`);
      throw new Error(`Google Places API error: ${errorData.error_message || response.statusText}`);
    }

    const data = await response.json();
    
    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      showError(`Google Places API status: ${data.status} - ${data.error_message || "Unknown error"}`);
      throw new Error(`Google Places API status: ${data.status} - ${data.error_message || "Unknown error"}`);
    }

    if (data.results.length === 0) {
      return [];
    }

    return data.results.map((place: GooglePlaceResult) => ({
      id: place.place_id,
      name: place.name,
      type: place.types && place.types.length > 0 ? place.types[0].replace(/_/g, ' ').toUpperCase() : "RESTAURANT",
      origin: place.formatted_address || "Unknown Location",
      rating: place.rating || 3.5, // Default rating if not available
      description: `Rekomendasi dari Google: ${place.name} di ${place.formatted_address}.`,
      imageUrl: place.photos && place.photos.length > 0
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${GOOGLE_API_KEY}`
        : "/no-image-available.svg", // Menggunakan placeholder lokal
      mostIconic: undefined,
    }));
  } catch (error) {
    console.error("Error fetching Google food recommendations:", error);
    showError(`Gagal mengambil rekomendasi Google: ${(error as Error).message}`);
    return [];
  }
};