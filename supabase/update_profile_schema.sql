-- 1. Add new columns to profiles if they don't exist
do $$
begin
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'full_name') then
        alter table public.profiles add column full_name text;
    end if;

    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'avatar_url') then
        alter table public.profiles add column avatar_url text;
    end if;
end $$;

-- 2. Create 'avatars' bucket in storage
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- 3. Storage Policies for Avatars
-- Enable RLS for objects (if not already enabled, usually implicit)

-- Allow Public Read
drop policy if exists "Avatar Public Read" on storage.objects;
create policy "Avatar Public Read"
on storage.objects for select
using ( bucket_id = 'avatars' );

-- Allow Authenticated Upload (Insert)
drop policy if exists "Avatar User Upload" on storage.objects;
create policy "Avatar User Upload"
on storage.objects for insert
with check ( bucket_id = 'avatars' and auth.role() = 'authenticated' );

-- Allow User Update Own Avatar
drop policy if exists "Avatar User Update" on storage.objects;
create policy "Avatar User Update"
on storage.objects for update
using ( bucket_id = 'avatars' and auth.uid() = owner );

-- Allow User Delete Own Avatar
drop policy if exists "Avatar User Delete" on storage.objects;
create policy "Avatar User Delete"
on storage.objects for delete
using ( bucket_id = 'avatars' and auth.uid() = owner );
