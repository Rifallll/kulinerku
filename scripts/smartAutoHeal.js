import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import {
    classifyItem,
    findDuplicates,
    checkDataQuality,
    autoHeal
} from './intelligentClassifier.js';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ============================================================
// CONFIGURATION
// ============================================================

const CONFIG = {
    AUTO_FIX_THRESHOLD: 0.7, // Only auto-fix if confidence >= 70%
    DUPLICATE_THRESHOLD: 0.85, // Similarity threshold for duplicates
    DRY_RUN: false, // Set to true to preview changes without applying
    VERBOSE: true // Show detailed logs
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function printSection(title, icon = '🔍') {
    console.log('\n' + '='.repeat(70));
    console.log(`${icon} ${title}`);
    console.log('='.repeat(70));
}

function printSubSection(title) {
    console.log(`\n${title}`);
    console.log('-'.repeat(70));
}

// ============================================================
// MAIN AUTO-HEALING PROCESS
// ============================================================

async function runIntelligentAutoHealing() {
    console.log('\n🤖 INTELLIGENT AUTO-HEALING SYSTEM');
    console.log('   Smart Data Quality Management\n');

    const stats = {
        totalItems: 0,
        healthyItems: 0,
        fixedItems: 0,
        manualReviewNeeded: 0,
        duplicatesFound: 0,
        duplicatesRemoved: 0,
        issues: {
            high: 0,
            medium: 0,
            low: 0
        }
    };

    try {
        // ============================================================
        // STEP 1: FETCH ALL DATA
        // ============================================================
        printSection('STEP 1: Fetching Data from Database', '📥');

        const { data: items, error } = await supabase
            .from('food_items')
            .select('*')
            .order('id');

        if (error) throw error;

        stats.totalItems = items.length;
        console.log(`✅ Loaded ${items.length} items`);

        // ============================================================
        // STEP 2: INTELLIGENT CLASSIFICATION & QUALITY CHECK
        // ============================================================
        printSection('STEP 2: Intelligent Quality Analysis', '🧠');

        const itemsWithIssues = [];
        const healthyItems = [];

        for (const item of items) {
            const qualityCheck = checkDataQuality(item);

            if (qualityCheck.isValid) {
                healthyItems.push(item);
            } else {
                itemsWithIssues.push({
                    item,
                    qualityCheck
                });
                stats.issues[qualityCheck.severity]++;
            }
        }

        stats.healthyItems = healthyItems.length;

        console.log(`\n📊 Quality Analysis Results:`);
        console.log(`   ✅ Healthy items: ${healthyItems.length} (${(healthyItems.length / items.length * 100).toFixed(1)}%)`);
        console.log(`   ⚠️  Items with issues: ${itemsWithIssues.length}`);
        console.log(`      🔴 High severity: ${stats.issues.high}`);
        console.log(`      🟡 Medium severity: ${stats.issues.medium}`);
        console.log(`      🟢 Low severity: ${stats.issues.low}`);

        // ============================================================
        // STEP 3: AUTO-HEALING
        // ============================================================
        printSection('STEP 3: Auto-Healing Process', '🔧');

        const healingResults = [];

        for (const { item, qualityCheck } of itemsWithIssues) {
            const healing = autoHeal(item, qualityCheck.issues);

            if (healing.fixed) {
                // Check confidence before auto-fixing
                const highConfidenceChanges = healing.changes.filter(
                    c => !c.confidence || c.confidence >= CONFIG.AUTO_FIX_THRESHOLD
                );

                if (highConfidenceChanges.length > 0) {
                    healingResults.push({
                        item,
                        healing,
                        autoFix: true
                    });
                } else {
                    healingResults.push({
                        item,
                        healing,
                        autoFix: false,
                        reason: 'Low confidence'
                    });
                    stats.manualReviewNeeded++;
                }
            } else {
                stats.manualReviewNeeded++;
            }
        }

        // Apply fixes
        if (!CONFIG.DRY_RUN) {
            for (const result of healingResults) {
                if (!result.autoFix) continue;

                const { error: updateError } = await supabase
                    .from('food_items')
                    .update(result.healing.newItem)
                    .eq('id', result.item.id);

                if (updateError) {
                    console.error(`   ✗ Failed to fix ${result.item.name}:`, updateError.message);
                } else {
                    stats.fixedItems++;
                    if (CONFIG.VERBOSE) {
                        console.log(`   ✓ Fixed: ${result.item.name}`);
                        result.healing.changes.forEach(change => {
                            console.log(`      ${change.field}: ${change.oldValue} → ${change.newValue} (${(change.confidence * 100).toFixed(0)}% confidence)`);
                        });
                    }
                }
            }
        } else {
            console.log('\n⚠️  DRY RUN MODE - No changes applied');
            healingResults.filter(r => r.autoFix).forEach(result => {
                console.log(`   Would fix: ${result.item.name}`);
                result.healing.changes.forEach(change => {
                    console.log(`      ${change.field}: ${change.oldValue} → ${change.newValue}`);
                });
            });
            stats.fixedItems = healingResults.filter(r => r.autoFix).length;
        }

        console.log(`\n✅ Auto-fixed: ${stats.fixedItems} items`);
        console.log(`⚠️  Manual review needed: ${stats.manualReviewNeeded} items`);

        // ============================================================
        // STEP 4: DUPLICATE DETECTION
        // ============================================================
        printSection('STEP 4: Fuzzy Duplicate Detection', '🔍');

        const duplicateGroups = findDuplicates(items, CONFIG.DUPLICATE_THRESHOLD);
        stats.duplicatesFound = duplicateGroups.reduce((sum, group) => sum + group.duplicates.length, 0);

        if (duplicateGroups.length > 0) {
            console.log(`\n⚠️  Found ${duplicateGroups.length} potential duplicate groups:`);

            duplicateGroups.forEach((group, idx) => {
                console.log(`\n   Group ${idx + 1}: "${group.original.name}"`);
                group.duplicates.forEach(dup => {
                    console.log(`      → "${dup.name}" (${(dup.similarity * 100).toFixed(0)}% similar)`);
                });
            });

            console.log(`\n💡 Tip: Review these duplicates manually`);
            console.log(`   Similar names might be different dishes or regional variations`);
        } else {
            console.log(`✅ No duplicates found`);
        }

        // ============================================================
        // STEP 5: FINAL VERIFICATION
        // ============================================================
        printSection('STEP 5: Final Verification', '✅');

        if (!CONFIG.DRY_RUN && stats.fixedItems > 0) {
            const { data: verifyData, error: verifyError } = await supabase
                .from('food_items')
                .select('type');

            if (verifyError) throw verifyError;

            const typeCounts = {};
            verifyData.forEach(item => {
                typeCounts[item.type] = (typeCounts[item.type] || 0) + 1;
            });

            console.log('\n📊 Current Database State:');
            console.table(typeCounts);

            const invalidTypes = Object.keys(typeCounts).filter(
                type => !['Makanan', 'Minuman'].includes(type)
            );

            if (invalidTypes.length > 0) {
                console.log('\n⚠️  WARNING: Still have invalid types:');
                invalidTypes.forEach(type => {
                    console.log(`   - ${type}: ${typeCounts[type]} items`);
                });
            } else {
                console.log('\n✅ All types are valid (Makanan or Minuman)');
            }
        }

        // ============================================================
        // FINAL REPORT
        // ============================================================
        printSection('FINAL REPORT', '📋');

        console.log(`\n📊 Summary:`);
        console.log(`   Total items processed: ${stats.totalItems}`);
        console.log(`   Healthy items: ${stats.healthyItems} (${(stats.healthyItems / stats.totalItems * 100).toFixed(1)}%)`);
        console.log(`   Auto-fixed: ${stats.fixedItems}`);
        console.log(`   Manual review needed: ${stats.manualReviewNeeded}`);
        console.log(`   Duplicates found: ${stats.duplicatesFound}`);

        console.log(`\n🎯 Data Quality Score: ${((stats.healthyItems + stats.fixedItems) / stats.totalItems * 100).toFixed(1)}%`);

        if (stats.manualReviewNeeded > 0) {
            console.log(`\n⚠️  Action Required:`);
            console.log(`   ${stats.manualReviewNeeded} items need manual review`);
            console.log(`   Run with VERBOSE=true to see details`);
        }

        if (duplicateGroups.length > 0) {
            console.log(`\n💡 Recommendations:`);
            console.log(`   - Review ${duplicateGroups.length} duplicate groups`);
            console.log(`   - Consider merging or removing duplicates`);
        }

        console.log(`\n✨ Auto-healing complete!`);

        return stats;

    } catch (error) {
        console.error('\n❌ Auto-healing failed:', error.message);
        throw error;
    }
}

// ============================================================
// RUN THE SYSTEM
// ============================================================

// Check for command line arguments
const args = process.argv.slice(2);
if (args.includes('--dry-run')) {
    CONFIG.DRY_RUN = true;
    console.log('🔍 Running in DRY RUN mode (no changes will be applied)\n');
}
if (args.includes('--quiet')) {
    CONFIG.VERBOSE = false;
}

runIntelligentAutoHealing()
    .then(stats => {
        process.exit(0);
    })
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
