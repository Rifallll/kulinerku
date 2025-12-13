CREATE TABLE public.food_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    type text NOT NULL,
    origin text NOT NULL,
    rating numeric NOT NULL,
    description text,
    "imageUrl" text,
    "mostIconic" text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.food_items ENABLE ROW LEVEL SECURITY;