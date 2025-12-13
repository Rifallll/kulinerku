-- Hapus semua kebijakan DELETE yang ada untuk tabel food_items yang diterapkan pada peran 'anon'
DROP POLICY IF EXISTS "Allow anon delete access" ON public.food_items;
DROP POLICY IF EXISTS "Allow anon delete all food items" ON public.food_items;
DROP POLICY IF EXISTS "Allow anon to delete all food items" ON public.food_items;

-- Pastikan RLS diaktifkan untuk tabel food_items
ALTER TABLE public.food_items ENABLE ROW LEVEL SECURITY;

-- Buat satu kebijakan DELETE yang jelas yang mengizinkan peran 'anon' untuk menghapus semua baris
CREATE POLICY "Allow anon to delete all food items"
ON public.food_items FOR DELETE
TO anon
USING (true);