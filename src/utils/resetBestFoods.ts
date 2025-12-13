import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const resetBestFoodsStatus = async () => {
    toast.info("Clearing Best Foods list...");

    try {
        const { error, count } = await supabase
            .from('food_items')
            .update({ mostIconic: null })
            .neq('id', '00000000-0000-0000-0000-000000000000'); // Check safe update

        if (error) {
            throw error;
        }

        toast.success("Best Foods list cleared! You can now star items manually.");
    } catch (err) {
        console.error("Error clearing best foods:", err);
        toast.error("Failed to clear Best Foods list.");
    }
};
