import MLClassifier from './mlClassifier.js';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Configuration
const CONFIG = {
    CONFIDENCE_THRESHOLD: 0.75, // Only fix if >= 75% confident
    DRY_RUN: process.argv.includes('--dry-run'),
    VERBOSE: !process.argv.includes('--quiet')
};

/**
 * ML-POWERED AUTO-HEALING
 * Uses trained neural network instead of pattern matching
 */

async function mlAutoHeal() {
    console.log('\n🤖 ML-POWERED AUTO-HEALING SYSTEM');
    console.log('   Using Neural Network for Classification\n');

    if (CONFIG.DRY_RUN) {
        console.log('🔍 DRY RUN MODE - No changes will be applied\n');
    }

    console.log('='.repeat(70));

    const stats = {
        total: 0,
        healthy: 0,
        fixed: 0,
        lowConfidence: 0,
        errors: 0
    };

    try {
        // Step 1: Load ML model
        console.log('\n📥 STEP 1: Loading ML model...');
        const classifier = new MLClassifier();
        const loaded = await classifier.loadModel();

        if (!loaded) {
            console.log('⚠️  No trained model found!');
            console.log('💡 Run: npm run ml:train first\n');
            process.exit(1);
        }

        // Step 2: Fetch all data
        console.log('\n📊 STEP 2: Fetching data from database...');
        const { data: items, error } = await supabase
            .from('food_items')
            .select('*')
            .order('id');

        if (error) throw error;

        stats.total = items.length;
        console.log(`✅ Loaded ${items.length} items`);

        // Step 3: ML-powered classification
        console.log('\n🧠 STEP 3: ML classification & healing...');

        const fixes = [];
        const lowConfidenceItems = [];

        for (const item of items) {
            // Skip if already correct
            if (['Makanan', 'Minuman'].includes(item.type)) {
                const prediction = classifier.predict(item.name);

                if (prediction.type === item.type) {
                    stats.healthy++;
                    continue;
                }

                // Type mismatch - need to fix
                if (prediction.confidence >= CONFIG.CONFIDENCE_THRESHOLD) {
                    fixes.push({
                        item,
                        prediction,
                        oldType: item.type,
                        newType: prediction.type
                    });
                } else {
                    lowConfidenceItems.push({
                        item,
                        prediction
                    });
                    stats.lowConfidence++;
                }
            } else {
                // Invalid type - always fix
                const prediction = classifier.predict(item.name);

                if (prediction.confidence >= CONFIG.CONFIDENCE_THRESHOLD) {
                    fixes.push({
                        item,
                        prediction,
                        oldType: item.type,
                        newType: prediction.type
                    });
                } else {
                    lowConfidenceItems.push({
                        item,
                        prediction
                    });
                    stats.lowConfidence++;
                }
            }
        }

        console.log(`\n📊 Classification Results:`);
        console.log(`   ✅ Healthy: ${stats.healthy} items`);
        console.log(`   🔧 Need fixing: ${fixes.length} items`);
        console.log(`   ⚠️  Low confidence: ${lowConfidenceItems.length} items`);

        // Step 4: Apply fixes
        if (fixes.length > 0) {
            console.log('\n🔧 STEP 4: Applying fixes...');

            if (CONFIG.DRY_RUN) {
                console.log('\n⚠️  DRY RUN - Would fix:');
                fixes.slice(0, 20).forEach(fix => {
                    console.log(`   "${fix.item.name}"`);
                    console.log(`      ${fix.oldType} → ${fix.newType} (${(fix.prediction.confidence * 100).toFixed(1)}% confidence)`);
                });
                if (fixes.length > 20) {
                    console.log(`   ... and ${fixes.length - 20} more`);
                }
                stats.fixed = fixes.length;
            } else {
                for (const fix of fixes) {
                    const { error: updateError } = await supabase
                        .from('food_items')
                        .update({ type: fix.newType })
                        .eq('id', fix.item.id);

                    if (updateError) {
                        console.error(`   ✗ Failed: ${fix.item.name}`);
                        stats.errors++;
                    } else {
                        if (CONFIG.VERBOSE) {
                            console.log(`   ✓ Fixed: ${fix.item.name}`);
                            console.log(`      ${fix.oldType} → ${fix.newType} (${(fix.prediction.confidence * 100).toFixed(1)}%)`);
                        }
                        stats.fixed++;
                    }
                }
            }
        }

        // Step 5: Report low confidence items
        if (lowConfidenceItems.length > 0 && CONFIG.VERBOSE) {
            console.log('\n⚠️  Low Confidence Items (need manual review):');
            lowConfidenceItems.slice(0, 10).forEach(({ item, prediction }) => {
                console.log(`   "${item.name}"`);
                console.log(`      Current: ${item.type}, Predicted: ${prediction.type} (${(prediction.confidence * 100).toFixed(1)}%)`);
            });
            if (lowConfidenceItems.length > 10) {
                console.log(`   ... and ${lowConfidenceItems.length - 10} more`);
            }
        }

        // Final report
        console.log('\n' + '='.repeat(70));
        console.log('📋 FINAL REPORT');
        console.log('='.repeat(70));
        console.log(`\n📊 Summary:`);
        console.log(`   Total items: ${stats.total}`);
        console.log(`   Healthy: ${stats.healthy}`);
        console.log(`   Fixed: ${stats.fixed}`);
        console.log(`   Low confidence: ${stats.lowConfidence}`);
        if (stats.errors > 0) {
            console.log(`   Errors: ${stats.errors}`);
        }

        const qualityScore = ((stats.healthy + stats.fixed) / stats.total * 100).toFixed(1);
        console.log(`\n🎯 Data Quality Score: ${qualityScore}%`);

        if (!CONFIG.DRY_RUN && stats.fixed > 0) {
            console.log(`\n✅ Successfully fixed ${stats.fixed} items using ML!`);
        }

        console.log('\n' + '='.repeat(70) + '\n');

    } catch (error) {
        console.error('\n❌ ML Auto-heal failed:', error.message);
        throw error;
    }
}

// Run ML auto-heal
mlAutoHeal()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
