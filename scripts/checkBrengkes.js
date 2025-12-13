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

async function checkAndFixBrengkes() {
    console.log('Checking Brengkes tempoyak iwak lais...\n');

    // Search for items containing "Brengkes"
    const { data: items, error: searchError } = await supabase
        .from('food_items')
        .select('*')
        .ilike('name', '%Brengkes%');

    if (searchError) {
        console.error('Error searching:', searchError);
        return;
    }

    console.log(`Found ${items.length} items with "Brengkes" in name:\n`);

    items.forEach((item, index) => {
        console.log(`${index + 1}. Name: "${item.name}"`);
        console.log(`   Type: ${item.type}`);
        console.log(`   Origin: ${item.origin}`);
        console.log(`   ID: ${item.id}\n`);
    });

    // Update any that are not "Makanan"
    const needsUpdate = items.filter(item => item.type !== 'Makanan');

    if (needsUpdate.length > 0) {
        console.log(`\nUpdating ${needsUpdate.length} items to Makanan...`);

        for (const item of needsUpdate) {
            const { error: updateError } = await supabase
                .from('food_items')
                .update({ type: 'Makanan' })
                .eq('id', item.id);

            if (updateError) {
                console.error(`Error updating ${item.name}:`, updateError);
            } else {
                console.log(`✅ Updated "${item.name}" to Makanan`);
            }
        }
    } else {
        console.log('\n✅ All Brengkes items are already tagged as Makanan!');
    }
}

checkAndFixBrengkes();
