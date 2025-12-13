import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkProvinces() {
    const { data, error } = await supabase.from('food_items').select('origin');
    if (error) {
        console.error(error);
        return;
    }

    const counts = {};
    data.forEach(item => {
        let origin = item.origin;
        if (origin.includes(',')) origin = origin.split(',')[1].trim();
        counts[origin] = (counts[origin] || 0) + 1;
    });

    console.log('Province Counts:', counts);
}

checkProvinces();
