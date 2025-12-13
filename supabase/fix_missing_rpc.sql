-- 1. Create food_view_history table if missing
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

-- Enable RLS
alter table public.food_view_history enable row level security;

-- Policies for food_view_history
drop policy if exists "Users can view own history" on public.food_view_history;
create policy "Users can view own history"
  on public.food_view_history for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own history" on public.food_view_history;
create policy "Users can insert own history"
  on public.food_view_history for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own history" on public.food_view_history;
create policy "Users can update own history"
  on public.food_view_history for update
  using (auth.uid() = user_id);

drop policy if exists "Users can delete own history" on public.food_view_history;
create policy "Users can delete own history"
  on public.food_view_history for delete
  using (auth.uid() = user_id);

-- 2. Create track_food_view RPC function
-- Drop first to allow signature change if needed
drop function if exists public.track_food_view;

create or replace function public.track_food_view(
  p_user_id uuid, -- Client is sending UUID string, Postgres handles casting automatically
  p_food_id text,
  p_food_name text,
  p_food_image text,
  p_food_category text,
  p_food_region text
)
returns void as $$
begin
  insert into public.food_view_history (
    user_id, food_id, food_name, food_image, 
    food_category, food_region, last_viewed_at, view_count
  )
  values (
    p_user_id, p_food_id, p_food_name, p_food_image, 
    p_food_category, p_food_region, now(), 1
  )
  on conflict (user_id, food_id)
  do update set
    last_viewed_at = now(),
    view_count = food_view_history.view_count + 1,
    food_name = excluded.food_name,
    food_image = excluded.food_image;
end;
$$ language plpgsql security definer;

-- 3. GRANT PERMISSIONS (Critical Fix)
grant execute on function public.track_food_view to authenticated;
grant execute on function public.track_food_view to anon;
grant execute on function public.track_food_view to service_role;
