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

// ============================================================
// VALIDATION HELPERS
// ============================================================

/**
 * Validates a single food item before insertion
 * @param {Object} item - The food item to validate
 * @returns {Object} - { valid: boolean, errors: string[] }
 */
function validateFoodItem(item) {
    const errors = [];

    // 1. Check required fields
    const requiredFields = ['name', 'type', 'origin', 'rating', 'description', 'imageUrl'];
    for (const field of requiredFields) {
        if (!item[field]) {
            errors.push(`Missing required field: ${field}`);
        }
    }

    // 2. Validate type (must be "Makanan" or "Minuman")
    if (item.type && !['Makanan', 'Minuman'].includes(item.type)) {
        errors.push(`Invalid type: "${item.type}". Must be "Makanan" or "Minuman"`);
    }

    // 3. Validate rating (must be 0-5)
    if (item.rating !== undefined) {
        const rating = Number(item.rating);
        if (isNaN(rating) || rating < 0 || rating > 5) {
            errors.push(`Invalid rating: ${item.rating}. Must be between 0 and 5`);
        }
    }

    // 4. Validate name is not empty
    if (item.name && typeof item.name === 'string' && item.name.trim().length === 0) {
        errors.push('Name cannot be empty string');
    }

    // 5. Validate origin is not empty
    if (item.origin && typeof item.origin === 'string' && item.origin.trim().length === 0) {
        errors.push('Origin cannot be empty string');
    }

    // 6. Validate imageUrl format (basic check)
    if (item.imageUrl && !item.imageUrl.startsWith('http')) {
        errors.push(`Invalid imageUrl: ${item.imageUrl}. Must be a valid URL`);
    }

    // 7. Special validation for beverages script: ensure type is "Minuman"
    if (item.type && item.type !== 'Minuman') {
        errors.push(`This script is for beverages only. Type must be "Minuman", got "${item.type}"`);
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * Validates all items in the array
 * @param {Array} items - Array of food items to validate
 * @returns {Object} - { valid: boolean, totalErrors: number, itemErrors: Object[] }
 */
function validateAllItems(items) {
    const itemErrors = [];
    let totalErrors = 0;

    items.forEach((item, index) => {
        const validation = validateFoodItem(item);
        if (!validation.valid) {
            itemErrors.push({
                index,
                name: item.name || 'Unknown',
                errors: validation.errors
            });
            totalErrors += validation.errors.length;
        }
    });

    return {
        valid: itemErrors.length === 0,
        totalErrors,
        itemErrors
    };
}

// Comprehensive Indonesian Beverage Data

const beverages = [
    // Traditional Hot Drinks
    {
        name: "Wedang Jahe",
        type: "Minuman",
        origin: "Jawa Tengah",
        rating: 4.7,
        description: "Minuman tradisional hangat berbahan dasar jahe yang menghangatkan tubuh. Cocok diminum saat cuaca dingin atau hujan.",
        imageUrl: "https://images.unsplash.com/photo-1587318408655-5a88f3f1f7c5?q=80&w=2070&auto=format&fit=crop"
    },
    {
        name: "Wedang Ronde",
        type: "Minuman",
        origin: "Jawa Tengah",
        rating: 4.6,
        description: "Minuman hangat berisi bola-bola ketan berisi kacang tanah, disajikan dengan kuah jahe manis dan kacang tanah.",
        imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=2089&auto=format&fit=crop"
    },
    {
        name: "Bajigur",
        type: "Minuman",
        origin: "Jawa Barat",
        rating: 4.8,
        description: "Minuman tradisional Sunda berbahan santan, gula merah, dan jahe. Sangat populer di daerah pegunungan Jawa Barat.",
        imageUrl: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=2070&auto=format&fit=crop"
    },
    {
        name: "Bandrek",
        type: "Minuman",
        origin: "Jawa Barat",
        rating: 4.7,
        description: "Minuman hangat khas Sunda berbahan jahe, gula merah, dan rempah-rempah. Sering ditambahkan susu atau kelapa muda.",
        imageUrl: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?q=80&w=2035&auto=format&fit=crop"
    },
    {
        name: "Sekoteng",
        type: "Minuman",
        origin: "Jawa Tengah",
        rating: 4.5,
        description: "Minuman hangat berisi kacang tanah, kacang hijau, pacar cina, dan roti tawar dalam kuah jahe manis.",
        imageUrl: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=2070&auto=format&fit=crop"
    },

    // Traditional Cold Drinks
    {
        name: "Es Cendol",
        type: "Minuman",
        origin: "Jawa Tengah",
        rating: 4.9,
        description: "Minuman es manis dengan cendol hijau dari tepung beras, santan, dan gula merah. Sangat menyegarkan di cuaca panas.",
        imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=2127&auto=format&fit=crop"
    },
    {
        name: "Es Dawet",
        type: "Minuman",
        origin: "Jawa Tengah",
        rating: 4.8,
        description: "Minuman tradisional mirip cendol, terbuat dari tepung beras dengan santan dan gula merah cair.",
        imageUrl: "https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=2064&auto=format&fit=crop"
    },
    {
        name: "Es Campur",
        type: "Minuman",
        origin: "Indonesia",
        rating: 4.7,
        description: "Campuran berbagai bahan seperti kelapa muda, kolang-kaling, cincau, nangka, dan sirup dengan es serut.",
        imageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=2070&auto=format&fit=crop"
    },
    {
        name: "Es Teler",
        type: "Minuman",
        origin: "Jakarta, DKI Jakarta",
        rating: 4.8,
        description: "Minuman segar berisi alpukat, kelapa muda, nangka, dan cincau dengan santan dan sirup.",
        imageUrl: "https://images.unsplash.com/photo-1546173159-315724a31696?q=80&w=2070&auto=format&fit=crop"
    },
    {
        name: "Es Doger",
        type: "Minuman",
        origin: "Jawa Barat",
        rating: 4.6,
        description: "Es serut dengan tape singkong, alpukat, roti tawar, pacar cina, dan sirup merah muda khas Bandung.",
        imageUrl: "https://images.unsplash.com/photo-1497534547324-0ebb3f052e88?q=80&w=2070&auto=format&fit=crop"
    },
    {
        name: "Es Selendang Mayang",
        type: "Minuman",
        origin: "Jakarta, DKI Jakarta",
        rating: 4.5,
        description: "Minuman tradisional Betawi dengan kue selendang mayang berwarna-warni dalam santan dan sirup.",
        imageUrl: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=2087&auto=format&fit=crop"
    },

    // Coffee & Tea
    {
        name: "Kopi Tubruk",
        type: "Minuman",
        origin: "Indonesia",
        rating: 4.6,
        description: "Kopi tradisional Indonesia yang diseduh dengan cara menuangkan air panas langsung ke bubuk kopi.",
        imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=2070&auto=format&fit=crop"
    },
    {
        name: "Kopi Susu",
        type: "Minuman",
        origin: "Indonesia",
        rating: 4.7,
        description: "Kopi hitam yang dicampur dengan susu kental manis, minuman favorit masyarakat Indonesia.",
        imageUrl: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=2069&auto=format&fit=crop"
    },
    {
        name: "Kopi Jahe",
        type: "Minuman",
        origin: "Indonesia",
        rating: 4.5,
        description: "Kombinasi kopi dan jahe yang menghangatkan, cocok untuk cuaca dingin atau pagi hari.",
        imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=2070&auto=format&fit=crop"
    },
    {
        name: "Teh Tarik",
        type: "Minuman",
        origin: "Medan, Sumatera Utara",
        rating: 4.6,
        description: "Teh dengan susu yang ditarik-tarik untuk menghasilkan busa, populer di Medan dan Malaysia.",
        imageUrl: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=2070&auto=format&fit=crop"
    },
    {
        name: "Teh Poci",
        type: "Minuman",
        origin: "Jawa Tengah",
        rating: 4.4,
        description: "Teh melati yang diseduh dalam poci tanah liat, memberikan aroma dan rasa yang khas.",
        imageUrl: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=2070&auto=format&fit=crop"
    },
    {
        name: "Es Kopi Susu",
        type: "Minuman",
        origin: "Indonesia",
        rating: 4.8,
        description: "Kopi susu dingin yang sangat populer, tren minuman kekinian favorit anak muda Indonesia.",
        imageUrl: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?q=80&w=2035&auto=format&fit=crop"
    },

    // Fruit-based Drinks
    {
        name: "Es Kelapa Muda",
        type: "Minuman",
        origin: "Indonesia",
        rating: 4.7,
        description: "Air kelapa muda segar dengan daging kelapa, sangat menyegarkan dan kaya elektrolit alami.",
        imageUrl: "https://images.unsplash.com/photo-1585238341710-4a1b7e0d3e4f?q=80&w=2104&auto=format&fit=crop"
    },
    {
        name: "Es Jeruk",
        type: "Minuman",
        origin: "Indonesia",
        rating: 4.5,
        description: "Jus jeruk segar dengan es, minuman paling umum dan menyegarkan di Indonesia.",
        imageUrl: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?q=80&w=2087&auto=format&fit=crop"
    },
    {
        name: "Jus Alpukat",
        type: "Minuman",
        origin: "Indonesia",
        rating: 4.8,
        description: "Jus alpukat dengan susu cokelat atau kental manis, creamy dan bergizi tinggi.",
        imageUrl: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?q=80&w=2070&auto=format&fit=crop"
    },
    {
        name: "Es Buah",
        type: "Minuman",
        origin: "Indonesia",
        rating: 4.6,
        description: "Campuran berbagai buah segar seperti melon, semangka, nanas dengan sirup dan susu.",
        imageUrl: "https://images.unsplash.com/photo-1546173159-315724a31696?q=80&w=2070&auto=format&fit=crop"
    },
    {
        name: "Es Cincau",
        type: "Minuman",
        origin: "Jawa Barat",
        rating: 4.5,
        description: "Minuman dari cincau hitam atau hijau dengan sirup gula merah, menyegarkan dan menyehatkan.",
        imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=2127&auto=format&fit=crop"
    },
    {
        name: "Es Timun Serut",
        type: "Minuman",
        origin: "Jakarta, DKI Jakarta",
        rating: 4.3,
        description: "Minuman unik dari timun serut dengan sirup dan es, sangat menyegarkan di cuaca panas.",
        imageUrl: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?q=80&w=2070&auto=format&fit=crop"
    },

    // Herbal & Health Drinks
    {
        name: "Jamu",
        type: "Minuman",
        origin: "Jawa Tengah",
        rating: 4.6,
        description: "Minuman herbal tradisional Indonesia dari berbagai rempah dan tanaman obat, berkhasiat untuk kesehatan.",
        imageUrl: "https://images.unsplash.com/photo-1587318408655-5a88f3f1f7c5?q=80&w=2070&auto=format&fit=crop"
    },
    {
        name: "Jamu Kunyit Asam",
        type: "Minuman",
        origin: "Jawa Tengah",
        rating: 4.5,
        description: "Jamu dari kunyit dan asam jawa, berkhasiat untuk kesehatan wanita dan pencernaan.",
        imageUrl: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=2070&auto=format&fit=crop"
    },
    {
        name: "Wedang Uwuh",
        type: "Minuman",
        origin: "DI Yogyakarta",
        rating: 4.7,
        description: "Minuman rempah khas Yogyakarta dari berbagai rempah seperti cengkeh, kayu manis, dan jahe.",
        imageUrl: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=2070&auto=format&fit=crop"
    },
    {
        name: "Bir Pletok",
        type: "Minuman",
        origin: "Jakarta, DKI Jakarta",
        rating: 4.4,
        description: "Minuman tradisional Betawi dari rempah-rempah, non-alkohol meski namanya 'bir'.",
        imageUrl: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?q=80&w=2035&auto=format&fit=crop"
    },
    {
        name: "Lahang",
        type: "Minuman",
        origin: "Jawa Timur",
        rating: 4.3,
        description: "Minuman dari nira pohon aren yang segar, khas dari daerah Jawa Timur.",
        imageUrl: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=2070&auto=format&fit=crop"
    },

    // Modern/Fusion Drinks
    {
        name: "Es Kopi Susu Gula Aren",
        type: "Minuman",
        origin: "Indonesia",
        rating: 4.9,
        description: "Kopi susu modern dengan gula aren, tren minuman kekinian yang sangat populer.",
        imageUrl: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=2069&auto=format&fit=crop"
    },
    {
        name: "Es Kopi Susu Tetangga",
        type: "Minuman",
        origin: "Indonesia",
        rating: 4.7,
        description: "Varian kopi susu dengan nama unik, bagian dari tren kopi kekinian Indonesia.",
        imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=2070&auto=format&fit=crop"
    },
    {
        name: "Thai Tea",
        type: "Minuman",
        origin: "Indonesia",
        rating: 4.6,
        description: "Teh Thailand yang sudah populer di Indonesia, dengan rasa manis dan creamy.",
        imageUrl: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=2070&auto=format&fit=crop"
    },
    {
        name: "Es Teh Manis",
        type: "Minuman",
        origin: "Indonesia",
        rating: 4.8,
        description: "Teh manis dingin, minuman paling populer dan umum di seluruh Indonesia.",
        imageUrl: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=2070&auto=format&fit=crop"
    },
    {
        name: "Susu Jahe",
        type: "Minuman",
        origin: "Indonesia",
        rating: 4.5,
        description: "Kombinasi susu hangat dengan jahe, menghangatkan dan menyehatkan.",
        imageUrl: "https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=2087&auto=format&fit=crop"
    },
    {
        name: "Es Cappuccino Cincau",
        type: "Minuman",
        origin: "Indonesia",
        rating: 4.6,
        description: "Fusion modern cappuccino dengan cincau hitam, perpaduan tradisional dan modern.",
        imageUrl: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?q=80&w=2035&auto=format&fit=crop"
    },
    {
        name: "Markisa",
        type: "Minuman",
        origin: "Indonesia",
        rating: 4.4,
        description: "Jus buah markisa segar yang asam manis, kaya vitamin C dan menyegarkan.",
        imageUrl: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?q=80&w=2087&auto=format&fit=crop"
    },
    {
        name: "Es Sirsak",
        type: "Minuman",
        origin: "Indonesia",
        rating: 4.5,
        description: "Jus sirsak dengan es, rasa manis asam yang unik dan menyegarkan.",
        imageUrl: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?q=80&w=2070&auto=format&fit=crop"
    }
];

async function insertBeverages() {
    console.log(`Starting to insert ${beverages.length} Indonesian beverages...`);

    // ============================================================
    // STEP 1: VALIDATE ALL DATA BEFORE INSERTION
    // ============================================================
    console.log('\n' + '='.repeat(50));
    console.log('STEP 1: Validating all beverage data...');
    console.log('='.repeat(50));

    const validation = validateAllItems(beverages);

    if (!validation.valid) {
        console.error('\n❌ VALIDATION FAILED!');
        console.error(`Found ${validation.totalErrors} errors in ${validation.itemErrors.length} items:\n`);

        validation.itemErrors.forEach(({ index, name, errors }) => {
            console.error(`Item #${index + 1}: "${name}"`);
            errors.forEach(err => console.error(`  - ${err}`));
            console.error('');
        });

        console.error('Please fix the errors above before running this script.');
        process.exit(1);
    }

    console.log('✓ All data validated successfully!');
    console.log(`  - ${beverages.length} items checked`);
    console.log(`  - 0 errors found`);

    // ============================================================
    // STEP 2: INSERT DATA IN BATCHES
    // ============================================================
    console.log('\n' + '='.repeat(50));
    console.log('STEP 2: Inserting data to database...');
    console.log('='.repeat(50) + '\n');

    try {
        // Insert in batches to avoid rate limits
        const BATCH_SIZE = 10;
        let successCount = 0;
        let errorCount = 0;
        const failedItems = [];

        for (let i = 0; i < beverages.length; i += BATCH_SIZE) {
            const batch = beverages.slice(i, i + BATCH_SIZE);

            console.log(`Inserting batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(beverages.length / BATCH_SIZE)}...`);

            const { data, error } = await supabase
                .from('food_items')
                .insert(batch);

            if (error) {
                console.error(`✗ Error inserting batch:`, error.message);

                // Log specific constraint violations
                if (error.code === '23505') {
                    console.error('  → Duplicate key violation (item already exists)');
                } else if (error.code === '23514') {
                    console.error('  → Check constraint violation (invalid data)');
                }

                errorCount += batch.length;
                failedItems.push(...batch.map(b => b.name));
            } else {
                console.log(`✓ Successfully inserted ${batch.length} beverages`);
                successCount += batch.length;

                // Show sample names from this batch
                batch.slice(0, 3).forEach(b => console.log(`  - ${b.name}`));
            }

            // Small delay between batches
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        // ============================================================
        // STEP 3: SUMMARY
        // ============================================================
        console.log('\n' + '='.repeat(50));
        console.log('INSERTION SUMMARY');
        console.log('='.repeat(50));
        console.log(`✓ Success: ${successCount} beverages`);
        if (errorCount > 0) {
            console.log(`✗ Errors: ${errorCount} beverages`);
            console.log('\nFailed items:');
            failedItems.forEach(name => console.log(`  - ${name}`));
        }
        console.log('='.repeat(50) + '\n');

        // ============================================================
        // STEP 4: VERIFY THE DATA
        // ============================================================
        console.log('STEP 3: Verifying inserted data...\n');
        const { data: verifyData, error: verifyError } = await supabase
            .from('food_items')
            .select('name, type, origin')
            .eq('type', 'Minuman')
            .order('name');

        if (verifyError) {
            console.error('Error verifying data:', verifyError);
        } else {
            console.log(`✓ Total Minuman items in database: ${verifyData.length}`);
            console.log('\nSample beverages:');
            verifyData.slice(0, 10).forEach((item, idx) => {
                console.log(`${idx + 1}. ${item.name} (${item.origin})`);
            });
        }

    } catch (err) {
        console.error('Unexpected error:', err);
        process.exit(1);
    }
}


// Run the insertion
insertBeverages();
