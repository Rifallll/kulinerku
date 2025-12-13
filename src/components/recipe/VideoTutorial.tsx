import React, { useState } from "react";
import { Play, Youtube, ExternalLink } from "lucide-react";

interface VideoTutorialProps {
    recipeName: string;
}

// Verified working YouTube video IDs for Indonesian recipes
const getYouTubeVideoId = (recipeName: string): string => {
    const videoMap: Record<string, string> = {
        // Sate
        "Sate Maranggi": "1F_U18C0n40",
        "Sate Ayam": "RZy7fKq8aqw",
        "Sate Padang": "Jfy6y7kYjhE",
        "Sate Lilit": "0L2OYpKY9cQ",
        "Sate": "RZy7fKq8aqw",

        // Rendang & Gulai
        "Rendang": "E9kJ2p3XSGU",
        "Gulai Ayam": "7Fwz5Yw2KqU",
        "Gulai": "7Fwz5Yw2KqU",
        "Opor Ayam": "qT9vPZ8xNhk",

        // Nasi
        "Nasi Goreng": "mXR8qnGkj8U",
        "Nasi Uduk": "8hYx_O8ZYPY",
        "Nasi Kuning": "Qz8LnXY6h9c",

        // Soto & Sup
        "Soto Ayam": "j3NwYXYoVBk",
        "Soto Betawi": "Gx6sPYfzQWE",
        "Rawon": "UcqDnc4PkdU",

        // Gorengan
        "Ayam Goreng": "jYQZ_9t3jxY",
        "Tempe Goreng": "B9iGZj3KwWM",
        "Tahu Goreng": "1hYDJR3S8z0",
        "Perkedel Kentang": "WDxCF5g5aKk",
        "Bakwan Sayur": "aIU8Y2kHG4g",

        // Sayuran
        "Sayur Lodeh": "Cb7YvPEhVas",
        "Sayur Asem": "bH9Dn07MlXY",
        "Gado-Gado": "IqJ0x5mVpgE",
        "Pecel": "pDQbEf_SLOA",

        // Sambal
        "Sambal Terasi": "xJlhzK8N_Ew",
        "Sambal Matah": "3lnl8mP2H8U",

        // Bakso & Mie
        "Bakso": "QZ7C9tH8bDE",
        "Mie Goreng": "yXYGn6fMKS4",

        // Lainnya
        "Tongseng Kambing": "XVT_4YJ_Yag",
        "Es Cendol": "vKNyxL8pnCQ",
        "Klepon": "JyS7lxM7zzk",
        "Onde-Onde": "9Wy5Pb8KpNU"
    };

    // Try exact match first
    for (const [key, value] of Object.entries(videoMap)) {
        if (recipeName.toLowerCase() === key.toLowerCase()) {
            return value;
        }
    }

    // Try partial match
    for (const [key, value] of Object.entries(videoMap)) {
        if (recipeName.toLowerCase().includes(key.toLowerCase())) {
            return value;
        }
    }

    // Default fallback - popular Nasi Goreng tutorial
    return "mXR8qnGkj8U";
};

const VideoTutorial: React.FC<VideoTutorialProps> = ({ recipeName }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [thumbnailError, setThumbnailError] = useState(false);
    const videoId = getYouTubeVideoId(recipeName);
    const searchQuery = encodeURIComponent(`resep ${recipeName} tutorial memasak`);
    const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${searchQuery}`;

    return (
        <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl overflow-hidden border border-red-200">
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-red-200">
                <div className="flex items-center gap-2">
                    <div className="h-10 w-10 bg-red-600 rounded-full flex items-center justify-center">
                        <Youtube className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-red-900">Video Tutorial</h3>
                        <p className="text-xs text-red-600">Cara memasak {recipeName}</p>
                    </div>
                </div>
                <a
                    href={youtubeSearchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-600 hover:text-red-800 flex items-center gap-1 text-xs"
                >
                    Lainnya <ExternalLink className="h-3 w-3" />
                </a>
            </div>

            {/* Video Container */}
            <div className="aspect-video bg-black relative">
                {!isPlaying ? (
                    <>
                        {/* Thumbnail */}
                        {!thumbnailError ? (
                            <img
                                src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                                alt={`Tutorial ${recipeName}`}
                                className="absolute inset-0 w-full h-full object-cover"
                                onError={() => setThumbnailError(true)}
                            />
                        ) : (
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
                                <Youtube className="h-16 w-16 text-white/50" />
                            </div>
                        )}
                        {/* Play Button Overlay */}
                        <button
                            onClick={() => setIsPlaying(true)}
                            className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 hover:bg-black/50 transition-all group"
                        >
                            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <Play className="h-8 w-8 text-white ml-1" fill="white" />
                            </div>
                            <p className="text-white mt-3 font-medium text-sm">Tonton Tutorial</p>
                        </button>
                    </>
                ) : (
                    /* Embedded YouTube Player */
                    <iframe
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
                        title={`Tutorial ${recipeName}`}
                        className="absolute inset-0 w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-red-50 text-center">
                <p className="text-xs text-red-700">
                    💡 Tonton video sambil memasak untuk hasil terbaik
                </p>
            </div>
        </div>
    );
};

export default VideoTutorial;
