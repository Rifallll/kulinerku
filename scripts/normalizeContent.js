
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

// Template for Indonesian description
const generateIndonesianDescription = (name, origin, type) => {
    // Randomize slightly for variety
    const templates = [
        `${name} adalah hidangan khas ${origin} yang sangat populer.`,
        `Nikmati kelezatan ${name}, kuliner autentik dari ${origin}.`,
        `${name} merupakan sajian ${type} tradisional ${origin}.`,
        `${name} adalah salah satu ikon kuliner ${origin} yang wajib dicoba.`
    ];
    return templates[Math.floor(Math.random() * templates.length)];
};

async function normalize() {
    console.log("Normalizing content (Language & Filtering)...");
    const { data: foods, error } = await supabase.from('food_items').select('*');

    if (error) { console.error(error); return; }

    let updates = 0;
    let deletes = 0;

    for (const food of foods) {
        let shouldDelete = false;
        let originalName = food.name;
        let newName = originalName;

        // 1. FILTERING (Non-Indonesian / Meta-pages)
        const lowerName = originalName.toLowerCase();
        if (lowerName.includes('cuisine of') || lowerName.startsWith('list of') || lowerName.startsWith('category:') || lowerName.includes('dishes')) {
            shouldDelete = true;
        }
        // Exclude obvious foreign generic terms unmodified
        if (['pizza', 'burger', 'spaghetti', 'sushi', 'steak', 'salad', 'sandwich'].includes(lowerName)) {
            shouldDelete = true;
        }

        if (shouldDelete) {
            console.log(`Deleting invalid/meta item: ${originalName}`);
            await supabase.from('food_items').delete().eq('id', food.id);
            deletes++;
            continue;
        }

        // 2. NAME CLEANING
        // Remove " (food)", " (dish)", " (drink)"
        newName = newName.replace(/ \((food|dish|drink|cuisine)\)/gi, '').trim();

        // 3. DESCRIPTION TRANSLATION / TEMPLATING
        let newDesc = food.description;
        // Detect English context based on broad stopwords
        if (!newDesc || newDesc.match(/\b(is|the|a|an|of|in|with|and|dish|cuisine|served|spicy|sweet|fried|traditional|popular|soup|noodle|rice|meat|chicken|fish)\b/i)) {
            newDesc = generateIndonesianDescription(newName, food.origin || "Indonesia", food.type);
        }

        // 4. APPLY UPDATES
        if (newName !== originalName || newDesc !== food.description) {
            // console.log(`Updating ${originalName} -> ${newName} (Indonesian Desc)`);
            await supabase.from('food_items').update({
                name: newName,
                description: newDesc
            }).eq('id', food.id);
            updates++;
        }
    }

    console.log(`Normalization Complete. Deleted: ${deletes}, Updated: ${updates}`);
}

normalize();
