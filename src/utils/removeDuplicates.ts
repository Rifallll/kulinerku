import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const removeDuplicateFoods = async () => {
    toast.info("Scanning for duplicates...");

    try {
        // Fetch all foods with name and id
        const { data: foods, error } = await supabase
            .from('food_items')
            .select('id, name, created_at')
            .order('created_at', { ascending: false }); // Newest first

        if (error) throw error;
        if (!foods) return;

        const seenNames = new Set<string>();
        const duplicatesToDelete: string[] = [];

        for (const food of foods) {
            const normalizedName = food.name.toLowerCase().trim();

            if (seenNames.has(normalizedName)) {
                // Already seen this name (since we iterate newest first, this is an older duplicate)
                duplicatesToDelete.push(food.id);
            } else {
                seenNames.add(normalizedName);
            }
        }

        if (duplicatesToDelete.length === 0) {
            toast.success("No duplicates found!");
            return;
        }

        toast.info(`Found ${duplicatesToDelete.length} duplicates. Deleting...`);

        // Delete in batches of 50 to be safe
        const batchSize = 50;
        for (let i = 0; i < duplicatesToDelete.length; i += batchSize) {
            const batch = duplicatesToDelete.slice(i, i + batchSize);
            const { error: deleteError } = await supabase
                .from('food_items')
                .delete()
                .in('id', batch);

            if (deleteError) {
                console.error("Error deleting batch:", deleteError);
            }
        }

        toast.success(`Successfully removed ${duplicatesToDelete.length} duplicate foods.`);

    } catch (err) {
        console.error("Error removing duplicates:", err);
        toast.error("Failed to remove duplicates.");
    }
};
