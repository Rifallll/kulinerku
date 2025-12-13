
import axios from 'axios';
import * as cheerio from 'cheerio';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const CATEGORY_MAP = [
    { url: 'https://en.wikipedia.org/wiki/Category:Acehnese_cuisine', region: 'Aceh' },
    { url: 'https://en.wikipedia.org/wiki/Category:Batak_cuisine', region: 'Sumatera Utara' }, // Toba/Batak
    { url: 'https://en.wikipedia.org/wiki/Category:Minangkabau_cuisine', region: 'Sumatera Barat' },
    { url: 'https://en.wikipedia.org/wiki/Category:Palembang_cuisine', region: 'Sumatera Selatan' },
    { url: 'https://en.wikipedia.org/wiki/Category:Betawi_cuisine', region: 'Jakarta, DKI Jakarta' },
    { url: 'https://en.wikipedia.org/wiki/Category:Sundanese_cuisine', region: 'Jawa Barat' },
    { url: 'https://en.wikipedia.org/wiki/Category:Javanese_cuisine', region: 'Jawa Tengah' }, // Defaulting Javanese to Central for now, or mixed
    { url: 'https://en.wikipedia.org/wiki/Category:Cuisine_of_East_Java', region: 'Jawa Timur' },
    { url: 'https://en.wikipedia.org/wiki/Category:Madurese_cuisine', region: 'Madura, Jawa Timur' },
    { url: 'https://en.wikipedia.org/wiki/Category:Balinese_cuisine', region: 'Bali' },
    { url: 'https://en.wikipedia.org/wiki/Category:Sasak_cuisine', region: 'Nusa Tenggara Barat' }, // Lombok
    { url: 'https://en.wikipedia.org/wiki/Category:Manado_cuisine', region: 'Manado, Sulawesi Utara' }, // Minahasan
    { url: 'https://en.wikipedia.org/wiki/Category:Makassar_cuisine', region: 'Makassar, Sulawesi Selatan' },
    { url: 'https://en.wikipedia.org/wiki/Category:Bugis_cuisine', region: 'Sulawesi Selatan' },
    { url: 'https://en.wikipedia.org/wiki/Category:Banjar_cuisine', region: 'Kalimantan Selatan' },
    { url: 'https://en.wikipedia.org/wiki/Category:Ambonese_cuisine', region: 'Maluku' }
];

// Helper to categorize
const determineCategory = (name, desc) => {
    const lowerName = name.toLowerCase();
    const lowerDesc = desc.toLowerCase();

    if (lowerName.includes('es ') || lowerName.includes('wedang') || lowerName.includes('jus') || lowerName.includes('kopi') || lowerDesc.includes('drink') || lowerDesc.includes('beverage')) return 'Minuman';
    if (lowerName.includes('sate') || lowerDesc.includes('satay')) return 'Sate';
    if (lowerName.includes('soto') || lowerName.includes('soup') || lowerName.includes('sup') || lowerName.includes('sop') || lowerName.includes('rawon') || lowerDesc.includes('soup')) return 'Sup & Soto';
    if (lowerName.includes('nasi') || lowerName.includes('lontong') || lowerName.includes('ketupat') || lowerDesc.includes('rice dish')) return 'Hidangan Nasi';
    if (lowerName.includes('mie') || lowerName.includes('mi ') || lowerName.includes('bihun') || lowerName.includes('kwetiau') || lowerDesc.includes('noodle')) return 'Mie & Pasta';
    if (lowerName.includes('ayam') || lowerName.includes('bebek') || lowerDesc.includes('chicken') || lowerDesc.includes('duck')) return 'Olahan Ayam & Unggas';
    if (lowerDesc.includes('snack') || lowerDesc.includes('dessert') || lowerDesc.includes('cake') || lowerDesc.includes('kue') || lowerDesc.includes('pastry') || lowerDesc.includes('sweet')) return 'Jajanan & Makanan Ringan';
    if (lowerName.includes('sambal') || lowerName.includes('saus') || lowerDesc.includes('condiment') || lowerDesc.includes('sauce') || lowerDesc.includes('chili paste')) return 'Sambal & Saus';

    return 'Lainnya'; // Default
};

async function scrapeUrl(url) {
    try {
        const { data } = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        return cheerio.load(data);
    } catch (e) {
        console.error(`Failed to fetch ${url}: ${e.message}`);
        return null;
    }
}

async function scrapeProvinces() {
    console.log("Starting targeted province scraping...");
    let allFoods = [];

    for (const { url, region } of CATEGORY_MAP) {
        console.log(`Scraping category: ${region} (${url})`);
        const $ = await scrapeUrl(url);
        if (!$) continue;

        // Find all links in the category list i.e. under #mw-pages
        const links = [];
        $('#mw-pages .mw-category-group a').each((i, el) => {
            const href = $(el).attr('href');
            const title = $(el).text();
            if (href && !title.startsWith('Category:') && !title.startsWith('Template:') && !title.startsWith('List of')) {
                links.push({ title, url: `https://en.wikipedia.org${href}` });
            }
        });

        console.log(`Found ${links.length} potential items for ${region}`);

        // Limit to 60 items per region to reach target
        const itemsToProcess = links.slice(0, 60);

        for (const item of itemsToProcess) {
            // Check if existing? (Optional optimization, but we usually overwrite)

            // Detail scrape
            const $item = await scrapeUrl(item.url);
            if (!$item) continue;

            // Get Description: First paragraph of content
            let description = $item('#mw-content-text .mw-parser-output > p:not(.mw-empty-elt)').first().text().trim();
            // Clean description (remove citation [1])
            description = description.replace(/\[\d+\]/g, '');

            // Get Image: First image in infobox or thumb
            let imageUrl = $item('.infobox img').first().attr('src') || $item('.thumb.tright img').first().attr('src');
            if (imageUrl && imageUrl.startsWith('//')) imageUrl = `https:${imageUrl}`;

            const name = item.title;
            const category = determineCategory(name, description);

            allFoods.push({
                name: name,
                type: category,
                origin: region, // Enforced region
                rating: (Math.random() * (5.0 - 4.2) + 4.2).toFixed(1), // Random high rating
                description: description || `${name} adalah hidangan khas ${region}.`,
                imageUrl: imageUrl || null
            });

            // Small delay to be nice
            await new Promise(r => setTimeout(r, 50));
        }
    }

    console.log(`Scraped total ${allFoods.length} items.`);

    // Remove duplicates by name
    const uniqueFoods = Array.from(new Map(allFoods.map(item => [item.name, item])).values());

    console.log(`Unique scraped items: ${uniqueFoods.length}`);

    // Fetch existing names to avoid duplicates and potential errors
    console.log("Fetching existing items to deduplicate...");
    const { data: existingData, error: fetchError } = await supabase
        .from('food_items')
        .select('name');

    if (fetchError) {
        console.error("Error fetching existing data, aborting to be safe:", fetchError);
        return;
    }

    const existingNames = new Set(existingData.map(e => e.name));
    const newFoods = uniqueFoods.filter(f => !existingNames.has(f.name));

    console.log(`New items to insert: ${newFoods.length} (Skipped ${uniqueFoods.length - newFoods.length} duplicates)`);

    if (newFoods.length === 0) {
        console.log("No new items to add.");
        return;
    }

    // Batch Insert
    const BATCH_SIZE = 50;
    for (let i = 0; i < newFoods.length; i += BATCH_SIZE) {
        const batch = newFoods.slice(i, i + BATCH_SIZE);

        const { error } = await supabase.from('food_items').insert(batch);

        if (error) {
            console.error('Error inserting batch:', error);
        } else {
            console.log(`Inserted batch ${Math.floor(i / BATCH_SIZE) + 1}`);
        }
    }

    console.log("Done.");
}

scrapeProvinces();
