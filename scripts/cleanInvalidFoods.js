import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * CLEAN INVALID FOOD NAMES
 * Remove anything that's not actual Indonesian food
 */

// Keywords yang BUKAN makanan (harus dihapus)
const INVALID_KEYWORDS = [
    // Negara/Tempat
    'Amerika', 'Serikat', 'Hawaii', 'Italia', 'Jepang', 'China', 'Korea',
    'Thailand', 'Vietnam', 'Malaysia', 'Singapura', 'Filipina',

    // Kata umum/metadata
    'Kategori', 'Reid', 'Anthony', 'Hagelslag', 'meses',
    'Wikipedia', 'Referensi', 'Sumber', 'Artikel', 'Halaman',
    'Lihat', 'Baca', 'Pranala', 'Templat', 'Berkas',

    // Kata non-makanan
    'Sejarah', 'Budaya', 'Tradisi', 'Adat', 'Upacara',
    'Festival', 'Perayaan', 'Acara', 'Event',

    // Angka/tahun
    '1450', '2014', '2015', '2016', '2017', '2018', '2019', '2020',

    // Kata asing
    'The', 'And', 'Or', 'In', 'On', 'At', 'To', 'From'
];

async function cleanInvalidFoods() {
    console.log('\n🧹 CLEANING INVALID FOOD NAMES');
    console.log('='.repeat(70));
    console.log('Removing non-food items from database\n');

    try {
        // Get all items
        const { data: allItems, error: fetchError } = await supabase
            .from('food_items')
            .select('*');

        if (fetchError) throw fetchError;

        console.log(`📊 Total items in database: ${allItems.length}\n`);

        let deletedCount = 0;
        const deletedItems = [];

        for (const item of allItems) {
            let shouldDelete = false;

            // Check if name contains invalid keywords
            for (const keyword of INVALID_KEYWORDS) {
                if (item.name.toLowerCase().includes(keyword.toLowerCase())) {
                    shouldDelete = true;
                    break;
                }
            }

            // Check if name is too short (likely not a real food name)
            if (item.name.length < 3) {
                shouldDelete = true;
            }

            // Check if name is all numbers
            if (/^\d+$/.test(item.name)) {
                shouldDelete = true;
            }

            // Check if name contains only special characters
            if (/^[^a-zA-Z0-9\s]+$/.test(item.name)) {
                shouldDelete = true;
            }

            if (shouldDelete) {
                console.log(`  ❌ Deleting: "${item.name}" (${item.origin})`);

                const { error: deleteError } = await supabase
                    .from('food_items')
                    .delete()
                    .eq('id', item.id);

                if (!deleteError) {
                    deletedCount++;
                    deletedItems.push(item.name);
                }
            }
        }

        console.log(`\n📊 CLEANUP SUMMARY:`);
        console.log(`   ❌ Deleted: ${deletedCount} invalid items`);
        console.log(`   ✅ Remaining: ${allItems.length - deletedCount} valid items`);

        if (deletedItems.length > 0) {
            console.log(`\n🗑️  Deleted items:`);
            deletedItems.forEach(name => console.log(`   - ${name}`));
        }

        // Show final distribution
        const { data: remaining } = await supabase
            .from('food_items')
            .select('origin, type');

        const dist = {};
        remaining.forEach(item => {
            if (!dist[item.origin]) dist[item.origin] = { makanan: 0, minuman: 0 };
            if (item.type === 'Makanan') dist[item.origin].makanan++;
            else dist[item.origin].minuman++;
        });

        console.log(`\n📍 CLEAN DISTRIBUTION:`);
        console.log('='.repeat(70));
        Object.entries(dist)
            .sort((a, b) => (b[1].makanan + b[1].minuman) - (a[1].makanan + a[1].minuman))
            .forEach(([province, counts]) => {
                console.log(`   ${province.padEnd(30)} | M: ${counts.makanan.toString().padStart(2)} | Min: ${counts.minuman.toString().padStart(2)}`);
            });

    } catch (error) {
        console.error('\n❌ Cleanup failed:', error.message);
        throw error;
    }
}

// Run
cleanInvalidFoods()
    .then(() => {
        console.log('\n✅ CLEANUP COMPLETE!');
        console.log('🔄 Refresh: http://192.168.1.101:8080/analytics\n');
        process.exit(0);
    })
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
