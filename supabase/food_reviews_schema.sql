-- ============================================
-- FOOD REVIEWS TABLE
-- ============================================
-- This table stores user reviews and ratings for foods in Kulinerku.
-- Members can submit one review per food with 1-5 star rating.

-- Create the table
CREATE TABLE IF NOT EXISTS public.food_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  food_id TEXT NOT NULL,
  food_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  user_email TEXT,
  user_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one review per user per food
  UNIQUE(user_id, food_id)
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
-- Enable RLS
ALTER TABLE public.food_reviews ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view reviews (including guests)
CREATE POLICY "Anyone can view reviews"
  ON public.food_reviews
  FOR SELECT
  USING (true);

-- Policy: Authenticated users can insert their own reviews
CREATE POLICY "Users can insert own reviews"
  ON public.food_reviews
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own reviews only
CREATE POLICY "Users can update own reviews"
  ON public.food_reviews
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own reviews only
CREATE POLICY "Users can delete own reviews"
  ON public.food_reviews
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
-- Index on food_id for faster queries when fetching reviews
CREATE INDEX IF NOT EXISTS idx_food_reviews_food_id 
  ON public.food_reviews(food_id);

-- Index on user_id for user's review history
CREATE INDEX IF NOT EXISTS idx_food_reviews_user_id 
  ON public.food_reviews(user_id);

-- Index on rating for filtering by rating
CREATE INDEX IF NOT EXISTS idx_food_reviews_rating 
  ON public.food_reviews(rating);

-- Index on created_at for sorting by date
CREATE INDEX IF NOT EXISTS idx_food_reviews_created_at 
  ON public.food_reviews(created_at DESC);

-- Composite index for common query pattern
CREATE INDEX IF NOT EXISTS idx_food_reviews_food_user 
  ON public.food_reviews(food_id, user_id);

-- ============================================
-- TRIGGER FOR UPDATED_AT
-- ============================================
-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER update_food_reviews_updated_at
    BEFORE UPDATE ON public.food_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- After running the above, you can verify with these queries:

-- Check if table was created
-- SELECT * FROM public.food_reviews LIMIT 5;

-- Check RLS policies
-- SELECT * FROM pg_policies WHERE tablename = 'food_reviews';

-- Check indexes
-- SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'food_reviews';

-- Get average rating for a food
-- SELECT 
--   food_id,
--   AVG(rating) as avg_rating,
--   COUNT(*) as total_reviews
-- FROM public.food_reviews 
-- WHERE food_id = 'rendang'
-- GROUP BY food_id;
