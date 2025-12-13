import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkSpecificProvinces() {
    const provinces = ['Kalimantan Barat', 'Kepulauan Riau', 'Bangka Belitung', 'Papua Tengah', 'Nusa Tenggara Barat', 'Lampung', 'Bengkulu'];

    console.log('\n📊 Checking province data:\n');

    for (const province of provinces) {
        const { data, error } = await supabase
            .from('food_items')
            .select('name, origin')
            .eq('origin', province);

        if (error) {
            console.error(`Error for ${province}:`, error);
        } else {
            console.log(`${province}: ${data.length} items`);
            if (data.length > 0 && data.length <= 5) {
                data.forEach(item => console.log(`  - ${item.name}`));
            }
        }
    }
}

checkSpecificProvinces();
