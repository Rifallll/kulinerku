import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    'https://mkhtlzmjdsjfrzinxnzp.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1raHRsem1qZHNqZnJ6aW54bnpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM0NTYxODksImV4cCI6MjA0OTAzMjE4OX0.gTk_0NfBYE0fzN53K79gxN1h-uU3FZWzKzxJiCM0YYU'
);

async function checkGenericOrigins() {
    const { data, error } = await supabase
        .from('food_items')
        .select('name, origin')
        .eq('origin', 'Indonesia');

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log(`Found ${data?.length} items with generic "Indonesia" origin:`);
    console.table(data);
}

checkGenericOrigins();
