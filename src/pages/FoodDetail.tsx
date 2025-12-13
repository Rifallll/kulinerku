"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, Loader2, MapPin, ChefHat, Clock, Flame } from "lucide-react";
import { translateFoodType } from "@/utils/foodTypeTranslator";
import { fixImageUrl, getErrorImagePlaceholder } from "@/utils/fixImage";
import { bestFoods } from "@/data/bestFoodData";
import FOOD_INGREDIENTS from "@/data/foodIngredients";
import { OptimizedImage } from "@/components/OptimizedImage";
import { useAuth } from "@/contexts/AuthContext";
import { useReviews } from "@/hooks/useReviews";
import { logActivity } from "@/utils/activityLogger";
import { RatingDisplay } from "@/components/RatingDisplay";
import { ReviewForm } from "@/components/ReviewForm";
import { ReviewsList } from "@/components/ReviewsList";
import { useToast } from "@/hooks/use-toast";
import { CommentsSection } from "@/components/CommentsSection";
import { useFoodHistory } from "@/hooks/useFoodHistory";


interface FoodItem {
  id: string;
  name: string;
  type: string;
  origin: string;
  rating: number;
  description: string;
  imageUrl: string;
  ingredients?: string[];
}

const FoodDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const { trackView } = useFoodHistory();

  // Synchronous check for local items to prevent loading state
  const isLocal = id?.startsWith('best-food-');
  let localFood: FoodItem | null = null;

  if (isLocal && id) {
    const index = parseInt(id.replace('best-food-', ''));
    const item = bestFoods[index];
    if (item) {
      localFood = {
        id: id,
        name: item.name,
        type: "Kuliner Indonesia",
        origin: "Indonesia",
        rating: item.rating,
        description: item.description,
        imageUrl: item.image,
        ingredients: []
      };
    }
  }

  const { data: remoteFood, isLoading: remoteLoading, isError, error } = useQuery<FoodItem, Error>({
    queryKey: ["foodItem", id],
    queryFn: async () => {
      if (!id) throw new Error("Food ID is missing.");
      const { data, error } = await supabase.from("food_items").select("*").eq("id", id).single();
      if (error) throw error;
      return data as FoodItem;
    },
    enabled: !!id && !isLocal, // Only fetch if not local
  });

  const food = isLocal ? localFood : remoteFood;
  const isLoading = isLocal ? false : remoteLoading;  // Instant load for local

  // Reviews functionality
  const { stats, addReview, getUserReview } = useReviews(id);
  const [userReview, setUserReview] = React.useState<any>(null);

  // Fetch user's existing review
  React.useEffect(() => {
    if (user && id) {
      getUserReview(id).then(setUserReview);
    }
  }, [user, id, getUserReview]);

  // Auto-track food view for dashboard
  React.useEffect(() => {
    if (food && user) {
      trackView(food);
      // Log activity to admin dashboard
      logActivity('VIEW_FOOD', {
        food_id: food.id,
        food_name: food.name,
        user_email: user.email
      });
    }
  }, [food, user, trackView]);

  const handleSubmitReview = useCallback(async (rating: number, reviewText: string) => {
    if (!food) return;
    try {
      await addReview({
        food_id: food.id,
        food_name: food.name,
        rating,
        review_text: reviewText
      });
      const updated = await getUserReview(food.id);
      setUserReview(updated);
      toast({
        title: "Review Submitted! ✅",
        description: "Thank you for your review!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit review",
        variant: "destructive",
      });
    }
  }, [food, addReview, getUserReview, toast]);

  const { data: relatedFoods } = useQuery<FoodItem[]>({
    queryKey: ["relatedFoods", food?.id],
    queryFn: async () => {
      if (!food) return [];
      const province = food.origin.includes(',') ? food.origin.split(',')[1].trim() : food.origin;

      let query = supabase.from("food_items").select("*").or(`type.eq.${food.type},origin.ilike.%${province}%`);

      // Only apply ID filter if it's a valid UUID (not local data)
      if (!food.id.startsWith('best-food-')) {
        query = query.neq('id', food.id);
      }

      const { data } = await query.limit(6);
      if (!data) return [];
      const scored = data.map((item: any) => {
        let score = 0;
        const itemProvince = item.origin.includes(',') ? item.origin.split(',')[1].trim() : item.origin;
        if (item.type === food.type) score += 5;
        if (itemProvince === province) score += 3;
        return { ...item, score };
      });
      return scored.sort((a, b) => b.score - a.score).slice(0, 4);
    },
    enabled: !!food,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !food) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white">
        <h1 className="text-4xl font-bold mb-4">Tidak Ditemukan</h1>
        <Button asChild>
          <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" /> Kembali</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">

      {/* Header */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 max-w-6xl">
          <Link to="/" className="text-sm text-gray-600 hover:text-primary inline-flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" /> Kembali ke Beranda
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">

          {/* Main Content */}
          <main>

            {/* Title & Badges */}
            <div className="mb-8">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">{food.name}</h1>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-full font-medium">
                  <ChefHat className="h-5 w-5" />
                  {translateFoodType(food.type)}
                </div>
                <div className="flex items-center gap-2 bg-yellow-500 text-white px-5 py-2.5 rounded-full font-bold">
                  <Star className="h-5 w-5 fill-white" />
                  {food.rating.toFixed(1)} / 5.0
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="mb-10 bg-gray-50 border border-gray-200 rounded-2xl p-6">
              <OptimizedImage
                src={fixImageUrl(food.name, food.imageUrl)}
                alt={food.name}
                width={800}
                height={500}
                className="w-full h-auto max-h-[500px] rounded-xl"
                priority={true}
              />
              <p className="text-sm text-center text-black mt-5 italic">
                {food.name} - Hidangan khas {food.origin}
              </p>
            </div>

            <div className="border-t-2 border-gray-200 my-10"></div>

            {/* Content */}
            <div className="space-y-10">

              <section>
                <h2 className="text-3xl font-bold mb-5">
                  <span className="text-primary">1.</span> Ringkasan
                </h2>
                <div className="bg-white border-l-4 border-primary rounded-r-xl p-7 border border-gray-200">
                  <p className="text-lg leading-relaxed text-justify text-black">
                    <strong className="text-primary">{food.name}</strong> {food.description}
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-3xl font-bold mb-5">
                  <span className="text-primary">2.</span> Sejarah dan Asal Usul
                </h2>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-7">
                  <p className="text-base leading-relaxed text-justify text-black mb-4">
                    {food.name} adalah salah satu hidangan tradisional dari <strong>{food.origin}</strong> yang telah dikenal
                    secara turun-temurun. Hidangan ini merupakan bagian penting dari warisan kuliner Indonesia.
                  </p>
                  <p className="text-base leading-relaxed text-justify text-black">
                    Sejak zaman dahulu, {food.name} telah menjadi hidangan favorit masyarakat setempat.
                    Resep yang digunakan diturunkan dari generasi ke generasi.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-3xl font-bold mb-5">
                  <span className="text-primary">3.</span> Karakteristik dan Cita Rasa
                </h2>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-7">
                  <p className="text-base leading-relaxed text-justify text-black mb-4">
                    {food.name} memiliki cita rasa yang khas dan autentik. Perpaduan bumbu rempah yang sempurna menghasilkan
                    aroma yang menggugah selera.
                  </p>
                  <p className="text-base leading-relaxed text-justify text-black">
                    Proses pembuatannya memerlukan ketelitian dan keahlian khusus. Setiap daerah mungkin memiliki variasi tersendiri.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-3xl font-bold mb-5">
                  <span className="text-primary">4.</span> Bahan-bahan Utama
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {['Rempah pilihan', 'Bahan berkualitas', 'Bumbu tradisional', 'Pelengkap segar'].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-white border border-gray-200 p-4 rounded-xl">
                      <div className="h-3 w-3 rounded-full bg-primary" />
                      <span className="text-sm font-medium text-black">{item}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-3xl font-bold mb-5">
                  <span className="text-primary">5.</span> Cara Penyajian
                </h2>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-7">
                  <p className="text-base leading-relaxed text-justify text-black">
                    {food.name} biasanya disajikan dalam keadaan hangat untuk mendapatkan cita rasa terbaik.
                    Hidangan ini dapat dinikmati sesuai tradisi daerah.
                  </p>
                </div>
              </section>

              {/* REVIEWS & RATINGS SECTION */}
              <section className="mt-16">
                <h2 className="text-3xl font-bold mb-6">
                  <span className="text-primary">⭐</span> Reviews & Ratings
                </h2>

                <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200">
                  <RatingDisplay
                    averageRating={stats.averageRating}
                    totalReviews={stats.totalReviews}
                    size="lg"
                    showCount={true}
                  />
                </div>

                {user ? (
                  !userReview ? (
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold mb-4">📝 Bagikan Pengalaman Anda</h3>
                      <ReviewForm
                        foodId={food.id}
                        foodName={food.name}
                        onSubmit={handleSubmitReview}
                      />
                    </div>
                  ) : (
                    <div className="mb-8 p-4 bg-green-50 border-2 border-green-300 rounded-lg">
                      <p className="text-green-800 font-semibold">✅ Anda sudah memberikan review!</p>
                      <p className="text-sm text-green-600 mt-1">Lihat review Anda di bawah</p>
                    </div>
                  )
                ) : (
                  <div className="mb-8 p-6 bg-gradient-to-r from-gray-700 to-slate-800 border-2 border-gray-600 rounded-lg text-center">
                    <p className="text-white font-semibold mb-3">🔒 Ingin memberikan review?</p>
                    <p className="text-sm text-gray-200 mb-4">Login untuk berbagi pengalaman Anda tentang {food.name}</p>
                    <Link to="/login">
                      <Button className="bg-white text-gray-900 hover:bg-gray-100">Login untuk Review</Button>
                    </Link>
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    💬 Semua Review ({stats.totalReviews})
                  </h3>
                  <ReviewsList foodId={food.id} foodName={food.name} />
                </div>
              </section>

              {/* COMMENTS SECTION */}
              <CommentsSection foodId={food.id} foodName={food.name} />

            </div>
          </main>

          {/* Sidebar */}
          <aside>
            <div className="space-y-8">

              {/* Info Box */}
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="bg-black text-white px-6 py-5 border-b">
                  <h3 className="font-bold text-xl">Informasi Detail</h3>
                </div>
                <div className="p-6 space-y-6">

                  <div className="flex items-start gap-4">
                    <ChefHat className="h-6 w-6 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-xs text-black mb-1">Jenis Hidangan</p>
                      <p className="font-bold text-black">{translateFoodType(food.type)}</p>
                    </div>
                  </div>

                  <hr className="border-gray-100" />

                  <div className="flex items-start gap-4">
                    <MapPin className="h-6 w-6 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-xs text-black mb-1">Asal Daerah</p>
                      <p className="font-bold text-black">{food.origin}</p>
                    </div>
                  </div>

                  <hr className="border-gray-100" />

                  <div className="flex items-start gap-4">
                    <Star className="h-6 w-6 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-black mb-1">Rating Pengguna</p>
                      <p className="font-bold text-black">{food.rating.toFixed(1)} / 5.0</p>
                    </div>
                  </div>

                  <hr className="border-gray-100" />

                  <div className="flex items-start gap-4">
                    <Clock className="h-6 w-6 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-xs text-black mb-1">Waktu Persiapan</p>
                      <p className="font-bold text-black">Bervariasi</p>
                    </div>
                  </div>

                  <hr className="border-gray-100" />

                  <div className="flex items-start gap-4">
                    <Flame className="h-6 w-6 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-xs text-black mb-1">Tingkat Kesulitan</p>
                      <p className="font-bold text-black">Menengah</p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Related Foods */}
              {relatedFoods && relatedFoods.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                  <div className="bg-black text-white px-6 py-5 border-b">
                    <h3 className="font-bold text-xl">Hidangan Sejenis</h3>
                  </div>
                  <div className="p-5 space-y-4">
                    {relatedFoods.map((item) => (
                      <Link
                        to={`/food/${item.id}`}
                        key={item.id}
                        className="flex gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group border border-transparent hover:border-gray-200"
                      >
                        <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                          <OptimizedImage
                            src={fixImageUrl(item.name, item.imageUrl)}
                            alt={item.name}
                            className="w-full h-full"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-primary text-black">
                            {item.name}
                          </h4>
                          <p className="text-xs text-black line-clamp-1">{item.origin}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default FoodDetail;