import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const PHASE6_FOOD_ITEMS = [
    // =============================================
    // KALIMANTAN UTARA
    // =============================================
    { name: "Kepiting Soka", type: "Hidangan Utama", origin: "Kalimantan Utara", description: "Kepiting lunak khas Kalimantan Utara yang lembut dan gurih.", rating: 4.7 },
    { name: "Nasi Subut", type: "Hidangan Utama", origin: "Kalimantan Utara", description: "Nasi khas Kalimantan Utara dengan bumbu rempah yang kaya.", rating: 4.5 },
    { name: "Tumis Kapah", type: "Hidangan Utama", origin: "Kalimantan Utara", description: "Tumisan kerang khas Kalimantan Utara yang segar.", rating: 4.4 },
    { name: "Kerupuk Amplang Kaltara", type: "Kue & Jajanan", origin: "Kalimantan Utara", description: "Kerupuk ikan khas Kalimantan Utara yang renyah.", rating: 4.6 },
    { name: "Gence Ruan", type: "Hidangan Utama", origin: "Kalimantan Utara", description: "Ikan gabus bakar dengan bumbu khas Kalimantan Utara.", rating: 4.6 },
    { name: "Es Kelapa Muda Kaltara", type: "Minuman", origin: "Kalimantan Utara", description: "Es kelapa muda segar khas Kalimantan Utara.", rating: 4.4 },
    { name: "Air Tebu Murni", type: "Minuman", origin: "Kalimantan Utara", description: "Air tebu murni tanpa campuran khas Kalimantan Utara.", rating: 4.3 },

    // =============================================
    // KALIMANTAN TIMUR
    // =============================================
    { name: "Kepiting Soka Kaltim", type: "Hidangan Utama", origin: "Kalimantan Timur", description: "Kepiting lunak khas Kalimantan Timur yang lezat.", rating: 4.7 },
    { name: "Amplang", type: "Kue & Jajanan", origin: "Kalimantan Timur", description: "Kerupuk ikan tenggiri khas Kalimantan Timur yang renyah.", rating: 4.8 },
    { name: "Sate Payau", type: "Sate", origin: "Kalimantan Timur", description: "Sate rusa khas Kalimantan Timur (peredarannya diatur).", rating: 4.5 },
    { name: "Gence Ruan Kaltim", type: "Hidangan Utama", origin: "Kalimantan Timur", description: "Ikan gabus bakar bumbu khas Kalimantan Timur.", rating: 4.6 },
    { name: "Nasi Bekepor", type: "Hidangan Utama", origin: "Kalimantan Timur", description: "Nasi bakar isi ikan khas Kalimantan Timur.", rating: 4.6 },
    { name: "Bubur Pedas Samarinda", type: "Bubur", origin: "Kalimantan Timur", description: "Bubur pedas khas Samarinda dengan rempah lengkap.", rating: 4.5 },
    { name: "Lempok Durian", type: "Kue & Jajanan", origin: "Kalimantan Timur", description: "Dodol durian khas Kalimantan Timur yang manis legit.", rating: 4.7 },
    { name: "Jus Lai", type: "Minuman", origin: "Kalimantan Timur", description: "Jus dari buah lai (sejenis durian) khas Kalimantan Timur.", rating: 4.5 },
    { name: "Sirup Sarang Walet", type: "Minuman", origin: "Kalimantan Timur", description: "Sirup premium dari sarang burung walet khas Kalimantan Timur.", rating: 4.7 },

    // =============================================
    // PAPUA BARAT (Additional)
    // =============================================
    { name: "Ikan Bakar Manokwari Papua Barat", type: "Hidangan Utama", origin: "Papua Barat", description: "Ikan bakar dengan bumbu khas Manokwari, Papua Barat.", rating: 4.6 },
    { name: "Papeda Papua Barat", type: "Hidangan Utama", origin: "Papua Barat", description: "Makanan pokok dari sagu khas Papua Barat.", rating: 4.4 },
    { name: "Ikan Kuah Kuning Papua Barat", type: "Hidangan Utama", origin: "Papua Barat", description: "Ikan dengan kuah kunyit khas Papua Barat.", rating: 4.5 },
    { name: "Sagu Lempeng Papua Barat", type: "Hidangan Utama", origin: "Papua Barat", description: "Sagu lempeng pipih khas Papua Barat.", rating: 4.3 },
    { name: "Lontar", type: "Kue & Jajanan", origin: "Papua Barat", description: "Kue kering besar khas Papua Barat.", rating: 4.4 },
    { name: "Ayam Lalapan Cenderawasih", type: "Hidangan Utama", origin: "Papua Barat", description: "Ayam lalapan dengan bumbu khas Papua Barat.", rating: 4.5 },
    { name: "Es Kelapa Muda Papua Barat", type: "Minuman", origin: "Papua Barat", description: "Es kelapa muda segar khas Papua Barat.", rating: 4.4 },
    { name: "Kopi Papua Barat", type: "Minuman", origin: "Papua Barat", description: "Kopi arabika dari Papua Barat yang berkualitas.", rating: 4.7 },

    // =============================================
    // SULAWESI TENGAH
    // =============================================
    { name: "Kaledo", type: "Hidangan Utama", origin: "Sulawesi Tengah", description: "Sup tulang kaki sapi khas Palu, Sulawesi Tengah yang gurih.", rating: 4.8 },
    { name: "Palumara", type: "Hidangan Utama", origin: "Sulawesi Tengah", description: "Ikan kuah asam pedas khas Sulawesi Tengah yang segar.", rating: 4.7 },
    { name: "Lalampa", type: "Kue & Jajanan", origin: "Sulawesi Tengah", description: "Mirip lemper, kue ketan isi ikan khas Sulawesi Tengah.", rating: 4.5 },
    { name: "Uta Kelo", type: "Hidangan Utama", origin: "Sulawesi Tengah", description: "Sayur daun kelor kuah santan khas Sulawesi Tengah.", rating: 4.4 },
    { name: "Onyop", type: "Hidangan Utama", origin: "Sulawesi Tengah", description: "Papeda khas Poso, Sulawesi Tengah.", rating: 4.3 },
    { name: "Saraba Sulteng", type: "Minuman", origin: "Sulawesi Tengah", description: "Minuman jahe hangat khas Sulawesi Tengah.", rating: 4.4 },
    { name: "Kopi Kulawi", type: "Minuman", origin: "Sulawesi Tengah", description: "Kopi arabika dari Kulawi, Sulawesi Tengah.", rating: 4.7 },
    { name: "Es Kelapa Muda Sulteng", type: "Minuman", origin: "Sulawesi Tengah", description: "Es kelapa muda segar khas Sulawesi Tengah.", rating: 4.4 },

    // =============================================
    // KALIMANTAN TENGAH
    // =============================================
    { name: "Juhu Singkah", type: "Hidangan Utama", origin: "Kalimantan Tengah", description: "Sayur umbut rotan khas Kalimantan Tengah yang unik.", rating: 4.6 },
    { name: "Ikan Bakar Patin Kalteng", type: "Hidangan Utama", origin: "Kalimantan Tengah", description: "Ikan patin bakar khas Kalimantan Tengah.", rating: 4.7 },
    { name: "Ikan Bakar Jelawat", type: "Hidangan Utama", origin: "Kalimantan Tengah", description: "Ikan jelawat bakar khas Kalimantan Tengah yang gurih.", rating: 4.6 },
    { name: "Kalumpe", type: "Hidangan Utama", origin: "Kalimantan Tengah", description: "Sayur daun singkong tumbuk khas Kalimantan Tengah.", rating: 4.4 },
    { name: "Wadi", type: "Hidangan Utama", origin: "Kalimantan Tengah", description: "Ikan fermentasi khas Kalimantan Tengah yang kaya rasa.", rating: 4.3 },
    { name: "Kue Lam", type: "Kue & Jajanan", origin: "Kalimantan Tengah", description: "Kue tradisional khas Kalimantan Tengah.", rating: 4.4 },
    { name: "Teh Kalteng", type: "Minuman", origin: "Kalimantan Tengah", description: "Teh khas Kalimantan Tengah yang menyegarkan.", rating: 4.3 },
    { name: "Jus Pisang Kepok", type: "Minuman", origin: "Kalimantan Tengah", description: "Jus pisang kepok khas Kalimantan Tengah yang kental.", rating: 4.4 },
    { name: "Air Jahe Kalteng", type: "Minuman", origin: "Kalimantan Tengah", description: "Minuman jahe hangat khas Kalimantan Tengah.", rating: 4.3 },
];

async function addPhase6Data() {
    console.log('\n🍽️  ADDING PHASE 6 REGIONAL FOOD DATA');
    console.log('='.repeat(60));

    try {
        const { data: existingItems, error: fetchError } = await supabase
            .from('food_items')
            .select('name');

        if (fetchError) throw fetchError;

        const existingNames = new Set(existingItems.map(item => item.name.toLowerCase()));
        console.log(`📊 Existing items in DB: ${existingItems.length}`);

        const newItems = PHASE6_FOOD_ITEMS.filter(item => !existingNames.has(item.name.toLowerCase()));
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

        console.log(`\n🎉 Successfully added ${inserted} Phase 6 food items!`);

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

addPhase6Data();
