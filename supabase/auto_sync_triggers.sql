-- ============================================
-- AUTO-SYNC TRIGGERS FOR USER STATS & ACTIVITIES
-- ============================================
-- Ensures dashboard data is always 100% consistent with user actions

-- 1. AUTO-CREATE USER STATS ON SIGNUP
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_stats (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 2. AUTO-SYNC REVIEWS (Stats + Activity)
-- ============================================
CREATE OR REPLACE FUNCTION public.sync_review_activity()
RETURNS TRIGGER AS $$
BEGIN
  -- Update Stats
  UPDATE public.user_stats 
  SET total_reviews = total_reviews + 1 
  WHERE user_id = NEW.user_id;

  -- Log Activity
  INSERT INTO public.user_activities (
    user_id, activity_type, food_id, food_name, food_image
  ) VALUES (
    NEW.user_id, 'review', NEW.food_id, NEW.food_name, NULL -- image fetched via join/lookup usually
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on food_reviews insert
DROP TRIGGER IF EXISTS on_review_created ON public.food_reviews;
CREATE TRIGGER on_review_created
  AFTER INSERT ON public.food_reviews
  FOR EACH ROW EXECUTE FUNCTION public.sync_review_activity();


-- 3. AUTO-SYNC FAVORITES (Stats + Activity)
-- ============================================
-- INSERT (Add Favorite)
CREATE OR REPLACE FUNCTION public.sync_favorite_add()
RETURNS TRIGGER AS $$
BEGIN
  -- Update Stats
  UPDATE public.user_stats 
  SET total_favorites = total_favorites + 1 
  WHERE user_id = NEW.user_id;

  -- Log Activity
  INSERT INTO public.user_activities (
    user_id, activity_type, food_id, food_name, food_image
  ) VALUES (
    NEW.user_id, 'favorite', NEW.food_id, NEW.food_name, NEW.food_image
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on user_favorites insert
DROP TRIGGER IF EXISTS on_favorite_added ON public.user_favorites;
CREATE TRIGGER on_favorite_added
  AFTER INSERT ON public.user_favorites
  FOR EACH ROW EXECUTE FUNCTION public.sync_favorite_add();

-- DELETE (Remove Favorite)
CREATE OR REPLACE FUNCTION public.sync_favorite_remove()
RETURNS TRIGGER AS $$
BEGIN
  -- Update Stats
  UPDATE public.user_stats 
  SET total_favorites = GREATEST(0, total_favorites - 1) 
  WHERE user_id = OLD.user_id;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on user_favorites delete
DROP TRIGGER IF EXISTS on_favorite_removed ON public.user_favorites;
CREATE TRIGGER on_favorite_removed
  AFTER DELETE ON public.user_favorites
  FOR EACH ROW EXECUTE FUNCTION public.sync_favorite_remove();


-- 4. AUTO-SYNC COMMENTS (Stats + Activity)
-- ============================================
CREATE OR REPLACE FUNCTION public.sync_comment_activity()
RETURNS TRIGGER AS $$
BEGIN
  -- Update Stats
  UPDATE public.user_stats 
  SET total_comments = total_comments + 1 
  WHERE user_id = NEW.user_id;

  -- Log Activity
  INSERT INTO public.user_activities (
    user_id, activity_type, food_id, food_name
  ) VALUES (
    NEW.user_id, 'comment', NEW.food_id, NEW.food_name
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on food_comments insert
DROP TRIGGER IF EXISTS on_comment_created ON public.food_comments;
CREATE TRIGGER on_comment_created
  AFTER INSERT ON public.food_comments
  FOR EACH ROW EXECUTE FUNCTION public.sync_comment_activity();
