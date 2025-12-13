import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

// Import the centralized mapping
import { getProvinceFromOrigin } from '../src/utils/provinceMapping.ts';

async function checkProvinceDistribution() {
    console.log('\n📊 Checking Province Distribution\n');
    console.log('='.repeat(70));

    try {
        const { data: items, error } = await supabase
            .from('food_items')
            .select('origin');

        if (error) throw error;

        // Process with centralized function
        const provinceCounts = {};

        items.forEach(item => {
            const province = getProvinceFromOrigin(item.origin);
            provinceCounts[province] = (provinceCounts[province] || 0) + 1;
        });

        // Sort by count descending
        const sorted = Object.entries(provinceCounts)
            .sort((a, b) => b[1] - a[1]);

        console.log('\nProvinsi dengan data (sorted by count):\n');
        sorted.forEach(([province, count], index) => {
            const marker = province === 'Indonesia' ? '⚠️ ' : '✓ ';
            console.log(`${(index + 1).toString().padStart(2)}. ${marker}${province.padEnd(30)} : ${count} items`);
        });

        console.log('\n' + '='.repeat(70));
        console.log(`Total Provinces: ${sorted.length}`);
        console.log(`Total Items: ${items.length}`);

        // Check for "Indonesia" generic entries
        const indonesiaCount = provinceCounts['Indonesia'] || 0;
        if (indonesiaCount > 0) {
            console.log(`\n⚠️  WARNING: ${indonesiaCount} items have generic "Indonesia" origin`);
        }

        // List provinces with data
        console.log('\n📋 All provinces with data:');
        const provinces = sorted.map(([p]) => p).filter(p => p !== 'Indonesia');
        console.log(provinces.join(', '));

    } catch (error) {
        console.error('\n❌ Error:', error.message);
    }
}

checkProvinceDistribution();
