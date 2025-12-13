import React from "react";
import { ExternalLink, BookMarked, Globe, FileText } from "lucide-react";

interface RecipeReferencesProps {
    recipeName: string;
}

const RecipeReferences: React.FC<RecipeReferencesProps> = ({ recipeName }) => {
    const searchQuery = encodeURIComponent(`resep ${recipeName}`);

    const references = [
        {
            name: "Cookpad Indonesia",
            url: `https://cookpad.com/id/cari/${searchQuery}`,
            icon: "🍳",
            description: "Resep dari komunitas"
        },
        {
            name: "Yummy App",
            url: `https://www.yummy.co.id/resep?q=${searchQuery}`,
            icon: "😋",
            description: "Resep dengan video"
        },
        {
            name: "Masakapahariini",
            url: `https://www.masakapahariini.com/search/${searchQuery}`,
            icon: "👨‍🍳",
            description: "Resep praktis"
        },
        {
            name: "Wikipedia",
            url: `https://id.wikipedia.org/wiki/${encodeURIComponent(recipeName)}`,
            icon: "📚",
            description: "Info lengkap"
        }
    ];

    return (
        <div className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-2xl border border-cyan-200 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-cyan-200 flex items-center gap-3">
                <div className="h-10 w-10 bg-cyan-600 rounded-full flex items-center justify-center">
                    <BookMarked className="h-5 w-5 text-white" />
                </div>
                <div>
                    <h3 className="font-bold text-cyan-900">Referensi & Sumber</h3>
                    <p className="text-xs text-cyan-600">Pelajari lebih lanjut</p>
                </div>
            </div>

            {/* Links */}
            <div className="p-4 space-y-2">
                {references.map((ref, idx) => (
                    <a
                        key={idx}
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-cyan-50 transition-colors group border border-transparent hover:border-cyan-200"
                    >
                        <span className="text-2xl">{ref.icon}</span>
                        <div className="flex-1">
                            <p className="font-medium text-cyan-900 group-hover:text-cyan-700">{ref.name}</p>
                            <p className="text-xs text-cyan-600">{ref.description}</p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-cyan-400 group-hover:text-cyan-600" />
                    </a>
                ))}
            </div>

            {/* Search More */}
            <div className="p-4 bg-cyan-50 border-t border-cyan-200">
                <a
                    href={`https://www.google.com/search?q=resep+${searchQuery}+lengkap`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 text-sm text-cyan-700 hover:text-cyan-900"
                >
                    <Globe className="h-4 w-4" />
                    Cari resep lainnya di Google
                </a>
            </div>
        </div>
    );
};

export default RecipeReferences;
