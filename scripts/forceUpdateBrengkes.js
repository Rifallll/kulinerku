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

async function forceUpdateBrengkes() {
    console.log('Force updating Brengkes item...\n');

    // First check current state
    const { data: current, error: checkError } = await supabase
        .from('food_items')
        .select('*')
        .ilike('name', '%Brengkes%tempoyak%');

    if (checkError) {
        console.error('Error checking:', checkError);
        return;
    }

    console.log('Current state:');
    current.forEach(item => {
        console.log(`- ${item.name}: Type = "${item.type}"`);
    });

    // Force update by ID
    console.log('\nForce updating all Brengkes items to Makanan...');

    for (const item of current) {
        const { data, error } = await supabase
            .from('food_items')
            .update({ type: 'Makanan' })
            .eq('id', item.id)
            .select();

        if (error) {
            console.error(`Error updating ${item.name}:`, error);
        } else {
            console.log(`✅ Updated ${item.name} to Makanan`);
            console.log(`   New type: ${data[0].type}`);
        }
    }

    // Verify update
    console.log('\nVerifying update...');
    const { data: verified, error: verifyError } = await supabase
        .from('food_items')
        .select('*')
        .ilike('name', '%Brengkes%tempoyak%');

    if (!verifyError) {
        verified.forEach(item => {
            console.log(`✓ ${item.name}: Type = "${item.type}"`);
        });
    }
}

forceUpdateBrengkes();
