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

async function findAndFixMinumanItems() {
    console.log('Finding all items tagged as Minuman...\n');

    // First, find all items with type = Minuman
    const { data: minumanItems, error: fetchError } = await supabase
        .from('food_items')
        .select('*')
        .eq('type', 'Minuman');

    if (fetchError) {
        console.error('Error fetching:', fetchError);
        return;
    }

    console.log(`Found ${minumanItems.length} items tagged as Minuman:\n`);

    minumanItems.forEach((item, index) => {
        console.log(`${index + 1}. ${item.name} (${item.origin})`);
    });

    // Now update all Minuman to Makanan
    console.log('\n\nUpdating all Minuman items to Makanan...');

    const { data: updated, error: updateError } = await supabase
        .from('food_items')
        .update({ type: 'Makanan' })
        .eq('type', 'Minuman')
        .select();

    if (updateError) {
        console.error('Error updating:', updateError);
    } else {
        console.log(`\n✅ Successfully updated ${updated.length} items from Minuman to Makanan!`);
    }
}

findAndFixMinumanItems();
