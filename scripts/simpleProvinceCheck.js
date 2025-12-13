const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

// Simplified province mapping check
async function checkProvinces() {
    console.log('\n📊 PROVINCE DISTRIBUTION CHECK\n');

    const { data: items, error } = await supabase.from('food_items').select('origin');
    if (error) {
        console.error('Error:', error);
        return;
    }

    const counts = {};
    items.forEach(item => {
        let origin = item.origin;

        // Handle "City, Province" format
        if (origin.includes(',')) {
            origin = origin.split(',').pop().trim();
        }

        counts[origin] = (counts[origin] || 0) + 1;
    });

    // Sort and display
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);

    console.log('Provinces in database:\n');
    sorted.forEach(([prov, count], i) => {
        console.log(`${(i + 1).toString().padStart(2)}. ${prov.padEnd(35)} : ${count} items`);
    });

    console.log(`\nTotal: ${sorted.length} provinces, ${items.length} items`);
}

checkProvinces();
