-- Enable Row Level Security (RLS) for the food_items table
ALTER TABLE public.food_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist, to ensure a clean setup
DROP POLICY IF EXISTS "Allow public insert access" ON public.food_items;
DROP POLICY IF EXISTS "Allow public select access" ON public.food_items;

-- Create a policy to allow anonymous users to insert data
CREATE POLICY "Allow public insert access" ON public.food_items
FOR INSERT WITH CHECK (true);

-- Create a policy to allow anonymous users to read data
CREATE POLICY "Allow public select access" ON public.food_items
FOR SELECT USING (true);