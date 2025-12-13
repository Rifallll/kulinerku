"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

const Map = () => {
  return (
    <div className="min-h-screen bg-background text-foreground pb-12">
      <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-2xl">
          <Globe className="mx-auto h-20 w-20 text-primary mb-8 animate-pulse" />
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Jelajahi di Peta
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
            Temukan lokasi kuliner favorit Anda di peta interaktif. Fitur ini
            akan segera hadir untuk memandu petualangan rasa Anda!
          </p>
          <Button asChild size="lg" className="px-8">
            <Link to="/">Kembali ke Beranda</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Map;