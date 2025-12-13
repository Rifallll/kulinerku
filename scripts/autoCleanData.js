import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

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
// HELPER FUNCTIONS
// ============================================================

function printSection(title) {
    console.log('\n' + '='.repeat(60));
    console.log(title);
    console.log('='.repeat(60));
}

function printSubSection(title) {
    console.log('\n' + title);
    console.log('-'.repeat(60));
}

// ============================================================
// STEP 1: AUDIT - Kondisi Data Saat Ini
// ============================================================

async function auditData() {
    printSection('STEP 1: AUDIT - Kondisi Data Saat Ini');

    try {
        // 1.1: Lihat semua tipe yang ada
        printSubSection('1.1: Tipe data yang ada');
        const { data: types, error: typesError } = await supabase
            .from('food_items')
            .select('type');

        if (typesError) throw typesError;

        const typeCounts = {};
        types.forEach(item => {
            typeCounts[item.type] = (typeCounts[item.type] || 0) + 1;
        });

        console.table(typeCounts);

        // 1.2: Statistik per kategori
        printSubSection('1.2: Statistik per kategori');
        const { data: allItems, error: statsError } = await supabase
            .from('food_items')
            .select('type, rating, origin');

        if (statsError) throw statsError;

        const stats = {};
        allItems.forEach(item => {
            if (!stats[item.type]) {
                stats[item.type] = {
                    count: 0,
                    totalRating: 0,
                    origins: new Set()
                };
            }
            stats[item.type].count++;
            stats[item.type].totalRating += item.rating;
            stats[item.type].origins.add(item.origin);
        });

        Object.keys(stats).forEach(type => {
            console.log(`\n${type}:`);
            console.log(`  Total items: ${stats[type].count}`);
            console.log(`  Avg rating: ${(stats[type].totalRating / stats[type].count).toFixed(2)}`);
            console.log(`  Jumlah daerah: ${stats[type].origins.size}`);
        });

        // 1.3: Cek duplikat
        printSubSection('1.3: Cek duplikat');
        const { data: items, error: dupError } = await supabase
            .from('food_items')
            .select('name, type');

        if (dupError) throw dupError;

        const nameTypeCounts = {};
        items.forEach(item => {
            const key = `${item.name}|${item.type}`;
            nameTypeCounts[key] = (nameTypeCounts[key] || 0) + 1;
        });

        const duplicates = Object.entries(nameTypeCounts)
            .filter(([_, count]) => count > 1)
            .map(([key, count]) => {
                const [name, type] = key.split('|');
                return { name, type, count };
            });

        if (duplicates.length > 0) {
            console.log(`⚠️  Found ${duplicates.length} duplicates:`);
            console.table(duplicates);
        } else {
            console.log('✅ No duplicates found');
        }

        return { typeCounts, duplicates };

    } catch (error) {
        console.error('❌ Error in audit:', error.message);
        throw error;
    }
}

// ============================================================
// STEP 2: IDENTIFIKASI MASALAH
// ============================================================

async function identifyProblems() {
    printSection('STEP 2: IDENTIFIKASI MASALAH');

    const beverageKeywords = [
        'es ', 'kopi', 'teh', 'jus ', 'susu', 'wedang', 'bajigur',
        'bandrek', 'sekoteng', 'jamu', 'bir pletok', 'lahang',
        'cendol', 'dawet', 'teler', 'doger', 'selendang mayang',
        'ronde', 'cincau', 'kelapa muda', 'air kelapa', 'timun serut',
        'thai tea', 'cappuccino', 'latte', 'smoothie', 'milkshake', 'sari '
    ];

    const foodKeywords = [
        'nasi', 'ayam', 'sate', 'rendang', 'soto', 'bakso', 'mie',
        'gado', 'pecel', 'gudeg', 'rawon', 'opor', 'sambal', 'ikan',
        'tempe', 'tahu', 'perkedel', 'kerupuk', 'empal', 'dendeng'
    ];

    try {
        // 2.1: Minuman yang salah tag
        printSubSection('2.1: Item yang seharusnya MINUMAN tapi salah tag');
        const { data: allItems, error } = await supabase
            .from('food_items')
            .select('id, name, type, origin');

        if (error) throw error;

        const wrongBeverages = allItems.filter(item => {
            if (item.type === 'Minuman') return false;
            const nameLower = item.name.toLowerCase();
            return beverageKeywords.some(keyword => {
                if (keyword.endsWith(' ')) {
                    return nameLower.startsWith(keyword) || nameLower.includes(' ' + keyword);
                }
                return nameLower.includes(keyword);
            });
        });

        if (wrongBeverages.length > 0) {
            console.log(`⚠️  Found ${wrongBeverages.length} items that should be Minuman:`);
            wrongBeverages.forEach(item => {
                console.log(`  - ${item.name} (currently: ${item.type})`);
            });
        } else {
            console.log('✅ No mistagged beverages found');
        }

        // 2.2: Makanan yang salah tag
        printSubSection('2.2: Item yang seharusnya MAKANAN tapi salah tag');
        const wrongFoods = allItems.filter(item => {
            if (item.type !== 'Minuman') return false;
            const nameLower = item.name.toLowerCase();
            return foodKeywords.some(keyword => nameLower.includes(keyword));
        });

        if (wrongFoods.length > 0) {
            console.log(`⚠️  Found ${wrongFoods.length} items that should be Makanan:`);
            wrongFoods.forEach(item => {
                console.log(`  - ${item.name} (currently: ${item.type})`);
            });
        } else {
            console.log('✅ No mistagged foods found');
        }

        return { wrongBeverages, wrongFoods };

    } catch (error) {
        console.error('❌ Error identifying problems:', error.message);
        throw error;
    }
}

// ============================================================
// STEP 3: PERBAIKI DATA
// ============================================================

async function fixData(wrongBeverages, wrongFoods) {
    printSection('STEP 3: PERBAIKI DATA');

    let totalFixed = 0;

    try {
        // 3.1: Fix beverages
        if (wrongBeverages.length > 0) {
            printSubSection('3.1: Memperbaiki tag minuman...');
            for (const item of wrongBeverages) {
                const { error } = await supabase
                    .from('food_items')
                    .update({ type: 'Minuman' })
                    .eq('id', item.id);

                if (error) {
                    console.error(`  ✗ Failed to update ${item.name}:`, error.message);
                } else {
                    console.log(`  ✓ Updated ${item.name} → Minuman`);
                    totalFixed++;
                }
            }
        } else {
            console.log('✅ No beverages to fix');
        }

        // 3.2: Fix foods
        if (wrongFoods.length > 0) {
            printSubSection('3.2: Memperbaiki tag makanan...');
            for (const item of wrongFoods) {
                const { error } = await supabase
                    .from('food_items')
                    .update({ type: 'Makanan' })
                    .eq('id', item.id);

                if (error) {
                    console.error(`  ✗ Failed to update ${item.name}:`, error.message);
                } else {
                    console.log(`  ✓ Updated ${item.name} → Makanan`);
                    totalFixed++;
                }
            }
        } else {
            console.log('✅ No foods to fix');
        }

        // 3.3: Remove duplicates
        printSubSection('3.3: Menghapus duplikat...');
        const { data: items, error: fetchError } = await supabase
            .from('food_items')
            .select('id, name, type')
            .order('id');

        if (fetchError) throw fetchError;

        const seen = new Set();
        const toDelete = [];

        items.forEach(item => {
            const key = `${item.name}|${item.type}`;
            if (seen.has(key)) {
                toDelete.push(item.id);
            } else {
                seen.add(key);
            }
        });

        if (toDelete.length > 0) {
            console.log(`  Found ${toDelete.length} duplicates to delete`);
            for (const id of toDelete) {
                const { error } = await supabase
                    .from('food_items')
                    .delete()
                    .eq('id', id);

                if (error) {
                    console.error(`  ✗ Failed to delete duplicate:`, error.message);
                } else {
                    console.log(`  ✓ Deleted duplicate`);
                }
            }
        } else {
            console.log('✅ No duplicates to delete');
        }

        console.log(`\n✅ Total items fixed: ${totalFixed}`);
        console.log(`✅ Total duplicates removed: ${toDelete.length}`);

        return { totalFixed, totalDeleted: toDelete.length };

    } catch (error) {
        console.error('❌ Error fixing data:', error.message);
        throw error;
    }
}

// ============================================================
// STEP 4: VERIFIKASI HASIL
// ============================================================

async function verifyResults() {
    printSection('STEP 4: VERIFIKASI HASIL');

    try {
        const { data: items, error } = await supabase
            .from('food_items')
            .select('type');

        if (error) throw error;

        const typeCounts = {};
        items.forEach(item => {
            typeCounts[item.type] = (typeCounts[item.type] || 0) + 1;
        });

        console.log('\nTotal per kategori:');
        console.table(typeCounts);

        // Check for invalid types
        const validTypes = ['Makanan', 'Minuman'];
        const invalidTypes = Object.keys(typeCounts).filter(type => !validTypes.includes(type));

        if (invalidTypes.length > 0) {
            console.log('\n⚠️  WARNING: Found invalid types:');
            invalidTypes.forEach(type => {
                console.log(`  - ${type}: ${typeCounts[type]} items`);
            });
        } else {
            console.log('\n✅ All types are valid (Makanan or Minuman)');
        }

        return typeCounts;

    } catch (error) {
        console.error('❌ Error verifying results:', error.message);
        throw error;
    }
}

// ============================================================
// MAIN FUNCTION
// ============================================================

async function main() {
    console.log('\n🚀 Starting Automated Data Cleaning...\n');

    try {
        // Step 1: Audit
        const auditResults = await auditData();

        // Step 2: Identify problems
        const { wrongBeverages, wrongFoods } = await identifyProblems();

        // Check if there are any problems to fix
        if (wrongBeverages.length === 0 && wrongFoods.length === 0 && auditResults.duplicates.length === 0) {
            printSection('RESULT');
            console.log('✅ Data is already clean! No fixes needed.');
            console.log('✅ All items are correctly tagged.');
            return;
        }

        // Step 3: Fix data
        const { totalFixed, totalDeleted } = await fixData(wrongBeverages, wrongFoods);

        // Step 4: Verify results
        await verifyResults();

        // Final summary
        printSection('FINAL SUMMARY');
        console.log(`✅ Items fixed: ${totalFixed}`);
        console.log(`✅ Duplicates removed: ${totalDeleted}`);
        console.log(`✅ Data cleaning completed successfully!`);

        console.log('\n📝 Next steps:');
        console.log('  1. Review the results above');
        console.log('  2. Check docs/EDGE_CASES.md for manual review items');
        console.log('  3. Run constraints script if needed (add_database_constraints.sql)');

    } catch (error) {
        console.error('\n❌ Data cleaning failed:', error.message);
        process.exit(1);
    }
}

// Run the script
main();
