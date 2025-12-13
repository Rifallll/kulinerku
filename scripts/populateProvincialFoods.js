import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const ALL_PROVINCES_DATA = {
    'Jawa Tengah': {
        makanan: ['Gudeg', 'Sate Kelinci', 'Tahu Gimbal', 'Mie Ongklok', 'Sate Ayam', 'Tahu Tempe Bacem'],
        minuman: ['Es Dawet', 'Sekoteng', 'Teh Talua']
    },
    'Jawa Timur': {
        makanan: ['Rawon', 'Sate Lalat', 'Lontong Balap', 'Tahu Campur', 'Soto Lamongan'],
        minuman: ['Es Goyobod', 'Kopi Tubruk']
    },
    'Jawa Barat': {
        makanan: ['Batagor', 'Nasi Goreng Cianjur', 'Mie Kocok', 'Nasi Timbel', 'Sate Maranggi'],
        minuman: ['Bandrek', 'Es Cincau', 'Teh Talua']
    },
    'DKI Jakarta': {
        makanan: ['Kerak Telor', 'Nasi Uduk', 'Soto Betawi', 'Gado-Gado', 'Nasi Campur'],
        minuman: ['Es Podeng', 'Es Kelapa Muda']
    },
    'Sumatera Barat': {
        makanan: ['Rendang', 'Sate Padang', 'Gulai Tambusu', 'Dendeng Balado', 'Nasi Kapau'],
        minuman: ['Es Teh Talua', 'Bandrek']
    },
    'DI Yogyakarta': {
        makanan: ['Gudeg', 'Sate Klathak', 'Tahu Tempe Bacem', 'Mie Lethek', 'Nasi Kuning'],
        minuman: ['Teh Talua', 'Sekoteng', 'Es Dawet']
    },
    'Sumatera Utara': {
        makanan: ['Bika Ambon', 'Sate Kelinci', 'Arsik', 'Ikan Mas Arsik', 'Sambal Tuktuk'],
        minuman: ['Tuak', 'Jus Durian']
    },
    'Bali': {
        makanan: ['Babi Guling', 'Ayam Betutu', 'Lawar', 'Sate Lilit', 'Sate Plecing'],
        minuman: ['Arak Bali', 'Es Kelapa Muda']
    },
    'Aceh': {
        makanan: ['Mie Aceh', 'Nasi Gurih', 'Ayam Tangkap', 'Roti Canai', 'Mie Rebus'],
        minuman: ['Kopi Aceh', 'Es Kopyor']
    },
    'Kalimantan Utara': {
        makanan: ['Kepiting Soka', 'Ikan Bakar', 'Nasi Kuning', 'Bubur Pedas'],
        minuman: ['Jus Kelapa', 'Es Jeruk']
    },
    'Kalimantan Selatan': {
        makanan: ['Soto Banjar', 'Nasi Kuning', 'Ikan Bakar', 'Laksa Banjar'],
        minuman: ['Kopi Banjar', 'Es Jeruk']
    },
    'Sulawesi Selatan': {
        makanan: ['Coto Makassar', 'Konro', 'Pallubasa', 'Sate Maranggi', 'Tinutuan'],
        minuman: ['Teh Kacang', 'Es Pisang Ijo']
    },
    'Papua': {
        makanan: ['Sate Ulat Sagu', 'Ikan Bakar', 'Papeda', 'Sagu Lapek', 'Ikan Kuah Kuning'],
        minuman: ['Teh Papua', 'Jus Durian']
    },
    'Gorontalo': {
        makanan: ['Ayam Penyet', 'Binte Biluhuta', 'Ikan Bakar', 'Soto Gorontalo'],
        minuman: ['Teh Gorontalo', 'Es Kacang Merah']
    },
    'Riau': {
        makanan: ['Sate Selamet', 'Lontong Sayur', 'Gulai Ikan', 'Nasi Lemak'],
        minuman: ['Teh Talua', 'Es Teler']
    },
    'Bengkulu': {
        makanan: ['Pendap', 'Sate Rembiga', 'Ikan Bakar', 'Sambal Bumi'],
        minuman: ['Jus Durian', 'Teh Bengkulu']
    },
    'Nusa Tenggara Timur': {
        makanan: ['Se\'i', 'Kolo', 'Jagung Bose', 'Sate Maranggi'],
        minuman: ['Es Kacang', 'Teh Talua']
    },
    'Kalimantan Barat': {
        makanan: ['Bubur Pedas', 'Sate Kerang', 'Nasi Goreng Pontianak', 'Soto Banjar'],
        minuman: ['Jus Durian', 'Es Jeruk']
    },
    'Lampung': {
        makanan: ['Seruit', 'Tempoyak', 'Pempek', 'Nasi Uduk Lampung'],
        minuman: ['Teh Susu', 'Jus Mangga']
    },
    'Kepulauan Bangka Belitung': {
        makanan: ['Mie Belitung', 'Sate Bangka', 'Lontong Nangka'],
        minuman: ['Es Jeruk', 'Teh Talua']
    },
    'Banten': {
        makanan: ['Sate Bandeng', 'Nasi Uduk Banten', 'Emping', 'Nasi Liwet'],
        minuman: ['Teh Talua', 'Es Jeruk']
    },
    'Kalimantan Timur': {
        makanan: ['Ayam Cincane', 'Ikan Bakar', 'Soto Banjar', 'Kakap Bakar'],
        minuman: ['Kopi Banjar', 'Es Jeruk']
    },
    'Nusa Tenggara Barat': {
        makanan: ['Ayam Taliwang', 'Sate Rembiga', 'Bebalung'],
        minuman: ['Es Kelapa Muda', 'Teh Talua']
    },
    'Maluku': {
        makanan: ['Papeda', 'Ikan Kuah Kuning', 'Nasi Laha', 'Soto Ambon'],
        minuman: ['Sopi', 'Es Kacang']
    },
    'Sulawesi Tengah': {
        makanan: ['Kaledo', 'Bubur Manado', 'Ikan Bakar', 'Dabu-Dabu'],
        minuman: ['Es Kacang', 'Teh Talua']
    },
    'Sulawesi Utara': {
        makanan: ['Tinutuan', 'Ayam Betutu', 'Ikan Kuah Asam', 'Paniki'],
        minuman: ['Teh Manado', 'Kopi Toraja']
    },
    'Maluku Utara': {
        makanan: ['Gohu Ikan', 'Papeda', 'Nasi Laha', 'Ikan Bakar'],
        minuman: ['Teh Talua', 'Es Kacang']
    },
    'Sulawesi Tenggara': {
        makanan: ['Ikan Bakar', 'Karedok', 'Sate Maranggi', 'Nasi Kuning'],
        minuman: ['Es Kelapa Muda', 'Teh Talua']
    },
    'Kalimantan Tengah': {
        makanan: ['Juhu Singkah', 'Ikan Bakar', 'Soto Banjar'],
        minuman: ['Es Jeruk', 'Kopi Banjar']
    },
    'Papua Barat': {
        makanan: ['Ikan Bakar Manokwari', 'Sate Kelinci', 'Papeda'],
        minuman: ['Teh Papua', 'Jus Buah Tropis']
    },
    'Sulawesi Barat': {
        makanan: ['Ikan Bakar', 'Coto Makassar', 'Sate Maranggi', 'Tinutuan'],
        minuman: ['Es Pisang Ijo', 'Teh Talua']
    },
    'Kepulauan Riau': {
        makanan: ['Otak-Otak', 'Gonggong', 'Lontong Sayur'],
        minuman: ['Es Teh', 'Air Nira']
    },
    'Jambi': {
        makanan: ['Gulai Tepek Ikan', 'Tempoyak', 'Nasi Goreng Jambi'],
        minuman: ['Teh Jambi', 'Es Durian']
    },
    'Sumatera Selatan': {
        makanan: ['Pempek', 'Martabak Har', 'Sate Pindang'],
        minuman: ['Teh Susu', 'Jus Kelapa Muda']
    }
};

async function populateAllProvinces() {
    console.log('\n🇮🇩 POPULATING ALL 34 PROVINCES');
    console.log('='.repeat(70));
    console.log('Complete data for every province in Indonesia\n');

    try {
        let totalInserted = 0;
        let totalSkipped = 0;

        for (const [province, foods] of Object.entries(ALL_PROVINCES_DATA)) {
            console.log(`\n📍 ${province}:`);
            console.log(`   Makanan: ${foods.makanan.length} | Minuman: ${foods.minuman.length}`);

            for (const food of foods.makanan) {
                const { data: existing } = await supabase
                    .from('food_items')
                    .select('id')
                    .eq('name', food)
                    .single();

                if (existing) {
                    totalSkipped++;
                    continue;
                }

                const { error } = await supabase
                    .from('food_items')
                    .insert([{
                        name: food,
                        type: 'Makanan',
                        origin: province,
                        description: `Makanan khas ${province}`,
                        rating: 4.2 + Math.random() * 0.8,
                        imageUrl: `https://via.placeholder.com/400x300?text=${encodeURIComponent(food)}`,
                        mostIconic: true
                    }]);

                if (!error) totalInserted++;
            }

            for (const drink of foods.minuman) {
                const { data: existing } = await supabase
                    .from('food_items')
                    .select('id')
                    .eq('name', drink)
                    .single();

                if (existing) {
                    totalSkipped++;
                    continue;
                }

                const { error } = await supabase
                    .from('food_items')
                    .insert([{
                        name: drink,
                        type: 'Minuman',
                        origin: province,
                        description: `Minuman khas ${province}`,
                        rating: 4.2 + Math.random() * 0.8,
                        imageUrl: `https://via.placeholder.com/400x300?text=${encodeURIComponent(drink)}`,
                        mostIconic: true
                    }]);

                if (!error) totalInserted++;
            }

            console.log(`   ✓ Done`);
        }

        const { data: all } = await supabase.from('food_items').select('origin, type');
        const dist = {};
        all.forEach(item => {
            if (!dist[item.origin]) dist[item.origin] = { makanan: 0, minuman: 0 };
            if (item.type === 'Makanan') dist[item.origin].makanan++;
            else dist[item.origin].minuman++;
        });

        console.log(`\n📊 FINAL DISTRIBUTION:`);
        console.log('='.repeat(70));
        Object.entries(dist)
            .sort((a, b) => (b[1].makanan + b[1].minuman) - (a[1].makanan + a[1].minuman))
            .forEach(([province, counts]) => {
                console.log(`   ${province.padEnd(30)} | M: ${counts.makanan.toString().padStart(2)} | Min: ${counts.minuman.toString().padStart(2)}`);
            });

        console.log(`\n✅ Inserted: ${totalInserted} | Skipped: ${totalSkipped}`);

    } catch (error) {
        console.error('\n❌ Failed:', error.message);
        throw error;
    }
}

populateAllProvinces()
    .then(() => {
        console.log('\n✅ ALL 34 PROVINCES COMPLETE!');
        console.log('🔄 http://192.168.1.101:8080/analytics\n');
        process.exit(0);
    })
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
