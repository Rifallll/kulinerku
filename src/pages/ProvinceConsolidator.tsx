import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Check, AlertCircle, MapPin } from 'lucide-react';

// Mapping kota → provinsi induknya
const cityToProvince: Record<string, string> = {
    // Jawa Barat
    "Bandung": "Jawa Barat",
    "Cirebon": "Jawa Barat",
    "Tasikmalaya": "Jawa Barat",
    "Sukabumi": "Jawa Barat",
    "Garut": "Jawa Barat",
    "Subang": "Jawa Barat",

    // Jawa Tengah
    "Semarang": "Jawa Tengah",
    "Solo": "Jawa Tengah",
    "Surakarta": "Jawa Tengah",
    "Kudus": "Jawa Tengah",
    "Pekalongan": "Jawa Tengah",
    "Purwokerto": "Jawa Tengah",
    "Magelang": "Jawa Tengah",
    "Brebes": "Jawa Tengah",
    "Yogyakarta": "DI Yogyakarta",

    // Jawa Timur
    "Surabaya": "Jawa Timur",
    "Malang": "Jawa Timur",
    "Madiun": "Jawa Timur",
    "Lamongan": "Jawa Timur",
    "Sidoarjo": "Jawa Timur",
    "Blitar": "Jawa Timur",
    "Ponorogo": "Jawa Timur",

    // DKI Jakarta (keep as is atau bisa jadi "DKI Jakarta")
    "Jakarta": "DKI Jakarta",

    // Banten
    "Serang": "Banten",
    "Tangerang": "Banten",
    "Pandeglang": "Banten",
    "Lebak": "Banten",

    // Sumatera Barat
    "Padang": "Sumatera Barat",
    "Bukittinggi": "Sumatera Barat",
    "Payakumbuh": "Sumatera Barat",
    "Pariaman": "Sumatera Barat",

    // Sumatera Utara
    "Medan": "Sumatera Utara",
    "Tapanuli": "Sumatera Utara",
    "Kabanjahe": "Sumatera Utara",

    // Aceh
    "Banda Aceh": "Aceh",

    // Riau
    "Pekanbaru": "Riau",

    // Jambi (keep as province)

    // Sumatera Selatan
    "Palembang": "Sumatera Selatan",

    // Bengkulu (keep as province)

    // Lampung (keep as province)

    // Kalimantan Barat
    "Pontianak": "Kalimantan Barat",

    // Kalimantan Tengah
    "Palangkaraya": "Kalimantan Tengah",

    // Kalimantan Selatan
    "Banjarmasin": "Kalimantan Selatan",
    "Kandangan": "Kalimantan Selatan",

    // Kalimantan Timur
    "Samarinda": "Kalimantan Timur",

    // Sulawesi Utara
    "Manado": "Sulawesi Utara",

    // Sulawesi Tengah
    "Palu": "Sulawesi Tengah",

    // Sulawesi Selatan
    "Makassar": "Sulawesi Selatan",

    // Gorontalo (keep as province)

    // Bali
    "Denpasar": "Bali",
    "Gianyar": "Bali",

    // Nusa Tenggara Barat
    "Lombok": "Nusa Tenggara Barat",

    // Nusa Tenggara Timur
    "Kupang": "Nusa Tenggara Timur",

    // Maluku
    "Ambon": "Maluku",

    // Papua
    "Jayapura": "Papua",
};

const ProvinceConsolidator = () => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [updates, setUpdates] = useState<Array<{ name: string, old: string, new: string }>>([]);
    const [error, setError] = useState<string | null>(null);

    const handleConsolidate = async () => {
        setIsUpdating(true);
        setError(null);
        const updatedList: typeof updates = [];

        try {
            console.log('🔍 Fetching all food items...');
            const { data: foods, error: fetchError } = await supabase
                .from('food_items')
                .select('id, name, origin');

            if (fetchError) throw fetchError;

            console.log(`✅ Found ${foods?.length} items`);

            for (const food of foods || []) {
                // Check if origin is a city that should be converted to province
                const provinceMapping = cityToProvince[food.origin];

                if (provinceMapping && provinceMapping !== food.origin) {
                    console.log(`🎯 Converting: "${food.origin}" → "${provinceMapping}" for ${food.name}`);

                    const { error: updateError } = await supabase
                        .from('food_items')
                        .update({ origin: provinceMapping })
                        .eq('id', food.id);

                    if (!updateError) {
                        updatedList.push({
                            name: food.name,
                            old: food.origin,
                            new: provinceMapping
                        });
                    } else {
                        console.error(`❌ Update failed for ${food.name}:`, updateError);
                    }
                }
            }

            console.log(`✅ Consolidated ${updatedList.length} items to provinces!`);
            setUpdates(updatedList);
        } catch (err: any) {
            console.error('Error:', err);
            setError(err.message);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Consolidate to Provinces
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                        Mengubah origin dari kota → provinsi (Bandung → Jawa Barat, dll)
                    </p>
                </CardHeader>
                <CardContent>
                    <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md mb-4">
                        <p className="text-sm font-semibold text-yellow-800 mb-1">⚠️ Perhatian:</p>
                        <p className="text-sm text-yellow-700">
                            Tool ini akan mengubah semua kota menjadi provinsi induknya.
                            <br />Contoh: Bandung → Jawa Barat, Semarang → Jawa Tengah
                        </p>
                    </div>

                    <Button
                        onClick={handleConsolidate}
                        disabled={isUpdating}
                        className="mb-4 w-full"
                        variant="default"
                    >
                        {isUpdating ? 'Processing...' : 'Start Consolidation'}
                    </Button>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md mb-4">
                            <div className="flex items-start gap-2">
                                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-semibold">Error:</p>
                                    <p className="text-sm">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {updates.length > 0 && (
                        <div className="bg-green-50 border border-green-200 p-4 rounded-md">
                            <div className="flex items-center gap-2 mb-3">
                                <Check className="h-5 w-5 text-green-600" />
                                <h3 className="font-semibold text-green-800">
                                    ✅ Berhasil consolidate {updates.length} makanan ke provinsi!
                                </h3>
                            </div>
                            <div className="max-h-96 overflow-y-auto space-y-2">
                                {updates.map((u, idx) => (
                                    <div key={idx} className="text-sm bg-white p-2 rounded border border-green-100">
                                        <span className="font-semibold text-rose-600">{u.name}</span>
                                        <br />
                                        <span className="text-gray-500">{u.old}</span> →
                                        <span className="text-green-600 font-semibold"> {u.new}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default ProvinceConsolidator;
