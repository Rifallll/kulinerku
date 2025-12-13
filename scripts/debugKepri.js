import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { getProvinceFromOrigin } from '../src/utils/provinceMapping.ts';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkKepri() {
    console.log('Checking Kepulauan Riau Items...');

    // Check for items with 'Kepulauan Riau' as origin string
    const { data: kepriItems, error } = await supabase
        .from('food_items')
        .select('name, origin')
        .ilike('origin', '%Kepulauan Riau%');

    console.log(`Items with 'Kepulauan Riau' in origin: ${kepriItems?.length}`);
    if (kepriItems?.length > 0) {
        console.log('Sample:', kepriItems[0]);
        console.log('Mapped to:', getProvinceFromOrigin(kepriItems[0].origin));
    }

    // Check for Batam/Tanjung Pinang
    const { data: cities } = await supabase
        .from('food_items')
        .select('name, origin')
        .or('origin.ilike.%Batam%,origin.ilike.%Tanjung Pinang%');

    console.log(`Items with Batam/Tanjung Pinang: ${cities?.length}`);
    if (cities?.length > 0) {
        console.log('Sample:', cities[0]);
        console.log('Mapped to:', getProvinceFromOrigin(cities[0].origin));
    }
}

checkKepri();
