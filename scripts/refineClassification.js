
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

const determineCategory = (name, desc, originalType) => {
    const text = (name + " " + desc + " " + (originalType || "")).toLowerCase();

    if (text.includes('beverage') || text.includes('drink') || text.includes('es ') || text.includes('wedang') || text.includes('kopi') || text.includes('teh') || text.includes('jus')) return 'Minuman';
    if (text.includes('sate') || text.includes('satay')) return 'Sate';
    if (text.includes('soto') || text.includes('soup') || text.includes('sup ') || text.includes('sop ') || text.includes('rawon') || text.includes('kuah')) return 'Sup & Soto';
    if (text.includes('nasi') || text.includes('lontong') || text.includes('ketupat') || text.includes('rice')) return 'Hidangan Nasi';
    if (text.includes('mie') || text.includes('noodle') || text.includes('bihun') || text.includes('kwetiau') || text.includes('pasta')) return 'Mie & Pasta';
    if (text.includes('ayam') || text.includes('chicken') || text.includes('bebek') || text.includes('duck') || text.includes('unggas')) return 'Olahan Ayam & Unggas';
    if (text.includes('kambing') || text.includes('sapi') || text.includes('beef') || text.includes('mutton') || text.includes('lamb') || text.includes('meat') || text.includes('daging')) return 'Daging & Iga'; // New Category
    if (text.includes('ikan') || text.includes('fish') || text.includes('seafood') || text.includes('udang') || text.includes('prawn') || text.includes('cumi') || text.includes('kerang')) return 'Ikan & Seafood'; // New Category
    if (text.includes('snack') || text.includes('kue') || text.includes('cake') || text.includes('dessert') || text.includes('sweet') || text.includes('jajanan') || text.includes('martabak') || text.includes('pisang') || text.includes('roti')) return 'Jajanan & Makanan Ringan';
    if (text.includes('sambal') || text.includes('sauce') || text.includes('bumbu')) return 'Sambal & Saus';
    if (text.includes('sayur') || text.includes('bayam') || text.includes('kangkung') || text.includes('vegetable') || text.includes('salad') || text.includes('gado')) return 'Sayuran'; // New Category

    return 'Lainnya';
};

async function refine() {
    console.log("Fetching all foods...");
    const { data: foods, error } = await supabase.from('food_items').select('*');
    if (error) { console.error(error); return; }

    console.log(`Processing ${foods.length} items...`);
    let updates = 0;
    let deletes = 0;

    for (const food of foods) {
        // 1. DELETE CLEANUP
        if (food.name.endsWith(' cuisine') || food.name.startsWith('Category:') || food.name.startsWith('List of')) {
            console.log(`Deleting invalid item: ${food.name}`);
            await supabase.from('food_items').delete().eq('id', food.id);
            deletes++;
            continue;
        }

        // 2. RECLASSIFY
        let newType = determineCategory(food.name, food.description || "", food.type);

        // If currently Lainnya, definitely try to update. 
        // If currently valid, only update if the new specific logic is better? 
        // Generally, our new logic in this script is richer (added Seafood, Daging, Sayur).
        // Let's force update if it changes from 'Lainnya', or if it changes to a richer category.

        if (food.type === 'Lainnya' && newType !== 'Lainnya') {
            console.log(`Updating ${food.name}: Lainnya -> ${newType}`);
            await supabase.from('food_items').update({ type: newType }).eq('id', food.id);
            updates++;
        }
        else if (food.type !== newType && newType !== 'Lainnya') {
            // Example: maybe it was 'Hidangan Utama' (old generic) and now we found it's 'Ikan & Seafood'
            console.log(`Refining ${food.name}: ${food.type} -> ${newType}`);
            await supabase.from('food_items').update({ type: newType }).eq('id', food.id);
            updates++;
        }
    }

    console.log(`Refinement Complete. Deleted: ${deletes}, Updated: ${updates}`);
}

refine();
