
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

const determineCategory = (name, desc, originalType) => {
    const text = (name + " " + desc).toLowerCase();
    const typeLower = (originalType || "").toLowerCase();

    // STRICT RULES FIRST
    if (name.toLowerCase().includes('mie ') || name.toLowerCase().includes('mi ') || typeLower.includes('noodle')) return 'Mie & Pasta';
    if (name.toLowerCase().includes('nasi') || name.toLowerCase().includes('lontong') || name.toLowerCase().includes('ketupat')) return 'Hidangan Nasi';
    if (name.toLowerCase().includes('sate') || typeLower.includes('satay')) return 'Sate';
    if (name.toLowerCase().includes('soto') || name.toLowerCase().includes('sup ') || name.toLowerCase().includes('sop ')) return 'Sup & Soto';

    // REGEX for beverages
    if (/\bes\s/.test(name.toLowerCase()) || /\bes\s/.test(desc.toLowerCase()) || name.toLowerCase().startsWith('es ') || text.includes('drink') || text.includes('beverage') || text.includes('wedang') || text.includes('teh ') || text.includes('kopi ') || text.includes('juice') || text.includes('jus ')) {
        // Exclude false positives like "Meat" (processed?)
        if (!text.includes('noodle') && !text.includes('rice') && !text.includes('chicken') && !text.includes('meat')) {
            return 'Minuman';
        }
    }

    if (text.includes('ayam') || text.includes('bebek') || text.includes('duck') || text.includes('chicken')) return 'Olahan Ayam & Unggas';

    // Check specific keywords for others
    if (text.includes('kambing') || text.includes('sapi') || text.includes('buntut') || text.includes('iga ') || text.includes('beef') || text.includes('lamb')) return 'Daging & Iga';
    if (text.includes('ikan') || text.includes('udang') || text.includes('cumi') || text.includes('seafood') || text.includes('fish') || text.includes('crab')) return 'Ikan & Seafood';
    if (text.includes('sayur') || text.includes('gado-gado') || text.includes('karedok') || text.includes('pecel')) return 'Sayuran';

    if (text.includes('martabak') || text.includes('snack') || text.includes('cake') || text.includes('kue') || text.includes('pisang') || text.includes('dessert') || text.includes('sweet')) return 'Jajanan & Makanan Ringan';

    if (text.includes('sambal')) return 'Sambal & Saus';

    return 'Lainnya'; // Keep existing if unsure, or 'Lainnya'
};

async function fix() {
    console.log("Fixing classifications...");
    const { data: foods } = await supabase.from('food_items').select('*');

    let updates = 0;

    for (const food of foods) {
        // Only re-eval items that might be wrong, OR just re-run all.
        // Re-run all is safer to correct the "Minuman" errors.

        let newType = determineCategory(food.name, food.description || "", food.originalType);

        // Special override for known errors from previous run
        if (food.name.toLowerCase().includes('mie ') && newType !== 'Mie & Pasta') newType = 'Mie & Pasta';
        if (food.name.toLowerCase().includes('nasi') && newType !== 'Hidangan Nasi') newType = 'Hidangan Nasi';

        if (newType !== food.type && newType !== 'Lainnya') {
            console.log(`Fixing ${food.name}: ${food.type} -> ${newType}`);
            await supabase.from('food_items').update({ type: newType }).eq('id', food.id);
            updates++;
        }
    }
    console.log(`Fixed ${updates} items.`);
}

fix();
