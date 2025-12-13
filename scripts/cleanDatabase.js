import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * Clean database - remove items with generic "Indonesia" origin
 * Keep only items with specific regions
 */
async function cleanDatabase() {
    console.log('🧹 CLEANING DATABASE');
    console.log('='.repeat(50));
    console.log('Removing items with generic "Indonesia" origin...\n');

    try {
        // Get all items
        const { data: allItems, error: fetchError } = await supabase
            .from('food_items')
            .select('id, name, origin');

        if (fetchError) throw fetchError;

        console.log(`📊 Total items in database: ${allItems.length}`);

        // Find items with generic "Indonesia" origin
        const genericItems = allItems.filter(item => item.origin === 'Indonesia');

        console.log(`🗑️  Items with generic "Indonesia": ${genericItems.length}`);
        console.log(`✅ Items with specific regions: ${allItems.length - genericItems.length}\n`);

        if (genericItems.length > 0) {
            console.log('Deleting generic items...');

            // Delete in batches
            let deleted = 0;
            for (const item of genericItems) {
                const { error } = await supabase
                    .from('food_items')
                    .delete()
                    .eq('id', item.id);

                if (!error) {
                    deleted++;
                    if (deleted % 20 === 0) {
                        console.log(`  ✓ Deleted ${deleted} items...`);
                    }
                }
            }

            console.log(`\n✅ Deleted ${deleted} generic items`);
        }

        // Show remaining distribution
        const { data: remaining, error: remainError } = await supabase
            .from('food_items')
            .select('origin');

        if (!remainError) {
            const distribution = {};
            remaining.forEach(item => {
                distribution[item.origin] = (distribution[item.origin] || 0) + 1;
            });

            console.log('\n📊 Regional Distribution After Cleaning:');
            Object.entries(distribution)
                .sort((a, b) => b[1] - a[1])
                .forEach(([region, count]) => {
                    console.log(`   ${region}: ${count}`);
                });
        }

        console.log('\n✅ Database cleaned!');
        console.log('🔄 Now run: npm run scrape:trending');

    } catch (error) {
        console.error('\n❌ Cleaning failed:', error.message);
        throw error;
    }
}

// Run cleaner
cleanDatabase()
    .then(() => {
        console.log('\n✅ CLEANING COMPLETE!');
        process.exit(0);
    })
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
