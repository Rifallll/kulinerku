import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const clearAllFoods = async () => {
    // Confirm with user (handled in UI usually, but this is the logic)
    // We assume the button click implies intent, but a double check is good practice.
    // For this utility, we just do the deletion.

    toast.info("Clearing all food data...");

    try {
        const { error, count } = await supabase
            .from('food_items')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all that are not some system ID if any

        if (error) {
            throw error;
        }

        toast.success("Database cleared successfully!");
    } catch (err) {
        console.error("Error clearing database:", err);
        toast.error("Failed to clear database.");
    }
};
