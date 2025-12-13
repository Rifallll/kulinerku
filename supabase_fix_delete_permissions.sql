-- ========================================
-- SUPABASE RLS POLICY FIX - ALLOW ALL OPERATIONS
-- ========================================
-- Run this SQL in Supabase SQL Editor to fix delete permissions
-- This will allow all operations (SELECT, INSERT, UPDATE, DELETE) without authentication

-- Step 1: Drop all existing policies (clean slate)
DROP POLICY IF EXISTS "Allow public read access" ON food_items;
DROP POLICY IF EXISTS "Allow public insert access" ON food_items;
DROP POLICY IF EXISTS "Allow public update access" ON food_items;
DROP POLICY IF EXISTS "Allow public delete access" ON food_items;
DROP POLICY IF EXISTS "Enable read access for all users" ON food_items;
DROP POLICY IF EXISTS "Enable insert for all users" ON food_items;
DROP POLICY IF EXISTS "Enable update for all users" ON food_items;
DROP POLICY IF EXISTS "Enable delete for all users" ON food_items;
DROP POLICY IF EXISTS "Public can select" ON food_items;
DROP POLICY IF EXISTS "Public can insert" ON food_items;
DROP POLICY IF EXISTS "Public can update" ON food_items;
DROP POLICY IF EXISTS "Public can delete" ON food_items;

-- Step 2: Ensure RLS is enabled
ALTER TABLE food_items ENABLE ROW LEVEL SECURITY;

-- Step 3: Create new comprehensive policies that allow ALL operations
-- These policies return TRUE for all requests, effectively allowing everyone

-- Allow SELECT (read) for everyone
CREATE POLICY "Allow all to read food_items"
ON food_items
FOR SELECT
USING (true);

-- Allow INSERT (create) for everyone
CREATE POLICY "Allow all to insert food_items"
ON food_items
FOR INSERT
WITH CHECK (true);

-- Allow UPDATE (modify) for everyone
CREATE POLICY "Allow all to update food_items"
ON food_items
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Allow DELETE (remove) for everyone - THIS IS THE KEY FIX
CREATE POLICY "Allow all to delete food_items"
ON food_items
FOR DELETE
USING (true);

-- Step 4: Verify policies are created (run this to check)
-- SELECT * FROM pg_policies WHERE tablename = 'food_items';

-- ========================================
-- VERIFICATION QUERIES
-- ========================================
-- After running the above, run these to verify:

-- 1. Check if RLS is enabled:
-- SELECT relname, relrowsecurity 
-- FROM pg_class 
-- WHERE relname = 'food_items';

-- 2. Check all policies:
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
-- FROM pg_policies 
-- WHERE tablename = 'food_items';

-- ========================================
-- NOTES
-- ========================================
-- If you want to restrict access later, you can modify the policies
-- For now, this allows public access to all CRUD operations
-- which is suitable for development/demo purposes
