import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function removeDuplicates() {
    console.log('🔍 Finding duplicate food names...\n');

    // Fetch all items
    const { data: allFoods, error } = await supabase
        .from('food_items')
        .select('*')
        .order('created_at', { ascending: false }); // Newer first

    if (error) {
        console.error('Error fetching foods:', error);
        return;
    }

    console.log(`Total items in database: ${allFoods.length}`);

    // Group by name (case-insensitive)
    const nameMap = new Map();

    allFoods.forEach(food => {
        const normalizedName = food.name.toLowerCase().trim();
        if (!nameMap.has(normalizedName)) {
            nameMap.set(normalizedName, []);
        }
        nameMap.get(normalizedName).push(food);
    });

    // Find duplicates
    const duplicates = [];
    let totalDuplicates = 0;

    nameMap.forEach((foods, name) => {
        if (foods.length > 1) {
            duplicates.push({ name, foods });
            totalDuplicates += foods.length - 1; // Keep 1, delete the rest
        }
    });

    console.log(`\nFound ${duplicates.length} food names with duplicates`);
    console.log(`Total duplicate entries to remove: ${totalDuplicates}\n`);

    if (duplicates.length === 0) {
        console.log('✅ No duplicates found!');
        return;
    }

    // For each duplicate group, keep the best one
    const idsToDelete = [];

    duplicates.forEach(({ name, foods }) => {
        console.log(`\n📋 "${foods[0].name}" (${foods.length} duplicates):`);

        // Sort by quality: prefer items with real images, descriptions, and specific provinces
        foods.sort((a, b) => {
            // Prefer items with pollinations.ai images (AI generated based on food name)
            const aHasGoodImage = a.imageUrl && a.imageUrl.includes('pollinations.ai');
            const bHasGoodImage = b.imageUrl && b.imageUrl.includes('pollinations.ai');
            if (aHasGoodImage && !bHasGoodImage) return -1;
            if (!aHasGoodImage && bHasGoodImage) return 1;

            // Prefer items with longer descriptions
            const aDescLength = (a.description || '').length;
            const bDescLength = (b.description || '').length;
            if (aDescLength > bDescLength) return -1;
            if (aDescLength < bDescLength) return 1;

            // Prefer items with specific provinces (not just "Indonesia")
            const aHasProvince = a.origin && a.origin !== 'Indonesia' && a.origin.length > 3;
            const bHasProvince = b.origin && b.origin !== 'Indonesia' && b.origin.length > 3;
            if (aHasProvince && !bHasProvince) return -1;
            if (!aHasProvince && bHasProvince) return 1;

            // Equal quality, just keep first one
            return 0;
        });

        // Keep the first (best) item, delete the rest
        console.log(`  ✅ Keeping: ${foods[0].origin} | ${foods[0].description?.substring(0, 50)}...`);
        for (let i = 1; i < foods.length; i++) {
            console.log(`  ❌ Deleting: ${foods[i].origin} | ${foods[i].description?.substring(0, 50)}...`);
            idsToDelete.push(foods[i].id);
        }
    });

    // Delete duplicates in batches
    console.log(`\n🗑️  Deleting ${idsToDelete.length} duplicate entries...`);

    const BATCH_SIZE = 50;
    let deleted = 0;

    for (let i = 0; i < idsToDelete.length; i += BATCH_SIZE) {
        const batch = idsToDelete.slice(i, i + BATCH_SIZE);
        const { error } = await supabase
            .from('food_items')
            .delete()
            .in('id', batch);

        if (error) {
            console.error(`Error deleting batch ${i / BATCH_SIZE + 1}:`, error);
        } else {
            deleted += batch.length;
            console.log(`Deleted batch ${i / BATCH_SIZE + 1} (${deleted}/${idsToDelete.length})`);
        }
    }

    // Final count
    const { data: finalCount } = await supabase
        .from('food_items')
        .select('id', { count: 'exact', head: true });

    console.log(`\n✅ Cleanup complete!`);
    console.log(`   Before: ${allFoods.length} items`);
    console.log(`   After: ${finalCount.count} items`);
    console.log(`   Removed: ${allFoods.length - finalCount.count} duplicates`);
}

removeDuplicates()
    .then(() => {
        console.log('\n🎉 Done!');
        process.exit(0);
    })
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });
