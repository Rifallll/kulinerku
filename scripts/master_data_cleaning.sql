-- ============================================================
-- MASTER SCRIPT - Complete Data Cleaning & Validation
-- Tujuan: Jalankan semua langkah dalam satu script
-- PERHATIAN: Baca komentar di setiap step sebelum menjalankan!
-- ============================================================

-- ============================================================
-- STEP 0: BACKUP (SANGAT DISARANKAN!)
-- ============================================================
-- Uncomment baris di bawah untuk membuat backup
-- CREATE TABLE food_items_backup AS SELECT * FROM food_items;

-- Verifikasi backup berhasil (uncomment jika sudah backup)
-- SELECT COUNT(*) as total_backup FROM food_items_backup;


-- ============================================================
-- STEP 1: AUDIT - Lihat kondisi data saat ini
-- ============================================================
\echo '=================================================='
\echo 'STEP 1: AUDIT - Kondisi Data Saat Ini'
\echo '=================================================='

-- 1.1: Lihat semua tipe yang ada
\echo '\n1.1: Tipe data yang ada:'
SELECT DISTINCT type, COUNT(*) as jumlah
FROM food_items
GROUP BY type
ORDER BY type;

-- 1.2: Statistik per kategori
\echo '\n1.2: Statistik per kategori:'
SELECT 
  type,
  COUNT(*) as total_items,
  ROUND(AVG(rating), 2) as avg_rating,
  COUNT(DISTINCT origin) as jumlah_daerah_asal
FROM food_items
GROUP BY type
ORDER BY total_items DESC;

-- 1.3: Cek duplikat
\echo '\n1.3: Cek duplikat:'
SELECT name, type, COUNT(*) as jumlah_duplikat
FROM food_items
GROUP BY name, type
HAVING COUNT(*) > 1
ORDER BY jumlah_duplikat DESC, name;


-- ============================================================
-- STEP 2: IDENTIFIKASI MASALAH
-- ============================================================
\echo '\n=================================================='
\echo 'STEP 2: IDENTIFIKASI MASALAH'
\echo '=================================================='

-- 2.1: Minuman yang salah tag sebagai makanan
\echo '\n2.1: Item yang seharusnya MINUMAN tapi salah tag:'
SELECT id, name, type, origin
FROM food_items
WHERE type != 'Minuman'
  AND (
    LOWER(name) LIKE 'es %' OR
    LOWER(name) LIKE '%kopi%' OR
    LOWER(name) LIKE '%teh%' OR
    LOWER(name) LIKE '%jus %' OR LOWER(name) LIKE 'jus %' OR
    LOWER(name) LIKE '%susu%' OR
    LOWER(name) LIKE '%wedang%' OR
    LOWER(name) LIKE '%bajigur%' OR
    LOWER(name) LIKE '%bandrek%' OR
    LOWER(name) LIKE '%sekoteng%' OR
    LOWER(name) LIKE '%jamu%' OR
    LOWER(name) LIKE '%bir pletok%' OR
    LOWER(name) LIKE '%lahang%' OR
    LOWER(name) LIKE '%cendol%' OR
    LOWER(name) LIKE '%dawet%' OR
    LOWER(name) LIKE '%teler%' OR
    LOWER(name) LIKE '%doger%' OR
    LOWER(name) LIKE '%selendang mayang%' OR
    LOWER(name) LIKE '%ronde%' OR
    LOWER(name) LIKE '%cincau%' OR
    LOWER(name) LIKE '%kelapa muda%' OR
    LOWER(name) LIKE '%air kelapa%' OR
    LOWER(name) LIKE '%timun serut%' OR
    LOWER(name) LIKE '%thai tea%' OR
    LOWER(name) LIKE '%cappuccino%' OR
    LOWER(name) LIKE '%latte%' OR
    LOWER(name) LIKE '%smoothie%' OR
    LOWER(name) LIKE '%milkshake%' OR
    LOWER(name) LIKE '%sari %'
  )
ORDER BY name;

-- 2.2: Makanan yang salah tag sebagai minuman
\echo '\n2.2: Item yang seharusnya MAKANAN tapi salah tag:'
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


-- ============================================================
-- STEP 3: PERBAIKI DATA (HATI-HATI!)
-- ============================================================
\echo '\n=================================================='
\echo 'STEP 3: PERBAIKI DATA'
\echo 'PERHATIAN: Ini akan mengubah data di database!'
\echo '=================================================='

-- 3.1: Perbaiki minuman yang salah tag
\echo '\n3.1: Memperbaiki tag minuman...'
UPDATE food_items
SET type = 'Minuman'
WHERE type != 'Minuman'
  AND (
    LOWER(name) LIKE 'es %' OR
    LOWER(name) LIKE '%kopi%' OR
    LOWER(name) LIKE '%teh%' OR
    LOWER(name) LIKE '%jus %' OR LOWER(name) LIKE 'jus %' OR
    LOWER(name) LIKE '%susu%' OR
    LOWER(name) LIKE '%wedang%' OR
    LOWER(name) LIKE '%bajigur%' OR
    LOWER(name) LIKE '%bandrek%' OR
    LOWER(name) LIKE '%sekoteng%' OR
    LOWER(name) LIKE '%jamu%' OR
    LOWER(name) LIKE '%bir pletok%' OR
    LOWER(name) LIKE '%lahang%' OR
    LOWER(name) LIKE '%cendol%' OR
    LOWER(name) LIKE '%dawet%' OR
    LOWER(name) LIKE '%teler%' OR
    LOWER(name) LIKE '%doger%' OR
    LOWER(name) LIKE '%selendang mayang%' OR
    LOWER(name) LIKE '%ronde%' OR
    LOWER(name) LIKE '%cincau%' OR
    LOWER(name) LIKE '%kelapa muda%' OR
    LOWER(name) LIKE '%air kelapa%' OR
    LOWER(name) LIKE '%timun serut%' OR
    LOWER(name) LIKE '%thai tea%' OR
    LOWER(name) LIKE '%cappuccino%' OR
    LOWER(name) LIKE '%latte%' OR
    LOWER(name) LIKE '%smoothie%' OR
    LOWER(name) LIKE '%milkshake%' OR
    LOWER(name) LIKE '%sari %'
  );

-- 3.2: Perbaiki makanan yang salah tag
\echo '\n3.2: Memperbaiki tag makanan...'
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

-- 3.3: Hapus duplikat
\echo '\n3.3: Menghapus duplikat...'
DELETE FROM food_items
WHERE id NOT IN (
  SELECT MIN(id)
  FROM food_items
  GROUP BY name, type
);


-- ============================================================
-- STEP 4: VERIFIKASI HASIL
-- ============================================================
\echo '\n=================================================='
\echo 'STEP 4: VERIFIKASI HASIL'
\echo '=================================================='

-- 4.1: Total per kategori
\echo '\n4.1: Total per kategori setelah cleaning:'
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

-- 4.2: Cek tipe yang tidak valid
\echo '\n4.2: Cek tipe yang tidak valid (seharusnya kosong):'
SELECT DISTINCT type, COUNT(*) as jumlah
FROM food_items
WHERE type NOT IN ('Makanan', 'Minuman')
GROUP BY type;


-- ============================================================
-- STEP 5: TAMBAHKAN CONSTRAINTS
-- ============================================================
\echo '\n=================================================='
\echo 'STEP 5: TAMBAHKAN CONSTRAINTS'
\echo '=================================================='

-- 5.1: Type constraint
\echo '\n5.1: Menambahkan constraint untuk type...'
ALTER TABLE food_items DROP CONSTRAINT IF EXISTS valid_food_type;
ALTER TABLE food_items ADD CONSTRAINT valid_food_type 
CHECK (type IN ('Makanan', 'Minuman'));

-- 5.2: Rating constraint
\echo '\n5.2: Menambahkan constraint untuk rating...'
ALTER TABLE food_items DROP CONSTRAINT IF EXISTS valid_rating;
ALTER TABLE food_items ADD CONSTRAINT valid_rating
CHECK (rating >= 0 AND rating <= 5);

-- 5.3: Name constraint
\echo '\n5.3: Menambahkan constraint untuk name...'
ALTER TABLE food_items DROP CONSTRAINT IF EXISTS name_not_empty;
ALTER TABLE food_items ADD CONSTRAINT name_not_empty
CHECK (LENGTH(TRIM(name)) > 0);

-- 5.4: Origin constraint
\echo '\n5.4: Menambahkan constraint untuk origin...'
ALTER TABLE food_items DROP CONSTRAINT IF EXISTS origin_not_empty;
ALTER TABLE food_items ADD CONSTRAINT origin_not_empty
CHECK (LENGTH(TRIM(origin)) > 0);

-- 5.5: Unique constraint
\echo '\n5.5: Menambahkan unique constraint...'
ALTER TABLE food_items DROP CONSTRAINT IF EXISTS unique_name_per_type;
ALTER TABLE food_items ADD CONSTRAINT unique_name_per_type
UNIQUE (name, type);

-- 5.6: Indexes
\echo '\n5.6: Menambahkan indexes...'
CREATE INDEX IF NOT EXISTS idx_food_items_type ON food_items(type);
CREATE INDEX IF NOT EXISTS idx_food_items_origin ON food_items(origin);
CREATE INDEX IF NOT EXISTS idx_food_items_rating ON food_items(rating);
CREATE INDEX IF NOT EXISTS idx_food_items_name ON food_items(name);


-- ============================================================
-- STEP 6: VERIFIKASI CONSTRAINTS
-- ============================================================
\echo '\n=================================================='
\echo 'STEP 6: VERIFIKASI CONSTRAINTS'
\echo '=================================================='

-- 6.1: Lihat semua constraints
\echo '\n6.1: Constraints yang sudah dibuat:'
SELECT 
  conname as constraint_name,
  contype as constraint_type,
  pg_get_constraintdef(oid) as definition
FROM pg_constraint
WHERE conrelid = 'food_items'::regclass
ORDER BY conname;

-- 6.2: Lihat semua indexes
\echo '\n6.2: Indexes yang sudah dibuat:'
SELECT 
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'food_items'
ORDER BY indexname;


-- ============================================================
-- SELESAI!
-- ============================================================
\echo '\n=================================================='
\echo 'SELESAI! Data cleaning dan validation complete.'
\echo '=================================================='
