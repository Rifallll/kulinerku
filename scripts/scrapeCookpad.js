import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

// Scrape recipes from Cookpad
async function scrapeCookpadRecipes(searchQuery = 'masakan indonesia', maxPages = 5) {
    console.log('🍳 COOKPAD INDONESIA SCRAPER');
    console.log('='.repeat(70));
    console.log(`\n🔍 Search Query: "${searchQuery}"`);
    console.log(`📄 Max Pages: ${maxPages}\n`);
    console.log('='.repeat(70) + '\n');

    const allRecipes = [];
    let successCount = 0;
    let failCount = 0;

    try {
        // Scrape search results pages
        for (let page = 1; page <= maxPages; page++) {
            console.log(`\n📖 Scraping Page ${page}/${maxPages}...`);

            const searchUrl = `https://cookpad.com/id/cari/${encodeURIComponent(searchQuery)}?page=${page}`;
            console.log(`   URL: ${searchUrl}`);

            try {
                const response = await axios.get(searchUrl, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
                    },
                    timeout: 15000
                });

                const $ = cheerio.load(response.data);

                // Find recipe cards
                const recipeCards = $('.recipe-preview, .recipe-card, [data-recipe-id]').toArray();
                console.log(`   Found ${recipeCards.length} recipes on this page\n`);

                for (const card of recipeCards) {
                    try {
                        const $card = $(card);

                        // Extract recipe URL
                        const recipeLink = $card.find('a[href*="/resep/"]').first().attr('href');
                        if (!recipeLink) continue;

                        const recipeUrl = recipeLink.startsWith('http') ? recipeLink : `https://cookpad.com${recipeLink}`;

                        // Extract recipe name
                        const recipeName = $card.find('.recipe-title, h2, h3, [class*="title"]').first().text().trim();

                        if (!recipeName) continue;

                        console.log(`   📌 ${recipeName}`);
                        console.log(`      Scraping: ${recipeUrl}`);

                        // Scrape individual recipe page
                        await new Promise(resolve => setTimeout(resolve, 1000)); // Delay

                        const recipeDetails = await scrapeRecipeDetails(recipeUrl);

                        if (recipeDetails) {
                            allRecipes.push({
                                name: recipeName,
                                url: recipeUrl,
                                ...recipeDetails
                            });

                            console.log(`      ✅ Ingredients: ${recipeDetails.ingredients.length} items`);
                            successCount++;
                        } else {
                            console.log(`      ⚠️  Failed to scrape details`);
                            failCount++;
                        }

                    } catch (error) {
                        console.error(`      ❌ Error: ${error.message}`);
                        failCount++;
                    }
                }

                // Delay between pages
                if (page < maxPages) {
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }

            } catch (error) {
                console.error(`   ❌ Page ${page} error: ${error.message}`);
            }
        }

        // Save results
        const outputPath = path.join(process.cwd(), 'cookpad_recipes.json');
        fs.writeFileSync(outputPath, JSON.stringify(allRecipes, null, 2), 'utf-8');

        console.log('\n' + '='.repeat(70));
        console.log('\n📊 SCRAPING SUMMARY:');
        console.log(`   ✅ Success: ${successCount} recipes`);
        console.log(`   ⚠️  Failed: ${failCount}`);
        console.log(`   📁 Total: ${allRecipes.length}`);
        console.log(`\n💾 Saved to: ${outputPath}`);
        console.log('\n' + '='.repeat(70));

        // Show samples
        if (allRecipes.length > 0) {
            console.log('\n🎯 SAMPLE RECIPES:\n');
            allRecipes.slice(0, 3).forEach((recipe, idx) => {
                console.log(`${idx + 1}. ${recipe.name}`);
                console.log(`   Ingredients (${recipe.ingredients.length}):`);
                recipe.ingredients.slice(0, 5).forEach(ing => console.log(`   - ${ing}`));
                if (recipe.ingredients.length > 5) {
                    console.log(`   ... and ${recipe.ingredients.length - 5} more`);
                }
                console.log();
            });
        }

        return allRecipes;

    } catch (error) {
        console.error('\n❌ FATAL ERROR:', error.message);
        throw error;
    }
}

// Scrape individual recipe details
async function scrapeRecipeDetails(url) {
    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 10000
        });

        const $ = cheerio.load(response.data);
        const ingredients = [];
        const steps = [];

        // Extract ingredients
        $('.ingredient-list li, .ingredients-list li, [class*="ingredient"] li').each((i, elem) => {
            const text = $(elem).text().trim();
            if (text && text.length > 1 && text.length < 100) {
                ingredients.push(text);
            }
        });

        // If no ingredients found, try alternative selectors
        if (ingredients.length === 0) {
            $('[id*="ingredient"] li, .ingredient-row').each((i, elem) => {
                const text = $(elem).text().trim();
                if (text && text.length > 1) {
                    ingredients.push(text);
                }
            });
        }

        // Extract cooking steps
        $('.step, .preparation-step, [class*="step"] p').each((i, elem) => {
            const text = $(elem).text().trim();
            if (text && text.length > 5) {
                steps.push(text);
            }
        });

        if (ingredients.length === 0) return null;

        return {
            ingredients: ingredients,
            steps: steps.slice(0, 10), // Max 10 steps
            scrapedAt: new Date().toISOString()
        };

    } catch (error) {
        return null;
    }
}

// Run scraper
scrapeCookpadRecipes('masakan indonesia', 3)
    .then(() => {
        console.log('\n✅ Cookpad scraping completed!');
        process.exit(0);
    })
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
