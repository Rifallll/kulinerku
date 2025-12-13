-- ==========================================
-- FINAL NETWORK FIX V2 (DEFAULTS & ROBUST) ☢️
-- ==========================================

-- 1. Ensure Table Exists
create table if not exists public.food_view_history (
  user_id uuid references auth.users(id) on delete cascade,
  food_id text not null,
  food_name text not null,
  food_image text,
  food_category text,
  food_region text,
  view_count integer default 1,
  last_viewed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, food_id)
);
alter table public.food_view_history enable row level security;

-- GRANT ALL on the table
grant select, insert, update, delete on public.food_view_history to authenticated;
grant select, insert, update, delete on public.food_view_history to service_role;
grant select, insert, update, delete on public.food_view_history to anon; -- Just in case

-- Policies
drop policy if exists "Users can view own history" on public.food_view_history;
create policy "Users can view own history" on public.food_view_history for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own history" on public.food_view_history;
create policy "Users can insert own history" on public.food_view_history for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own history" on public.food_view_history;
create policy "Users can update own history" on public.food_view_history for update using (auth.uid() = user_id);


-- 2. FIX RPC FUNCTION (With DEFAULTS)
-- Drop old versions
drop function if exists public.track_food_view(uuid, text, text, text, text, text);
drop function if exists public.track_food_view(text, text, text, text, text, text);

-- Create with TEXT params and DEFAULTS implies optionality
create or replace function public.track_food_view(
  p_user_id text default null,
  p_food_id text default null,
  p_food_name text default null,
  p_food_image text default null,
  p_food_category text default null,
  p_food_region text default null
)
returns void as $$
begin
  -- Validate inputs
  if p_user_id is null or p_food_id is null then
    return; -- Silently fail if critical data missing
  end if;

  insert into public.food_view_history (
    user_id, food_id, food_name, food_image, 
    food_category, food_region, last_viewed_at, view_count
  )
  values (
    p_user_id::uuid, -- Cast
    p_food_id, 
    coalesce(p_food_name, 'Unknown Message'), 
    p_food_image, 
    p_food_category, 
    p_food_region, 
    now(), 
    1
  )
  on conflict (user_id, food_id)
  do update set
    last_viewed_at = now(),
    view_count = food_view_history.view_count + 1,
    food_name = excluded.food_name,
    food_image = excluded.food_image;
end;
$$ language plpgsql security definer set search_path = public;

-- GRANT EXECUTE (Critical)
grant execute on function public.track_food_view(text, text, text, text, text, text) to authenticated;
grant execute on function public.track_food_view(text, text, text, text, text, text) to service_role;
grant execute on function public.track_food_view(text, text, text, text, text, text) to anon;

-- 3. FIX REVIEWS (406 Not Acceptable Fix)
grant select on public.food_reviews to anon;
grant select on public.food_reviews to authenticated;

drop policy if exists "Reviews are viewable by everyone" on public.food_reviews;
create policy "Reviews are viewable by everyone" on public.food_reviews for select using (true);

-- 4. Reload Schema Cache (Supabase Refresh)
notify pgrst, 'reload schema';
