-- ============================================================
-- DATA VALIDATION & AUDIT SCRIPT
-- Tujuan: Mengidentifikasi dan memperbaiki kesalahan tag Minuman/Makanan
-- ============================================================

-- 1. AUDIT: Lihat semua tipe yang ada di database
SELECT DISTINCT type, COUNT(*) as jumlah
FROM food_items
GROUP BY type
ORDER BY type;

-- 2. AUDIT: Cari item yang mungkin salah tag (berdasarkan nama)
-- Kata kunci minuman yang seharusnya bertipe "Minuman"
SELECT id, name, type, origin
FROM food_items
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
  )
ORDER BY name;

-- 3. AUDIT: Cari item makanan yang mungkin salah tag sebagai minuman
SELECT id, name, type, origin
FROM food_items
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
  )
ORDER BY name;

-- 4. STATISTIK: Total per kategori
SELECT 
  type,
  COUNT(*) as total_items,
  ROUND(AVG(rating), 2) as avg_rating,
  COUNT(DISTINCT origin) as jumlah_daerah_asal
FROM food_items
GROUP BY type
ORDER BY total_items DESC;

-- 5. AUDIT: Cek duplikat berdasarkan nama
SELECT name, type, COUNT(*) as jumlah_duplikat
FROM food_items
GROUP BY name, type
HAVING COUNT(*) > 1
ORDER BY jumlah_duplikat DESC, name;

-- 6. AUDIT: Lihat semua minuman yang ada
SELECT name, type, origin, rating
FROM food_items
WHERE type = 'Minuman'
ORDER BY name;
