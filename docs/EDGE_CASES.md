# Edge Cases & Manual Review Required

## ⚠️ Kasus Khusus yang Perlu Manual Review

Berikut adalah item-item yang mungkin terdeteksi salah oleh script otomatis dan perlu di-review manual:

### 1. **Es Krim** ❄️
- **Deteksi otomatis**: Minuman (karena kata "Es")
- **Seharusnya**: Makanan (dimakan, bukan diminum)
- **Action**: Jika ada "Es Krim" di database, update manual:
  ```sql
  UPDATE food_items 
  SET type = 'Makanan' 
  WHERE name LIKE '%es krim%';
  ```

### 2. **Es Puter**
- **Deteksi otomatis**: Minuman (karena kata "Es")
- **Seharusnya**: Makanan (es krim tradisional, dimakan)
- **Action**: Update manual jika ada

### 3. **Bubur** (Bubur Ayam, Bubur Kacang Hijau, dll)
- **Deteksi otomatis**: Makanan (karena kata "Ayam" atau kata kunci lain)
- **Seharusnya**: Makanan ✓ (benar, meskipun cair tapi dimakan dengan sendok)
- **Action**: Tidak perlu action, sudah benar

### 4. **Sup/Sop** (Sup Ayam, Sop Buntut, dll)
- **Deteksi otomatis**: Makanan (karena kata "Ayam")
- **Seharusnya**: Makanan ✓ (benar, hidangan berkuah tapi termasuk makanan)
- **Action**: Tidak perlu action, sudah benar

### 5. **Kolak**
- **Deteksi otomatis**: Tidak terdeteksi (tidak ada kata kunci)
- **Seharusnya**: Makanan (dimakan dengan sendok)
- **Action**: Jika ada dan salah tag, update manual:
  ```sql
  UPDATE food_items 
  SET type = 'Makanan' 
  WHERE name LIKE '%kolak%';
  ```

### 6. **Cendol/Dawet** (tanpa kata "Es")
- **Deteksi otomatis**: Minuman (karena kata "cendol" atau "dawet")
- **Seharusnya**: Minuman ✓ (benar)
- **Action**: Tidak perlu action, sudah benar

### 7. **Martabak**
- **Martabak Telur/Mesir**: Makanan ✓
- **Martabak Manis**: Makanan ✓
- **Deteksi otomatis**: Tidak terdeteksi (tidak ada kata kunci)
- **Action**: Pastikan semua martabak bertipe "Makanan"

### 8. **Pisang** (Pisang Goreng, Pisang Rai, dll)
- **Deteksi otomatis**: Tidak terdeteksi
- **Seharusnya**: Makanan
- **Action**: Jika ada dan salah tag, update manual

### 9. **Klepon, Onde-onde, Lemper**
- **Deteksi otomatis**: Tidak terdeteksi
- **Seharusnya**: Makanan (kue/jajanan pasar)
- **Action**: Pastikan bertipe "Makanan"

### 10. **Sari Buah** (Sari Apel, Sari Jeruk, dll)
- **Deteksi otomatis**: Minuman (karena kata "sari")
- **Seharusnya**: Minuman ✓ (benar)
- **Action**: Tidak perlu action, sudah benar

---

## 🔍 Query untuk Cek Edge Cases

### Cek semua item dengan kata "Es"
```sql
SELECT id, name, type, origin
FROM food_items
WHERE LOWER(name) LIKE '%es %' OR LOWER(name) LIKE 'es %'
ORDER BY name;
```
**Review manual**: Pastikan "Es Krim" dan "Es Puter" bertipe Makanan

### Cek semua item dengan kata "Bubur"
```sql
SELECT id, name, type, origin
FROM food_items
WHERE LOWER(name) LIKE '%bubur%'
ORDER BY name;
```
**Expected**: Semua seharusnya bertipe Makanan

### Cek semua item dengan kata "Sup" atau "Sop"
```sql
SELECT id, name, type, origin
FROM food_items
WHERE LOWER(name) LIKE '%sup%' OR LOWER(name) LIKE '%sop%'
ORDER BY name;
```
**Expected**: Semua seharusnya bertipe Makanan

### Cek item yang tidak terdeteksi oleh kata kunci
```sql
-- Item yang bukan Makanan atau Minuman berdasarkan kata kunci
SELECT id, name, type, origin
FROM food_items
WHERE type = 'Makanan'
  AND NOT (
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
```
**Review manual**: Pastikan item-item ini memang Makanan

---

## 📋 Checklist Manual Review

Setelah menjalankan script cleaning, lakukan manual review untuk:

- [ ] Cek semua item dengan kata "Es" - pastikan Es Krim = Makanan
- [ ] Cek semua item dengan kata "Bubur" - pastikan = Makanan
- [ ] Cek semua item dengan kata "Sup/Sop" - pastikan = Makanan
- [ ] Cek semua item dengan kata "Kolak" - pastikan = Makanan
- [ ] Cek semua Martabak - pastikan = Makanan
- [ ] Cek item yang tidak terdeteksi kata kunci - review manual
- [ ] Cek apakah ada item dengan type selain Makanan/Minuman
- [ ] Verifikasi tidak ada duplikat

---

## 🛠️ Query Manual Fix Template

Jika menemukan item yang salah tag, gunakan template ini:

```sql
-- Fix single item
UPDATE food_items 
SET type = 'Makanan'  -- atau 'Minuman'
WHERE name = 'Nama Item Yang Salah';

-- Fix multiple items dengan pattern
UPDATE food_items 
SET type = 'Makanan'  -- atau 'Minuman'
WHERE LOWER(name) LIKE '%pattern%';

-- Verifikasi perubahan
SELECT name, type, origin 
FROM food_items 
WHERE name LIKE '%pattern%';
```

---

## ⚡ Quick Fix untuk Edge Cases Umum

```sql
-- Fix Es Krim (jika ada)
UPDATE food_items SET type = 'Makanan' WHERE LOWER(name) LIKE '%es krim%';

-- Fix Es Puter (jika ada)
UPDATE food_items SET type = 'Makanan' WHERE LOWER(name) LIKE '%es puter%';

-- Fix Kolak (jika ada dan salah tag)
UPDATE food_items SET type = 'Makanan' WHERE LOWER(name) LIKE '%kolak%';

-- Verifikasi
SELECT name, type FROM food_items 
WHERE LOWER(name) LIKE '%es krim%' 
   OR LOWER(name) LIKE '%es puter%' 
   OR LOWER(name) LIKE '%kolak%';
```
