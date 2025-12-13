-- ============================================
-- ☢️ MASTER FIX SCRIPT (RESET & REPAIR) ☢️
-- ============================================
-- INSTRUCTION: Run this in a NEW SQL Editor window.
-- This script wipes out all faulty triggers and recreates them cleanly.

-- 1. CLEANUP (Drop duplicate/faulty triggers)
drop trigger if exists on_food_view on public.food_view_history;
drop trigger if exists on_food_viewed on public.food_view_history;
drop trigger if exists on_view_change on public.user_activities;
drop function if exists public.handle_food_view_activity;
drop function if exists public.sync_view_activity;
drop function if exists public.handle_view_change;

-- 2. FIX TABLE COLUMNS (Standardize)
do $$
begin
  if exists(select 1 from information_schema.columns where table_name = 'user_activities' and column_name = 'action_type') then
    alter table public.user_activities rename column action_type to activity_type;
  end if;
end $$;
alter table public.user_activities add column if not exists activity_type text;

-- 3. RECREATE TRIGGERS (With Correct JSONB Logic)

-- A. FAVORITES SYNC
create or replace function public.sync_favorite_add()
returns trigger as $$
begin
  update public.user_stats set total_favorites = total_favorites + 1 where user_id = new.user_id;
  insert into public.user_activities (user_id, activity_type, details) 
  values (new.user_id, 'favorite', jsonb_build_object('food_id', new.food_id, 'food_name', new.food_name, 'food_image', new.food_image));
  return new;
end;
$$ language plpgsql security definer;

-- B. REVIEWS SYNC
create or replace function public.sync_review_activity()
returns trigger as $$
begin
  update public.user_stats set total_reviews = total_reviews + 1 where user_id = new.user_id;
  insert into public.user_activities (user_id, activity_type, details) 
  values (new.user_id, 'review', jsonb_build_object('food_id', new.food_id, 'food_name', new.food_name));
  return new;
end;
$$ language plpgsql security definer;

-- C. COMMENTS SYNC
create or replace function public.sync_comment_activity()
returns trigger as $$
begin
  update public.user_stats set total_comments = total_comments + 1 where user_id = new.user_id;
  insert into public.user_activities (user_id, activity_type, details) 
  values (new.user_id, 'comment', jsonb_build_object('food_id', new.food_id, 'food_name', new.food_name));
  return new;
end;
$$ language plpgsql security definer;

-- D. FOOD VIEWS SYNC (The one causing errors)
create or replace function public.handle_food_view_proper()
returns trigger as $$
begin
  -- Update Stats
  insert into public.user_stats (user_id, total_foods_viewed) values (new.user_id, 1) on conflict (user_id) do update set total_foods_viewed = user_stats.total_foods_viewed + 1;
  
  -- Log Activity (In Details JSON)
  insert into public.user_activities (user_id, activity_type, details) 
  values (new.user_id, 'view', jsonb_build_object('food_id', new.food_id, 'food_name', new.food_name, 'food_image', new.food_image));
  
  return new;
end;
$$ language plpgsql security definer;

create trigger on_food_view_master
  after insert on public.food_view_history
  for each row execute procedure public.handle_food_view_proper();

-- 4. FIX NETWORK ERRORS (Permissions & Defaults)
grant execute on function public.track_food_view(text, text, text, text, text, text) to authenticated;
grant execute on function public.track_food_view(text, text, text, text, text, text) to service_role;
grant execute on function public.track_food_view(text, text, text, text, text, text) to anon;

grant select, insert, update, delete on public.food_view_history to authenticated;
grant select on public.food_reviews to authenticated;
grant select on public.food_reviews to anon;

-- 5. RELOAD
notify pgrst, 'reload schema';
