import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * Remove all items with generic "Indonesia" origin
 */
async function removeIndonesiaItems() {
    console.log('\n🗑️  REMOVING GENERIC "INDONESIA" ITEMS');
    console.log('='.repeat(50));

    try {
        // Find items with "Indonesia" origin
        const { data: items, error: fetchError } = await supabase
            .from('food_items')
            .select('*')
            .eq('origin', 'Indonesia');

        if (fetchError) throw fetchError;

        console.log(`📊 Found ${items.length} items with "Indonesia" origin`);

        if (items.length === 0) {
            console.log('✅ No items to delete!');
            return;
        }

        console.log('\n🗑️  Deleting items...');

        // Delete all items with "Indonesia" origin
        const { error: deleteError } = await supabase
            .from('food_items')
            .delete()
            .eq('origin', 'Indonesia');

        if (deleteError) throw deleteError;

        console.log(`✅ Deleted ${items.length} items with "Indonesia" origin`);

        // Verify
        const { data: remaining, error: verifyError } = await supabase
            .from('food_items')
            .select('origin')
            .eq('origin', 'Indonesia');

        if (!verifyError) {
            console.log(`\n✅ Verification: ${remaining.length} items with "Indonesia" remaining`);
        }

        // Show distribution
        const { data: all, error: allError } = await supabase
            .from('food_items')
            .select('origin');

        if (!allError) {
            const dist = {};
            all.forEach(item => {
                dist[item.origin] = (dist[item.origin] || 0) + 1;
            });

            console.log(`\n📊 Current Distribution:`);
            console.log(`   Total provinces: ${Object.keys(dist).length}`);
            console.log(`   Total items: ${all.length}`);
        }

        console.log(`\n🎉 Cleanup complete!`);

    } catch (error) {
        console.error('\n❌ Removal failed:', error.message);
        throw error;
    }
}

// Run
removeIndonesiaItems()
    .then(() => {
        console.log('\n✅ REMOVAL COMPLETE!');
        console.log('🔄 Refresh dashboard: http://192.168.1.101:8080/analytics\n');
        process.exit(0);
    })
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
