-- Create a new storage bucket for food images
insert into storage.buckets (id, name, public)
values ('food-images', 'food-images', true)
on conflict (id) do nothing;

-- Drop existing policies to prevent "already exists" errors
drop policy if exists "Public Access" on storage.objects;
drop policy if exists "Authenticated Upload" on storage.objects;
drop policy if exists "Authenticated Update" on storage.objects;
drop policy if exists "Authenticated Delete" on storage.objects;

-- Allow public access to view images
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'food-images' );

-- Allow authenticated users to upload images
create policy "Authenticated Upload"
  on storage.objects for insert
  with check ( bucket_id = 'food-images' );

-- Allow authenticated users to update their images
create policy "Authenticated Update"
  on storage.objects for update
  using ( bucket_id = 'food-images' );

-- Allow authenticated users to delete images
create policy "Authenticated Delete"
  on storage.objects for delete
  using ( bucket_id = 'food-images' );
