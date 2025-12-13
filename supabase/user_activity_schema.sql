-- Drop table if it exists to ensure fresh start with correct columns
drop table if exists public.user_activities cascade;

-- Create a table to track user activities
create table public.user_activities (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete set null,
  action_type text not null, -- 'LOGIN', 'VIEW_FOOD', 'SEARCH', 'REVIEW', etc.
  details jsonb, -- Arbitrary details about the action (e.g., food_id, search_term)
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.user_activities enable row level security;

-- Policy: Admins can view all logs
create policy "Admins can view all activities"
  on public.user_activities
  for select
  using (
    auth.jwt() ->> 'role' = 'service_role' OR
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Policy: Users can insert their own activities (or anyone if we want to log anon views)
-- For now, let's allow authenticated users to insert.
create policy "Users can insert their own activities"
  on public.user_activities
  for insert
  with check (auth.uid() = user_id);

-- If we want to track anonymous users, we might need a broader insert policy, 
-- but for now let's stick to auth users or maybe handle anon in the future.
-- PROPOSAL: Allow anon insert if user_id is null?
create policy "Anyone can insert activities"
  on public.user_activities
  for insert
  with check (true); 
  -- We'll just allow insertion. RLS main job here is protecting READ access.

-- Index for faster queries on filtering
create index if not exists user_activities_created_at_idx on public.user_activities(created_at desc);
create index if not exists user_activities_user_id_idx on public.user_activities(user_id);
create index if not exists user_activities_action_type_idx on public.user_activities(action_type);
