
import axios from 'axios';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkUrl(url) {
    if (!url) return false;
    // Always trust pollinations and unsplash source if correctly formatted
    if (url.includes('pollinations.ai')) return true;

    // Wikipedia/Uploads might be 403 to scripts or broken
    try {
        await axios.head(url, { timeout: 3000, headers: { 'User-Agent': 'Mozilla/5.0' } });
        return true;
    } catch (e) {
        // If 404, return false. 
        // If 403, it might just be blocking HEAD, but let's assume valid for now mostly?
        // Actually, many scraped images might be hotlink protected.
        // User says "broken", so let's be aggressive.
        if (e.response && e.response.status === 404) return false;
        return false; // Treat timeout/other errors as broken to be safe?
    }
}

async function fixImages() {
    console.log("Checking for BROKEN images (Validation Mode)...");

    // Fetch all 
    const { data: foods, error } = await supabase.from('food_items').select('*');
    if (error) { console.error(error); return; }

    let updates = 0;
    console.log(`Scanning ${foods.length} items...`);

    // Process in chunks to avoid overwhelming network
    const CHUNK_SIZE = 10;
    for (let i = 0; i < foods.length; i += CHUNK_SIZE) {
        const chunk = foods.slice(i, i + CHUNK_SIZE);

        await Promise.all(chunk.map(async (food) => {
            const currentUrl = food.imageUrl;

            // Allow existing good AI images
            if (currentUrl && currentUrl.includes('pollinations.ai')) return;

            const isValid = await checkUrl(currentUrl);

            if (!isValid) {
                // Generate Replacement
                const encodedName = encodeURIComponent(food.name.trim());
                const prompt = `Delicious ${encodedName} Indonesian Food culinary photography`;
                const seed = Math.floor(Math.random() * 100000);
                const newUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=600&nologo=true&seed=${seed}&model=flux`;

                console.log(`Fixing Broken [${food.name}]: ${currentUrl?.substring(0, 30)}... -> AI Image`);

                await supabase
                    .from('food_items')
                    .update({ imageUrl: newUrl })
                    .eq('id', food.id);
                updates++;
            }
        }));

        if (i % 50 === 0) console.log(`Processed ${i} / ${foods.length}`);
    }

    console.log(`Validation Complete. Fixed ${updates} broken images.`);
}

fixImages();
