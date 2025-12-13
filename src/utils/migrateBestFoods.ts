import { supabase } from '@/lib/supabase';
import { bestFoodsFinal } from '@/data/bestFoodsFinal';
import { toast } from 'sonner';

export const migrateBestFoods = async () => {
    let count = 0;
    let errors = 0;
    let updated = 0;

    // Show starting toast
    toast.info("Starting sync of 50 Best Foods...");

    for (const food of bestFoodsFinal) {
        try {
            // Determine category
            let type = (food as any).type || "Makanan";

            // Fallback for older data shape if any
            if (!type) {
                const lowerName = food.name.toLowerCase();
                const lowerDesc = food.description.toLowerCase();
                if (lowerName.includes('es ') || lowerName.includes('jus ') || lowerName.includes('kopi') || lowerDesc.includes('minuman')) {
                    type = "Minuman";
                } else if (lowerName.includes('kue') || lowerName.includes('martabak') || lowerName.includes('pisang') || lowerDesc.includes('manis') || lowerDesc.includes('snack') || lowerDesc.includes('jajanan')) {
                    type = "Jajanan";
                }
            }

            // Check if exists
            const { data: existing } = await supabase
                .from('food_items')
                .select('id')
                .eq('name', food.name)
                .single();

            if (existing) {
                // Update existing
                const { error } = await supabase.from('food_items').update({
                    description: food.description,
                    rating: food.rating,
                    imageUrl: "",
                    type: type,
                    origin: food.origin, // Use specific origin
                    mostIconic: "STAR"
                }).eq('id', existing.id);

                if (error) {
                    console.error(`Failed to update ${food.name}:`, error);
                    errors++;
                } else {
                    updated++;
                }
            } else {
                // Insert new
                const { error } = await supabase.from('food_items').insert({
                    name: food.name,
                    description: food.description,
                    rating: food.rating,
                    imageUrl: "",
                    type: type,
                    origin: food.origin, // Use specific origin
                    mostIconic: "STAR"
                });

                if (error) {
                    console.error(`Failed to insert ${food.name}:`, error);
                    errors++;
                } else {
                    count++;
                }
            }

        } catch (err) {
            console.error(`Error processing ${food.name}:`, err);
            errors++;
        }
    }

    if (count > 0 || updated > 0) {
        toast.success(`Sync complete! Added ${count} new, Updated ${updated} items.`);
    } else if (errors === 0) {
        toast.info("All items are already up to date.");
    } else {
        toast.warning(`Sync finished with ${errors} errors.`);
    }
};
