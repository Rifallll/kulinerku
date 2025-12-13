-- ============================================================
-- DATABASE CONSTRAINTS & VALIDATION
-- Tujuan: Mencegah kesalahan tag di masa depan
-- ============================================================

-- STEP 1: Tambahkan CHECK constraint untuk memastikan type hanya 'Makanan' atau 'Minuman'
-- Drop constraint lama jika ada
ALTER TABLE food_items 
DROP CONSTRAINT IF EXISTS valid_food_type;

-- Tambahkan constraint baru
ALTER TABLE food_items
ADD CONSTRAINT valid_food_type 
CHECK (type IN ('Makanan', 'Minuman'));

-- STEP 2: Tambahkan constraint untuk memastikan rating valid (0-5)
ALTER TABLE food_items
DROP CONSTRAINT IF EXISTS valid_rating;

ALTER TABLE food_items
ADD CONSTRAINT valid_rating
CHECK (rating >= 0 AND rating <= 5);

-- STEP 3: Tambahkan constraint untuk memastikan nama tidak kosong
ALTER TABLE food_items
DROP CONSTRAINT IF EXISTS name_not_empty;

ALTER TABLE food_items
ADD CONSTRAINT name_not_empty
CHECK (LENGTH(TRIM(name)) > 0);

-- STEP 4: Tambahkan constraint untuk memastikan origin tidak kosong
ALTER TABLE food_items
DROP CONSTRAINT IF EXISTS origin_not_empty;

ALTER TABLE food_items
ADD CONSTRAINT origin_not_empty
CHECK (LENGTH(TRIM(origin)) > 0);

-- STEP 5: Tambahkan UNIQUE constraint untuk mencegah duplikat nama dalam tipe yang sama
-- Drop constraint lama jika ada
ALTER TABLE food_items
DROP CONSTRAINT IF EXISTS unique_name_per_type;

-- Tambahkan constraint baru
ALTER TABLE food_items
ADD CONSTRAINT unique_name_per_type
UNIQUE (name, type);

-- STEP 6: Buat index untuk performa query
CREATE INDEX IF NOT EXISTS idx_food_items_type ON food_items(type);
CREATE INDEX IF NOT EXISTS idx_food_items_origin ON food_items(origin);
CREATE INDEX IF NOT EXISTS idx_food_items_rating ON food_items(rating);
CREATE INDEX IF NOT EXISTS idx_food_items_name ON food_items(name);

-- STEP 7: Verifikasi constraints yang sudah dibuat
SELECT 
  conname as constraint_name,
  contype as constraint_type,
  pg_get_constraintdef(oid) as definition
FROM pg_constraint
WHERE conrelid = 'food_items'::regclass
ORDER BY conname;

-- STEP 8: Verifikasi indexes yang sudah dibuat
SELECT 
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'food_items'
ORDER BY indexname;
