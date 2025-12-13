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

async function updateAllMinumanToMakanan() {
    console.log('Checking all items with type = Minuman...\n');

    // Get all Minuman items
    const { data: minumanItems, error: fetchError } = await supabase
        .from('food_items')
        .select('*')
        .eq('type', 'Minuman');

    if (fetchError) {
        console.error('Error fetching:', fetchError);
        return;
    }

    console.log(`Found ${minumanItems ? minumanItems.length : 0} items with type = Minuman`);

    if (minumanItems && minumanItems.length > 0) {
        console.log('\nItems to update:');
        minumanItems.forEach((item, i) => {
            console.log(`${i + 1}. ${item.name}`);
        });

        // Update all to Makanan
        console.log('\nUpdating all to Makanan...');
        const { data: updated, error: updateError } = await supabase
            .from('food_items')
            .update({ type: 'Makanan' })
            .eq('type', 'Minuman')
            .select();

        if (updateError) {
            console.error('Error updating:', updateError);
        } else {
            console.log(`\n✅ Successfully updated ${updated ? updated.length : 0} items!`);
        }
    } else {
        console.log('\n✅ No items with type = Minuman found. All good!');
    }

    // Double check Brengkes specifically
    console.log('\n\nDouble-checking Brengkes item...');
    const { data: brengkes, error: brengkesError } = await supabase
        .from('food_items')
        .select('*')
        .ilike('name', '%Brengkes%');

    if (!brengkesError && brengkes) {
        brengkes.forEach(item => {
            console.log(`- ${item.name}: Type = "${item.type}"`);
        });
    }
}

updateAllMinumanToMakanan();
