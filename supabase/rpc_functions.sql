-- ============================================
-- RPC FUNCTIONS FOR ADVANCED FEATURES
-- ============================================

-- 1. TRACK FOOD VIEW (Upsert logic)
CREATE OR REPLACE FUNCTION public.track_food_view(
  p_user_id UUID,
  p_food_id TEXT,
  p_food_name TEXT,
  p_food_image TEXT,
  p_food_category TEXT,
  p_food_region TEXT
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.food_view_history (
    user_id, food_id, food_name, food_image, 
    food_category, food_region, last_viewed_at, view_count
  )
  VALUES (
    p_user_id, p_food_id, p_food_name, p_food_image, 
    p_food_category, p_food_region, NOW(), 1
  )
  ON CONFLICT (user_id, food_id)
  DO UPDATE SET
    last_viewed_at = NOW(),
    view_count = food_view_history.view_count + 1,
    food_name = EXCLUDED.food_name,     -- Update details if changed
    food_image = EXCLUDED.food_image;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. INCREMENT USER STATS
CREATE OR REPLACE FUNCTION public.increment_stat(
  p_user_id UUID,
  p_stat_name TEXT
)
RETURNS VOID AS $$
BEGIN
  IF p_stat_name = 'total_reviews' THEN
    UPDATE public.user_stats SET total_reviews = total_reviews + 1 WHERE user_id = p_user_id;
  ELSIF p_stat_name = 'total_favorites' THEN
    UPDATE public.user_stats SET total_favorites = total_favorites + 1 WHERE user_id = p_user_id;
  ELSIF p_stat_name = 'total_foods_viewed' THEN
    UPDATE public.user_stats SET total_foods_viewed = total_foods_viewed + 1 WHERE user_id = p_user_id;
  ELSIF p_stat_name = 'total_comments' THEN
    UPDATE public.user_stats SET total_comments = total_comments + 1 WHERE user_id = p_user_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. INCREMENT COMMENT LIKES
CREATE OR REPLACE FUNCTION public.increment_comment_likes(comment_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.food_comments
  SET likes_count = likes_count + 1
  WHERE id = comment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. DECREMENT COMMENT LIKES
CREATE OR REPLACE FUNCTION public.decrement_comment_likes(comment_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.food_comments
  SET likes_count = GREATEST(0, likes_count - 1)
  WHERE id = comment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
