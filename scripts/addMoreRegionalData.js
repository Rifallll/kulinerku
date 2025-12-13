import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const MORE_FOOD_ITEMS = [
    // =============================================
    // PAPUA SELATAN (Additional items)
    // =============================================
    { name: "Udang Selingkuh Merauke", type: "Hidangan Utama", origin: "Papua Selatan", description: "Udang air tawar besar dari pedalaman Papua Selatan yang lezat.", rating: 4.7 },
    { name: "Papeda Papua Selatan", type: "Hidangan Utama", origin: "Papua Selatan", description: "Makanan pokok dari sagu dengan kuah ikan khas Papua Selatan.", rating: 4.4 },
    { name: "Ikan Kuah Kuning Merauke", type: "Hidangan Utama", origin: "Papua Selatan", description: "Ikan dengan kuah kunyit khas Merauke yang gurih.", rating: 4.5 },
    { name: "Sup Ikan Kakap Merah", type: "Hidangan Utama", origin: "Papua Selatan", description: "Sup ikan kakap merah segar dari perairan Papua Selatan.", rating: 4.6 },
    { name: "Jus Buah Merah Papua Selatan", type: "Minuman", origin: "Papua Selatan", description: "Jus buah merah kaya antioksidan dari Papua Selatan.", rating: 4.6 },
    { name: "Air Tebu Papua", type: "Minuman", origin: "Papua Selatan", description: "Air tebu segar murni khas Papua Selatan.", rating: 4.3 },
    { name: "Es Kelapa Muda Merauke", type: "Minuman", origin: "Papua Selatan", description: "Es kelapa muda segar dari pesisir Merauke.", rating: 4.4 },

    // =============================================
    // GORONTALO
    // =============================================
    { name: "Binte Biluhuta", type: "Hidangan Utama", origin: "Gorontalo", description: "Sup jagung ikan cakalang khas Gorontalo yang kaya rasa.", rating: 4.8 },
    { name: "Ayam Ilabulo", type: "Hidangan Utama", origin: "Gorontalo", description: "Ayam santan bakar khas Gorontalo dengan bumbu rempah.", rating: 4.7 },
    { name: "Sate Tuna Gorontalo", type: "Sate", origin: "Gorontalo", description: "Sate ikan tuna segar khas Gorontalo dengan bumbu kacang.", rating: 4.6 },
    { name: "Ikan Ili-Ili", type: "Hidangan Utama", origin: "Gorontalo", description: "Ikan kecil khas Gorontalo yang dimasak dengan bumbu rica.", rating: 4.5 },
    { name: "Bubur Sagela Gorontalo", type: "Bubur", origin: "Gorontalo", description: "Bubur sagu khas Gorontalo dengan rasa manis.", rating: 4.3 },
    { name: "Kue Pia Sagu", type: "Kue & Jajanan", origin: "Gorontalo", description: "Kue pia berbahan sagu khas Gorontalo yang renyah.", rating: 4.4 },
    { name: "Es Kelapa Kopyor", type: "Minuman", origin: "Gorontalo", description: "Es kelapa kopyor segar khas Gorontalo yang manis.", rating: 4.5 },
    { name: "Kopi Pinogu", type: "Minuman", origin: "Gorontalo", description: "Kopi lokal Gorontalo dengan cita rasa khas.", rating: 4.6 },
    { name: "Saraba Gorontalo", type: "Minuman", origin: "Gorontalo", description: "Minuman jahe hangat khas Gorontalo yang menyegarkan.", rating: 4.4 },

    // =============================================
    // BANTEN
    // =============================================
    { name: "Sate Bandeng", type: "Sate", origin: "Banten", description: "Sate dari daging bandeng yang sudah disuir, khas Banten.", rating: 4.8 },
    { name: "Rabeg", type: "Hidangan Utama", origin: "Banten", description: "Masakan daging kambing khas Kesultanan Banten dengan bumbu rempah.", rating: 4.7 },
    { name: "Nasi Uduk Pandeglang", type: "Hidangan Utama", origin: "Banten", description: "Nasi uduk gurih khas Pandeglang dengan lauk lengkap.", rating: 4.6 },
    { name: "Gipang", type: "Kue & Jajanan", origin: "Banten", description: "Ketan gula merah khas Banten yang manis dan kenyal.", rating: 4.4 },
    { name: "Otak-Otak Labuan", type: "Kue & Jajanan", origin: "Banten", description: "Otak-otak ikan bakar khas Labuan, Banten.", rating: 4.5 },
    { name: "Angeun Lada", type: "Hidangan Utama", origin: "Banten", description: "Sayur pedas khas Banten dengan bumbu lada yang kuat.", rating: 4.5 },
    { name: "Es Sekemu", type: "Minuman", origin: "Banten", description: "Minuman es segar khas Banten.", rating: 4.3 },
    { name: "Air Walanda", type: "Minuman", origin: "Banten", description: "Minuman tradisional khas Banten yang menyegarkan.", rating: 4.2 },

    // =============================================
    // KALIMANTAN SELATAN
    // =============================================
    { name: "Soto Banjar", type: "Hidangan Utama", origin: "Kalimantan Selatan", description: "Soto ayam khas Banjar dengan perkedel kentang yang gurih.", rating: 4.8 },
    { name: "Nasi Kuning Banjar", type: "Hidangan Utama", origin: "Kalimantan Selatan", description: "Nasi kuning khas Banjarmasin dengan lauk lengkap.", rating: 4.7 },
    { name: "Ketupat Kandangan", type: "Hidangan Utama", origin: "Kalimantan Selatan", description: "Ketupat khas Kandangan dengan kuah santan yang kental.", rating: 4.6 },
    { name: "Mandai", type: "Hidangan Utama", origin: "Kalimantan Selatan", description: "Fermentasi kulit cempedak khas Kalimantan Selatan yang unik.", rating: 4.3 },
    { name: "Amparan Tatak", type: "Kue & Jajanan", origin: "Kalimantan Selatan", description: "Kue pisang santan khas Banjar yang lembut dan manis.", rating: 4.5 },
    { name: "Ikan Patin Bakar Banjar", type: "Hidangan Utama", origin: "Kalimantan Selatan", description: "Ikan patin bakar dengan bumbu khas Kalimantan Selatan.", rating: 4.6 },
    { name: "Es Selimut", type: "Minuman", origin: "Kalimantan Selatan", description: "Es campur khas Banjarmasin yang segar.", rating: 4.5 },
    { name: "Kopi Aranio", type: "Minuman", origin: "Kalimantan Selatan", description: "Kopi khas dari daerah Aranio, Kalimantan Selatan.", rating: 4.6 },
    { name: "Air Sarabba Banjar", type: "Minuman", origin: "Kalimantan Selatan", description: "Minuman jahe tradisional khas Banjar.", rating: 4.4 },

    // =============================================
    // PAPUA (Provinsi Induk - Additional)
    // =============================================
    { name: "Papeda Papua", type: "Hidangan Utama", origin: "Papua", description: "Makanan pokok dari sagu dengan tekstur lengket khas Papua.", rating: 4.5 },
    { name: "Ikan Kuah Kuning Papua", type: "Hidangan Utama", origin: "Papua", description: "Ikan dengan kuah kunyit khas Papua yang gurih.", rating: 4.6 },
    { name: "Udang Selingkuh Papua", type: "Hidangan Utama", origin: "Papua", description: "Udang air tawar besar khas Papua yang lezat.", rating: 4.7 },
    { name: "Sate Ulat Sagu Papua", type: "Sate", origin: "Papua", description: "Sate ulat sagu kaya protein khas Papua.", rating: 4.3 },
    { name: "Aunu Senebre Papua", type: "Hidangan Utama", origin: "Papua", description: "Masakan ikan dan sayuran dibungkus daun khas Papua.", rating: 4.4 },
    { name: "Sagu Lempeng Papua", type: "Hidangan Utama", origin: "Papua", description: "Sagu yang diproses menjadi lempeng pipih khas Papua.", rating: 4.3 },
    { name: "Ikan Bakar Manaus", type: "Hidangan Utama", origin: "Papua", description: "Ikan bakar khas Papua dengan bumbu sederhana.", rating: 4.5 },
    { name: "Es Matoa Papua", type: "Minuman", origin: "Papua", description: "Es dari buah matoa khas Papua yang manis.", rating: 4.6 },
    { name: "Kopi Wamena Papua", type: "Minuman", origin: "Papua", description: "Kopi arabika premium dari Wamena, Papua.", rating: 4.8 },
    { name: "Minyak Buah Merah", type: "Minuman", origin: "Papua", description: "Ekstrak buah merah Papua yang kaya manfaat kesehatan.", rating: 4.5 },

    // =============================================
    // KALIMANTAN BARAT (Additional)
    // =============================================
    { name: "Bubur Pedas Sambas Kalbar", type: "Bubur", origin: "Kalimantan Barat", description: "Bubur pedas khas Sambas dengan berbagai sayuran.", rating: 4.6 },
    { name: "Pengkang Kalbar", type: "Kue & Jajanan", origin: "Kalimantan Barat", description: "Jajanan ketan isi ebi khas Kalimantan Barat.", rating: 4.4 },
    { name: "Choipan Kalbar", type: "Kue & Jajanan", origin: "Kalimantan Barat", description: "Kue kukus isi sayuran khas Kalimantan Barat.", rating: 4.7 },
    { name: "Mie Sagu Pontianak", type: "Mie", origin: "Kalimantan Barat", description: "Mie sagu kenyal khas Pontianak.", rating: 4.5 },
    { name: "Pacri Nanas", type: "Hidangan Utama", origin: "Kalimantan Barat", description: "Masakan nanas dengan bumbu kari khas Kalimantan Barat.", rating: 4.4 },
    { name: "Jorong-Jorong Kalbar", type: "Kue & Jajanan", origin: "Kalimantan Barat", description: "Kue tradisional dalam takir daun pandan khas Kalbar.", rating: 4.3 },
    { name: "Kopi Singkawang Kalbar", type: "Minuman", origin: "Kalimantan Barat", description: "Kopi tiam khas Singkawang yang pekat.", rating: 4.7 },
    { name: "Limun Sarsaparila Kalbar", type: "Minuman", origin: "Kalimantan Barat", description: "Minuman bersoda lokal khas Kalimantan Barat.", rating: 4.4 },
    { name: "Es Ce Hun Tiau Kalbar", type: "Minuman", origin: "Kalimantan Barat", description: "Es campur khas Pontianak dengan sagu gunting.", rating: 4.6 },
];

async function addMoreRegionalData() {
    console.log('\n🍽️  ADDING MORE REGIONAL FOOD DATA');
    console.log('='.repeat(60));

    try {
        const { data: existingItems, error: fetchError } = await supabase
            .from('food_items')
            .select('name');

        if (fetchError) throw fetchError;

        const existingNames = new Set(existingItems.map(item => item.name.toLowerCase()));
        console.log(`📊 Existing items in DB: ${existingItems.length}`);

        const newItems = MORE_FOOD_ITEMS.filter(item => !existingNames.has(item.name.toLowerCase()));
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

        console.log(`\n🎉 Successfully added ${inserted} more food items!`);

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

addMoreRegionalData();
