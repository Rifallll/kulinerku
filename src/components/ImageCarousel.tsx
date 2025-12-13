"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ImageCarouselProps {
  images: string[];
  interval?: number; // Interval dalam milidetik, default 30000 (30 detik)
  className?: string;
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  interval = 30000,
  className,
  currentIndex,
  onIndexChange,
}) => {
  React.useEffect(() => {
    if (images.length === 0) return;

    const timer = setInterval(() => {
      const nextIndex = (currentIndex + 1) % images.length;
      onIndexChange(nextIndex); // Langsung ganti indeks tanpa fade
    }, interval);

    return () => clearInterval(timer);
  }, [images, interval, currentIndex, onIndexChange]);

  if (images.length === 0) {
    return (
      <div className={cn("w-full h-full bg-gray-200 flex items-center justify-center text-gray-500", className)}>
        Tidak ada gambar
      </div>
    );
  }

  return (
    <div className={cn("relative w-full h-full overflow-hidden", className)}>
      {images.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`Background ${index + 1}`}
          // Gambar hanya akan terlihat jika indeksnya cocok dengan currentIndex
          className={cn(
            "absolute inset-0 w-full h-full object-cover",
            index === currentIndex ? "opacity-100" : "opacity-0",
          )}
          style={{ zIndex: index === currentIndex ? 1 : 0 }}
        />
      ))}
    </div>
  );
};

export default ImageCarousel;