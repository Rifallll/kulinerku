-- ==========================================
-- FINAL TRIGGER FIX (JSONB SCHEMA) 🔧
-- ==========================================
-- This script fixes the 'column "food_id" does not exist' error.
-- It redefines all triggers to insert into the 'details' JSONB column
-- instead of trying to insert into non-existent columns.

-- 1. SYNC REVIEWS
create or replace function public.sync_review_activity()
returns trigger as $$
begin
  -- Update Stats
  update public.user_stats 
  set total_reviews = total_reviews + 1 
  where user_id = new.user_id;

  -- Log Activity (Corrected)
  insert into public.user_activities (
    user_id, activity_type, details
  ) values (
    new.user_id, 
    'review', 
    jsonb_build_object(
      'food_id', new.food_id,
      'food_name', new.food_name
    )
  );
  
  return new;
end;
$$ language plpgsql security definer;


-- 2. SYNC FAVORITES
create or replace function public.sync_favorite_add()
returns trigger as $$
begin
  -- Update Stats
  update public.user_stats 
  set total_favorites = total_favorites + 1 
  where user_id = new.user_id;

  -- Log Activity (Corrected)
  insert into public.user_activities (
    user_id, activity_type, details
  ) values (
    new.user_id, 
    'favorite', 
    jsonb_build_object(
      'food_id', new.food_id,
      'food_name', new.food_name,
      'food_image', new.food_image
    )
  );
  
  return new;
end;
$$ language plpgsql security definer;


-- 3. SYNC COMMENTS
create or replace function public.sync_comment_activity()
returns trigger as $$
begin
  -- Update Stats
  update public.user_stats 
  set total_comments = total_comments + 1 
  where user_id = new.user_id;

  -- Log Activity (Corrected)
  insert into public.user_activities (
    user_id, activity_type, details
  ) values (
    new.user_id, 
    'comment', 
    jsonb_build_object(
      'food_id', new.food_id,
      'food_name', new.food_name
    )
  );
  
  return new;
end;
$$ language plpgsql security definer;

-- 4. FORCE SCHEMA RELOAD
notify pgrst, 'reload schema';
