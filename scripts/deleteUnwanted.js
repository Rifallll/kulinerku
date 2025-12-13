
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function deleteUnwantedFoods() {
    console.log("Deleting 'Kidu' and 'Lainnya' items...");

    // Delete Kidu specifically
    const { error: errorKidu } = await supabase
        .from('food_items')
        .delete()
        .eq('name', 'Kidu');

    if (errorKidu) console.error("Error deleting Kidu:", errorKidu);
    else console.log("Deleted Kidu.");

    // Delete items with type 'Lainnya'
    const { error: errorLainnya } = await supabase
        .from('food_items')
        .delete()
        .eq('type', 'Lainnya');

    if (errorLainnya) console.error("Error deleting Lainnya items:", errorLainnya);
    else console.log("Deleted Lainnya items.");
}

deleteUnwantedFoods();
