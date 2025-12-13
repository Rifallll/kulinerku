import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * Add food and beverage items for new Indonesian provinces
 */

const NEW_FOOD_ITEMS = [
    // =============================================
    // SULAWESI BARAT
    // =============================================
    // Makanan
    { name: "Bau Peapi", type: "Hidangan Utama", origin: "Sulawesi Barat", description: "Hidangan tradisional khas Sulawesi Barat dengan cita rasa kaya rempah.", rating: 4.3 },
    { name: "Jepa", type: "Hidangan Utama", origin: "Sulawesi Barat", description: "Makanan khas Mandar berbahan dasar sagu yang disajikan dengan kuah gurih.", rating: 4.2 },
    { name: "Gogos Kambu", type: "Hidangan Utama", origin: "Sulawesi Barat", description: "Hidangan ikan khas Sulawesi Barat dengan bumbu rempah tradisional.", rating: 4.4 },
    { name: "Kue Tetu", type: "Kue & Jajanan", origin: "Sulawesi Barat", description: "Kue tradisional Mandar dengan tekstur lembut dan rasa manis.", rating: 4.1 },
    { name: "Pappuda", type: "Hidangan Utama", origin: "Sulawesi Barat", description: "Masakan khas Mandar yang terbuat dari bahan lokal dengan rasa autentik.", rating: 4.2 },
    { name: "Pelepah Mandar", type: "Kue & Jajanan", origin: "Sulawesi Barat", description: "Jajanan tradisional khas suku Mandar, Sulawesi Barat.", rating: 4.0 },
    // Minuman
    { name: "Sarabba", type: "Minuman", origin: "Sulawesi Barat", description: "Minuman tradisional hangat dari jahe, gula merah, dan santan yang menyegarkan.", rating: 4.5 },
    { name: "Tuak Manis Enau", type: "Minuman", origin: "Sulawesi Barat", description: "Minuman tradisional dari nira enau dengan rasa manis alami.", rating: 4.3 },

    // =============================================
    // SULAWESI TENGGARA
    // =============================================
    // Makanan
    { name: "Sinonggi", type: "Hidangan Utama", origin: "Sulawesi Tenggara", description: "Makanan pokok khas Sulawesi Tenggara berbahan dasar sagu dengan tekstur kenyal.", rating: 4.4 },
    { name: "Kasoami", type: "Hidangan Utama", origin: "Sulawesi Tenggara", description: "Makanan tradisional dari olahan singkong yang disajikan dengan lauk pendamping.", rating: 4.3 },
    { name: "Lapa-Lapa", type: "Kue & Jajanan", origin: "Sulawesi Tenggara", description: "Kue tradisional dari beras ketan yang dibungkus daun kelapa muda.", rating: 4.2 },
    { name: "Kabuto", type: "Hidangan Utama", origin: "Sulawesi Tenggara", description: "Hidangan sayur tradisional khas Sulawesi Tenggara dengan rasa gurih.", rating: 4.1 },
    { name: "Parende Ikan", type: "Hidangan Utama", origin: "Sulawesi Tenggara", description: "Masakan ikan dengan kuah asam pedas khas Sulawesi Tenggara.", rating: 4.5 },
    { name: "Sate Gogos Pokea", type: "Sate", origin: "Sulawesi Tenggara", description: "Sate kerang pokea khas Sulawesi Tenggara dengan bumbu gurih.", rating: 4.4 },
    { name: "Kapusu", type: "Hidangan Utama", origin: "Sulawesi Tenggara", description: "Makanan khas berbahan ubi atau singkong dengan cita rasa tradisional.", rating: 4.2 },
    { name: "Bubur Sagela", type: "Bubur", origin: "Sulawesi Tenggara", description: "Bubur sagu tradisional khas Sulawesi Tenggara dengan rasa manis.", rating: 4.1 },
    // Minuman
    { name: "Jus Patikala", type: "Minuman", origin: "Sulawesi Tenggara", description: "Jus buah patikala segar khas Sulawesi Tenggara dengan rasa manis asam.", rating: 4.3 },
    { name: "Saguer", type: "Minuman", origin: "Sulawesi Tenggara", description: "Minuman tradisional dari nira pohon enau atau aren.", rating: 4.2 },
    { name: "Jus Salak", type: "Minuman", origin: "Sulawesi Tenggara", description: "Minuman segar dari buah salak lokal yang kaya rasa.", rating: 4.1 },
    { name: "Kopi Tolaki Robusta", type: "Minuman", origin: "Sulawesi Tenggara", description: "Kopi robusta khas suku Tolaki dengan cita rasa kuat dan khas.", rating: 4.6 },

    // =============================================
    // MALUKU UTARA
    // =============================================
    // Makanan
    { name: "Gohu Ikan", type: "Hidangan Utama", origin: "Maluku Utara", description: "Sashimi ala Ternate dengan ikan mentah segar dan bumbu khas Maluku.", rating: 4.6 },
    { name: "Woku Komo-Komo", type: "Hidangan Utama", origin: "Maluku Utara", description: "Masakan seafood dengan bumbu woku yang kaya rempah khas Maluku Utara.", rating: 4.5 },
    { name: "Nasi Lapola", type: "Hidangan Utama", origin: "Maluku Utara", description: "Nasi khas Maluku yang dimasak dengan santan dan kacang kenari.", rating: 4.4 },
    { name: "Ikan Bakar Manokwari", type: "Hidangan Utama", origin: "Maluku Utara", description: "Ikan bakar dengan bumbu khas yang juga populer di Papua Barat.", rating: 4.5 },
    { name: "Popeda Maluku Utara", type: "Hidangan Utama", origin: "Maluku Utara", description: "Makanan pokok dari sagu dengan tekstur lengket, disajikan dengan kuah ikan.", rating: 4.3 },
    { name: "Sate Ulat Sagu Maluku", type: "Sate", origin: "Maluku Utara", description: "Sate dari ulat sagu yang kaya protein, makanan khas Papua dan Maluku.", rating: 4.2 },
    { name: "Kue Bagea", type: "Kue & Jajanan", origin: "Maluku Utara", description: "Kue kering khas Maluku berbahan sagu dan kenari dengan rasa renyah.", rating: 4.4 },
    // Minuman
    { name: "Air Guraka", type: "Minuman", origin: "Maluku Utara", description: "Minuman tradisional khas Maluku Utara dengan rasa segar dan unik.", rating: 4.2 },
    { name: "Kopi Gaharu", type: "Minuman", origin: "Maluku Utara", description: "Kopi dengan sentuhan aroma gaharu, minuman premium khas Maluku Utara.", rating: 4.7 },

    // =============================================
    // PAPUA SELATAN (Ibu Kota: Merauke)
    // =============================================
    // Makanan
    { name: "Sagu Sep", type: "Hidangan Utama", origin: "Papua Selatan", description: "Olahan sagu khas Merauke yang disajikan dengan kuah ikan.", rating: 4.3 },
    { name: "Cacing Laut", type: "Hidangan Utama", origin: "Papua Selatan", description: "Hidangan cacing laut yang kaya protein, kuliner eksotis Papua Selatan.", rating: 4.1 },
    { name: "Sagu Lempeng", type: "Hidangan Utama", origin: "Papua Selatan", description: "Sagu yang diproses menjadi lempeng pipih dan dibakar hingga renyah.", rating: 4.2 },
    { name: "Ikan Bungkus", type: "Hidangan Utama", origin: "Papua Selatan", description: "Ikan segar yang dibungkus daun dan dibakar dengan bumbu tradisional.", rating: 4.4 },
    { name: "Keladi Tumbuk", type: "Hidangan Utama", origin: "Papua Selatan", description: "Keladi yang ditumbuk dan disajikan sebagai makanan pokok dengan lauk.", rating: 4.0 },
    // Minuman
    { name: "Es Matoa", type: "Minuman", origin: "Papua Selatan", description: "Es segar dari buah matoa khas Papua dengan rasa manis menyegarkan.", rating: 4.5 },
    { name: "Kopi Lokal Merauke", type: "Minuman", origin: "Papua Selatan", description: "Kopi lokal Merauke dengan cita rasa khas tanah Papua.", rating: 4.4 },

    // =============================================
    // PAPUA TENGAH (Ibu Kota: Nabire)
    // =============================================
    // Makanan
    { name: "Aunu Senebre", type: "Hidangan Utama", origin: "Papua Tengah", description: "Masakan khas Papua dengan ikan dan sayuran yang dibungkus daun.", rating: 4.3 },
    { name: "Papeda", type: "Hidangan Utama", origin: "Papua Tengah", description: "Makanan pokok dari sagu dengan tekstur lengket, disajikan dengan kuah kuning.", rating: 4.4 },
    { name: "Ikan Kuah Kuning", type: "Hidangan Utama", origin: "Papua Tengah", description: "Ikan dengan kuah kunyit khas Papua yang gurih dan sedikit asam.", rating: 4.5 },
    { name: "Martabak Sagu", type: "Kue & Jajanan", origin: "Papua Tengah", description: "Martabak dengan bahan dasar sagu, variasi unik khas Papua Tengah.", rating: 4.2 },
    // Minuman
    { name: "Es Kelapa Muda Nabire", type: "Minuman", origin: "Papua Tengah", description: "Es kelapa muda segar langsung dari kebun Nabire yang menyegarkan.", rating: 4.3 },
    { name: "Jus Buah Merah", type: "Minuman", origin: "Papua Tengah", description: "Jus dari buah merah Papua yang kaya antioksidan dan manfaat kesehatan.", rating: 4.6 },

    // =============================================
    // PAPUA PEGUNUNGAN (Ibu Kota: Wamena)
    // =============================================
    // Makanan
    { name: "Udang Selingkuh", type: "Hidangan Utama", origin: "Papua Pegunungan", description: "Udang air tawar besar khas Wamena dengan cita rasa unik pegunungan.", rating: 4.7 },
    { name: "Petatas", type: "Hidangan Utama", origin: "Papua Pegunungan", description: "Ubi jalar ungu khas Papua Pegunungan, makanan pokok suku Dani.", rating: 4.3 },
    { name: "Bakar Batu", type: "Hidangan Utama", origin: "Papua Pegunungan", description: "Metode memasak tradisional dengan batu panas, menghasilkan daging dan sayur yang lembut.", rating: 4.8 },
    { name: "Keladi Ungu", type: "Hidangan Utama", origin: "Papua Pegunungan", description: "Keladi dengan warna ungu khas pegunungan Papua yang lezat.", rating: 4.2 },
    { name: "Sate Ulat Sagu Wamena", type: "Sate", origin: "Papua Pegunungan", description: "Sate ulat sagu khas Wamena yang kaya protein dan berlemak.", rating: 4.3 },
    // Minuman
    { name: "Kopi Wamena", type: "Minuman", origin: "Papua Pegunungan", description: "Kopi arabika premium dari dataran tinggi Wamena dengan rasa lembut.", rating: 4.8 },
    { name: "Teh Hijau Pegunungan", type: "Minuman", origin: "Papua Pegunungan", description: "Teh hijau dari perkebunan di pegunungan Papua dengan aroma segar.", rating: 4.4 },

    // =============================================
    // PAPUA BARAT DAYA (Ibu Kota: Sorong)
    // =============================================
    // Makanan
    { name: "Ikan Bakar Sorong", type: "Hidangan Utama", origin: "Papua Barat Daya", description: "Ikan bakar segar khas Sorong dengan bumbu rempah lokal.", rating: 4.5 },
    { name: "Kue Lontar", type: "Kue & Jajanan", origin: "Papua Barat Daya", description: "Kue tar telur dengan aroma pandan yang legit dan lembut.", rating: 4.4 },
    { name: "Roti Abon Gulung", type: "Kue & Jajanan", origin: "Papua Barat Daya", description: "Roti gulung dengan isian abon yang gurih dan lezat.", rating: 4.3 },
    { name: "Keripik Keladi", type: "Kue & Jajanan", origin: "Papua Barat Daya", description: "Keripik dari keladi dengan rasa renyah dan gurih khas Papua.", rating: 4.2 },
    { name: "Keripik Sukun", type: "Kue & Jajanan", origin: "Papua Barat Daya", description: "Keripik sukun renyah, camilan populer dari Papua Barat Daya.", rating: 4.1 },
    // Minuman
    { name: "Es Mangga Sorong", type: "Minuman", origin: "Papua Barat Daya", description: "Es mangga segar dari buah mangga lokal Sorong yang manis.", rating: 4.4 },
    { name: "Air Tebu Segar", type: "Minuman", origin: "Papua Barat Daya", description: "Minuman segar dari perasan tebu murni khas Papua Barat Daya.", rating: 4.3 },
];

async function addNewFoodItems() {
    console.log('\n🍽️  ADDING NEW FOOD ITEMS FOR NEW PROVINCES');
    console.log('='.repeat(60));

    try {
        // Check existing items to avoid duplicates
        const { data: existingItems, error: fetchError } = await supabase
            .from('food_items')
            .select('name');

        if (fetchError) throw fetchError;

        const existingNames = new Set(existingItems.map(item => item.name.toLowerCase()));
        console.log(`📊 Existing items in DB: ${existingItems.length}`);

        // Filter out items that already exist
        const newItems = NEW_FOOD_ITEMS.filter(item => !existingNames.has(item.name.toLowerCase()));
        console.log(`📥 New items to add: ${newItems.length}`);

        if (newItems.length === 0) {
            console.log('✅ All items already exist in database!');
            return;
        }

        // Add imageUrl placeholder for each item
        const itemsWithImages = newItems.map(item => ({
            ...item,
            imageUrl: `https://placehold.co/400x300/f5f5f5/666666?text=${encodeURIComponent(item.name)}`
        }));

        // Batch insert
        const BATCH_SIZE = 20;
        let inserted = 0;

        for (let i = 0; i < itemsWithImages.length; i += BATCH_SIZE) {
            const batch = itemsWithImages.slice(i, i + BATCH_SIZE);
            const { error } = await supabase.from('food_items').insert(batch);

            if (error) {
                console.error(`❌ Error inserting batch ${Math.floor(i / BATCH_SIZE) + 1}:`, error);
            } else {
                inserted += batch.length;
                console.log(`✅ Inserted batch ${Math.floor(i / BATCH_SIZE) + 1}: ${batch.length} items`);
            }
        }

        console.log(`\n🎉 Successfully added ${inserted} new food items!`);

        // Show distribution by province
        console.log('\n📊 New items by province:');
        const byProvince = {};
        newItems.forEach(item => {
            byProvince[item.origin] = (byProvince[item.origin] || 0) + 1;
        });
        Object.entries(byProvince).forEach(([province, count]) => {
            console.log(`   ${province}: ${count} items`);
        });

    } catch (error) {
        console.error('\n❌ Failed to add items:', error.message);
        throw error;
    }
}

addNewFoodItems();
