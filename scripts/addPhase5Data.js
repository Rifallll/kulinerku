import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const PHASE5_FOOD_ITEMS = [
    // =============================================
    // BALI
    // =============================================
    { name: "Ayam Betutu", type: "Hidangan Utama", origin: "Bali", description: "Ayam bumbu khas Bali yang dibungkus dan dipanggang dengan rempah lengkap.", rating: 4.8 },
    { name: "Babi Guling", type: "Hidangan Utama", origin: "Bali", description: "Babi panggang utuh dengan bumbu khas Bali yang legendaris.", rating: 4.9 },
    { name: "Sate Lilit", type: "Sate", origin: "Bali", description: "Sate ikan cincang yang dililitkan pada batang serai khas Bali.", rating: 4.7 },
    { name: "Lawar", type: "Hidangan Utama", origin: "Bali", description: "Campuran sayuran, kelapa, dan daging cincang dengan bumbu khas Bali.", rating: 4.6 },
    { name: "Jukut Undis", type: "Hidangan Utama", origin: "Bali", description: "Sayur khas Bali dengan bumbu base genep yang kaya rempah.", rating: 4.4 },
    { name: "Tum Ayam", type: "Hidangan Utama", origin: "Bali", description: "Ayam cincang berbumbu yang dibungkus daun pisang dan dikukus.", rating: 4.5 },
    { name: "Bebek Bengil", type: "Hidangan Utama", origin: "Bali", description: "Bebek goreng crispy khas Bali yang terkenal di Ubud.", rating: 4.7 },
    { name: "Nasi Campur Bali", type: "Hidangan Utama", origin: "Bali", description: "Nasi dengan berbagai lauk khas Bali yang lengkap.", rating: 4.6 },
    { name: "Laklak", type: "Kue & Jajanan", origin: "Bali", description: "Kue tradisional Bali dari tepung beras dengan santan dan gula merah.", rating: 4.4 },
    { name: "Pie Susu Bali", type: "Kue & Jajanan", origin: "Bali", description: "Pie susu khas Bali yang lembut dan manis, oleh-oleh favorit.", rating: 4.8 },
    { name: "Es Daluman", type: "Minuman", origin: "Bali", description: "Minuman segar dari cincau hijau dengan santan dan gula merah.", rating: 4.5 },
    { name: "Tuak Bali", type: "Minuman", origin: "Bali", description: "Minuman fermentasi dari nira pohon enau khas Bali.", rating: 4.3 },
    { name: "Kopi Kintamani", type: "Minuman", origin: "Bali", description: "Kopi arabika premium dari dataran tinggi Kintamani, Bali.", rating: 4.8 },
    { name: "Brem Bali", type: "Minuman", origin: "Bali", description: "Minuman fermentasi beras ketan khas Bali yang manis.", rating: 4.4 },
    { name: "Arak Bali", type: "Minuman", origin: "Bali", description: "Minuman beralkohol tradisional dari fermentasi nira atau beras.", rating: 4.2 },

    // =============================================
    // SULAWESI BARAT (Additional)
    // =============================================
    { name: "Ikan Terbang Goreng", type: "Hidangan Utama", origin: "Sulawesi Barat", description: "Ikan terbang goreng khas pesisir Sulawesi Barat yang renyah.", rating: 4.5 },

    // =============================================
    // SULAWESI SELATAN
    // =============================================
    { name: "Coto Makassar", type: "Hidangan Utama", origin: "Sulawesi Selatan", description: "Sup jeroan sapi khas Makassar dengan bumbu kacang yang kaya.", rating: 4.8 },
    { name: "Konro Bakar", type: "Hidangan Utama", origin: "Sulawesi Selatan", description: "Iga sapi bakar dengan bumbu konro khas Makassar yang gurih.", rating: 4.8 },
    { name: "Sop Konro", type: "Hidangan Utama", origin: "Sulawesi Selatan", description: "Sup iga sapi dengan kuah hitam khas Makassar yang pekat.", rating: 4.7 },
    { name: "Mie Kangkung Belacan", type: "Mie", origin: "Sulawesi Selatan", description: "Mie dengan kangkung dan belacan khas Makassar yang pedas.", rating: 4.6 },
    { name: "Pisang Epe", type: "Kue & Jajanan", origin: "Sulawesi Selatan", description: "Pisang bakar gepeng dengan gula merah khas Makassar.", rating: 4.5 },
    { name: "Jalangkote", type: "Kue & Jajanan", origin: "Sulawesi Selatan", description: "Pastel goreng isi sayuran khas Makassar yang renyah.", rating: 4.6 },
    { name: "Kapurung", type: "Hidangan Utama", origin: "Sulawesi Selatan", description: "Sup sagu dengan ikan dan sayuran khas Sulawesi Selatan.", rating: 4.5 },
    { name: "Pallu Basa", type: "Hidangan Utama", origin: "Sulawesi Selatan", description: "Sup jeroan sapi dengan kuah putih kental khas Makassar.", rating: 4.7 },
    { name: "Buras", type: "Hidangan Utama", origin: "Sulawesi Selatan", description: "Nasi yang dibungkus daun pisang berbentuk lonjong khas Makassar.", rating: 4.4 },
    { name: "Nasu Palekko", type: "Hidangan Utama", origin: "Sulawesi Selatan", description: "Nasi jagung khas Bugis yang gurih dan mengenyangkan.", rating: 4.3 },
    { name: "Barongko", type: "Kue & Jajanan", origin: "Sulawesi Selatan", description: "Kue pisang kukus dengan santan khas Bugis yang lembut.", rating: 4.5 },
    { name: "Es Pisang Ijo", type: "Minuman", origin: "Sulawesi Selatan", description: "Es pisang dengan adonan hijau dan santan khas Makassar.", rating: 4.7 },
    { name: "Es Palu Butung", type: "Minuman", origin: "Sulawesi Selatan", description: "Es campur khas Makassar dengan pisang, alpukat, dan sirup.", rating: 4.6 },
    { name: "Kopi Toraja", type: "Minuman", origin: "Sulawesi Selatan", description: "Kopi arabika premium dari Toraja yang terkenal di dunia.", rating: 4.9 },
    { name: "Saraba Makassar", type: "Minuman", origin: "Sulawesi Selatan", description: "Minuman jahe hangat dengan telur khas Makassar.", rating: 4.5 },

    // =============================================
    // PAPUA TENGAH (Additional)
    // =============================================
    { name: "Air Kelapa Muda Asam Manis", type: "Minuman", origin: "Papua Tengah", description: "Air kelapa muda dengan rasa asam manis khas Papua Tengah.", rating: 4.4 },

    // =============================================
    // KEPULAUAN BANGKA BELITUNG (Additional - using exact name)
    // =============================================
    // Note: Most items already added in Phase 2, adding any missing ones
];

async function addPhase5Data() {
    console.log('\n🍽️  ADDING PHASE 5 REGIONAL FOOD DATA');
    console.log('='.repeat(60));

    try {
        const { data: existingItems, error: fetchError } = await supabase
            .from('food_items')
            .select('name');

        if (fetchError) throw fetchError;

        const existingNames = new Set(existingItems.map(item => item.name.toLowerCase()));
        console.log(`📊 Existing items in DB: ${existingItems.length}`);

        const newItems = PHASE5_FOOD_ITEMS.filter(item => !existingNames.has(item.name.toLowerCase()));
        console.log(`📥 New items to add: ${newItems.length}`);

        if (newItems.length === 0) {
            console.log('✅ All items already exist in database!');
            return;
        }

        const itemsWithImages = newItems.map(item => ({
            ...item,
            imageUrl: `https://placehold.co/400x300/f5f5f5/666666?text=${encodeURIComponent(item.name)}`
        }));

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

        console.log(`\n🎉 Successfully added ${inserted} Phase 5 food items!`);

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

addPhase5Data();
