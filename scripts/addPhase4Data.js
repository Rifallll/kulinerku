import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const PHASE4_FOOD_ITEMS = [
    // =============================================
    // MALUKU UTARA (Additional)
    // =============================================
    { name: "Ikan Garu Rica", type: "Hidangan Utama", origin: "Maluku Utara", description: "Ikan garu dengan bumbu rica khas Maluku Utara yang pedas.", rating: 4.6 },
    { name: "Pisang Mulubebe", type: "Kue & Jajanan", origin: "Maluku Utara", description: "Pisang goreng khas Maluku Utara dengan tepung khusus.", rating: 4.4 },
    { name: "Jus Pala Maluku Utara", type: "Minuman", origin: "Maluku Utara", description: "Jus pala segar khas Maluku Utara yang menyegarkan.", rating: 4.5 },
    { name: "Air Kalapa", type: "Minuman", origin: "Maluku Utara", description: "Air kelapa muda segar khas Maluku Utara.", rating: 4.4 },

    // =============================================
    // DI YOGYAKARTA (Additional)
    // =============================================
    { name: "Gudeg Manggar", type: "Hidangan Utama", origin: "DI Yogyakarta", description: "Gudeg dengan bunga kelapa (manggar) khas Yogyakarta.", rating: 4.8 },
    { name: "Gudeg Basah", type: "Hidangan Utama", origin: "DI Yogyakarta", description: "Gudeg dengan kuah yang lebih banyak, khas Yogyakarta.", rating: 4.7 },
    { name: "Gudeg Kering", type: "Hidangan Utama", origin: "DI Yogyakarta", description: "Gudeg yang dimasak hingga kering, tahan lama.", rating: 4.6 },
    { name: "Bakpia Pathok", type: "Kue & Jajanan", origin: "DI Yogyakarta", description: "Kue pia legendaris dari Pathok, Yogyakarta dengan isian kacang hijau.", rating: 4.8 },
    { name: "Jenang Gempol", type: "Kue & Jajanan", origin: "DI Yogyakarta", description: "Jenang dengan bola-bola tepung ketan khas Yogyakarta.", rating: 4.5 },
    { name: "Geplak", type: "Kue & Jajanan", origin: "DI Yogyakarta", description: "Kue dari kelapa dan gula yang manis dan renyah.", rating: 4.4 },
    { name: "Tiwul", type: "Hidangan Utama", origin: "DI Yogyakarta", description: "Makanan pokok dari singkong khas Gunung Kidul, Yogyakarta.", rating: 4.3 },
    { name: "Gatot", type: "Hidangan Utama", origin: "DI Yogyakarta", description: "Singkong yang difermentasi dan dikukus, makanan tradisional Yogyakarta.", rating: 4.2 },
    { name: "Nasi Kucing", type: "Hidangan Utama", origin: "DI Yogyakarta", description: "Nasi bungkus kecil dengan lauk sederhana khas Yogyakarta.", rating: 4.6 },
    { name: "Oseng Mercon", type: "Hidangan Utama", origin: "DI Yogyakarta", description: "Tumisan pedas super khas Yogyakarta yang bikin ketagihan.", rating: 4.7 },
    { name: "Sate Klathak", type: "Sate", origin: "DI Yogyakarta", description: "Sate kambing tusuk besi khas Bantul, Yogyakarta.", rating: 4.7 },
    { name: "Tengkleng", type: "Hidangan Utama", origin: "DI Yogyakarta", description: "Sup tulang kambing khas Solo dan Yogyakarta.", rating: 4.6 },
    { name: "Wedang Ronde", type: "Minuman", origin: "DI Yogyakarta", description: "Minuman hangat dengan bola-bola ketan isi kacang.", rating: 4.6 },
    { name: "Wedang Uwuh", type: "Minuman", origin: "DI Yogyakarta", description: "Minuman rempah tradisional khas Yogyakarta yang menyehatkan.", rating: 4.5 },
    { name: "Wedang Secang", type: "Minuman", origin: "DI Yogyakarta", description: "Minuman dari kayu secang berwarna merah khas Yogyakarta.", rating: 4.4 },
    { name: "Kopi Jos", type: "Minuman", origin: "DI Yogyakarta", description: "Kopi dengan arang panas yang dicelupkan, khas Yogyakarta.", rating: 4.7 },
    { name: "Es Doger Yogya", type: "Minuman", origin: "DI Yogyakarta", description: "Es campur khas Yogyakarta dengan tape singkong dan santan.", rating: 4.5 },

    // =============================================
    // SULAWESI BARAT (Additional)
    // =============================================
    { name: "Leme'", type: "Hidangan Utama", origin: "Sulawesi Barat", description: "Fermentasi singkong khas Sulawesi Barat yang unik.", rating: 4.3 },
    { name: "Sambal Cumi Hitam", type: "Sambal & Saus", origin: "Sulawesi Barat", description: "Sambal dari cumi dengan tinta hitamnya, khas Sulawesi Barat.", rating: 4.5 },

    // =============================================
    // NUSA TENGGARA TIMUR (NTT)
    // =============================================
    { name: "Se'i Sapi", type: "Hidangan Utama", origin: "Nusa Tenggara Timur", description: "Daging sapi asap khas NTT yang gurih dan beraroma.", rating: 4.8 },
    { name: "Jagung Bose", type: "Hidangan Utama", origin: "Nusa Tenggara Timur", description: "Jagung rebus dengan kacang merah dan labu khas NTT.", rating: 4.6 },
    { name: "Kolo", type: "Hidangan Utama", origin: "Nusa Tenggara Timur", description: "Nasi bakar dalam bambu khas NTT yang harum.", rating: 4.7 },
    { name: "Catemak Jagung", type: "Hidangan Utama", origin: "Nusa Tenggara Timur", description: "Bubur jagung khas NTT dengan kacang-kacangan.", rating: 4.5 },
    { name: "Karmanaci", type: "Hidangan Utama", origin: "Nusa Tenggara Timur", description: "Daging masak rica khas NTT yang pedas.", rating: 4.6 },
    { name: "Tumis Bunga Pepaya", type: "Hidangan Utama", origin: "Nusa Tenggara Timur", description: "Tumisan bunga pepaya khas NTT yang segar.", rating: 4.4 },
    { name: "Kue Cucur Manggarai", type: "Kue & Jajanan", origin: "Nusa Tenggara Timur", description: "Kue cucur khas Manggarai, NTT yang manis.", rating: 4.3 },
    { name: "Tuak Manis NTT", type: "Minuman", origin: "Nusa Tenggara Timur", description: "Minuman fermentasi lontar manis khas NTT.", rating: 4.5 },
    { name: "Sopi NTT", type: "Minuman", origin: "Nusa Tenggara Timur", description: "Minuman tradisional beralkohol dari lontar khas NTT.", rating: 4.2 },
    { name: "Kopi Manggarai", type: "Minuman", origin: "Nusa Tenggara Timur", description: "Kopi arabika premium dari Manggarai, NTT.", rating: 4.8 },
    { name: "Jus Sirsak NTT", type: "Minuman", origin: "Nusa Tenggara Timur", description: "Jus sirsak segar khas NTT yang manis.", rating: 4.4 },

    // =============================================
    // MALUKU (Additional)
    // =============================================
    { name: "Papeda Maluku", type: "Hidangan Utama", origin: "Maluku", description: "Makanan pokok dari sagu khas Maluku dengan kuah ikan.", rating: 4.5 },
    { name: "Ikan Kuah Kuning Maluku", type: "Hidangan Utama", origin: "Maluku", description: "Ikan dengan kuah kunyit khas Maluku yang segar.", rating: 4.6 },
    { name: "Ikan Asar", type: "Hidangan Utama", origin: "Maluku", description: "Ikan asap khas Maluku yang tahan lama dan gurih.", rating: 4.5 },
    { name: "Sambal Colo-Colo", type: "Sambal & Saus", origin: "Maluku", description: "Sambal segar khas Maluku dengan tomat dan cabai rawit.", rating: 4.7 },
    { name: "Ampas Sagu", type: "Kue & Jajanan", origin: "Maluku", description: "Kue dari ampas sagu yang diolah menjadi camilan.", rating: 4.2 },
    { name: "Pisang Asar", type: "Kue & Jajanan", origin: "Maluku", description: "Pisang asap khas Maluku yang manis.", rating: 4.3 },
    { name: "Nasi Jaha", type: "Hidangan Utama", origin: "Maluku", description: "Nasi santan dalam bambu khas Maluku yang harum.", rating: 4.6 },
    { name: "Lapola Maluku", type: "Hidangan Utama", origin: "Maluku", description: "Nasi dengan kacang kenari khas Maluku.", rating: 4.4 },
    { name: "Air Guraka Maluku", type: "Minuman", origin: "Maluku", description: "Minuman tradisional khas Maluku yang menyegarkan.", rating: 4.3 },
    { name: "Jus Pala Maluku", type: "Minuman", origin: "Maluku", description: "Jus pala segar khas Maluku yang kaya rasa.", rating: 4.5 },
    { name: "Sopi Maluku", type: "Minuman", origin: "Maluku", description: "Minuman beralkohol tradisional khas Maluku.", rating: 4.2 },
    { name: "Kopi Rarobang", type: "Minuman", origin: "Maluku", description: "Kopi khas dari Rarobang, Maluku dengan cita rasa unik.", rating: 4.6 },

    // =============================================
    // JAMBI
    // =============================================
    { name: "Gulai Ikan Patin", type: "Hidangan Utama", origin: "Jambi", description: "Gulai ikan patin khas Jambi dengan bumbu kuning yang kaya.", rating: 4.7 },
    { name: "Nasi Gemuk", type: "Hidangan Utama", origin: "Jambi", description: "Nasi santan khas Jambi yang gurih dan mengenyangkan.", rating: 4.5 },
    { name: "Pempek Beringin", type: "Hidangan Utama", origin: "Jambi", description: "Pempek khas Jambi dengan pengaruh Palembang.", rating: 4.4 },
    { name: "Mie Celor Jambi", type: "Mie", origin: "Jambi", description: "Mie dengan kuah santan khas Jambi yang gurih.", rating: 4.6 },
    { name: "Kerupuk Kemplang Jambi", type: "Kue & Jajanan", origin: "Jambi", description: "Kerupuk ikan khas Jambi yang renyah.", rating: 4.3 },
    { name: "Gulai Tepek Ikan", type: "Hidangan Utama", origin: "Jambi", description: "Gulai ikan dengan bumbu khas Jambi yang pedas.", rating: 4.5 },
    { name: "Tempoyak Ikan Jambi", type: "Hidangan Utama", origin: "Jambi", description: "Ikan dengan fermentasi durian khas Jambi.", rating: 4.6 },
    { name: "Es Sarang Burung Walet", type: "Minuman", origin: "Jambi", description: "Minuman premium dari sarang burung walet khas Jambi.", rating: 4.7 },
    { name: "Kopi Liberika Tungkal", type: "Minuman", origin: "Jambi", description: "Kopi liberika khas Tungkal, Jambi dengan rasa unik.", rating: 4.8 },
    { name: "Air Tebu Jambi", type: "Minuman", origin: "Jambi", description: "Air tebu segar khas Jambi yang manis.", rating: 4.4 },

    // =============================================
    // PAPUA PEGUNUNGAN (Additional)
    // =============================================
    { name: "Ikan Bakar Kemiri", type: "Hidangan Utama", origin: "Papua Pegunungan", description: "Ikan bakar dengan bumbu kemiri khas Papua Pegunungan.", rating: 4.6 },
    { name: "Puding Sagu", type: "Kue & Jajanan", origin: "Papua Pegunungan", description: "Puding dari sagu khas Papua Pegunungan yang lembut.", rating: 4.3 },
    { name: "Teh Hijau Pegunungan Papua", type: "Minuman", origin: "Papua Pegunungan", description: "Teh hijau dari perkebunan pegunungan Papua.", rating: 4.5 },
    { name: "Jus Matoa Papua Pegunungan", type: "Minuman", origin: "Papua Pegunungan", description: "Jus buah matoa segar khas Papua Pegunungan.", rating: 4.6 },

    // =============================================
    // PAPUA BARAT DAYA (Additional)
    // =============================================
    { name: "Ikan Bakar Manokwari Sorong", type: "Hidangan Utama", origin: "Papua Barat Daya", description: "Ikan bakar dengan bumbu khas Manokwari dan Sorong.", rating: 4.6 },
    { name: "Sagu Lempeng Papua Barat Daya", type: "Hidangan Utama", origin: "Papua Barat Daya", description: "Sagu lempeng khas Papua Barat Daya yang renyah.", rating: 4.3 },
    { name: "Aunu Senebre Papua Barat Daya", type: "Hidangan Utama", origin: "Papua Barat Daya", description: "Masakan ikan dan sayuran dibungkus daun khas Papua Barat Daya.", rating: 4.4 },
    { name: "Papeda Kuah Kuning", type: "Hidangan Utama", origin: "Papua Barat Daya", description: "Papeda dengan kuah ikan kuning khas Papua Barat Daya.", rating: 4.5 },
    { name: "Jus Matoa Sorong", type: "Minuman", origin: "Papua Barat Daya", description: "Jus matoa segar dari Sorong, Papua Barat Daya.", rating: 4.5 },
];

async function addPhase4Data() {
    console.log('\n🍽️  ADDING PHASE 4 REGIONAL FOOD DATA');
    console.log('='.repeat(60));

    try {
        const { data: existingItems, error: fetchError } = await supabase
            .from('food_items')
            .select('name');

        if (fetchError) throw fetchError;

        const existingNames = new Set(existingItems.map(item => item.name.toLowerCase()));
        console.log(`📊 Existing items in DB: ${existingItems.length}`);

        const newItems = PHASE4_FOOD_ITEMS.filter(item => !existingNames.has(item.name.toLowerCase()));
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

        console.log(`\n🎉 Successfully added ${inserted} Phase 4 food items!`);

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

addPhase4Data();
