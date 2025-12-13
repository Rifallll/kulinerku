-- Add ingredients column to food_items table
-- Run this in Supabase SQL Editor

ALTER TABLE food_items 
ADD COLUMN IF NOT EXISTS ingredients text[];

-- Add comment
COMMENT ON COLUMN food_items.ingredients IS 'Array of ingredient names for the dish';
