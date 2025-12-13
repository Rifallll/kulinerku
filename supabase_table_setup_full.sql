-- Create the food_items table
CREATE TABLE public.food_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    type text NOT NULL,
    origin text NOT NULL,
    rating numeric NOT NULL,
    description text NOT NULL,
    "imageUrl" text NOT NULL,
    "mostIconic" text
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.food_items ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow anonymous users to insert data
-- This is for demonstration/testing purposes. For production, you might want to restrict this.
CREATE POLICY "Allow public insert access" ON public.food_items
FOR INSERT WITH CHECK (true);

-- Create a policy to allow anonymous users to read data
CREATE POLICY "Allow public select access" ON public.food_items
FOR SELECT USING (true);