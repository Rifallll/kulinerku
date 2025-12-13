-- 0. Ensure user_stats table exists
create table if not exists public.user_stats (
  user_id uuid references auth.users(id) primary key,
  total_reviews integer default 0,
  total_favorites integer default 0,
  total_foods_viewed integer default 0,
  total_comments integer default 0,
  member_since timestamp with time zone default now(),
  last_active timestamp with time zone default now(),
  badges jsonb default '[]'::jsonb,
  achievements jsonb default '{}'::jsonb
);

-- Enable RLS for user_stats
alter table public.user_stats enable row level security;

drop policy if exists "Users can view own stats" on public.user_stats;
drop policy if exists "Users can update own stats" on public.user_stats;
drop policy if exists "Users can insert own stats" on public.user_stats;

create policy "Users can view own stats" on public.user_stats for select using (auth.uid() = user_id);
create policy "Users can update own stats" on public.user_stats for update using (auth.uid() = user_id);
create policy "Users can insert own stats" on public.user_stats for insert with check (auth.uid() = user_id);

-- 1. FAVORITES SYNC
create or replace function public.handle_favorite_change()
returns trigger as $$
begin
  if (TG_OP = 'INSERT') then
    insert into public.user_stats (user_id, total_favorites, total_reviews, total_foods_viewed, total_comments)
    values (new.user_id, 1, 0, 0, 0)
    on conflict (user_id) do update
    set total_favorites = user_stats.total_favorites + 1;
    return new;
  elsif (TG_OP = 'DELETE') then
    update public.user_stats
    set total_favorites = GREATEST(0, total_favorites - 1)
    where user_id = old.user_id;
    return old;
  end if;
  return null;
end;
$$ language plpgsql security definer;

drop trigger if exists on_favorite_change on public.user_favorites;
create trigger on_favorite_change
after insert or delete on public.user_favorites
for each row execute procedure public.handle_favorite_change();

-- 2. REVIEWS SYNC
create or replace function public.handle_review_change()
returns trigger as $$
begin
  if (TG_OP = 'INSERT') then
    insert into public.user_stats (user_id, total_reviews)
    values (new.user_id, 1)
    on conflict (user_id) do update
    set total_reviews = user_stats.total_reviews + 1;
    return new;
  elsif (TG_OP = 'DELETE') then
    update public.user_stats
    set total_reviews = GREATEST(0, total_reviews - 1)
    where user_id = old.user_id;
    return old;
  end if;
  return null;
end;
$$ language plpgsql security definer;

drop trigger if exists on_review_change on public.food_reviews;
create trigger on_review_change
after insert or delete on public.food_reviews
for each row execute procedure public.handle_review_change();

-- 3. VIEWS SYNC
create or replace function public.handle_view_change()
returns trigger as $$
begin
  if (TG_OP = 'INSERT' and new.action_type = 'VIEW_FOOD') then
    insert into public.user_stats (user_id, total_foods_viewed)
    values (new.user_id, 1)
    on conflict (user_id) do update
    set total_foods_viewed = user_stats.total_foods_viewed + 1;
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_view_change on public.user_activities;
create trigger on_view_change
after insert on public.user_activities
for each row execute procedure public.handle_view_change();

-- 4. FINAL RECALCULATION
update public.user_stats s
set 
  total_favorites = (select count(*) from public.user_favorites f where f.user_id = s.user_id),
  total_reviews = (select count(*) from public.food_reviews r where r.user_id = s.user_id),
  total_foods_viewed = (select count(*) from public.user_activities a where a.user_id = s.user_id and a.action_type = 'VIEW_FOOD');
