/**
 * Centralized City to Province Mapping
 * Used across Regions, Maps, and Analytics Dashboard for consistency
 */

export const CITY_TO_PROVINCE: Record<string, string> = {
    // Jawa Barat
    "Bandung": "Jawa Barat",
    "Cirebon": "Jawa Barat",
    "Tasikmalaya": "Jawa Barat",
    "Sukabumi": "Jawa Barat",
    "Garut": "Jawa Barat",
    "Subang": "Jawa Barat",
    "Bogor": "Jawa Barat",
    "Bekasi": "Jawa Barat",
    "Depok": "Jawa Barat",

    // Jawa Tengah
    "Semarang": "Jawa Tengah",
    "Solo": "Jawa Tengah",
    "Surakarta": "Jawa Tengah",
    "Kudus": "Jawa Tengah",
    "Pekalongan": "Jawa Tengah",
    "Purwokerto": "Jawa Tengah",
    "Magelang": "Jawa Tengah",
    "Brebes": "Jawa Tengah",
    "Tegal": "Jawa Tengah",
    "Salatiga": "Jawa Tengah",

    // DI Yogyakarta
    "Yogyakarta": "DI Yogyakarta",
    "Jogja": "DI Yogyakarta",

    // Jawa Timur
    "Surabaya": "Jawa Timur",
    "Malang": "Jawa Timur",
    "Madiun": "Jawa Timur",
    "Lamongan": "Jawa Timur",
    "Sidoarjo": "Jawa Timur",
    "Blitar": "Jawa Timur",
    "Ponorogo": "Jawa Timur",
    "Kediri": "Jawa Timur",
    "Jember": "Jawa Timur",
    "Banyuwangi": "Jawa Timur",

    // DKI Jakarta
    "Jakarta": "DKI Jakarta",

    // Banten
    "Serang": "Banten",
    "Tangerang": "Banten",
    "Pandeglang": "Banten",
    "Lebak": "Banten",
    "Cilegon": "Banten",

    // Sumatera Barat
    "Padang": "Sumatera Barat",
    "Bukittinggi": "Sumatera Barat",
    "Payakumbuh": "Sumatera Barat",
    "Pariaman": "Sumatera Barat",

    // Sumatera Utara
    "Medan": "Sumatera Utara",
    "Tapanuli": "Sumatera Utara",
    "Kabanjahe": "Sumatera Utara",
    "Pematangsiantar": "Sumatera Utara",
    "Binjai": "Sumatera Utara",

    // Aceh
    "Banda Aceh": "Aceh",
    "Lhokseumawe": "Aceh",
    "Sabang": "Aceh",

    // Riau
    "Pekanbaru": "Riau",
    "Dumai": "Riau",

    // Kepulauan Riau
    "Batam": "Kepulauan Riau",
    "Tanjung Pinang": "Kepulauan Riau",

    // Jambi
    "Jambi": "Jambi",

    // Sumatera Selatan
    "Palembang": "Sumatera Selatan",
    "Lubuklinggau": "Sumatera Selatan",

    // Bengkulu
    "Bengkulu": "Bengkulu",

    // Lampung
    "Bandar Lampung": "Lampung",
    "Metro": "Lampung",

    // Bangka Belitung
    "Pangkalpinang": "Bangka Belitung",
    "Belitung": "Bangka Belitung",

    // Kalimantan Barat
    "Pontianak": "Kalimantan Barat",
    "Singkawang": "Kalimantan Barat",
    "Sambas": "Kalimantan Barat",

    // Kalimantan Tengah
    "Palangkaraya": "Kalimantan Tengah",
    "Sampit": "Kalimantan Tengah",

    // Kalimantan Selatan
    "Banjarmasin": "Kalimantan Selatan",
    "Kandangan": "Kalimantan Selatan",
    "Banjarbaru": "Kalimantan Selatan",

    // Kalimantan Timur
    "Samarinda": "Kalimantan Timur",
    "Balikpapan": "Kalimantan Timur",

    // Kalimantan Utara
    "Tarakan": "Kalimantan Utara",

    // Sulawesi Utara
    "Manado": "Sulawesi Utara",
    "Tomohon": "Sulawesi Utara",
    "Bitung": "Sulawesi Utara",

    // Gorontalo
    "Gorontalo": "Gorontalo",

    // Sulawesi Tengah
    "Palu": "Sulawesi Tengah",

    // Sulawesi Barat
    "Mamuju": "Sulawesi Barat",

    // Sulawesi Selatan
    "Makassar": "Sulawesi Selatan",
    "Parepare": "Sulawesi Selatan",
    "Palopo": "Sulawesi Selatan",

    // Sulawesi Tenggara
    "Kendari": "Sulawesi Tenggara",
    "Baubau": "Sulawesi Tenggara",

    // Bali
    "Denpasar": "Bali",
    "Gianyar": "Bali",
    "Ubud": "Bali",

    // Nusa Tenggara Barat
    "Lombok": "Nusa Tenggara Barat",
    "Mataram": "Nusa Tenggara Barat",

    // Nusa Tenggara Timur
    "Kupang": "Nusa Tenggara Timur",
    "Ende": "Nusa Tenggara Timur",

    // Maluku
    "Ambon": "Maluku",

    // Maluku Utara
    "Ternate": "Maluku Utara",
    "Tidore": "Maluku Utara",

    // Papua
    "Jayapura": "Papua",

    // Papua Barat
    "Manokwari": "Papua Barat",

    // Papua Selatan
    "Merauke": "Papua Selatan",

    // Papua Tengah
    "Nabire": "Papua Tengah",

    // Papua Pegunungan
    "Wamena": "Papua Pegunungan",

    // Papua Barat Daya
    // Papua Barat Daya
    "Sorong": "Papua Barat Daya",

    // Broad Region Mappings (Distributing generic origins to representative provinces)
    "Jawa": "Jawa Tengah", // Representation of Javanese culture
    "Sumatera": "Sumatera Barat", // Dominant culinary influence
    "Sulawesi": "Sulawesi Selatan", // Dominant culinary influence (Makassar)
    "Kalimantan": "Kalimantan Selatan", // Representative
    "Nasional": "DKI Jakarta", // Melting pot / Capital
    "Indonesia": "DKI Jakarta",
    "Nusa Tenggara": "Nusa Tenggara Barat",
    "Maluku-Papua": "Maluku",
    "Sumatera Selatan (Palembang)": "Sumatera Selatan",
    "NTB": "Nusa Tenggara Barat",
    "NTT": "Nusa Tenggara Timur",
    "Bangka": "Bangka Belitung",
    "India–Indonesia": "DKI Jakarta",
    "India-Indonesia": "DKI Jakarta",
    "DIY": "DI Yogyakarta"
};

/**
 * Helper function to normalize region names
 * Ensures consistent casing and spacing
 */
export function normalizeRegionName(name: string): string {
    // Remove content within parentheses, e.g. "Sumatera Selatan (Palembang)" -> "Sumatera Selatan"
    let normalized = name.replace(/\s*\(.*?\)\s*/g, '').trim();

    normalized = normalized.replace(/\s+/g, ' ').trim();

    // Special case: Bangka Belitung often referred without "Kepulauan"
    // But Kepulauan Riau MUST be distinct from Riau
    if (normalized.toLowerCase() === 'kepulauan bangka belitung') {
        return 'Bangka Belitung';
    }

    return normalized;
}

/**
 * Helper function to get province from origin
 * Handles "City, Province" format and city-to-province mapping
 */
export function getProvinceFromOrigin(origin: string): string {
    if (!origin) return 'Unknown';

    let regionName = origin;

    // Handle "City, Province" or "Ethnic, Province" format
    if (regionName.includes(',')) {
        const parts = regionName.split(',').map(p => p.trim());
        // Take the last part (province)
        regionName = parts[parts.length - 1];
    }

    // Map city to province if found in mapping
    if (CITY_TO_PROVINCE[regionName]) {
        regionName = CITY_TO_PROVINCE[regionName];
    }

    // Normalize the region name
    regionName = normalizeRegionName(regionName);

    return regionName;
}
