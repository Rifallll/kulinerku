"use client";

import React, { useRef, useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Users, Flame, BookOpen, Download, MessageCircle, Moon, Sun, Lock, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { findRecipeById } from "@/data/recipeData";
import { useAuth } from "@/contexts/AuthContext";

// Import all recipe components
import StarRating from "@/components/recipe/StarRating";
import PortionSlider from "@/components/recipe/PortionSlider";
import AIAssistant from "@/components/recipe/AIAssistant";
import NutritionCard from "@/components/recipe/NutritionCard";
import FavoriteButton from "@/components/recipe/FavoriteButton";
import ShoppingList from "@/components/recipe/ShoppingList";
import RelatedRecipes from "@/components/recipe/RelatedRecipes";
import FoodHistory from "@/components/recipe/FoodHistory";
import RecipeReferences from "@/components/recipe/RecipeReferences";
import ProTips from "@/components/recipe/ProTips";
import AIChat from "@/components/recipe/AIChat";

const RecipeDetail = () => {
    const { id } = useParams<{ id: string }>();
    const recipe = findRecipeById(id || "");
    const { user } = useAuth();
    const navigate = useNavigate();
    const printRef = useRef<HTMLDivElement>(null);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [currentServings, setCurrentServings] = useState(4);
    const [adjustedIngredients, setAdjustedIngredients] = useState<string[]>([]);

    // Timer state
    const [timerSeconds, setTimerSeconds] = useState(0);
    const [timerRunning, setTimerRunning] = useState(false);
    const [timerStarted, setTimerStarted] = useState(false);

    // Initialize timer when recipe loads
    useEffect(() => {
        if (recipe?.cookMinutes) {
            setTimerSeconds(recipe.cookMinutes * 60);
        }
    }, [recipe?.cookMinutes]);

    // Timer countdown effect
    useEffect(() => {
        if (!timerRunning || timerSeconds <= 0) return;
        const id = window.setInterval(() => {
            setTimerSeconds(s => {
                if (s <= 1) {
                    setTimerRunning(false);
                    try {
                        const a = new AudioContext();
                        const o = a.createOscillator();
                        o.connect(a.destination);
                        o.frequency.value = 880;
                        o.start(); o.stop(a.currentTime + 0.5);
                    } catch (e) { }
                    return 0;
                }
                return s - 1;
            });
        }, 1000);
        return () => clearInterval(id);
    }, [timerRunning, timerSeconds]);

    const handlePrint = () => {
        if (!recipe || !user) return;
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${recipe.name} - Resep</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Georgia, serif; padding: 40px; max-width: 800px; margin: 0 auto; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 3px double #333; padding-bottom: 20px; }
          .title { font-size: 32px; font-weight: bold; }
          .subtitle { font-style: italic; color: #666; margin: 10px 0; }
          .info-row { display: flex; justify-content: center; gap: 30px; margin-top: 15px; }
          .section { margin: 30px 0; }
          .section-title { font-size: 22px; font-weight: bold; margin-bottom: 15px; border-bottom: 2px solid #333; padding-bottom: 8px; }
          .ingredient-list { list-style: none; }
          .ingredient-list li { padding: 8px 0; border-bottom: 1px dotted #ccc; }
          .step-list { list-style: none; }
          .step-list li { padding: 12px 0; border-bottom: 1px solid #eee; display: flex; gap: 15px; }
          .step-number { width: 30px; height: 30px; background: #333; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0; }
          .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #333; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">${recipe.name}</div>
          <div class="subtitle">Resep Masakan Indonesia</div>
          <div class="info-row">
            <span>Waktu: ${recipe.cookTime}</span>
            <span>Porsi: ${currentServings}</span>
            <span>Level: ${recipe.difficulty}</span>
          </div>
        </div>
        <div class="section">
          <div class="section-title">Bahan-Bahan</div>
          <ul class="ingredient-list">
            ${(adjustedIngredients.length > 0 ? adjustedIngredients : recipe.ingredients).map((ing: string, idx: number) => `<li>${idx + 1}. ${ing}</li>`).join('')}
          </ul>
        </div>
        <div class="section">
          <div class="section-title">Cara Membuat</div>
          <ul class="step-list">
            <li><div class="step-number">1</div><div>Siapkan dan cuci bersih semua bahan</div></li>
            <li><div class="step-number">2</div><div>Haluskan bumbu-bumbu utama</div></li>
            <li><div class="step-number">3</div><div>Tumis bumbu halus hingga harum</div></li>
            <li><div class="step-number">4</div><div>Masukkan bahan utama, aduk rata</div></li>
            <li><div class="step-number">5</div><div>Masak hingga matang sempurna</div></li>
            <li><div class="step-number">6</div><div>Koreksi rasa, sajikan hangat</div></li>
          </ul>
        </div>
        <div class="footer">Dari Buku Resep Kuliner Indonesia</div>
      </body>
      </html>
    `);
        printWindow.document.close();
        setTimeout(() => printWindow.print(), 500);
    };

    const handleShareWhatsApp = () => {
        if (!recipe || !user) return;
        const ings = adjustedIngredients.length > 0 ? adjustedIngredients : recipe.ingredients;
        const bahanList = ings.map((ing: string, idx: number) => `${idx + 1}. ${ing}`).join('\n');
        const message = `*RESEP ${recipe.name.toUpperCase()}*\n\n*Bahan-Bahan (${currentServings} porsi):*\n${bahanList}\n\nWaktu: ${recipe.cookTime}\nKesulitan: ${recipe.difficulty}\n\nLihat resep:\n${window.location.href}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    };

    const handlePortionChange = (newServings: number, newIngredients: string[]) => {
        setCurrentServings(newServings);
        setAdjustedIngredients(newIngredients);
    };

    if (!recipe) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50">
                <BookOpen className="h-20 w-20 text-slate-600 mb-6" />
                <h1 className="text-4xl font-serif font-bold mb-4 text-slate-900">Resep Tidak Ditemukan</h1>
                <Link to="/recipes">
                    <Button className="bg-slate-800 hover:bg-slate-900">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
                    </Button>
                </Link>
            </div>
        );
    }

    const displayIngredients = adjustedIngredients.length > 0 ? adjustedIngredients : recipe.ingredients;

    const cookingSteps = [
        `Cuci bersih ${recipe.ingredients[0] || 'bahan utama'} dan potong sesuai selera.`,
        `Haluskan ${recipe.ingredients[2] || 'bawang merah'}, ${recipe.ingredients[3] || 'bawang putih'}, dan bumbu lainnya.`,
        `Panaskan minyak, tumis bumbu halus hingga harum.`,
        `Masukkan ${recipe.ingredients[0] || 'bahan utama'}, aduk rata dengan bumbu.`,
        `Tambahkan ${recipe.ingredients[1] || 'bumbu pelengkap'} dan bahan lainnya.`,
        `Masak dengan api kecil 15-20 menit hingga matang.`,
        `Koreksi rasa dan sajikan selagi hangat.`
    ];

    const bgClass = isDarkMode ? "bg-slate-900" : "bg-gradient-to-br from-slate-100 via-white to-slate-100";
    const textClass = isDarkMode ? "text-white" : "text-slate-900";
    const cardClass = isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200";

    // Member-Only Gate: Show login prompt if not authenticated
    if (!user) {
        return (
            <div className={`min-h-screen ${bgClass}`}>
                {/* Navigation */}
                <div className="bg-slate-800 text-white">
                    <div className="container mx-auto px-4 py-3">
                        <Link to="/recipes" className="flex items-center gap-2 hover:text-slate-300 inline-flex">
                            <ArrowLeft className="h-5 w-5" />
                            <span>Kembali ke Buku Resep</span>
                        </Link>
                    </div>
                </div>

                {/* Preview Content */}
                <div className="container mx-auto px-4 py-8 max-w-4xl">
                    {/* Header Preview */}
                    <div className={`${cardClass} rounded-3xl shadow-xl overflow-hidden border mb-8`}>
                        <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-2"></div>
                        <div className="p-8">
                            <span className="inline-block bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium mb-4">
                                {recipe.category}
                            </span>
                            <h1 className={`text-4xl md:text-5xl font-serif font-bold ${textClass} mb-4`}>
                                {recipe.name}
                            </h1>
                            <div className="flex flex-wrap gap-4 mb-6">
                                <div className={`flex items-center gap-2 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'} px-4 py-2 rounded-full`}>
                                    <Clock className="h-5 w-5 text-blue-500" />
                                    <span className={`font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{recipe.cookTime}</span>
                                </div>
                                <div className={`flex items-center gap-2 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'} px-4 py-2 rounded-full`}>
                                    <Users className="h-5 w-5 text-green-500" />
                                    <span className={`font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{recipe.servings} Porsi</span>
                                </div>
                                <div className={`flex items-center gap-2 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'} px-4 py-2 rounded-full`}>
                                    <Flame className="h-5 w-5 text-orange-500" />
                                    <span className={`font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{recipe.difficulty}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Image */}
                    <div className={`${cardClass} rounded-2xl overflow-hidden border mb-8`}>
                        <img src={recipe.imageUrl} alt={recipe.name} className="w-full h-80 object-cover" />
                    </div>

                    {/* Member-Only Lock */}
                    <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-2xl p-8 text-white text-center">
                        <Lock className="h-16 w-16 mx-auto mb-4 animate-pulse" />
                        <h2 className="text-3xl font-bold mb-4">Resep Lengkap - Member Only 🔒</h2>
                        <p className="text-lg mb-6 opacity-90">
                            Bahan-bahan lengkap dan cara membuat detail hanya tersedia untuk member!
                        </p>
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-6">
                            <p className="text-sm mb-2">✨ Dapatkan akses ke:</p>
                            <ul className="text-left inline-block text-sm space-y-1">
                                <li>✅ Bahan-bahan lengkap dengan takaran</li>
                                <li>✅ Langkah-langkah memasak detail</li>
                                <li>✅ Tips & trik dari chef profesional</li>
                                <li>✅ Informasi nutrisi</li>
                                <li>✅ Download & share resep</li>
                            </ul>
                        </div>
                        <Button
                            size="lg"
                            onClick={() => navigate('/login')}
                            className="bg-white text-orange-600 hover:bg-gray-100 font-bold text-lg px-8"
                        >
                            <LogIn className="mr-2 h-5 w-5" />
                            Login untuk Lihat Resep Lengkap
                        </Button>
                        <p className="mt-4 text-sm opacity-75">
                            Belum punya akun? <Link to="/register" className="underline font-bold">Daftar Gratis</Link>
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Full content for authenticated members
    return (
        <div className={`min-h-screen ${bgClass} transition-colors duration-300`}>
            {/* Navigation */}
            <div className="bg-slate-800 text-white">
                <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                    <Link to="/recipes" className="flex items-center gap-2 hover:text-slate-300">
                        <ArrowLeft className="h-5 w-5" />
                        <span>Kembali ke Buku Resep</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <FavoriteButton recipeId={recipe.id} recipeName={recipe.name} size="sm" />
                        <button onClick={handleShareWhatsApp} className="hover:text-green-400 flex items-center gap-2 p-2">
                            <MessageCircle className="h-5 w-5" />
                        </button>
                        <button onClick={handlePrint} className="hover:text-slate-300 flex items-center gap-2 p-2">
                            <Download className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className="hover:text-yellow-400 p-2"
                        >
                            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8 max-w-6xl" ref={printRef}>

                {/* Header */}
                <div className={`${cardClass} rounded-3xl shadow-xl overflow-hidden border mb-8`}>
                    <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-2"></div>
                    <div className="p-8">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                            <div className="flex-1">
                                <span className="inline-block bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium mb-4">
                                    {recipe.category}
                                </span>
                                <h1 className={`text-4xl md:text-5xl font-serif font-bold ${textClass} mb-4`}>
                                    {recipe.name}
                                </h1>
                                <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'} text-lg italic mb-6`}>
                                    Resep Masakan Tradisional Indonesia
                                </p>

                                {/* Quick Info */}
                                <div className="flex flex-wrap gap-4">
                                    <div className={`flex items-center gap-2 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'} px-4 py-2 rounded-full`}>
                                        <Clock className="h-5 w-5 text-blue-500" />
                                        <span className={`font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{recipe.cookTime}</span>
                                    </div>
                                    <div className={`flex items-center gap-2 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'} px-4 py-2 rounded-full`}>
                                        <Users className="h-5 w-5 text-green-500" />
                                        <span className={`font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{currentServings} Porsi</span>
                                    </div>
                                    <div className={`flex items-center gap-2 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'} px-4 py-2 rounded-full`}>
                                        <Flame className="h-5 w-5 text-orange-500" />
                                        <span className={`font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{recipe.difficulty}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Rating */}
                            <div className="flex flex-col items-center">
                                <StarRating recipeId={recipe.id} size="lg" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column - Main Content */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Image */}
                        <div className={`${cardClass} rounded-2xl overflow-hidden border`}>
                            <img src={recipe.imageUrl} alt={recipe.name} className="w-full h-80 object-cover" />
                        </div>

                        {/* Portion Slider */}
                        <PortionSlider
                            defaultServings={recipe.servings}
                            ingredients={recipe.ingredients}
                            onPortionChange={handlePortionChange}
                        />

                        {/* Ingredients */}
                        <div className={`${cardClass} rounded-2xl p-6 border`}>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl">📝</div>
                                <h2 className={`text-2xl font-serif font-bold ${textClass}`}>Bahan-Bahan</h2>
                            </div>
                            <div className="space-y-3">
                                {displayIngredients.map((ing: string, idx: number) => (
                                    <div key={idx} className={`flex items-center gap-4 py-3 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-200'} last:border-0`}>
                                        <div style={{ backgroundColor: '#2563eb', color: 'white' }} className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                                            {idx + 1}
                                        </div>
                                        <span className={`font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{ing}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Cooking Steps */}
                        <div className={`${cardClass} rounded-2xl p-6 border`}>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl">👨‍🍳</div>
                                <div>
                                    <h2 className={`text-2xl font-serif font-bold ${textClass}`}>Cara Membuat</h2>
                                    <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'} text-sm`}>Ikuti langkah berikut</p>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-blue-200"></div>
                                <div className="space-y-6">
                                    {cookingSteps.map((step, idx) => (
                                        <div key={idx} className="relative flex gap-6">
                                            <div style={{ backgroundColor: '#2563eb', color: 'white' }} className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0 shadow-lg border-4 border-white">
                                                {idx + 1}
                                            </div>
                                            <div className={`flex-1 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-50'} rounded-xl p-5 border ${isDarkMode ? 'border-slate-600' : 'border-slate-200'}`}>
                                                <p className={`${isDarkMode ? 'text-slate-200' : 'text-slate-800'} leading-relaxed`}>{step}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Related Recipes */}
                        <RelatedRecipes currentRecipeId={recipe.id} category={recipe.category} />
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-6">
                        {/* Interactive Timer */}
                        <div className={`border-2 rounded-xl p-5 ${timerSeconds === 0 && timerStarted ? 'bg-green-50 border-green-300' : 'bg-blue-50 border-blue-200'}`}>
                            <h3 className="font-bold text-blue-700 text-center mb-3">⏱️ Timer {recipe.name}</h3>
                            <div className={`text-center py-4 rounded-lg mb-3 ${timerSeconds === 0 && timerStarted ? 'bg-green-500' : 'bg-blue-600'}`}>
                                <span className="text-3xl font-bold text-white">
                                    {timerSeconds === 0 && timerStarted
                                        ? 'SELESAI!'
                                        : `${Math.floor(timerSeconds / 60)} menit ${timerSeconds % 60} detik`
                                    }
                                </span>
                            </div>
                            <div className="flex gap-2 justify-center">
                                <Button
                                    size="sm"
                                    onClick={() => { setTimerStarted(true); setTimerRunning(!timerRunning); }}
                                    className={timerRunning ? "bg-orange-500" : "bg-blue-600"}
                                >
                                    {timerRunning ? "⏸ Pause" : "▶ Mulai"}
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                        setTimerRunning(false);
                                        setTimerStarted(false);
                                        setTimerSeconds((recipe.cookMinutes || 20) * 60);
                                    }}
                                >
                                    Reset
                                </Button>
                            </div>
                        </div>

                        {/* Pro Tips */}
                        <ProTips recipeName={recipe.name} ingredients={recipe.ingredients} />

                        {/* AI Assistant */}
                        <AIAssistant recipeName={recipe.name} ingredients={recipe.ingredients} />

                        {/* Nutrition */}
                        <NutritionCard recipeName={recipe.name} ingredients={recipe.ingredients} servings={currentServings} />

                        {/* Food History */}
                        <FoodHistory recipeName={recipe.name} />

                        {/* Shopping List */}
                        <ShoppingList recipeName={recipe.name} ingredients={displayIngredients} />

                        {/* References */}
                        <RecipeReferences recipeName={recipe.name} />
                    </div>
                </div>
            </div>

            {/* Floating AI Chat */}
            <AIChat recipeName={recipe.name} ingredients={recipe.ingredients} />
        </div>
    );
};

export default RecipeDetail;
