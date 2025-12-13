// Quick script to check current database origin values
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    'https://mkhtlzmjdsjfrzinxnzp.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1raHRsem1qZHNqZnJ6aW54bnpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM0NTYxODksImV4cCI6MjA0OTAzMjE4OX0.gTk_0NfBYE0fzN53K79gxN1h-uU3FZWzKzxJiCM0YYU'
);

async function checkOrigins() {
    const { data, error } = await supabase
        .from('food_items')
        .select('name, origin')
        .limit(20);

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log('Sample of current data:');
    console.table(data);

    // Count by origin
    const { data: all } = await supabase
        .from('food_items')
        .select('origin');

    const counts = {};
    all?.forEach(item => {
        counts[item.origin] = (counts[item.origin] || 0) + 1;
    });

    console.log('\nOrigin distribution:');
    console.table(counts);
}

checkOrigins();
