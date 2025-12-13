import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env file');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function deleteAllMinumanItems() {
    console.log('🔍 Finding all items with type = "Minuman"...\n');

    // First, get all Minuman items to show what will be deleted
    const { data: minumanItems, error: fetchError } = await supabase
        .from('food_items')
        .select('*')
        .eq('type', 'Minuman');

    if (fetchError) {
        console.error('❌ Error fetching items:', fetchError);
        return;
    }

    if (!minumanItems || minumanItems.length === 0) {
        console.log('✅ No items with type = "Minuman" found. Nothing to delete.');
        return;
    }

    console.log(`Found ${minumanItems.length} items to delete:\n`);
    minumanItems.forEach((item, i) => {
        console.log(`${i + 1}. ${item.name} (${item.origin})`);
    });

    console.log('\n⚠️  DELETING ALL MINUMAN ITEMS...\n');

    // Delete all items with type = Minuman
    const { data: deleted, error: deleteError } = await supabase
        .from('food_items')
        .delete()
        .eq('type', 'Minuman')
        .select();

    if (deleteError) {
        console.error('❌ Error deleting items:', deleteError);
        console.error('Error details:', JSON.stringify(deleteError, null, 2));
    } else {
        console.log(`✅ Successfully deleted ${deleted ? deleted.length : 0} items!`);
        if (deleted && deleted.length > 0) {
            console.log('\nDeleted items:');
            deleted.forEach((item, i) => {
                console.log(`${i + 1}. ${item.name}`);
            });
        }
    }

    // Verify deletion
    console.log('\n🔍 Verifying deletion...');
    const { data: remaining, error: verifyError } = await supabase
        .from('food_items')
        .select('*', { count: 'exact', head: true })
        .eq('type', 'Minuman');

    if (!verifyError) {
        console.log(`✅ Remaining Minuman items: 0`);
    }
}

deleteAllMinumanItems();
