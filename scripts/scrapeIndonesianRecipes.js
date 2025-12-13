import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

// Scraper untuk berbagai situs resep Indonesia
class IndonesianRecipeScraper {
    constructor() {
        this.recipes = [];
        this.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7'
        };
    }

    // 1. Scrape from resepdapur.id
    async scrapeResepDapur() {
        console.log('\n📖 Scraping resepdapur.id...');
        try {
            const url = 'https://resepdapur.id/100-resep-masakan-indonesia/';
            const response = await axios.get(url, { headers: this.headers, timeout: 15000 });
            const $ = cheerio.load(response.data);

            const recipes = [];

            // Find recipe links
            $('article a, .recipe-card a, h2 a, h3 a').each((i, elem) => {
                const href = $(elem).attr('href');
                const title = $(elem).text().trim();

                if (href && title && title.length > 3 && title.length < 100) {
                    // Filter: Hanya masakan Indonesia
                    const keywords = ['nasi', 'sate', 'rendang', 'soto', 'gado', 'pecel', 'bakso', 'ayam', 'ikan',
                        'sambal', 'tempe', 'tahu', 'sayur', 'gulai', 'opor', 'rawon', 'gudeg'];
                    const isIndonesian = keywords.some(k => title.toLowerCase().includes(k)) ||
                        !title.toLowerCase().match(/pasta|pizza|burger|steak|cake|spaghetti|lasagna/);

                    if (isIndonesian && href.includes('resep')) {
                        recipes.push({ name: title, url: href, source: 'resepdapur.id' });
                    }
                }
            });

            console.log(`   ✅ Found ${recipes.length} Indonesian recipes`);
            return recipes.slice(0, 20); // Limit to 20
        } catch (error) {
            console.error(`   ❌ Error: ${error.message}`);
            return [];
        }
    }

    // 2. Scrape from cookpad.com/id
    async scrapeCookpad() {
        console.log('\n📖 Scraping cookpad.com/id...');
        try {
            const searches = ['nasi goreng', 'rendang', 'sate ayam', 'soto ayam', 'gado-gado'];
            const recipes = [];

            for (const query of searches) {
                const url = `https://cookpad.com/id/cari/${encodeURIComponent(query)}`;
                const response = await axios.get(url, { headers: this.headers, timeout: 15000 });
                const $ = cheerio.load(response.data);

                $('.recipe-title, .recipe-card h3, .recipe-preview h2').each((i, elem) => {
                    const title = $(elem).text().trim();
                    const link = $(elem).closest('a').attr('href') || $(elem).find('a').attr('href');

                    if (title && title.length > 3) {
                        recipes.push({
                            name: title,
                            url: link ? `https://cookpad.com${link}` : '',
                            source: 'cookpad.com'
                        });
                    }
                });

                await new Promise(resolve => setTimeout(resolve, 1000)); // Delay
            }

            console.log(`   ✅ Found ${recipes.length} recipes`);
            return recipes.slice(0, 20);
        } catch (error) {
            console.error(`   ❌ Error: ${error.message}`);
            return [];
        }
    }

    // 3. Scrape from sajianlezat.com
    async scrapeSajianLezat() {
        console.log('\n📖 Scraping sajianlezat.com...');
        try {
            const url = 'https://www.sajianlezat.com/';
            const response = await axios.get(url, { headers: this.headers, timeout: 15000 });
            const $ = cheerio.load(response.data);

            const recipes = [];

            $('article h2 a, .post-title a, .entry-title a').each((i, elem) => {
                const title = $(elem).text().trim();
                const href = $(elem).attr('href');

                if (title && href && title.length > 5) {
                    // Filter Indonesian only
                    if (!title.toLowerCase().match(/pasta|pizza|western|korean|japanese|chinese/)) {
                        recipes.push({ name: title, url: href, source: 'sajianlezat.com' });
                    }
                }
            });

            console.log(`   ✅ Found ${recipes.length} recipes`);
            return recipes.slice(0, 20);
        } catch (error) {
            console.error(`   ❌ Error: ${error.message}`);
            return [];
        }
    }

    // 4. Scrape from sendoksejagat.id
    async scrapeSendokSejagat() {
        console.log('\n📖 Scraping sendoksejagat.id...');
        try {
            const url = 'https://sendoksejagat.id/';
            const response = await axios.get(url, { headers: this.headers, timeout: 15000 });
            const $ = cheerio.load(response.data);

            const recipes = [];

            $('.recipe-title, article h2, .post-title').each((i, elem) => {
                const title = $(elem).text().trim();
                const link = $(elem).find('a').attr('href') || $(elem).closest('a').attr('href');

                if (title && title.length > 5) {
                    recipes.push({
                        name: title,
                        url: link || '',
                        source: 'sendoksejagat.id'
                    });
                }
            });

            console.log(`   ✅ Found ${recipes.length} recipes`);
            return recipes.slice(0, 20);
        } catch (error) {
            console.error(`   ❌ Error: ${error.message}`);
            return [];
        }
    }

    // Scrape detail from a recipe URL
    async scrapeRecipeDetails(url, recipeName) {
        try {
            const response = await axios.get(url, { headers: this.headers, timeout: 10000 });
            const $ = cheerio.load(response.data);

            const ingredients = [];
            const steps = [];

            // Extract ingredients
            $('.ingredient, .ingredients li, [class*="ingredient"] li').each((i, elem) => {
                const text = $(elem).text().trim();
                if (text && text.length > 2 && text.length < 150) {
                    ingredients.push(text);
                }
            });

            // Extract steps
            $('.step, .instruction, .directions li, [class*="step"] p').each((i, elem) => {
                const text = $(elem).text().trim();
                if (text && text.length > 10) {
                    steps.push(text);
                }
            });

            return {
                ingredients: ingredients.slice(0, 15),
                steps: steps.slice(0, 10)
            };
        } catch (error) {
            return { ingredients: [], steps: [] };
        }
    }

    // Main scraping function
    async scrapeAll() {
        console.log('🚀 INDONESIAN RECIPE SCRAPER');
        console.log('='.repeat(70));
        console.log('\n🇮🇩 Scraping HANYA masakan Indonesia\n');

        const allRecipes = [];

        // Scrape from all sources
        const sources = [
            { name: 'ResepDapur', fn: () => this.scrapeResepDapur() },
            { name: 'Cookpad', fn: () => this.scrapeCookpad() },
            { name: 'SajianLezat', fn: () => this.scrapeSajianLezat() },
            { name: 'SendokSejagat', fn: () => this.scrapeSendokSejagat() }
        ];

        for (const source of sources) {
            try {
                const recipes = await source.fn();
                allRecipes.push(...recipes);
                await new Promise(resolve => setTimeout(resolve, 2000)); // Delay between sources
            } catch (error) {
                console.error(`Failed to scrape ${source.name}:`, error.message);
            }
        }

        // Remove duplicates
        const uniqueRecipes = [];
        const seen = new Set();

        for (const recipe of allRecipes) {
            const key = recipe.name.toLowerCase().trim();
            if (!seen.has(key)) {
                seen.add(key);
                uniqueRecipes.push(recipe);
            }
        }

        console.log('\n' + '='.repeat(70));
        console.log(`\n📊 SUMMARY:`);
        console.log(`   Total scraped: ${allRecipes.length}`);
        console.log(`   Unique recipes: ${uniqueRecipes.length}`);
        console.log(`\n💾 Saving to indonesian_recipes.json...`);

        // Save to file
        const outputPath = path.join(process.cwd(), 'indonesian_recipes.json');
        fs.writeFileSync(outputPath, JSON.stringify(uniqueRecipes, null, 2), 'utf-8');

        console.log(`   ✅ Saved to: ${outputPath}`);
        console.log('\n' + '='.repeat(70));

        // Show samples
        if (uniqueRecipes.length > 0) {
            console.log('\n🎯 SAMPLE RECIPES:\n');
            uniqueRecipes.slice(0, 10).forEach((recipe, idx) => {
                console.log(`${idx + 1}. ${recipe.name}`);
                console.log(`   Source: ${recipe.source}`);
                console.log(`   URL: ${recipe.url || 'N/A'}\n`);
            });
        }

        return uniqueRecipes;
    }
}

// Run scraper
const scraper = new IndonesianRecipeScraper();
scraper.scrapeAll()
    .then(() => {
        console.log('✅ Scraping completed!');
        process.exit(0);
    })
    .catch(error => {
        console.error('❌ Fatal error:', error);
        process.exit(1);
    });
