import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * Add additional food and beverage items for specific provinces
 */

const ADDITIONAL_FOOD_ITEMS = [
    // =============================================
    // KALIMANTAN BARAT
    // =============================================
    // Makanan
    { name: "Bubur Pedas Sambas", type: "Bubur", origin: "Kalimantan Barat", description: "Bubur khas Sambas dengan berbagai macam sayuran dan rempah, sering disajikan dengan kacang tanah.", rating: 4.6 },
    { name: "Pengkang", type: "Kue & Jajanan", origin: "Kalimantan Barat", description: "Jajanan dari ketan isi ebi yang dibungkus daun pisang dan dibakar.", rating: 4.4 },
    { name: "Choipan", type: "Kue & Jajanan", origin: "Kalimantan Barat", description: "Kue kukus isi sayuran (bengkoang/kucai) dengan taburan bawang goreng.", alias: "Chai Kue", rating: 4.7 },
    { name: "Mie Sagu", type: "Mie", origin: "Kalimantan Barat", description: "Mie yang terbuat dari sagu, teksturnya kenyal dan disajikan dengan kuah atau goreng.", rating: 4.3 },
    { name: "Kiam Ji", type: "Minuman", origin: "Kalimantan Barat", description: "Minuman segar dari jeruk nipis dan kiamboy (plum kering asin).", rating: 4.5 },
    { name: "Lek Tau Suan", type: "Kue & Jajanan", origin: "Kalimantan Barat", description: "Bubur kacang hijau kupas dengan kuah kental manis dan cakwe.", rating: 4.4 },
    { name: "Bakso Ikan Pontianak", type: "Hidangan Utama", origin: "Kalimantan Barat", description: "Bakso ikan khas Pontianak dengan tekstur kenyal dan kuah bening segar.", rating: 4.5 },
    { name: "Mie Tiaw Siram", type: "Mie", origin: "Kalimantan Barat", description: "Kwetiau siram kuah kental dengan daging sapi atau seafood.", rating: 4.6 },
    { name: "Kwetiau Goreng Pontianak", type: "Mie", origin: "Kalimantan Barat", description: "Kwetiau goreng khas Pontianak dengan sentuhan rasa asap (wok hei).", rating: 4.7 },
    { name: "Pisang Goreng Pontianak", type: "Kue & Jajanan", origin: "Kalimantan Barat", description: "Pisang goreng kipas dengan kremes yang sangat renyah dan selai srikaya.", rating: 4.8 },
    { name: "Jorong-Jorong", type: "Kue & Jajanan", origin: "Kalimantan Barat", description: "Kue tradisional dalam takir daun pandan dengan rasa manis gurih santan.", rating: 4.3 },
    { name: "Bingke", type: "Kue & Jajanan", origin: "Kalimantan Barat", description: "Kue bingka khas Pontianak dengan tekstur lembut dan rasa manis legit.", rating: 4.5 },
    // Minuman
    { name: "Kopi Singkawang", type: "Minuman", origin: "Kalimantan Barat", description: "Kopi tiam tradisional khas Singkawang yang pekat dan nikmat.", rating: 4.7 },
    { name: "Limun Sarsaparila", type: "Minuman", origin: "Kalimantan Barat", description: "Minuman bersoda lokal dengan rasa sarsaparila khas zaman dulu.", rating: 4.4 },
    { name: "Susu Kedelai (Air Tahu)", type: "Minuman", origin: "Kalimantan Barat", description: "Sari kedelai segar yang populer dinikmati hangat atau dingin.", rating: 4.5 },
    { name: "Es Sari Kacang Hijau", type: "Minuman", origin: "Kalimantan Barat", description: "Minuman sari kacang hijau yang kental dan mengenyangkan.", rating: 4.4 },
    { name: "Ce Hun Tiau", type: "Minuman", origin: "Kalimantan Barat", description: "Es campur khas Pontianak dengan sagu gunting, kacang merah, dan bongko.", rating: 4.6 },

    // =============================================
    // KEPULAUAN RIAU
    // =============================================
    // Makanan
    { name: "Siput Gonggong", type: "Hidangan Utama", origin: "Kepulauan Riau", description: "Siput laut rebus khas Batam/Bintan yang disajikan dengan sambal.", rating: 4.6 },
    { name: "Mie Tarempa", type: "Mie", origin: "Kepulauan Riau", description: "Mie pipih berbumbu rempah merah dengan suwiran ikan tongkol.", rating: 4.7 },
    { name: "Sop Ikan Batam", type: "Hidangan Utama", origin: "Kepulauan Riau", description: "Sup ikan dengan kuah bening segar, tomat hijau, dan sawi asin.", rating: 4.5 },
    { name: "Nasi Lemak Kepri", type: "Hidangan Utama", origin: "Kepulauan Riau", description: "Nasi gurih santan dengan lauk pauk khas Melayu Kepulauan Riau.", rating: 4.6 },
    { name: "Ikan Bakar Sambal Petai", type: "Hidangan Utama", origin: "Kepulauan Riau", description: "Ikan bakar dengan topping sambal petai yang menggugah selera.", rating: 4.5 },
    { name: "Laksa Kuah", type: "Mie", origin: "Kepulauan Riau", description: "Mie sagu dengan kuah kari ikan yang kental dan gurih.", rating: 4.4 },
    { name: "Asam Pedas Ikan Pari", type: "Hidangan Utama", origin: "Kepulauan Riau", description: "Masakan ikan pari dengan kuah asam pedas yang segar.", rating: 4.5 },
    { name: "Luti Gendang", type: "Kue & Jajanan", origin: "Kepulauan Riau", description: "Roti goreng lonjong isi abon ikan yang renyah di luar, lembut di dalam.", rating: 4.6 },
    { name: "Otak-Otak Kepri", type: "Kue & Jajanan", origin: "Kepulauan Riau", description: "Otak-otak ikan tenggiri bakar khas Kepulauan Riau dengan bumbu kacang.", rating: 4.5 },
    // Minuman
    { name: "Es Laksamana Mengamuk", type: "Minuman", origin: "Kepulauan Riau", description: "Minuman segar dari buah kweni, santan, dan gula dengan nama yang unik.", rating: 4.6 },
    { name: "Teh Obeng", type: "Minuman", origin: "Kepulauan Riau", description: "Es teh manis khas Batam/Tanjung Pinang.", rating: 4.4 },
    { name: "Air Mata Kucing", type: "Minuman", origin: "Kepulauan Riau", description: "Minuman herbal menyegarkan dari lo han kuo dan kelengkeng kering.", rating: 4.5 },
    { name: "Jus Alpukat Mente", type: "Minuman", origin: "Kepulauan Riau", description: "Jus alpukat kental dengan topping kacang mete goreng.", rating: 4.6 },
    { name: "Kopi Meranti", type: "Minuman", origin: "Kepulauan Riau", description: "Kopi khas Kepulauan Meranti dengan cita rasa lokal yang kuat.", rating: 4.5 },

    // =============================================
    // KEPULAUAN BANGKA BELITUNG
    // =============================================
    // Makanan
    { name: "Lempah Kuning", type: "Hidangan Utama", origin: "Bangka Belitung", description: "Sup ikan berkuah kuning asam pedas dengan nanas, khas Bangka.", rating: 4.7 },
    { name: "Mie Bangka", type: "Mie", origin: "Bangka Belitung", description: "Mie ayam khas Bangka dengan tauge dan pelengkap lainnya.", rating: 4.6 },
    { name: "Otak-Otak Ikan Tenggiri Bangka", type: "Kue & Jajanan", origin: "Bangka Belitung", description: "Otak-otak bakar dari ikan tenggiri asli dengan saus cuka terasi.", rating: 4.6 },
    { name: "Rusip", type: "Sambal & Saus", origin: "Bangka Belitung", description: "Fermentasi ikan bilis yang dijadikan sambal atau penyedap masakan.", rating: 4.2 },
    { name: "Getas Bangka", type: "Kue & Jajanan", origin: "Bangka Belitung", description: "Kerupuk ikan bulat khas Bangka yang renyah.", rating: 4.4 },
    { name: "Kue Rintak", type: "Kue & Jajanan", origin: "Bangka Belitung", description: "Kue bangkit khas Bangka berbahan dasar sagu.", rating: 4.3 },
    { name: "Dodol Agar-Agar", type: "Kue & Jajanan", origin: "Bangka Belitung", description: "Dodol khas dengan tekstur seperti agar-agar yang padat.", rating: 4.2 },
    { name: "Gangan", type: "Hidangan Utama", origin: "Bangka Belitung", description: "Sayur ikan kuah kuning khas Belitung, mirip lempah kuning.", rating: 4.6 },
    { name: "Martabak Bangka (Hopia)", type: "Kue & Jajanan", origin: "Bangka Belitung", description: "Kue pia atau martabak manis khas Bangka yang legendaris.", rating: 4.7 },
    // Minuman
    { name: "Es Campur Kacang Merah", type: "Minuman", origin: "Bangka Belitung", description: "Es campur segar dengan dominasi kacang merah yang empuk.", rating: 4.5 },
    { name: "Kopi Kong Djie", type: "Minuman", origin: "Bangka Belitung", description: "Kopi legendaris dari Belitung dengan aroma yang khas.", rating: 4.8 },
    { name: "Air Sarang Burung Walet", type: "Minuman", origin: "Bangka Belitung", description: "Minuman kesehatan dari sarang burung walet berkualitas.", rating: 4.7 },
    { name: "Minuman Lidah Buaya", type: "Minuman", origin: "Bangka Belitung", description: "Minuman segar dengan potongan lidah buaya, khas Pontianak dan Bangka.", rating: 4.4 },

    // =============================================
    // PAPUA TENGAH (Tambahan)
    // =============================================
    // Makanan
    { name: "Norohombi", type: "Hidangan Utama", origin: "Papua Tengah", description: "Makanan tradisional khas suku-suku di Papua Tengah.", rating: 4.2 },
    { name: "Udang Selingkuh Nabire", type: "Hidangan Utama", origin: "Papua Tengah", description: "Udang air tawar besar yang juga ditemukan di perairan pedalaman Nabire.", rating: 4.6 },
    { name: "Ikan Bakar Nabire", type: "Hidangan Utama", origin: "Papua Tengah", description: "Ikan laut segar Nabire yang dibakar polos atau bumbu kuning.", rating: 4.5 },
    // Minuman
    { name: "Kopi Amungme", type: "Minuman", origin: "Papua Tengah", description: "Kopi arabika dataran tinggi yang dibudidayakan suku Amungme.", rating: 4.7 },
    { name: "Air Kelapa Muda Nabire", type: "Minuman", origin: "Papua Tengah", description: "Air kelapa muda segar dari pesisir Nabire.", rating: 4.4 },

    // =============================================
    // NUSA TENGGARA BARAT (NTB)
    // =============================================
    // Makanan
    { name: "Ayam Taliwang", type: "Hidangan Utama", origin: "Nusa Tenggara Barat", description: "Ayam bakar pedas khas Lombok dengan bumbu ragi yang kuat.", rating: 4.8 },
    { name: "Plecing Kangkung", type: "Hidangan Utama", origin: "Nusa Tenggara Barat", description: "Kangkung rebus dengan sambal tomat terasi yang pedas segar.", rating: 4.6 },
    { name: "Sate Rembiga", type: "Sate", origin: "Nusa Tenggara Barat", description: "Sate sapi khas Lombok dengan bumbu pedas manis yang meresap.", rating: 4.7 },
    { name: "Ares", type: "Hidangan Utama", origin: "Nusa Tenggara Barat", description: "Sayur dari pelepah pisang muda (gedebog) yang dimasak santan.", rating: 4.4 },
    { name: "Kelaq Batih", type: "Hidangan Utama", origin: "Nusa Tenggara Barat", description: "Sayur biji-bijian batih khas Lombok.", rating: 4.2 },
    { name: "Sate Bulayak", type: "Sate", origin: "Nusa Tenggara Barat", description: "Sate daging sapi dengan lontong bulayak yang dibungkus daun aren.", rating: 4.6 },
    { name: "Bebalung", type: "Hidangan Utama", origin: "Nusa Tenggara Barat", description: "Sup tulang sapi khas Lombok dengan kuah bening berbumbu.", rating: 4.5 },
    { name: "Poteng Japar", type: "Kue & Jajanan", origin: "Nusa Tenggara Barat", description: "Tape ketan khas Lombok yang manis dan berair.", rating: 4.3 },
    // Minuman
    { name: "Es Kelapa Muda Lombok Ijo", type: "Minuman", origin: "Nusa Tenggara Barat", description: "Es kelapa muda varietas hijau yang segar.", rating: 4.5 },
    { name: "Tuak Manis Lombok", type: "Minuman", origin: "Nusa Tenggara Barat", description: "Minuman nira aren segar yang tidak memabukkan.", rating: 4.4 },
    { name: "Air Jahe Lombok", type: "Minuman", origin: "Nusa Tenggara Barat", description: "Minuman wedang jahe hangat khas Lombok.", rating: 4.3 },
    { name: "Kopi Lombok", type: "Minuman", origin: "Nusa Tenggara Barat", description: "Kopi robusta atau arabika dari perkebunan di Lombok.", rating: 4.6 },

    // =============================================
    // LAMPUNG
    // =============================================
    // Makanan
    { name: "Seruit", type: "Hidangan Utama", origin: "Lampung", description: "Hidangan ikan bakar yang disajikan dengan sambal terasi dan mangga (tempoyak).", rating: 4.7 },
    { name: "Pindang Lampung", type: "Hidangan Utama", origin: "Lampung", description: "Sup ikan dengan kuah asam pedas dan aroma kemangi yang kuat.", rating: 4.6 },
    { name: "Gulai Taboh", type: "Hidangan Utama", origin: "Lampung", description: "Gulai santan berisi ikan dan rebung atau sayuran lainnya.", rating: 4.5 },
    { name: "Engkak Ketan", type: "Kue & Jajanan", origin: "Lampung", description: "Kue lapis ketan khas Lampung yang kenyal dan manis, mirip lapis legit.", rating: 4.4 },
    { name: "Kemplang", type: "Kue & Jajanan", origin: "Lampung", description: "Kerupuk ikan pangggang khas Lampung yang disajikan dengan sambal.", rating: 4.5 },
    { name: "Sambal Lampung", type: "Sambal & Saus", origin: "Lampung", description: "Sambal terasi khas Lampung yang pedas nendang, kadang pakai tempoyak.", rating: 4.6 },
    { name: "Umbu Rebung", type: "Hidangan Utama", origin: "Lampung", description: "Hidangan dari rebung yang dimasak dengan bumbu khas.", rating: 4.3 },
    { name: "Secapa", type: "Hidangan Utama", origin: "Lampung", description: "Hidangan tradisional Lampung.", rating: 4.2 },
    // Minuman
    { name: "Serbat Kweni", type: "Minuman", origin: "Lampung", description: "Minuman segar dari buah mangga kweni yang harum.", rating: 4.5 },
    { name: "Kopi Robusta Lampung", type: "Minuman", origin: "Lampung", description: "Kopi robusta unggulan dari Lampung yang terkenal di dunia.", rating: 4.8 },
    { name: "Jus Alpukat Lampung", type: "Minuman", origin: "Lampung", description: "Jus alpukat mentega segar dari hasil bumi Lampung.", rating: 4.6 },
    { name: "Es Cendol Lampung", type: "Minuman", origin: "Lampung", description: "Es cendol dengan gula aren khas Lampung.", rating: 4.4 },

    // =============================================
    // BENGKULU
    // =============================================
    // Makanan
    { name: "Pendap", type: "Hidangan Utama", origin: "Bengkulu", description: "Ikan berbumbu yang dibungkus daun talas dan dikukus berjam-jam.", rating: 4.6 },
    { name: "Tempoyak Ikan", type: "Hidangan Utama", origin: "Bengkulu", description: "Masakan ikan dengan fermentasi durian (tempoyak) yang asam manis pedas.", rating: 4.7 },
    { name: "Bagar Hiu", type: "Hidangan Utama", origin: "Bengkulu", description: "Gulai daging ikan hiu (atau ikan lain) dengan kuah kental kaya rempah.", rating: 4.5 },
    { name: "Pindang Patin Bengkulu", type: "Hidangan Utama", origin: "Bengkulu", description: "Pindang ikan patin dengan kuah bening segar khas Bengkulu.", rating: 4.6 },
    { name: "Kue Tat", type: "Kue & Jajanan", origin: "Bengkulu", description: "Kue bolu padat dengan toping selai nanas, sajian untuk raja-raja dulu.", rating: 4.4 },
    { name: "Kerupuk Khas Bengkulu", type: "Kue & Jajanan", origin: "Bengkulu", description: "Aneka kerupuk ikan olahan laut Bengkulu.", rating: 4.3 },
    { name: "Lema", type: "Hidangan Utama", origin: "Bengkulu", description: "Fermentasi rebung dan ikan, mirip tempoyak tapi bahan dasar rebung.", rating: 4.4 },
    // Minuman
    { name: "Teh Kancing", type: "Minuman", origin: "Bengkulu", description: "Teh tradisional dengan aroma khas.", rating: 4.2 },
    { name: "Kopi Robusta Bengkulu", type: "Minuman", origin: "Bengkulu", description: "Kopi robusta dari dataran tinggi Bengkulu dengan body tebal.", rating: 4.7 },
    { name: "Jus Markisa", type: "Minuman", origin: "Bengkulu", description: "Jus segar dari buah markisa lokal yang asam manis.", rating: 4.5 },
];

async function addAdditionalFoods() {
    console.log('\n🍽️  ADDING ADDITIONAL FOOD ITEMS');
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
        const newItems = ADDITIONAL_FOOD_ITEMS.filter(item => !existingNames.has(item.name.toLowerCase()));
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

        console.log(`\n🎉 Successfully added ${inserted} additional food items!`);

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

addAdditionalFoods();
