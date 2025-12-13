
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
    console.log("Starting correction and count...");

    // 1. Correct the misclassified item
    const { error: updateError } = await supabase
        .from('food_items')
        .update({ type: 'Ikan & Seafood' })
        .eq('name', 'Brengkes tempoyak iwak lais');

    if (updateError) console.error("Update Error:", updateError);
    else console.log("Correction for 'Brengkes tempoyak iwak lais' applied (Type -> Ikan & Seafood).");

    // 2. Get Counts
    const { count: minCount, error: minError } = await supabase
        .from('food_items')
        .select('*', { count: 'exact', head: true })
        .eq('type', 'Makanan');

    const { count: totalCount, error: totError } = await supabase
        .from('food_items')
        .select('*', { count: 'exact', head: true });

    if (minError || totError) {
        console.error("Count Error:", minError, totError);
        return;
    }

    const foodCount = totalCount - minCount;

    console.log(`\n=== FINAL COUNTS ===`);
    console.log(`Minuman: ${minCount} items -> ${Math.ceil(minCount / 9)} Pages`);
    console.log(`Makanan (Total - Minuman): ${foodCount} items -> ${Math.ceil(foodCount / 9)} Pages`);
    console.log(`Total Semua: ${totalCount} items -> ${Math.ceil(totalCount / 9)} Pages`);
}

run();
