import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function findKalimantanItems() {
    const { data, error } = await supabase
        .from('food_items')
        .select('name, origin')
        .or('origin.ilike.%Kalimantan Barat%,origin.ilike.%Kepulauan Riau%');

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log('\n📊 Found items:\n');
    const byOrigin = {};
    data.forEach(item => {
        if (!byOrigin[item.origin]) byOrigin[item.origin] = [];
        byOrigin[item.origin].push(item.name);
    });

    Object.entries(byOrigin).forEach(([origin, items]) => {
        console.log(`\n${origin} (${items.length} items):`);
        items.slice(0, 3).forEach(name => console.log(`  - ${name}`));
        if (items.length > 3) console.log(`  ... and ${items.length - 3} more`);
    });
}

findKalimantanItems();
