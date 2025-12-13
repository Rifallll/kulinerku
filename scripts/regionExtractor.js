/**
 * Extract specific region from text
 * Returns most specific region found (city > province > island > Indonesia)
 */
function extractRegion(text) {
    const lowerText = text.toLowerCase();

    // Priority 1: Specific cities (most specific)
    const cities = {
        'jakarta': 'Jakarta',
        'bandung': 'Jawa Barat',
        'surabaya': 'Jawa Timur',
        'yogyakarta': 'Yogyakarta',
        'jogja': 'Yogyakarta',
        'semarang': 'Jawa Tengah',
        'solo': 'Jawa Tengah',
        'surakarta': 'Jawa Tengah',
        'medan': 'Sumatra Utara',
        'padang': 'Sumatra Barat',
        'palembang': 'Sumatra Selatan',
        'makassar': 'Sulawesi Selatan',
        'manado': 'Sulawesi Utara',
        'denpasar': 'Bali',
        'malang': 'Jawa Timur',
        'bogor': 'Jawa Barat',
        'depok': 'Jawa Barat',
        'tangerang': 'Banten',
        'bekasi': 'Jawa Barat',
        'aceh': 'Aceh',
        'lampung': 'Lampung',
        'bengkulu': 'Bengkulu',
        'jambi': 'Jambi',
        'riau': 'Riau',
        'pekanbaru': 'Riau',
        'batam': 'Kepulauan Riau',
        'pontianak': 'Kalimantan Barat',
        'banjarmasin': 'Kalimantan Selatan',
        'balikpapan': 'Kalimantan Timur',
        'samarinda': 'Kalimantan Timur',
        'palu': 'Sulawesi Tengah',
        'kendari': 'Sulawesi Tenggara',
        'gorontalo': 'Gorontalo',
        'ambon': 'Maluku',
        'ternate': 'Maluku Utara',
        'jayapura': 'Papua',
        'mataram': 'Nusa Tenggara Barat',
        'kupang': 'Nusa Tenggara Timur'
    };

    for (const [city, province] of Object.entries(cities)) {
        if (lowerText.includes(city)) {
            return province;
        }
    }

    // Priority 2: Provinces
    const provinces = [
        'Jawa Barat', 'Jawa Tengah', 'Jawa Timur',
        'Sumatra Utara', 'Sumatra Barat', 'Sumatra Selatan',
        'Sulawesi Selatan', 'Sulawesi Utara', 'Sulawesi Tengah', 'Sulawesi Tenggara',
        'Kalimantan Barat', 'Kalimantan Selatan', 'Kalimantan Timur', 'Kalimantan Tengah', 'Kalimantan Utara',
        'Bali', 'Yogyakarta', 'Banten', 'Aceh', 'Lampung', 'Bengkulu', 'Jambi', 'Riau', 'Kepulauan Riau',
        'Nusa Tenggara Barat', 'Nusa Tenggara Timur', 'Maluku', 'Maluku Utara', 'Papua', 'Papua Barat',
        'Gorontalo', 'Sulawesi Barat'
    ];

    for (const province of provinces) {
        if (lowerText.includes(province.toLowerCase())) {
            return province;
        }
    }

    // Priority 3: Islands (less specific)
    const islands = {
        'jawa': 'Jawa',
        'java': 'Jawa',
        'sumatra': 'Sumatra',
        'sumatera': 'Sumatra',
        'sulawesi': 'Sulawesi',
        'celebes': 'Sulawesi',
        'kalimantan': 'Kalimantan',
        'borneo': 'Kalimantan',
        'bali': 'Bali',
        'papua': 'Papua',
        'maluku': 'Maluku',
        'nusa tenggara': 'Nusa Tenggara'
    };

    for (const [island, name] of Object.entries(islands)) {
        if (lowerText.includes(island)) {
            return name;
        }
    }

    // Default
    return 'Indonesia';
}

module.exports = { extractRegion };
