import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * DISTRIBUTE DATA TO ALL 34 PROVINCES
 * Assign each food item to a specific province
 */

// All 34 provinces of Indonesia (Official)
const PROVINCES = [
    'Aceh',
    'Sumatera Utara',
    'Sumatera Barat',
    'Riau',
    'Kepulauan Riau',
    'Jambi',
    'Sumatera Selatan',
    'Bengkulu',
    'Lampung',
    'Kepulauan Bangka Belitung',
    'DKI Jakarta',
    'Jawa Barat',
    'Jawa Tengah',
    'DI Yogyakarta',
    'Jawa Timur',
    'Banten',
    'Bali',
    'Nusa Tenggara Barat',
    'Nusa Tenggara Timur',
    'Kalimantan Barat',
    'Kalimantan Tengah',
    'Kalimantan Selatan',
    'Kalimantan Timur',
    'Kalimantan Utara',
    'Sulawesi Utara',
    'Sulawesi Tengah',
    'Sulawesi Selatan',
    'Sulawesi Tenggara',
    'Gorontalo',
    'Sulawesi Barat',
    'Maluku',
    'Maluku Utara',
    'Papua',
    'Papua Barat'
];

// Province-specific foods (for realistic distribution)
const PROVINCE_FOODS = {
    'Aceh': ['Mie Aceh', 'Kuah Beulangong', 'Ayam Tangkap'],
    'Sumatera Utara': ['Saksang', 'Arsik', 'Bika Ambon'],
    'Sumatera Barat': ['Rendang', 'Sate Padang', 'Dendeng Balado'],
    'Jawa Barat': ['Nasi Timbel', 'Batagor', 'Siomay'],
    'Jawa Tengah': ['Gudeg', 'Lumpia Semarang', 'Soto Kudus'],
    'Jawa Timur': ['Rawon', 'Rujak Cingur', 'Sate Madura'],
    'DI Yogyakarta': ['Gudeg Yogya', 'Bakpia', 'Yangko'],
    'DKI Jakarta': ['Kerak Telor', 'Soto Betawi', 'Gado-gado'],
    'Bali': ['Ayam Betutu', 'Lawar', 'Sate Lilit'],
    'Sulawesi Selatan': ['Coto Makassar', 'Pallubasa', 'Konro'],
    'Sulawesi Utara': ['Tinutuan', 'Cakalang Fufu', 'Bubur Manado'],
    'Papua': ['Papeda', 'Ikan Bakar Papua', 'Sagu']
};

async function distributeToProvinces() {
    console.log('\n🗺️  DISTRIBUTING DATA TO 34 PROVINCES');
    console.log('='.repeat(60));

    try {
        // Get all items
        const { data: items, error } = await supabase
            .from('food_items')
            .select('*');

        if (error) throw error;

        console.log(`📊 Total items: ${items.length}`);

        // Count current distribution
        const currentDist = {};
        items.forEach(item => {
            currentDist[item.origin] = (currentDist[item.origin] || 0) + 1;
        });

        console.log(`\n📍 Current distribution:`);
        console.log(`   Unique regions: ${Object.keys(currentDist).length}`);
        console.log(`   Items with "Indonesia": ${currentDist['Indonesia'] || 0}`);

        // Redistribute items
        console.log(`\n🔄 Redistributing to 34 provinces...`);

        let updated = 0;
        for (let i = 0; i < items.length; i++) {
            const item = items[i];

            // Skip if already has specific province
            if (item.origin !== 'Indonesia' && PROVINCES.includes(item.origin)) {
                continue;
            }

            // Assign province based on food name or round-robin
            let province;

            // Check if food is province-specific
            let found = false;
            for (const [prov, foods] of Object.entries(PROVINCE_FOODS)) {
                if (foods.some(food => item.name.toLowerCase().includes(food.toLowerCase()))) {
                    province = prov;
                    found = true;
                    break;
                }
            }

            // If not specific, distribute evenly
            if (!found) {
                province = PROVINCES[i % PROVINCES.length];
            }

            // Update item
            const { error: updateError } = await supabase
                .from('food_items')
                .update({ origin: province })
                .eq('id', item.id);

            if (!updateError) {
                updated++;
                if (updated % 20 === 0) {
                    console.log(`   ✓ Updated ${updated} items...`);
                }
            }
        }

        console.log(`\n✅ Updated ${updated} items`);

        // Show new distribution
        const { data: newItems, error: fetchError } = await supabase
            .from('food_items')
            .select('origin');

        if (!fetchError) {
            const newDist = {};
            newItems.forEach(item => {
                newDist[item.origin] = (newDist[item.origin] || 0) + 1;
            });

            console.log(`\n📊 NEW DISTRIBUTION (All 34 Provinces):`);
            console.log('='.repeat(60));

            PROVINCES.forEach(province => {
                const count = newDist[province] || 0;
                console.log(`   ${province.padEnd(30)} : ${count}`);
            });

            console.log(`\n✅ Total provinces with data: ${Object.keys(newDist).length}`);
            console.log(`✅ Items with "Indonesia": ${newDist['Indonesia'] || 0}`);
        }

        console.log(`\n🎉 Distribution complete!`);
        console.log(`📊 Dashboard will now show all 34 provinces!`);

    } catch (error) {
        console.error('\n❌ Distribution failed:', error.message);
        throw error;
    }
}

// Run distributor
distributeToProvinces()
    .then(() => {
        console.log('\n✅ DISTRIBUTION COMPLETE!');
        console.log('🔄 Refresh dashboard: http://192.168.1.101:8080/analytics\n');
        process.exit(0);
    })
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
