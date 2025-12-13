import { createClient } from '@supabase/supabase-js';

// Initialize Supabase
const supabaseUrl = 'https://mkhtlzmjdsjfrzinxnzp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1raHRsem1qZHNqZnJ6aW54bnpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM0NTYxODksImV4cCI6MjA0OTAzMjE4OX0.gTk_0NfBYE0fzN53K79gxN1h-uU3FZWzKzxJiCM0YYU';
const supabase = createClient(supabaseUrl, supabaseKey);

// Mapping makanan khas ke kota/kabupaten asalnya
const foodOriginMapping = {
    // Banten
    "Emping": "Pandeglang",
    "Sate Bandeng": "Serang",
    "Rabeg": "Serang",
    "Nasi Sumsum": "Serang",
    "Pasung": "Lebak",
    "Angeun Lada": "Serang",

    // Jawa Barat
    "Batagor": "Bandung",
    "Seblak": "Bandung",
    "Surabi": "Bandung",
    "Mie Kocok": "Bandung",
    "Peuyeum": "Bandung",
    "Lotek": "Bandung",
    "Cireng": "Bandung",
    "Nasi Timbel": "Bandung",
    "Gepuk": "Tasikmalaya",
    "Karedok": "Bandung",
    "Oncom": "Tasikmalaya",
    "Nasi Tutug Oncom": "Tasikmalaya",
    "Colenak": "Bandung",
    "Mochi": "Sukabumi",
    "Dodol Garut": "Garut",
    "Opak Bakar": "Subang",
    "Soto Bandung": "Bandung",
    "Nasi Lengko": "Cirebon",
    "Empal Gentong": "Cirebon",
    "Tahu Gejrot": "Cirebon",
    "Docang": "Cirebon",

    // Jawa Tengah
    "Lumpia": "Semarang",
    "Wingko Babat": "Semarang",
    "Bandeng Presto": "Semarang",
    "Tahu Gimbal": "Semarang",
    "Soto Kudus": "Kudus",
    "Jenang Kudus": "Kudus",
    "Garang Asem": "Semarang",
    "Serabi Solo": "Solo",
    "Selat Solo": "Solo",
    "Nasi Liwet": "Solo",
    "Timlo": "Solo",
    "Cabuk Rambak": "Solo",
    "Sate Buntel": "Solo",
    "Tengkleng": "Solo",
    "Gudeg": "Yogyakarta",
    "Bakpia": "Yogyakarta",
    "Yangko": "Pekalongan",
    "Megono": "Pekalongan",
    "Mendoan": "Purwokerto",
    "Sroto Sokaraja": "Purwokerto",
    "Getuk": "Magelang",
    "Kupat Tahu": "Magelang",

    // Jawa Timur
    "Rawon": "Surabaya",
    "Rujak Cingur": "Surabaya",
    "Lontong Balap": "Surabaya",
    "Sate Klopo": "Surabaya",
    "Tahu Tek": "Surabaya",
    "Lontong Kupang": "Sidoarjo",
    "Pecel Madiun": "Madiun",
    "Soto Lamongan": "Lamongan",
    "Tahu Campur": "Lamongan",
    "Bakso Malang": "Malang",
    "Cwie Mie Malang": "Malang",
    "Arem-arem": "Malang",
    "Rawon Setan": "Malang",
    "Pecel Pincuk": "Blitar",
    "Sate Ayam Ponorogo": "Ponorogo",
    "Dawet Ireng": "Banjarnegara",
    "Tahu Kupat": "Madiun",
    "Nasi Pecel": "Madiun",

    // Sumatera Barat
    "Rendang": "Padang",
    "Sate Padang": "Padang",
    "Gulai": "Padang",
    "Dendeng Balado": "Padang",
    "Soto Padang": "Padang",
    "Dadiah": "Bukittinggi",
    "Lamang": "Bukittinggi",
    "Kapau": "Bukittinggi",

    // Sumatera Utara
    "Bika Ambon": "Medan",
    "Saksang": "Medan",
    "Arsik": "Tapanuli",
    "Mie Gomak": "Medan",
    "Babi Panggang Karo": "Kabanjahe",

    // Sulawesi Selatan
    "Coto Makassar": "Makassar",
    "Konro": "Makassar",
    "Pallubasa": "Makassar",
    "Pisang Epe": "Makassar",
    "Jalangkote": "Makassar",
    "Barongko": "Makassar",

    // Bali
    "Babi Guling": "Denpasar",
    "Lawar": "Denpasar",
    "Sate Lilit": "Denpasar",
    "Bebek Betutu": "Gianyar",
    "Jukut Ares": "Denpasar",
    "Tipat Cantok": "Denpasar",
};

// Function to normalize food name for matching
function normalizeName(name) {
    return name
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .trim();
}

// Main function to update origins
async function updateFoodOrigins() {
    console.log('🔍 Fetching all food items...');

    const { data: foods, error } = await supabase
        .from('food_items')
        .select('id, name, origin');

    if (error) {
        console.error('❌ Error fetching foods:', error);
        return;
    }

    console.log(`✅ Found ${foods?.length} food items`);

    let updatedCount = 0;
    const updates = [];

    for (const food of foods || []) {
        const normalizedName = normalizeName(food.name);

        // Check if food matches any in our mapping
        for (const [foodKey, cityOrigin] of Object.entries(foodOriginMapping)) {
            const normalizedKey = normalizeName(foodKey);

            if (normalizedName.includes(normalizedKey) || normalizedKey.includes(normalizedName)) {
                // Update the origin
                const { error: updateError } = await supabase
                    .from('food_items')
                    .update({ origin: cityOrigin })
                    .eq('id', food.id);

                if (updateError) {
                    console.error(`❌ Error updating ${food.name}:`, updateError);
                } else {
                    updatedCount++;
                    updates.push({
                        id: food.id,
                        name: food.name,
                        oldOrigin: food.origin,
                        newOrigin: cityOrigin
                    });
                    console.log(`✅ Updated: "${food.name}" from "${food.origin}" → "${cityOrigin}"`);
                }

                break; // Stop checking other mappings once matched
            }
        }
    }

    console.log(`\n🎉 Update complete! Updated ${updatedCount} food items.`);
    console.log('\n📋 Summary of updates:');
    updates.forEach(u => {
        console.log(`   "${u.name}": ${u.oldOrigin} → ${u.newOrigin}`);
    });
}

// Run the update
updateFoodOrigins().catch(console.error);
