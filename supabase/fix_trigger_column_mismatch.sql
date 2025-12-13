-- ==========================================
-- FINAL TRIGGER FIX (COLUMN MISMATCH) 🔧
-- ==========================================

-- The error 'column "activity_type" does not exist' means the table likely has 'action_type'
-- but the triggers are trying to insert into 'activity_type'.
-- We will Standardize on 'activity_type' because the Dashboard code expects it.

-- 1. Rename column if 'action_type' exists
do $$
begin
  if exists(select 1 from information_schema.columns where table_name = 'user_activities' and column_name = 'action_type') then
    alter table public.user_activities rename column action_type to activity_type;
  end if;
end $$;

-- 2. Ensure 'activity_type' column exists (Backup plan)
alter table public.user_activities add column if not exists activity_type text;

-- 3. Re-Create the Trigger Function (Just to be safe and ensure it works with new column)
create or replace function public.handle_food_view_activity()
returns trigger as $$
begin
  insert into public.user_activities (
    user_id, 
    activity_type, 
    details, 
    created_at
  )
  values (
    new.user_id, 
    'view', 
    jsonb_build_object(
      'food_id', new.food_id,
      'food_name', new.food_name,
      'food_image', new.food_image
    ),
    now()
  );
  return new;
end;
$$ language plpgsql security definer;

-- 4. Re-Bind Trigger to food_view_history
drop trigger if exists on_food_view on public.food_view_history;
create trigger on_food_view
  after insert on public.food_view_history
  for each row execute procedure public.handle_food_view_activity();

-- 5. Force Schema Cache Reload
notify pgrst, 'reload schema';
