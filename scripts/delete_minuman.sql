-- SQL Query to permanently delete all items with type = 'Minuman'
-- Run this in Supabase SQL Editor

-- First, let's see what will be deleted (optional - for verification)
SELECT id, name, type, origin 
FROM food_items 
WHERE type = 'Minuman';

-- Then delete all items with type = 'Minuman'
DELETE FROM food_items 
WHERE type = 'Minuman';

-- Verify deletion (should return 0 rows)
SELECT COUNT(*) as remaining_minuman_items
FROM food_items 
WHERE type = 'Minuman';
