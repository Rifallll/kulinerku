-- ============================================
-- MISSING TRIGGER FOR FOOD VIEW HISTORY
-- ============================================
-- This ensures "Foods Explored" stat updates automatically
-- and logs "Viewed" activity for new foods.

CREATE OR REPLACE FUNCTION public.sync_view_activity()
RETURNS TRIGGER AS $$
BEGIN
  -- Update Stats (Unique foods count)
  UPDATE public.user_stats 
  SET total_foods_viewed = total_foods_viewed + 1 
  WHERE user_id = NEW.user_id;

  -- Log Activity (Only for first time discovery)
  INSERT INTO public.user_activities (
    user_id, activity_type, food_id, food_name, food_image
  ) VALUES (
    NEW.user_id, 'view', NEW.food_id, NEW.food_name, NEW.food_image
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on food_view_history insert (New food discovered)
DROP TRIGGER IF EXISTS on_food_viewed ON public.food_view_history;
CREATE TRIGGER on_food_viewed
  AFTER INSERT ON public.food_view_history
  FOR EACH ROW EXECUTE FUNCTION public.sync_view_activity();
