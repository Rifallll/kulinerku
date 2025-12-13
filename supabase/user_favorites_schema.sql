-- ============================================
-- USER FAVORITES TABLE
-- ============================================
-- This table stores user-specific favorites for the Kulinerku app.
-- Each user can save their favorite foods, and the data is private
-- and synced across devices.

-- Drop table if it exists to ensure fresh start
DROP TABLE IF EXISTS public.user_favorites CASCADE;

-- Create the table
CREATE TABLE public.user_favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  food_id TEXT NOT NULL,
  food_name TEXT NOT NULL,
  food_image TEXT,
  food_category TEXT,
  food_region TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one user can't favorite the same food twice
  UNIQUE(user_id, food_id)
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
-- Enable RLS to ensure users can only access their own favorites
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view only their own favorites
CREATE POLICY "Users can view own favorites"
  ON public.user_favorites
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert only their own favorites
CREATE POLICY "Users can insert own favorites"
  ON public.user_favorites
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete only their own favorites
CREATE POLICY "Users can delete own favorites"
  ON public.user_favorites
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
-- Index on user_id for faster queries when fetching user's favorites
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id 
  ON public.user_favorites(user_id);

-- Index on food_id for faster lookup when checking if food is favorited
CREATE INDEX IF NOT EXISTS idx_user_favorites_food_id 
  ON public.user_favorites(food_id);

-- Composite index for the most common query pattern
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_food 
  ON public.user_favorites(user_id, food_id);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- After running the above, you can verify with these queries:

-- Check if table was created
-- SELECT * FROM public.user_favorites LIMIT 5;

-- Check RLS policies
-- SELECT * FROM pg_policies WHERE tablename = 'user_favorites';

-- Check indexes
-- SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'user_favorites';
