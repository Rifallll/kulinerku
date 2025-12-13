
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function verify() {
    console.log("Fetching unique regions...");
    const { data, error } = await supabase
        .from('food_items')
        .select('origin');

    if (error) {
        console.error(error);
        return;
    }

    const counts = {};
    data.forEach(item => {
        counts[item.origin] = (counts[item.origin] || 0) + 1;
    });

    console.log("Region Counts:");
    Object.entries(counts)
        .sort((a, b) => b[1] - a[1]) // Sort by count desc
        .forEach(([region, count]) => {
            console.log(`${region}: ${count}`);
        });
}

verify();
