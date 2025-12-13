-- Aktifkan RLS untuk tabel food_items jika belum aktif
ALTER TABLE public.food_items ENABLE ROW LEVEL SECURITY;

-- Buat kebijakan DELETE yang mengizinkan pengguna anon untuk menghapus semua baris
-- Pastikan tidak ada kebijakan DELETE lain yang bertentangan untuk peran 'anon'
DROP POLICY IF EXISTS "Allow anon delete all food items" ON public.food_items;
CREATE POLICY "Allow anon delete all food items"
ON public.food_items FOR DELETE
TO anon
USING (true);