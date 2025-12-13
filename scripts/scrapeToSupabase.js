
import axios from 'axios';
import * as cheerio from 'cheerio';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const WIKI_URL = 'https://en.wikipedia.org/wiki/List_of_Indonesian_dishes';

async function scrapeFoods() {
    console.log(`Starting scrape from ${WIKI_URL}...`);
    try {
        const { data } = await axios.get(WIKI_URL, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5'
            }
        });
        const $ = cheerio.load(data);
        const foods = [];

        // Helper to categorize
        const determineCategory = (name, type, desc) => {
            const lowerName = name.toLowerCase();
            const lowerType = type.toLowerCase();
            const lowerDesc = desc.toLowerCase();

            if (lowerType.includes('beverage') || lowerType.includes('drink') || lowerDesc.includes('drink') || lowerDesc.includes('beverage') || lowerName.includes('es ') || lowerName.includes('wedang') || lowerName.includes('jus') || lowerName.includes('kopi') || lowerName.includes('teh')) return 'Minuman';
            if (lowerType.includes('snack') || lowerType.includes('dessert') || lowerType.includes('kue') || lowerType.includes('cake') || lowerType.includes('street food') || lowerDesc.includes('snack') || lowerDesc.includes('cookie') || lowerDesc.includes('pastry')) return 'Jajanan & Makanan Ringan';
            if (lowerType.includes('soup') || lowerType.includes('soto') || lowerName.includes('soto') || lowerName.includes('sup') || lowerName.includes('sop') || lowerName.includes('rawon')) return 'Sup & Soto';
            if (lowerType.includes('rice') || lowerName.includes('nasi') || lowerName.includes('lontong') || lowerName.includes('ketupat')) return 'Hidangan Nasi';
            if (lowerType.includes('noodle') || lowerName.includes('mie') || lowerName.includes('mi ') || lowerName.includes('bihun') || lowerName.includes('kwetiau')) return 'Mie & Pasta';
            if (lowerType.includes('sambal') || lowerType.includes('sauce') || lowerName.includes('sambal') || lowerName.includes('saus')) return 'Sambal & Saus';
            if (lowerType.includes('chicken') || lowerName.includes('ayam') || lowerName.includes('bebek')) return 'Olahan Ayam & Unggas';
            if (lowerType.includes('satay') || lowerName.includes('sate')) return 'Sate';

            // Default fallbacks
            if (lowerType.includes('dish') || lowerType.includes('main course')) return 'Hidangan Utama';

            return 'Lainnya';
        };

        // User-defined specific mapping
        const FOOD_SPECIFIC_MAP = {
            // 1. Nasi & Pokok
            "Bihun": "Indonesia",
            "Ketan": "Jawa Barat",
            "Ketupat": "Indonesia",
            "Kwetiau": "Indonesia",
            "Lontong": "Indonesia",
            "Nasi putih": "Indonesia",
            "Papeda": "Papua",
            "Perkedel": "Indonesia",
            "Perkedel jagung": "Jawa Tengah",
            "Nasi bakar": "Jawa Tengah",
            "Nasi campur": "Bali",
            "Nasi rames": "Jawa Tengah",
            "Nasi goreng": "Jawa Tengah",
            "Nasi kari": "Sumatera Utara",
            "Nasi kuning": "Jawa Tengah",
            "Tumpeng": "Jawa Tengah",

            // 2. Ayam
            "Gulai ayam": "Sumatera Barat",
            "Kari ayam": "Aceh",
            "Kari kambing": "Aceh",
            "Opor ayam": "Jawa Tengah",
            "Ayam bakar": "Jawa Barat",
            "Ayam cincane": "Samarinda, Kalimantan Timur",
            "Ayam goreng": "Jawa Tengah",
            "Ayam kodok": "Jakarta, DKI Jakarta",
            "Ayam pansuh": "Kalimantan Barat",
            "Ayam tandori": "DELETE",

            // 3. Ikan & Seafood
            "Ikan asin": "Indonesia",
            "Ikan bakar": "Indonesia",
            "Ikan goreng": "Indonesia",
            "Pepes": "Jawa Barat",
            "Bakso ikan": "Makassar, Sulawesi Selatan",
            "Otak-otak": "Palembang, Sumatera Selatan",

            // 4. Sate
            "Sate": "Madura, Jawa Timur",
            "Sate kambing": "Jawa Tengah",
            "Sate Madura": "Madura, Jawa Timur",
            "Sate udang": "Indonesia",

            // 5. Tahu & Tempe
            "Tahu": "Indonesia",
            "Tahu goreng": "Jawa Tengah",
            "Tempe": "Jawa Tengah",
            "Burger tempe": "Jawa Tengah",
            "Yong tau fu": "DELETE",

            // 6. Bubur
            "Bubur kacang hijau": "Jawa Timur",
            "Bubur ketan hitam": "Jawa Tengah",
            "Bubur sumsum": "Jawa Tengah",
            "Bubur pedas": "Sambas, Kalimantan Barat",

            // 7. Mie
            "Bakmi": "Indonesia",
            "Bihun goreng": "Indonesia",
            "Mie kering": "Makassar, Sulawesi Selatan",
            "Kwetiau goreng": "Indonesia",
            "Mi bakso": "Wonogiri, Jawa Tengah",
            "Mi kuah": "Indonesia",
            "Soto mi": "Bogor, Jawa Barat",
            "Mi goreng": "Indonesia",
            "Laksa": "Jawa Barat",
            "Jamur": "DELETE",

            // 8. Sup & Soto
            "Brenebon": "Manado, Sulawesi Utara",
            "Marak": "DELETE",
            "Saltah": "DELETE",
            "Sayur asem": "Jawa Barat",
            "Sayur bayam": "Jawa Tengah",
            "Sayur lodeh": "Jawa Tengah",
            "Sayur sop": "Indonesia",
            "Semur": "Jakarta, DKI Jakarta",
            "Soto": "Lamongan, Jawa Timur",
            "Soto ayam": "Lamongan, Jawa Timur",
            "Sup ayam": "Indonesia",
            "Sup ercis": "Manado, Sulawesi Utara",
            "Sup kambing": "Jakarta, DKI Jakarta",
            "Sup krim ayam": "Indonesia",
            "Sup wortel": "Indonesia",
            "Sayur oyong": "Indonesia",
            "Kidu": "DELETE",

            // 9. Tumisan
            "Mobil": "Jakarta, DKI Jakarta",
            "Cah kangkung": "Indonesia",
            "Pondok": "Jakarta, DKI Jakarta",
            "Kangkung belacan": "Medan, Sumatera Utara",
            "Rujak": "Jawa Timur",

            // 10. Roti & Kue
            "Bakpau": "Indonesia",
            "Bolu gulung": "Indonesia",
            "Bolu kukus": "Jawa Tengah",
            "Bolu pandan": "Jawa Barat",
            "Roti bakar": "Jakarta, DKI Jakarta",
            "Roti bolen": "Bandung, Jawa Barat",
            "Roti lapis tempe": "Jawa Tengah",
            "Roti meses": "Indonesia",
            "Roti pita": "DELETE",
            "Oliebol": "DELETE",
            "Naan": "DELETE",
            "Ontbijtkoek": "DELETE",
            "Pannenkoek": "DELETE",
            "Roti chapati": "DELETE",

            // 11. Gorengan & Camilan
            "Bakwan": "Jawa Tengah",
            "Bitterballen": "DELETE",
            "Donat kentang": "Jawa Tengah",
            "Kroket": "DELETE",
            "Kuaci": "DELETE",
            "Lumpia": "Semarang, Jawa Tengah",
            "Martabak": "Sumatera Selatan",
            "Nagasari": "Jawa Tengah",
            "Pastel": "Jawa Tengah",
            "Pastel tutup": "Jawa Tengah",
            "Pisang goreng": "Indonesia",
            "Risol": "Jakarta, DKI Jakarta",
            "Sumpia": "Jawa Tengah",

            // 12. Kue Tradisional
            "Klepon": "Jawa Tengah",
            "Kue busa": "Indonesia",
            "Kue kaak": "Sumatera Utara",
            "Kue lidah kucing": "Indonesia",
            "Kue putri salju": "Indonesia",
            "Kue sus": "Indonesia",
            "Kukis jagung": "Jawa Tengah",
            "Lapis legit": "Lampung",
            "Nastar": "Indonesia",
            "Onde-onde": "Mojokerto, Jawa Timur",
            "Semprong": "Jakarta, DKI Jakarta",
            "Spekulaas": "DELETE",
            "Wafel Stroop": "DELETE",
            "Bibingka": "Ambon, Maluku",
            "Clorot": "Jawa Tengah",
            "Dadar gulung": "Jawa Barat",
            "Kaasstengels": "DELETE",
            "Terang bulan": "Bangka Belitung",
            "Wajik": "Jawa Tengah",

            // 13. Kerupuk
            "Emping": "Banten",
            "Keripik": "Indonesia",
            "Keripik pisang": "Lampung",
            "Kerupuk": "Sidoarjo, Jawa Timur",
            "Kerupuk kulit": "Jawa Barat",
            "Kerupuk ikan": "Palembang, Sumatera Selatan",
            "Kerupuk udang": "Sidoarjo, Jawa Timur",
            "Rempeyek": "Jawa Tengah",
            "Rengginang": "Jawa Barat",

            // 14. Minuman & Dessert
            "Agar-agar": "Indonesia",
            "Es lilin": "Jawa Barat",
            "Kolak": "Jawa Tengah",
            "Kue cubit": "Jakarta, DKI Jakarta",
            "Kue cucur": "Jakarta, DKI Jakarta",
            "Kue lapis": "Jawa Tengah",
            "Kue lumpur surga": "Banjarmasin, Kalimantan Selatan",
            "Kue putu": "Jawa Tengah",
            "Nata de coco": "Jawa Timur",
            "Poffertjes": "DELETE",
            "Putu mangkok": "Jawa Tengah",
            "Tapai": "Jawa Barat",
            "Cincau": "Jawa Barat",

            // 15. Saus & Pelengkap
            "Abon": "Jawa Tengah",
            "Bawang goreng": "Palu, Sulawesi Tengah",
            "Bumbu kacang": "Jawa Timur",
            "Hagelslag": "Indonesia",
            "Meises": "Indonesia",
            "Kecap manis": "Jawa Barat",
            "Kecap asin": "Jawa Barat",
            "Mayones": "DELETE",
            "Muisjes": "DELETE",
            "Sambal": "Indonesia",
            "Sambal goreng teri": "Jawa Tengah",
            "Saus tiram": "DELETE",
            "Selai kacang": "Indonesia",
            "Selai serikaya": "Medan, Sumatera Utara",
            "Tauco": "Cianjur, Jawa Barat",
            "Terasi": "Cirebon, Jawa Barat",
            "Edam": "DELETE"
        };

        // Helper to normalize regions using strict User Mapping, checking Name and Description
        const detectRegion = (regionRaw, name, description) => {
            const PROVINCE_MAP = {
                "Aceh": ["Banda Aceh", "Sabang", "Lhokseumawe", "Langsa", "Subulussalam", "Aceh", "Gayo"],
                "Sumatera Utara": ["Medan", "Binjai", "Tebing Tinggi", "Pematangsiantar", "Tanjungbalai", "Padangsidimpuan", "Gunungsitoli", "Sibolga", "Tapanuli", "Batak", "Karo", "North Sumatra", "Sumatra", "Sumatera Utara", "Sumut", "Nias", "Mandailing", "Simalungun"],
                "Sumatera Barat": ["Padang", "Bukittinggi", "Padang Panjang", "Pariaman", "Payakumbuh", "Sawahlunto", "Solok", "Minang", "Minangkabau", "West Sumatra", "Sumatera Barat", "Sumbar", "Rendang", "Kapau"],
                "Riau": ["Pekanbaru", "Dumai", "Malay", "Melayu", "Riau"],
                "Kepulauan Riau": ["Batam", "Tanjungpinang", "Kepulauan Riau", "Kepri", "Natuna", "Anambas"],
                "Jambi": ["Sungai Penuh", "Kerinci", "Jambi"],
                "Sumatera Selatan": ["Palembang", "Pagar Alam", "Lubuklinggau", "Prabumulih", "South Sumatra", "Sumatera Selatan", "Sumsel", "Musi"],
                "Kepulauan Bangka Belitung": ["Pangkalpinang", "Bangka", "Belitung"],
                "Bengkulu": ["Bengkulu"],
                "Lampung": ["Bandar Lampung", "Metro", "Lampung"],
                "Banten": ["Serang", "Tangerang", "Cilegon", "Banten"],
                "DKI Jakarta": ["Jakarta", "Betawi", "DKI", "Chinese", "Tionghoa", "Peranakan", "Batavia", "Sunda Kelapa", "Menteng"],
                "Jawa Barat": ["Bandung", "Bekasi", "Depok", "Bogor", "Cimahi", "Sukabumi", "Tasikmalaya", "Banjar", "Cirebon", "Sunda", "West Java", "Barat Java", "Jawa Barat", "Jabar", "Priangan", "Cianjur", "Garut", "Indramayu", "Karawang", "Kuningan", "Majalengka", "Pangandaran", "Purwakarta", "Subang", "Sumedang"],
                "Jawa Tengah": ["Semarang", "Surakarta", "Solo", "Salatiga", "Magelang", "Pekalongan", "Tegal", "Banyumas", "Kudus", "Jepara", "Central Java", "Tengah Java", "Jawa Tengah", "Jateng", "Boyolali", "Brebes", "Cilacap", "Demak", "Grobogan", "Karanganyar", "Kebumen", "Kendal", "Klaten", "Pati", "Pemalang", "Purbalingga", "Purworejo", "Rembang", "Sragen", "Sukoharjo", "Temanggung", "Wonogiri", "Wonosobo"],
                "DI Yogyakarta": ["Yogyakarta", "Jogja", "Yogya", "Sleman", "Bantul", "Gunung Kidul", "Kulon Progo", "Mataram"],
                "Jawa Timur": ["Surabaya", "Malang", "Batu", "Madiun", "Kediri", "Blitar", "Mojokerto", "Pasuruan", "Probolinggo", "Madura", "Banyuwangi", "East Java", "Timur Java", "Jawa Timur", "Jatim", "Bangkalan", "Bondowoso", "Gresik", "Jember", "Jombang", "Lamongan", "Lumajang", "Magetan", "Nganjuk", "Ngawi", "Pacitan", "Pamekasan", "Ponorogo", "Sampang", "Sidoarjo", "Situbondo", "Sumenep", "Trenggalek", "Tuban", "Tulungagung"],
                "Bali": ["Denpasar", "Bali", "Badung", "Bangli", "Buleleng", "Gianyar", "Jembrana", "Karangasem", "Klungkung", "Tabanan", "Betutu"],
                "Nusa Tenggara Barat": ["Mataram", "Bima", "Lombok", "Sumbawa", "Nusa Tenggara Barat", "NTB", "Sasak", "Dompu"],
                "Nusa Tenggara Timur": ["Kupang", "Flores", "Sumba", "Timor", "Nusa Tenggara Timur", "NTT", "Alor", "Belu", "Ende", "Rote", "Sabu"],
                "Kalimantan Barat": ["Pontianak", "Singkawang", "West Kalimantan", "Kalimantan Barat", "Kalbar", "Sambas", "Ketapang"],
                "Kalimantan Tengah": ["Palangka Raya", "Central Kalimantan", "Kalimantan Tengah", "Kalteng", "Dayak"],
                "Kalimantan Selatan": ["Banjarmasin", "Banjarbaru", "Banjar", "South Kalimantan", "Kalimantan Selatan", "Kalsel"],
                "Kalimantan Timur": ["Samarinda", "Balikpapan", "Bontang", "Kutai", "East Kalimantan", "Kalimantan Timur", "Kaltim"],
                "Kalimantan Utara": ["Tarakan", "North Kalimantan", "Kalimantan Utara", "Kaltara", "Nunukan"],
                "Sulawesi Utara": ["Manado", "Tomohon", "Bitung", "Kotamobagu", "Minahasa", "North Sulawesi", "Sulawesi Utara", "Sulut"],
                "Sulawesi Tengah": ["Palu", "Donggala", "Central Sulawesi", "Sulawesi Tengah", "Sulteng", "Poso", "Luwuk"],
                "Sulawesi Selatan": ["Makassar", "Parepare", "Palopo", "Toraja", "Bugis", "South Sulawesi", "Sulawesi Selatan", "Sulsel", "Gowa", "Bone"],
                "Sulawesi Tenggara": ["Kendari", "Baubau", "Southeast Sulawesi", "Sulawesi Tenggara", "Sultra", "Wakatobi", "Buton"],
                "Gorontalo": ["Gorontalo"],
                "Maluku": ["Ambon", "Tual", "Maluku", "Moluccas", "Buru", "Seram"],
                "Maluku Utara": ["Ternate", "Tidore", "Maluku Utara", "Halmahera"],
                "Papua": ["Jayapura", "Papua", "Asmat", "Biak", "Merauke", "Nabire"],
                "Papua Barat": ["Sorong", "Manokwari", "Papua Barat", "Raja Ampat", "Fakfak"]
            };

            // Heuristic Function to check text against map
            const checkText = (text) => {
                if (!text) return null;
                const lower = text.toLowerCase();

                for (const [province, keywords] of Object.entries(PROVINCE_MAP)) {
                    // Sort keywords by length to match Specific first
                    const sortedKeywords = [...keywords].sort((a, b) => b.length - a.length);

                    for (const keyword of sortedKeywords) {
                        if (lower.includes(keyword.toLowerCase())) {
                            // Exclusion checks
                            if (keyword === 'Java' && (lower.includes('west java') || lower.includes('east java') || lower.includes('central java'))) continue;
                            if (keyword === 'Sumatra' && (lower.includes('north sumatra') || lower.includes('west sumatra') || lower.includes('south sumatra'))) continue;
                            if (keyword === 'Banjar' && (lower.includes('banjarmasin') || lower.includes('banjarbaru'))) continue;

                            const isAlias = ['Sumatra', 'Java', 'Celebes', 'Borneo', 'Sulawesi', 'Kalimantan', 'Jawa', 'Sumatera', 'Nusa Tenggara', 'Maluku', 'Papua', 'Jabar', 'Jateng', 'Jatim', 'Sulsel', 'Sulut', 'Sulteng', 'Sultra', 'Kalbar', 'Kalteng', 'Kalsel', 'Kaltim', 'Kaltara', 'Sumut', 'Sumbar', 'Sumsel', 'NTB', 'NTT', 'DIY', 'DKI', 'Kepri', 'Babel', 'Indonesia', 'Nusantara',
                                'West Java', 'Central Java', 'East Java', 'North Sumatra', 'West Sumatra', 'South Sumatra', 'North Sulawesi', 'South Sulawesi', 'Southeast Sulawesi', 'Central Sulawesi', 'West Kalimantan', 'Central Kalimantan', 'South Kalimantan', 'East Kalimantan', 'North Kalimantan', 'South East Sulawesi'].some(k => k.toLowerCase() === keyword.toLowerCase());

                            // Exception for Bika Ambon -> it is from Medan (North Sumatra), not Ambon (Maluku)
                            if (text.toLowerCase().includes('bika ambon') && province === 'Maluku') return null;

                            if (!isAlias) {
                                // Re-capitalize keyword properly from detection
                                return `${keyword.charAt(0).toUpperCase() + keyword.slice(1)}, ${province}`;
                            }
                            return province;
                        }
                    }
                }
                return null;
            }

            // basic cleaning to remove Wiki artifacts
            let cleanRegion = regionRaw ? regionRaw.replace(/\[.*?\]/g, '').replace(/[\(\)]/g, '').replace(/\n/g, '').trim() : "Indonesia";

            // 1. Check Region Column
            let result = checkText(cleanRegion);
            if (result && result !== "Indonesia") return result;

            // 2. Check Name associated with food (very high confidence)
            result = checkText(name);
            if (result && result !== "Indonesia") return result;

            // 3. Check Description (lower confidence, might mention other places)
            result = checkText(description);
            if (result && result !== "Indonesia") return result;

            // Final fallbacks for generic
            const lowerRaw = (cleanRegion + " " + name).toLowerCase();
            if (lowerRaw.includes('java') || lowerRaw.includes('jawa')) return "Jawa Tengah";
            if (lowerRaw.includes('sunda')) return "Jawa Barat";
            if (lowerRaw.includes('betawi')) return "Jakarta, DKI Jakarta";
            if (lowerRaw.includes('minang') || lowerRaw.includes('padang')) return "Padang, Sumatera Barat";
            if (lowerRaw.includes('batak')) return "Medan, Sumatera Utara";
            if (lowerRaw.includes('bali')) return "Bali";
            if (lowerRaw.includes('sumatra') || lowerRaw.includes('sumatera')) return "Sumatera Utara";

            return "Indonesia";
        };

        // Strategy 1: Look for table rows in "wikitable"
        $('.wikitable tr').each((i, el) => {
            // Skip header
            if ($(el).find('th').length > 0) return;

            const tds = $(el).find('td');
            if (tds.length >= 2) {
                const name = $(tds[0]).text().trim().replace(/\[.*?\]/g, '');
                const imageSrc = $(tds[1]).find('img').attr('src');
                const regionRaw = $(tds[2]).text().trim().replace(/\[.*?\]/g, '') || "Indonesia";
                const typeRaw = $(tds[3]).text().trim() || "Hidangan";
                const description = $(tds[4]).text().trim() || "";

                if (name) {
                    // CHECK SPECIFIC MAP FIRST
                    // Normalize name match?
                    let specificRegion = FOOD_SPECIFIC_MAP[name];

                    if (!specificRegion) {
                        const matchKey = Object.keys(FOOD_SPECIFIC_MAP).find(k => k.toLowerCase() === name.toLowerCase());
                        if (matchKey) specificRegion = FOOD_SPECIFIC_MAP[matchKey];
                        // Also try to match substring for some generic items?? No, safer to leave it unless explicit.
                    }

                    if (specificRegion === "DELETE") {
                        // console.log(`Skipping ${name} (Deleted per user list)`);
                        return;
                    }

                    const category = determineCategory(name, typeRaw, description);

                    // Pass Name and Description to detection logic OR use specific
                    const region = specificRegion || detectRegion(regionRaw, name, description);

                    if (region === "DELETE") return;

                    if (category === 'Lainnya') return;

                    // Force delete any "Western" or "Non-Indo" detected via simple text check if somehow missed
                    // e.g. "Pizza"
                    if (['pizza', 'burger', 'spaghetti', 'sushi', 'steak'].some(x => name.toLowerCase().includes(x)) && !name.toLowerCase().includes('tempe')) return;


                    foods.push({
                        name,
                        imageUrl: imageSrc ? `https:${imageSrc}` : null,
                        region: region,
                        type: category, // Use our determined category as 'type' for the schema
                        originalType: typeRaw,
                        description,
                        rating: (Math.random() * (5.0 - 4.0) + 4.0).toFixed(1)
                    });
                }
            }
        });

        console.log(`Found ${foods.length} items from tables.`);

        // If tables yielded few results, fallback or add list items
        if (foods.length < 50) {
            console.log("Tables yielded few items, trying lists...");
            $('li').each((i, el) => {
                const text = $(el).text();
                // Heuristic: items often look like "Name - Description"
                if (text.includes(' - ')) {
                    const parts = text.split(' - ');
                    if (parts.length >= 2 && parts[0].length < 50) {
                        const name = parts[0].trim();
                        const desc = parts[1].trim();
                        // Simple heuristics for list items
                        let cat = 'Hidangan';
                        if (name.toLowerCase().includes('es ') || name.toLowerCase().includes('wedang')) cat = 'Minuman';

                        // Try detect region from name/desc
                        const region = detectRegion("Indonesia", name, desc);

                        foods.push({
                            name: name,
                            imageUrl: null,
                            region: region,
                            type: cat,
                            description: desc,
                            rating: 4.5
                        });
                    }
                }
            });
        }

        console.log(`Total items scraping candidates: ${foods.length}`);

        // Clean and Limit to unique names
        const uniqueFoods = Array.from(new Map(foods.map(item => [item.name, item])).values());
        console.log(`Unique items: ${uniqueFoods.length}`);

        // Insert into Supabase
        console.log("Clearing existing data...");
        // DISABLED: Don't delete existing data, only add new ones
        // const { error: deleteError } = await supabase.from('food_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        // if (deleteError) {
        //     console.error("Error clearing data:", deleteError);
        //     // Continuing might fail if constraints logic, but we try
        // } else {
        //     console.log("Data cleared.");
        // }
        console.log("Skipping delete - will add to existing data");

        console.log("Inserting new data to Supabase...");

        // Process in batches
        const BATCH_SIZE = 50;
        for (let i = 0; i < uniqueFoods.length; i += BATCH_SIZE) {
            const batch = uniqueFoods.slice(i, i + BATCH_SIZE).map(f => ({
                name: f.name.slice(0, 100), // Limit length
                type: f.type.slice(0, 50),
                origin: f.region.slice(0, 50),
                rating: parseFloat(f.rating),
                description: f.description.slice(0, 500) || `${f.name} adalah makanan khas Indonesia.`,
                imageUrl: f.imageUrl || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop",
            }));

            // Use INSERT instead of UPSERT to avoid constraint error
            const { error } = await supabase.from('food_items').insert(batch);

            if (error) {
                console.error("Error inserting batch:", error);
            } else {
                console.log(`Inserted batch ${i / BATCH_SIZE + 1}`);
            }
        }

        console.log("Scraping and seeding complete!");

    } catch (err) {
        console.error("Scraping failed:", err);
    }
}

scrapeFoods();
