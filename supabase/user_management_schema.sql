-- Create a public profiles table that syncs with auth.users
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  role text default 'member',
  is_banned boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Policies
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using ( true );

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile"
  on public.profiles for update
  using ( auth.uid() = id );

-- Special Policy: Admins can update ANY profile (to ban/promote)
-- Note: This relies on the user calling the update having the 'admin' role in their own profile metadata or this table.
-- For simplicity, we'll allow updates if the requester is an admin in the profiles table.
create policy "Admins can update any profile"
  on public.profiles for update
  using ( 
    auth.uid() in (
      select id from public.profiles where role = 'admin'
    )
  );

-- Trigger to handle new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, role, is_banned)
  values (
    new.id, 
    new.email, 
    coalesce(new.raw_user_meta_data->>'role', 'member'),
    false
  );
  return new;
end;
$$;

-- Trigger execution
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Backfill existing users (Optional - run manually/once if needed, but safe to include)
insert into public.profiles (id, email, role)
select id, email, coalesce(raw_user_meta_data->>'role', 'member')
from auth.users
on conflict (id) do nothing;
