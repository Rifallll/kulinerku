import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { getProvinceFromOrigin } from '../src/utils/provinceMapping.ts';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function listProvinces() {
    const { data } = await supabase.from('food_items').select('origin');
    const provinces = new Set();
    data.forEach(item => {
        const p = getProvinceFromOrigin(item.origin);
        if (p !== 'Indonesia' && p !== 'Unknown') provinces.add(p);
    });

    console.log(`Total Unique Provinces: ${provinces.size}`);
    console.log(Array.from(provinces).sort().join('\n'));
}

listProvinces();
