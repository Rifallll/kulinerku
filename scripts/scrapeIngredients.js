import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import * as cheerio from 'cheerio';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

// Scrape ingredients from Wikipedia
async function scrapeIngredientsFromWikipedia(foodName) {
    try {
        const searchUrl = `https://id.wikipedia.org/wiki/${encodeURIComponent(foodName.replace(/ /g, '_'))}`;

        console.log(`🔍 ${foodName}`);

        const response = await axios.get(searchUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 10000
        });

        const $ = cheerio.load(response.data);
        const ingredients = [];

        // Method 1: Look for ingredient list
        $('h2, h3').each((i, heading) => {
            const headingText = $(heading).text().toLowerCase();
            if (headingText.includes('bahan') || headingText.includes('komposisi')) {
                const list = $(heading).nextUntil('h2, h3', 'ul, ol').first();
                list.find('li').each((j, item) => {
                    const ingredient = $(item).text().trim().split('\n')[0];
                    if (ingredient && ingredient.length < 80 && ingredient.length > 2) {
                        ingredients.push(ingredient);
                    }
                });
            }
        });

        // Method 2: Extract from first sentences
        if (ingredients.length === 0) {
            const paragraphs = $('#mw-content-text p').slice(0, 3);
            paragraphs.each((i, para) => {
                const text = $(para).text();

                // Look for patterns like "terbuat dari", "menggunakan", "berisi"
                const patterns = [
                    /(?:terbuat dari|dibuat dari|menggunakan|berisi|bahan[- ]?bahan(?:nya)?(?:\s+(?:utama|pokok))?(?:\s+adalah)?)[:\s]+([^.]+)/i,
                    /(?:komposisi|ingredients?)[:\s]+([^.]+)/i
                ];

                for (const pattern of patterns) {
                    const match = text.match(pattern);
                    if (match) {
                        const items = match[1]
                            .split(/,| dan | serta /)
                            .map(item => item.trim())
                            .filter(item => item.length > 2 && item.length < 50 && !item.includes('[['));

                        ingredients.push(...items.slice(0, 8));
                        break;
                    }
                }

                if (ingredients.length > 0) return false; // break
            });
        }

        // Clean up ingredients
        const cleaned = ingredients
            .map(ing => ing.replace(/\[\d+\]/g, '').replace(/\([^)]*\)/g, '').trim())
            .filter(ing => ing.length > 2 && !ing.toLowerCase().includes('wiki'))
            .slice(0, 8);

        return cleaned;
    } catch (error) {
        if (error.response?.status === 404) {
            console.log(`   ⚠️  Not found on Wikipedia`);
        } else {
            console.error(`   ❌ Error: ${error.message}`);
        }
        return [];
    }
}

// Main scraping function
async function scrapeAllIngredients() {
    console.log('🚀 Starting Ingredients Scraping from Wikipedia\n');
    console.log('='.repeat(60));

    try {
        // Get food items from database
        const { data: foods, error } = await supabase
            .from('food_items')
            .select('id, name, origin')
            .limit(100);

        if (error) {
            console.error('Error fetching foods:', error);
            return;
        }

        console.log(`\n📊 Found ${foods.length} food items to scrape\n`);
        console.log('='.repeat(60) + '\n');

        const results = [];
        let successCount = 0;
        let failCount = 0;

        for (let i = 0; i < foods.length; i++) {
            const food = foods[i];

            console.log(`\n[${i + 1}/${foods.length}] 📌 ${food.name} (${food.origin})`);

            const ingredients = await scrapeIngredientsFromWikipedia(food.name);

            if (ingredients.length > 0) {
                console.log(`   ✅ Found ${ingredients.length} ingredients:`);
                ingredients.forEach((ing, idx) => {
                    console.log(`      ${idx + 1}. ${ing}`);
                });

                results.push({
                    id: food.id,
                    name: food.name,
                    origin: food.origin,
                    ingredients: ingredients
                });

                successCount++;
            } else {
                console.log(`   ⚠️  No ingredients found`);
                failCount++;
            }

            // Delay between requests
            await new Promise(resolve => setTimeout(resolve, 1500));
        }

        // Save to JSON file
        const outputPath = path.join(process.cwd(), 'scraped_ingredients.json');
        fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), 'utf-8');

        console.log('\n' + '='.repeat(60));
        console.log('\n📊 SCRAPING SUMMARY:');
        console.log(`   ✅ Success: ${successCount}`);
        console.log(`   ⚠️  Failed: ${failCount}`);
        console.log(`   📁 Total: ${foods.length}`);
        console.log(`\n💾 Results saved to: ${outputPath}`);
        console.log('\n' + '='.repeat(60));

        // Show sample results
        if (results.length > 0) {
            console.log('\n🎯 SAMPLE RESULTS:\n');
            results.slice(0, 5).forEach((item, idx) => {
                console.log(`${idx + 1}. ${item.name}:`);
                item.ingredients.forEach(ing => console.log(`   - ${ing}`));
                console.log();
            });
        }

    } catch (error) {
        console.error('\n❌ FATAL ERROR:', error.message);
        throw error;
    }
}

// Run
scrapeAllIngredients()
    .then(() => {
        console.log('✅ Scraping completed successfully!');
        process.exit(0);
    })
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
