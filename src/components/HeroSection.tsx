"use client";

import React from "react";
import ImageCarousel from "./ImageCarousel";
import GlobalSearch from "./GlobalSearch";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface HeroSectionProps {
  onSearch: (term: string) => void;
  searchTerm: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onSearch, searchTerm }) => {
  const heroContent = [
    {
      imageUrl: "/gambar/jdul/rempah.jpg",
      title: "Rempah Nusantara, Jantung Kuliner Indonesia",
      description: "Temukan kekayaan rasa dari rempah-rempah pilihan yang menjadi dasar setiap hidangan.",
    },
    {
      imageUrl: "/gambar/jdul/daerah khas.jpg",
      title: "Jelajahi Kuliner Khas Setiap Daerah",
      description: "Dari Sabang sampai Merauke, setiap daerah punya cerita rasa yang unik dan tak terlupakan.",
    },
    {
      imageUrl: "/gambar/jdul/tradsional.jpg",
      title: "Warisan Rasa Tradisional yang Abadi",
      description: "Nikmati hidangan klasik yang telah diwariskan turun-temurun, menjaga cita rasa asli Indonesia.",
    },
  ];

  const [currentIndex, setCurrentIndex] = React.useState(0);

  const currentItem = heroContent[currentIndex];

  return (
    <section className="relative w-[100vw] left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] min-h-[500px] md:min-h-[680px] overflow-hidden">
      <ImageCarousel
        images={heroContent.map(item => item.imageUrl)}
        interval={30000}
        className="absolute inset-0"
        currentIndex={currentIndex}
        onIndexChange={setCurrentIndex}
      />
      {/* Overlay yang lebih gelap untuk meningkatkan keterbacaan teks */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-black/60"></div>

      {/* Konten teks yang dipusatkan */}
      <div className="absolute inset-0 z-10 text-white flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight drop-shadow-md animate-in fade-in slide-in-from-bottom-4 duration-700">
          {currentItem.title}
        </h2>
        <p className="mt-4 text-sm md:text-base text-gray-200 drop-shadow-sm max-w-md animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
          {currentItem.description}
        </p>

        {/* Search Input in Hero */}
        <div className="mt-6 w-full max-w-md animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
          <GlobalSearch
            trigger={
              <Button
                variant="outline"
                className="relative h-9 w-full justify-start text-sm text-black sm:pr-12 md:w-40 lg:w-64 rounded-full bg-white hover:bg-gray-50 border-gray-200 shadow-sm transition-all"
              >
                <Search className="mr-2 h-4 w-4" />
                <span className="hidden lg:inline-flex">Cari kuliner...</span>
                <span className="inline-flex lg:hidden">Cari...</span>
                <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-gray-100 px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </Button>
            }
          />
        </div>

      </div>
    </section>
  );
};

export default HeroSection;