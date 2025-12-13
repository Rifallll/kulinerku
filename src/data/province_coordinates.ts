// Indonesian province and city coordinate mappings for map display
export const provinceCoordinates: Record<string, { lat: number; lng: number }> = {
    // Provinces
    "Aceh": { lat: 5.5483, lng: 95.3238 },
    "Sumatera Utara": { lat: 3.5952, lng: 98.6722 },
    "Sumatra Utara": { lat: 3.5952, lng: 98.6722 },
    "Sumatera Barat": { lat: -0.9471, lng: 100.4172 },
    "Sumatra Barat": { lat: -0.9471, lng: 100.4172 },
    "Riau": { lat: 0.5071, lng: 101.4478 },
    "Kepulauan Riau": { lat: 1.0456, lng: 103.9415 },
    "Jambi": { lat: -1.6101, lng: 103.6131 },
    "Sumatera Selatan": { lat: -2.9761, lng: 104.7754 },
    "Sumatra Selatan": { lat: -2.9761, lng: 104.7754 },
    "Bangka Belitung": { lat: -2.7410, lng: 106.4406 },
    "Kepulauan Bangka Belitung": { lat: -2.7410, lng: 106.4406 },
    "Bengkulu": { lat: -3.7928, lng: 102.2608 },
    "Lampung": { lat: -5.4292, lng: 105.2625 },
    "Jakarta": { lat: -6.2088, lng: 106.8456 },
    "DKI Jakarta": { lat: -6.2088, lng: 106.8456 },
    "Banten": { lat: -6.1781, lng: 106.6300 },
    "Jawa Barat": { lat: -6.9175, lng: 107.6191 },
    "Jawa Tengah": { lat: -7.1500, lng: 110.1403 },
    "Yogyakarta": { lat: -7.7956, lng: 110.3695 },
    "DI Yogyakarta": { lat: -7.7956, lng: 110.3695 },
    "Jogja": { lat: -7.7956, lng: 110.3695 },
    "Jawa Timur": { lat: -7.2575, lng: 112.7521 },
    "Bali": { lat: -8.3405, lng: 115.0920 },
    "Nusa Tenggara Barat": { lat: -8.6529, lng: 117.3616 },
    "NTB": { lat: -8.6529, lng: 117.3616 },
    "Nusa Tenggara Timur": { lat: -8.6574, lng: 121.0794 },
    "NTT": { lat: -8.6574, lng: 121.0794 },
    "Kalimantan Barat": { lat: -0.2787, lng: 111.4752 },
    "Kalimantan Tengah": { lat: -1.6815, lng: 113.3824 },
    "Kalimantan Selatan": { lat: -3.0926, lng: 115.2838 },
    "Kalimantan Timur": { lat: 0.5387, lng: 116.4194 },
    "Kalimantan Utara": { lat: 3.0731, lng: 116.0413 },
    "Sulawesi Utara": { lat: 0.6247, lng: 123.9750 },
    "Gorontalo": { lat: 0.6999, lng: 122.4467 },
    "Sulawesi Tengah": { lat: -1.4300, lng: 121.4456 },
    "Sulawesi Barat": { lat: -2.8441, lng: 119.2320 },
    "Sulawesi Selatan": { lat: -3.6687, lng: 119.9740 },
    "Sulawesi Tenggara": { lat: -4.1448, lng: 122.1747 },
    "Maluku": { lat: -3.2385, lng: 130.1453 },
    "Maluku Utara": { lat: 1.5709, lng: 127.8084 },
    "Papua": { lat: -4.2699, lng: 138.0804 },
    "Papua Barat": { lat: -1.3361, lng: 133.1747 },
    // New Papua provinces (2022 expansion)
    "Papua Selatan": { lat: -8.4933, lng: 140.4018 }, // Ibu kota: Merauke
    "Papua Tengah": { lat: -3.3645, lng: 135.4962 }, // Ibu kota: Nabire
    "Papua Pegunungan": { lat: -4.0807, lng: 138.9344 }, // Ibu kota: Wamena
    "Papua Barat Daya": { lat: -0.8615, lng: 131.2550 }, // Ibu kota: Sorong

    // Major Cities
    "Banda Aceh": { lat: 5.5483, lng: 95.3238 },
    "Medan": { lat: 3.5952, lng: 98.6722 },
    "Padang": { lat: -0.9471, lng: 100.4172 },
    "Pekanbaru": { lat: 0.5071, lng: 101.4478 },
    "Palembang": { lat: -2.9761, lng: 104.7754 },
    "Bandung": { lat: -6.9175, lng: 107.6191 },
    "Semarang": { lat: -6.9667, lng: 110.4167 },
    "Surabaya": { lat: -7.2575, lng: 112.7521 },
    "Malang": { lat: -7.9666, lng: 112.6326 },
    "Solo": { lat: -7.5755, lng: 110.8243 },
    "Surakarta": { lat: -7.5755, lng: 110.8243 },
    "Denpasar": { lat: -8.6705, lng: 115.2126 },
    "Makassar": { lat: -5.1477, lng: 119.4328 },
    "Manado": { lat: 1.4748, lng: 124.8428 },

    // Generic fallback - Jakarta on mainland (not ocean center)
    "Indonesia": { lat: -6.2088, lng: 106.8456 },
};

// Helper function to find coordinates with fuzzy matching
export function getCoordinates(origin: string): { lat: number; lng: number } | null {
    if (!origin) return null;

    const trimmed = origin.trim();

    // Direct match
    if (provinceCoordinates[trimmed]) {
        return provinceCoordinates[trimmed];
    }

    // Case-insensitive match
    const lowerOrigin = trimmed.toLowerCase();
    for (const [key, value] of Object.entries(provinceCoordinates)) {
        if (key.toLowerCase() === lowerOrigin) {
            return value;
        }
    }

    // Fuzzy match - prioritize longer matches
    let bestMatch: { value: { lat: number; lng: number } } | null = null;
    let bestMatchLength = 0;

    for (const [key, value] of Object.entries(provinceCoordinates)) {
        const lowerKey = key.toLowerCase();
        if (lowerOrigin.includes(lowerKey) || lowerKey.includes(lowerOrigin)) {
            if (lowerKey.length > bestMatchLength) {
                bestMatch = { value };
                bestMatchLength = lowerKey.length;
            }
        }
    }

    if (bestMatch) {
        return bestMatch.value;
    }

    // Default to Jakarta (mainland, not ocean)
    console.warn(`No coordinates found for "${origin}", using Jakarta`);
    return { lat: -6.2088, lng: 106.8456 };
}
