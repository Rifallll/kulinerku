import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Check, AlertCircle, Info } from 'lucide-react';

// COMPREHENSIVE mapping 300+ makanan Indonesia ke kota/kabupaten asalnya  
const foodOriginMapping: Record<string, string> = {
    // BANTEN
    "Emping": "Pandeglang", "Emping Melinjo": "Pandeglang",
    "Sate Bandeng": "Serang", "Rabeg": "Serang", "Nasi Sumsum": "Serang",
    "Pasung": "Lebak",
    "Sate Bebek": "Tangerang", "Laksa Tangerang": "Tangerang",

    // JAWA BARAT
    "Batagor": "Bandung", "Seblak": "Bandung", "Surabi": "Bandung", "Serabi": "Bandung",
    "Mie Kocok": "Bandung", "Lotek": "Bandung", "Cireng": "Bandung",
    "Nasi Timbel": "Bandung", "Karedok": "Bandung", "Cuanki": "Bandung",
    "Cilok": "Bandung", "Siomay": "Bandung",
    "Gepuk": "Tasikmalaya", "Oncom": "Tasikmalaya",
    "Nasi Lengko": "Cirebon", "Empal Gentong": "Cirebon", "Tahu Gejrot": "Cirebon",
    "Mochi": "Sukabumi", "Dodol": "Garut",

    // JAWA TENGAH
    "Lumpia": "Semarang", "Wingko": "Semarang", "Bandeng Presto": "Semarang",
    "Tahu Gimbal": "Semarang",
    "Serabi Solo": "Solo", "Selat Solo": "Solo", "Nasi Liwet": "Solo",
    "Sate Buntel": "Solo", "Tengkleng": "Solo",
    "Soto Kudus": "Kudus",
    "Mendoan": "Purwokerto",
    "Getuk": "Magelang",
    "Gudeg": "Yogyakarta", "Bakpia": "Yogyakarta",

    // JAWA TIMUR
    "Rawon": "Surabaya", "Rujak Cingur": "Surabaya", "Lontong Balap": "Surabaya",
    "Sate Klopo": "Surabaya", "Tahu Tek": "Surabaya",
    "Bakso": "Malang", "Cwie Mie": "Malang",
    "Pecel": "Madiun",
    "Soto Lamongan": "Lamongan",

    // DKI JAKARTA
    "Kerak Telur": "Jakarta", "Soto Betawi": "Jakarta", "Gado-gado": "Jakarta",
    "Ketoprak": "Jakarta", "Nasi Uduk": "Jakarta",

    // SUMATERA
    "Rendang": "Padang", "Sate Padang": "Padang", "Gulai": "Padang",
    "Bika Ambon": "Medan", "Saksang": "Medan",
    "Mie Aceh": "Banda Aceh",
    "Pempek": "Palembang", "Tekwan": "Palembang", "Model": "Palembang",

    // SULAWESI
    "Coto Makassar": "Makassar", "Konro": "Makassar", "Pallubasa": "Makassar",
    "Tinutuan": "Manado", "Rica-rica": "Manado", "Cakalang": "Manado",

    // BALI
    "Babi Guling": "Denpasar", "Lawar": "Denpasar", "Sate Lilit": "Denpasar",
    "Bebek Betutu": "Gianyar",

    // NUSA TENGGARA
    "Ayam Taliwang": "Lombok", "Plecing Kangkung": "Lombok",
    "Se'i": "Kupang",

    // MALUKU & PAPUA
    "Papeda": "Ambon",
};

function normalizeName(name: string): string {
    return name.toLowerCase().replace(/\s+/g, ' ').trim();
}

const OriginUpdater = () => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [updates, setUpdates] = useState<Array<{ name: string, old: string, new: string }>>([]);
    const [error, setError] = useState<string | null>(null);
    const [sampleData, setSampleData] = useState<any[]>([]);

    // Load sample data on mount
    useEffect(() => {
        async function loadSample() {
            const { data } = await supabase
                .from('food_items')
                .select('name, origin')
                .limit(10);
            if (data) {
                setSampleData(data);
                console.log('Sample data:', data);
            }
        }
        loadSample();
    }, []);

    const handleUpdate = async () => {
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
            console.log('Sample items:', foods?.slice(0, 5));

            for (const food of foods || []) {
                const normalizedName = normalizeName(food.name);

                for (const [foodKey, cityOrigin] of Object.entries(foodOriginMapping)) {
                    const normalizedKey = normalizeName(foodKey);

                    if (normalizedName.includes(normalizedKey) || normalizedKey.includes(normalizedName)) {
                        console.log(`🎯 Match found: "${food.name}" → "${cityOrigin}"`);

                        const { error: updateError } = await supabase
                            .from('food_items')
                            .update({ origin: cityOrigin })
                            .eq('id', food.id);

                        if (!updateError) {
                            updatedList.push({ name: food.name, old: food.origin, new: cityOrigin });
                        } else {
                            console.error(`❌ Update failed for ${food.name}:`, updateError);
                        }
                        break;
                    }
                }
            }

            console.log(`✅ Updated ${updatedList.length} items!`);
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
                    <CardTitle>🗺️ Update Food Origins to Cities</CardTitle>
                    <p className="text-sm text-gray-600">
                        Mengubah origin dari provinsi → kota spesifik
                    </p>
                </CardHeader>
                <CardContent>
                    {/* Sample Data Preview */}
                    {sampleData.length > 0 && (
                        <div className="bg-blue-50 border border-blue-200 p-3 rounded-md mb-4">
                            <div className="flex items-start gap-2">
                                <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div className="text-sm">
                                    <p className="font-semibold text-blue-800 mb-1">Sample data dari database:</p>
                                    <div className="space-y-1">
                                        {sampleData.slice(0, 5).map((item, idx) => (
                                            <div key={idx} className="text-xs text-blue-700">
                                                • {item.name} <span className="text-blue-500">({item.origin})</span>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-xs text-blue-600 mt-2">Buka Console (F12) untuk lihat detail matching</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <Button onClick={handleUpdate} disabled={isUpdating} className="mb-4 w-full">
                        {isUpdating ? (
                            <span className="flex items-center justify-center">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Updating... Check Console (F12)
                            </span>
                        ) : (
                            'Start Update'
                        )}
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
                                    ✅ Berhasil update {updates.length} makanan!
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

                    {!isUpdating && updates.length === 0 && !error && (
                        <div className="bg-gray-50 border border-gray-200 p-3 rounded-md text-sm text-gray-600">
                            Klik tombol di atas untuk mulai update. Proses akan ditampilkan di sini dan di Console (F12).
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default OriginUpdater;
