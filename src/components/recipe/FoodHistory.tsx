import React from "react";
import { BookOpen, MapPin, Clock, Globe } from "lucide-react";

interface FoodHistoryProps {
    recipeName: string;
}

// Database of Indonesian food histories
const foodHistories: Record<string, { origin: string; history: string; funFact: string }> = {
    "Rendang": {
        origin: "Minangkabau, Sumatera Barat",
        history: "Rendang berasal dari Minangkabau dan telah ada sejak abad ke-16. Awalnya dibuat untuk perjalanan jauh karena tahan lama. CNN pernah menobatkan Rendang sebagai makanan terenak di dunia.",
        funFact: "Rendang bukan sekedar kari kering - proses memasaknya bisa memakan waktu 4-8 jam!"
    },
    "Sate": {
        origin: "Jawa",
        history: "Sate diperkirakan berasal dari pedagang Arab yang membawa tradisi kebab. Di Indonesia, sate berkembang dengan berbagai variasi unik seperti sate padang, madura, dan maranggi.",
        funFact: "Indonesia memiliki lebih dari 100 variasi sate dari berbagai daerah!"
    },
    "Nasi Goreng": {
        origin: "Seluruh Indonesia",
        history: "Nasi goreng berkembang sebagai cara mengolah sisa nasi. Setiap daerah memiliki ciri khas sendiri - dari nasi goreng Jawa yang manis hingga nasi goreng Aceh yang pedas.",
        funFact: "Nasi goreng adalah sarapan favorit orang Indonesia!"
    },
    "Soto": {
        origin: "Jawa Tengah",
        history: "Soto dipengaruhi oleh sup dari China dan India. Setiap kota di Indonesia memiliki soto khasnya - Soto Lamongan, Coto Makassar, Soto Betawi, dll.",
        funFact: "Ada lebih dari 30 jenis soto yang berbeda di Indonesia!"
    },
    "Gado-Gado": {
        origin: "Jakarta / Betawi",
        history: "Gado-gado adalah salad khas Indonesia dengan bumbu kacang. Nama 'gado-gado' berarti 'campur-campur' karena berisi berbagai sayuran.",
        funFact: "Gado-gado adalah salah satu makanan vegetarian tertua di Indonesia."
    },
    "Rawon": {
        origin: "Surabaya, Jawa Timur",
        history: "Rawon adalah sup daging berwarna hitam khas Jawa Timur. Warna hitamnya berasal dari kluwek, sejenis buah yang difermentasi.",
        funFact: "Kluwek mentah sebenarnya beracun - harus difermentasi dulu!"
    },
    "Gudeg": {
        origin: "Yogyakarta, Jawa Tengah",
        history: "Gudeg adalah masakan nangka muda yang dimasak dalam santan selama berjam-jam. Gudeg sudah ada sejak era Kerajaan Mataram.",
        funFact: "Memasak gudeg tradisional membutuhkan waktu hingga 24 jam!"
    },
    "Bakso": {
        origin: "Tiongkok-Indonesia",
        history: "Bakso diperkirakan diperkenalkan oleh pedagang Tionghoa. Di Indonesia, bakso berkembang menjadi makanan nasional dengan berbagai inovasi.",
        funFact: "Orang Indonesia mengonsumsi lebih dari 1 miliar porsi bakso setiap tahun!"
    },
    "Gulai": {
        origin: "Sumatera",
        history: "Gulai adalah kari gaya Indonesia dengan santan dan rempah. Resepnya dipengaruhi oleh pedagang India yang datang ke Sumatera.",
        funFact: "Gulai berbeda dengan kari India - lebih kaya santan dan rempah lokal."
    },
    "Opor Ayam": {
        origin: "Jawa Tengah",
        history: "Opor ayam adalah hidangan wajib saat Lebaran. Masakan ini sudah ada sejak era kerajaan Jawa dan melambangkan kemakmuran.",
        funFact: "Opor ayam selalu dipasangkan dengan ketupat saat Lebaran!"
    }
};

// Get history for a recipe (with fallback)
const getHistory = (recipeName: string) => {
    // Try exact match
    if (foodHistories[recipeName]) {
        return foodHistories[recipeName];
    }

    // Try partial match
    for (const [key, value] of Object.entries(foodHistories)) {
        if (recipeName.toLowerCase().includes(key.toLowerCase())) {
            return value;
        }
    }

    // Default fallback
    return {
        origin: "Indonesia",
        history: `${recipeName} adalah salah satu hidangan khas Indonesia yang kaya akan rempah dan cita rasa. Seperti banyak masakan Nusantara, resep ini telah diwariskan turun-temurun dan menjadi bagian dari warisan kuliner bangsa.`,
        funFact: "Indonesia memiliki lebih dari 5.000 resep tradisional dari 34 provinsi!"
    };
};

const FoodHistory: React.FC<FoodHistoryProps> = ({ recipeName }) => {
    const history = getHistory(recipeName);

    return (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-amber-200 flex items-center gap-3">
                <div className="h-10 w-10 bg-amber-600 rounded-full flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-white" />
                </div>
                <div>
                    <h3 className="font-bold text-amber-900">Sejarah & Asal Usul</h3>
                    <p className="text-xs text-amber-600">Cerita di balik {recipeName}</p>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
                {/* Origin */}
                <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="text-sm font-medium text-amber-900">Asal Daerah</p>
                        <p className="text-sm text-amber-700">{history.origin}</p>
                    </div>
                </div>

                {/* History */}
                <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="text-sm font-medium text-amber-900">Sejarah</p>
                        <p className="text-sm text-amber-700 leading-relaxed">{history.history}</p>
                    </div>
                </div>

                {/* Fun Fact */}
                <div className="bg-amber-100 rounded-xl p-4 border border-amber-200">
                    <div className="flex items-start gap-2">
                        <span className="text-xl">💡</span>
                        <div>
                            <p className="text-sm font-medium text-amber-900">Fakta Menarik</p>
                            <p className="text-sm text-amber-700">{history.funFact}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FoodHistory;
