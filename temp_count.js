
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
    const { count: minCount, error: minError } = await supabase
        .from('food_items')
        .select('*', { count: 'exact', head: true })
        .eq('type', 'Minuman');

    const { count: totalCount, error: totError } = await supabase
        .from('food_items')
        .select('*', { count: 'exact', head: true });

    if (minError || totError) {
        console.error("Error:", minError, totError);
        return;
    }

    const foodCount = totalCount - minCount;

    console.log(`Minuman: ${minCount} items (${Math.ceil(minCount / 9)} Pages)`);
    console.log(`Makanan: ${foodCount} items (${Math.ceil(foodCount / 9)} Pages)`);
    console.log(`Total: ${totalCount} items (${Math.ceil(totalCount / 9)} Pages)`);
}

run();
