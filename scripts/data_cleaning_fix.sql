-- ============================================================
-- DATA CLEANING & FIX SCRIPT
-- Tujuan: Memperbaiki tag yang salah dan membersihkan data
-- ============================================================

-- STEP 1: Backup data sebelum cleaning (optional, untuk safety)
-- Uncomment jika ingin backup
-- CREATE TABLE food_items_backup AS SELECT * FROM food_items;

-- STEP 2: Perbaiki item yang seharusnya "Minuman" tapi salah tag
-- Update semua item dengan kata kunci minuman menjadi type = 'Minuman'
UPDATE food_items
SET type = 'Minuman'
WHERE type != 'Minuman'
  AND (
    -- Minuman dingin dengan "Es"
    LOWER(name) LIKE 'es %' OR
    
    -- Kopi dan Teh
    LOWER(name) LIKE '%kopi%' OR
    LOWER(name) LIKE '%teh%' OR
    
    -- Jus dan minuman buah
    LOWER(name) LIKE '%jus %' OR
    LOWER(name) LIKE 'jus %' OR
    
    -- Susu
    LOWER(name) LIKE '%susu%' OR
    
    -- Minuman tradisional hangat
    LOWER(name) LIKE '%wedang%' OR
    LOWER(name) LIKE '%bajigur%' OR
    LOWER(name) LIKE '%bandrek%' OR
    LOWER(name) LIKE '%sekoteng%' OR
    
    -- Jamu dan herbal
    LOWER(name) LIKE '%jamu%' OR
    LOWER(name) LIKE '%bir pletok%' OR
    LOWER(name) LIKE '%lahang%' OR
    
    -- Minuman tradisional dingin
    LOWER(name) LIKE '%cendol%' OR
    LOWER(name) LIKE '%dawet%' OR
    LOWER(name) LIKE '%teler%' OR
    LOWER(name) LIKE '%doger%' OR
    LOWER(name) LIKE '%selendang mayang%' OR
    LOWER(name) LIKE '%ronde%' OR
    LOWER(name) LIKE '%cincau%' OR
    
    -- Minuman kelapa dan buah spesifik
    LOWER(name) LIKE '%kelapa muda%' OR
    LOWER(name) LIKE '%air kelapa%' OR
    LOWER(name) LIKE '%timun serut%' OR
    
    -- Minuman modern
    LOWER(name) LIKE '%thai tea%' OR
    LOWER(name) LIKE '%cappuccino%' OR
    LOWER(name) LIKE '%latte%' OR
    LOWER(name) LIKE '%smoothie%' OR
    LOWER(name) LIKE '%milkshake%' OR
    
    -- Minuman sari buah
    LOWER(name) LIKE '%sari %'
  );

-- STEP 3: Perbaiki item yang seharusnya "Makanan" tapi salah tag
-- Update semua item dengan kata kunci makanan menjadi type = 'Makanan'
UPDATE food_items
SET type = 'Makanan'
WHERE type = 'Minuman'
  AND (
    LOWER(name) LIKE '%nasi%' OR
    LOWER(name) LIKE '%ayam%' OR
    LOWER(name) LIKE '%sate%' OR
    LOWER(name) LIKE '%rendang%' OR
    LOWER(name) LIKE '%soto%' OR
    LOWER(name) LIKE '%bakso%' OR
    LOWER(name) LIKE '%mie%' OR
    LOWER(name) LIKE '%gado%' OR
    LOWER(name) LIKE '%pecel%' OR
    LOWER(name) LIKE '%gudeg%' OR
    LOWER(name) LIKE '%rawon%' OR
    LOWER(name) LIKE '%opor%' OR
    LOWER(name) LIKE '%sambal%' OR
    LOWER(name) LIKE '%ikan%' OR
    LOWER(name) LIKE '%tempe%' OR
    LOWER(name) LIKE '%tahu%' OR
    LOWER(name) LIKE '%perkedel%' OR
    LOWER(name) LIKE '%kerupuk%' OR
    LOWER(name) LIKE '%empal%' OR
    LOWER(name) LIKE '%dendeng%'
  );

-- STEP 4: Hapus duplikat (keep yang pertama berdasarkan created_at atau id terkecil)
-- Jika ada duplikat berdasarkan nama dan type
DELETE FROM food_items
WHERE id NOT IN (
  SELECT MIN(id)
  FROM food_items
  GROUP BY name, type
);

-- STEP 5: Verifikasi hasil cleaning
SELECT 
  'Total Makanan' as kategori,
  COUNT(*) as jumlah
FROM food_items
WHERE type = 'Makanan'
UNION ALL
SELECT 
  'Total Minuman' as kategori,
  COUNT(*) as jumlah
FROM food_items
WHERE type = 'Minuman'
UNION ALL
SELECT 
  'Total Semua' as kategori,
  COUNT(*) as jumlah
FROM food_items;

-- STEP 6: Cek apakah masih ada tipe yang tidak valid
SELECT DISTINCT type, COUNT(*) as jumlah
FROM food_items
WHERE type NOT IN ('Makanan', 'Minuman')
GROUP BY type;
