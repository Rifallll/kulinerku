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

async function updateByID() {
    console.log('Finding Brengkes item...\n');

    // Get the item
    const { data: items, error: fetchError } = await supabase
        .from('food_items')
        .select('id, name, type')
        .ilike('name', '%Brengkes%tempoyak%');

    if (fetchError) {
        console.error('Fetch error:', fetchError);
        return;
    }

    if (!items || items.length === 0) {
        console.log('Item not found!');
        return;
    }

    console.log('Found item:');
    const item = items[0];
    console.log(`ID: ${item.id}`);
    console.log(`Name: ${item.name}`);
    console.log(`Current Type: ${item.type}\n`);

    // Update by ID
    console.log('Updating to Makanan...');
    const { data: updated, error: updateError } = await supabase
        .from('food_items')
        .update({ type: 'Makanan' })
        .eq('id', item.id)
        .select();

    if (updateError) {
        console.error('Update error:', updateError);
        console.error('Error details:', JSON.stringify(updateError, null, 2));
    } else if (updated && updated.length > 0) {
        console.log('✅ Update successful!');
        console.log(`New type: ${updated[0].type}`);
    } else {
        console.log('⚠️ Update returned no data');
    }
}

updateByID();
