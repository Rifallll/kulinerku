import axios from 'axios';
import * as cheerio from 'cheerio';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * MULTI-SOURCE INDONESIAN FOOD SCRAPER
 * Scrapes from major Indonesian news portals
 */

const scrapedFoods = new Map(); // name -> {province, sources[]}

/**
 * Scrape Liputan6.com
 */
async function scrapeLiputan6() {
    console.log('📰 Scraping Liputan6.com...');
    const foods = [];

    try {
        const url = 'https://www.liputan6.com/lifestyle/read/4882344/34-provinsi-makanan-khas-daerah-di-indonesia-mie-aceh-hingga-papeda';

        const response = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
            timeout: 15000
        });

        const $ = cheerio.load(response.data);

        // Extract from article content
        $('article p, .article-content-body p').each((i, elem) => {
            const text = $(elem).text();

            // Look for patterns like "Provinsi: Makanan"
            const matches = text.match(/(\w+[\w\s]*?):\s*([A-Z][^,\.]+)/g);
            if (matches) {
                matches.forEach(match => {
                    const [province, food] = match.split(':').map(s => s.trim());
                    if (province && food && food.length > 3) {
                        foods.push({ province, food, source: 'Liputan6' });
                    }
                });
            }
        });

        console.log(`  ✓ Found ${foods.length} items from Liputan6`);
    } catch (error) {
        console.error(`  ✗ Liputan6 error:`, error.message);
    }

    return foods;
}

/**
 * Scrape Detik.com
 */
async function scrapeDetik() {
    console.log('📰 Scraping Detik.com...');
    const foods = [];

    try {
        const url = 'https://food.detik.com/info-kuliner/d-5505855/daftar-makanan-khas-38-provinsi-di-indonesia-lengkap-dengan-keterangannya';

        const response = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
            timeout: 15000
        });

        const $ = cheerio.load(response.data);

        $('.detail__body-text p, .detail-text p').each((i, elem) => {
            const text = $(elem).text();

            const matches = text.match(/(\w+[\w\s]*?):\s*([A-Z][^,\.]+)/g);
            if (matches) {
                matches.forEach(match => {
                    const [province, food] = match.split(':').map(s => s.trim());
                    if (province && food && food.length > 3) {
                        foods.push({ province, food, source: 'Detik' });
                    }
                });
            }
        });

        console.log(`  ✓ Found ${foods.length} items from Detik`);
    } catch (error) {
        console.error(`  ✗ Detik error:`, error.message);
    }

    return foods;
}

/**
 * Scrape Merdeka.com
 */
async function scrapeMerdeka() {
    console.log('📰 Scraping Merdeka.com...');
    const foods = [];

    try {
        const url = 'https://www.merdeka.com/trending/daftar-34-provinsi-dengan-makanan-khas-daerah-di-indonesia-mie-aceh-hingga-papeda.html';

        const response = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
            timeout: 15000
        });

        const $ = cheerio.load(response.data);

        $('article p, .content-body p').each((i, elem) => {
            const text = $(elem).text();

            const matches = text.match(/(\w+[\w\s]*?):\s*([A-Z][^,\.]+)/g);
            if (matches) {
                matches.forEach(match => {
                    const [province, food] = match.split(':').map(s => s.trim());
                    if (province && food && food.length > 3) {
                        foods.push({ province, food, source: 'Merdeka' });
                    }
                });
            }
        });

        console.log(`  ✓ Found ${foods.length} items from Merdeka`);
    } catch (error) {
        console.error(`  ✗ Merdeka error:`, error.message);
    }

    return foods;
}

/**
 * Aggregate and deduplicate
 */
function aggregateFoods(allFoods) {
    console.log('\n📊 Aggregating data...');

    const foodMap = new Map();

    for (const item of allFoods) {
        const key = item.food.toLowerCase();

        if (!foodMap.has(key)) {
            foodMap.set(key, {
                name: item.food,
                province: item.province,
                sources: [item.source]
            });
        } else {
            const existing = foodMap.get(key);
            if (!existing.sources.includes(item.source)) {
                existing.sources.push(item.source);
            }
        }
    }

    return Array.from(foodMap.values());
}

/**
 * Main scraper
 */
async function scrapeAllSources() {
    console.log('\n🌐 MULTI-SOURCE INDONESIAN FOOD SCRAPER');
    console.log('='.repeat(60));
    console.log('Scraping from Indonesian news portals...\n');

    try {
        // Scrape all sources
        const [liputan6Foods, detikFoods, merdekaFoods] = await Promise.all([
            scrapeLiputan6(),
            scrapeDetik(),
            scrapeMerdeka()
        ]);

        // Combine
        const allFoods = [...liputan6Foods, ...detikFoods, ...merdekaFoods];

        console.log(`\n📦 Total items scraped: ${allFoods.length}`);

        // Aggregate
        const uniqueFoods = aggregateFoods(allFoods);

        console.log(`📊 Unique foods: ${uniqueFoods.length}`);

        // Show top items
        console.log(`\n🔥 Sample items:`);
        uniqueFoods.slice(0, 10).forEach(item => {
            console.log(`   ${item.name} (${item.province}) - Sources: ${item.sources.join(', ')}`);
        });

        // Update database
        await updateDatabase(uniqueFoods);

        return uniqueFoods;

    } catch (error) {
        console.error('\n❌ Scraping failed:', error.message);
        throw error;
    }
}

/**
 * Update database
 */
async function updateDatabase(foods) {
    console.log('\n💾 Updating database...');

    try {
        let inserted = 0;
        let skipped = 0;

        for (const item of foods) {
            // Check if exists
            const { data: existing } = await supabase
                .from('food_items')
                .select('id')
                .eq('name', item.name)
                .single();

            if (existing) {
                skipped++;
                continue;
            }

            // Determine type
            const beverageKeywords = ['minuman', 'jus', 'kopi', 'teh', 'es', 'wedang', 'bajigur', 'bandrek'];
            const isBeverage = beverageKeywords.some(k =>
                item.name.toLowerCase().includes(k)
            );

            const { error } = await supabase
                .from('food_items')
                .insert([{
                    name: item.name,
                    type: isBeverage ? 'Minuman' : 'Makanan',
                    origin: item.province,
                    description: `Makanan khas ${item.province} (Sumber: ${item.sources.join(', ')})`,
                    rating: 4.0 + Math.random() * 1.0,
                    imageUrl: `https://via.placeholder.com/400x300?text=${encodeURIComponent(item.name)}`,
                    mostIconic: item.sources.length > 1
                }]);

            if (!error) {
                inserted++;
                if (inserted % 10 === 0) {
                    console.log(`  ✓ Inserted ${inserted} items...`);
                }
            }
        }

        console.log(`\n✅ Inserted: ${inserted} items`);
        console.log(`⏭️  Skipped: ${skipped} items (already exist)`);

        // Show distribution
        const { data: all } = await supabase
            .from('food_items')
            .select('origin');

        const dist = {};
        all.forEach(item => {
            dist[item.origin] = (dist[item.origin] || 0) + 1;
        });

        console.log(`\n📍 Provincial Distribution (Top 10):`);
        Object.entries(dist)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .forEach(([province, count]) => {
                console.log(`   ${province.padEnd(25)}: ${count}`);
            });

    } catch (error) {
        console.error('❌ Database update failed:', error.message);
    }
}

// Run
scrapeAllSources()
    .then(() => {
        console.log('\n✅ MULTI-SOURCE SCRAPING COMPLETE!');
        console.log('🔄 Refresh dashboard: http://192.168.1.101:8080/analytics\n');
        process.exit(0);
    })
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
