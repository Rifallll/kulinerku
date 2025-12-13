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

async function fixBrengkesTag() {
    console.log('Updating Brengkes tempoyak iwak lais tag from Minuman to Makanan...');

    const { data, error } = await supabase
        .from('food_items')
        .update({ type: 'Makanan' })
        .eq('name', 'Brengkes tempoyak iwak lais')
        .select();

    if (error) {
        console.error('Error updating:', error);
    } else {
        console.log('✅ Successfully updated!');
        console.log('Updated item:', data);
    }
}

fixBrengkesTag();
