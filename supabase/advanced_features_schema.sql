-- ============================================
-- ADVANCED MEMBER FEATURES - DATABASE SCHEMA
-- ============================================
-- Created for Kulinerku Dashboard, History, and Comments system

-- ============================================
-- 1. USER STATS TABLE
-- ============================================
-- Tracks member statistics, badges, and achievements

CREATE TABLE IF NOT EXISTS public.user_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  
  -- Statistics
  total_reviews INTEGER DEFAULT 0,
  total_favorites INTEGER DEFAULT 0,
  total_foods_viewed INTEGER DEFAULT 0,
  total_comments INTEGER DEFAULT 0,
  
  -- Membership
  member_since TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Badges & Achievements (stored as JSON)
  badges JSONB DEFAULT '[]'::jsonb,
  achievements JSONB DEFAULT '{}'::jsonb,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. USER ACTIVITIES TABLE
-- ============================================
-- Tracks user activity feed for dashboard

CREATE TABLE IF NOT EXISTS public.user_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Activity details
  activity_type TEXT NOT NULL, -- 'review', 'favorite', 'view', 'comment'
  food_id TEXT,
  food_name TEXT,
  food_image TEXT,
  
  -- Additional metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 3. FOOD VIEW HISTORY TABLE
-- ============================================
-- Tracks which foods a user has viewed

CREATE TABLE IF NOT EXISTS public.food_view_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Food details
  food_id TEXT NOT NULL,
  food_name TEXT NOT NULL,
  food_image TEXT,
  food_category TEXT,
  food_region TEXT,
  
  -- View tracking
  view_count INTEGER DEFAULT 1,
  first_viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- One record per user per food
  UNIQUE(user_id, food_id)
);

-- ============================================
-- 4. FOOD COMMENTS TABLE
-- ============================================
-- Nested comments/discussion system

CREATE TABLE IF NOT EXISTS public.food_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Food reference
  food_id TEXT NOT NULL,
  food_name TEXT NOT NULL,
  
  -- User info
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT,
  user_name TEXT,
  
  -- Comment content
  comment_text TEXT NOT NULL,
  
  -- Nesting support
  parent_id UUID REFERENCES public.food_comments(id) ON DELETE CASCADE,
  
  -- Edit tracking
  is_edited BOOLEAN DEFAULT FALSE,
  edited_at TIMESTAMP WITH TIME ZONE,
  
  -- Engagement
  likes_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 5. COMMENT LIKES TABLE
-- ============================================
-- Track which users liked which comments

CREATE TABLE IF NOT EXISTS public.comment_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id UUID NOT NULL REFERENCES public.food_comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- One like per user per comment
  UNIQUE(comment_id, user_id)
);

-- ============================================
-- ROW LEVEL SECURITY - USER STATS
-- ============================================

ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

-- Users can view their own stats
CREATE POLICY "Users can view own stats"
  ON public.user_stats FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own stats
CREATE POLICY "Users can insert own stats"
  ON public.user_stats FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own stats
CREATE POLICY "Users can update own stats"
  ON public.user_stats FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- ROW LEVEL SECURITY - USER ACTIVITIES
-- ============================================

ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;

-- Users can view their own activities
CREATE POLICY "Users can view own activities"
  ON public.user_activities FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own activities
CREATE POLICY "Users can insert own activities"
  ON public.user_activities FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- ROW LEVEL SECURITY - FOOD VIEW HISTORY
-- ============================================

ALTER TABLE public.food_view_history ENABLE ROW LEVEL SECURITY;

-- Users can view their own history
CREATE POLICY "Users can view own history"
  ON public.food_view_history FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own views
CREATE POLICY "Users can insert own views"
  ON public.food_view_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own views
CREATE POLICY "Users can update own views"
  ON public.food_view_history FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- ROW LEVEL SECURITY - FOOD COMMENTS
-- ============================================

ALTER TABLE public.food_comments ENABLE ROW LEVEL SECURITY;

-- Everyone can view comments
CREATE POLICY "Anyone can view comments"
  ON public.food_comments FOR SELECT
  USING (true);

-- Authenticated users can insert comments
CREATE POLICY "Members can insert comments"
  ON public.food_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own comments
CREATE POLICY "Users can update own comments"
  ON public.food_comments FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own comments
CREATE POLICY "Users can delete own comments"
  ON public.food_comments FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- ROW LEVEL SECURITY - COMMENT LIKES
-- ============================================

ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;

-- Everyone can view likes
CREATE POLICY "Anyone can view likes"
  ON public.comment_likes FOR SELECT
  USING (true);

-- Users can insert their own likes
CREATE POLICY "Users can insert own likes"
  ON public.comment_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own likes
CREATE POLICY "Users can delete own likes"
  ON public.comment_likes FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- User Stats
CREATE INDEX IF NOT EXISTS idx_user_stats_user_id ON public.user_stats(user_id);

-- User Activities
CREATE INDEX IF NOT EXISTS idx_user_activities_user_id ON public.user_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_created ON public.user_activities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_activities_type ON public.user_activities(activity_type);

-- Food View History
CREATE INDEX IF NOT EXISTS idx_food_view_user_id ON public.food_view_history(user_id);
CREATE INDEX IF NOT EXISTS idx_food_view_food_id ON public.food_view_history(food_id);
CREATE INDEX IF NOT EXISTS idx_food_view_last ON public.food_view_history(last_viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_food_view_count ON public.food_view_history(view_count DESC);

-- Food Comments
CREATE INDEX IF NOT EXISTS idx_food_comments_food_id ON public.food_comments(food_id);
CREATE INDEX IF NOT EXISTS idx_food_comments_user_id ON public.food_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_food_comments_parent ON public.food_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_food_comments_created ON public.food_comments(created_at DESC);

-- Comment Likes
CREATE INDEX IF NOT EXISTS idx_comment_likes_comment ON public.comment_likes(comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_user ON public.comment_likes(user_id);

-- ============================================
-- TRIGGERS FOR AUTO-UPDATE
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to relevant tables
CREATE TRIGGER update_user_stats_updated_at
    BEFORE UPDATE ON public.user_stats
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_food_comments_updated_at
    BEFORE UPDATE ON public.food_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Uncomment to test after running the above

-- Check tables created
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE '%user_%' OR table_name LIKE '%comment%';

-- Check RLS policies
-- SELECT tablename, policyname FROM pg_policies WHERE tablename IN ('user_stats', 'user_activities', 'food_view_history', 'food_comments', 'comment_likes');

-- Check indexes
-- SELECT indexname, tablename FROM pg_indexes WHERE schemaname = 'public' AND (tablename LIKE '%user_%' OR tablename LIKE '%comment%');

-- ============================================
-- DONE! Ready to use
-- ============================================
