# Quick Reference: Data Cleaning & Validation

## 🎯 Langkah-langkah Cepat

### 1️⃣ Audit Data (Wajib dilakukan pertama)
Buka Supabase SQL Editor dan jalankan query dari `scripts/data_validation_audit.sql`:

```sql
-- Query 1: Lihat semua tipe data
SELECT DISTINCT type, COUNT(*) as jumlah
FROM food_items
GROUP BY type
ORDER BY type;
```

**Hasil yang diharapkan**: Hanya ada 'Makanan' dan 'Minuman'

---

### 2️⃣ Identifikasi Masalah
Jalankan query 2 dan 3 dari `data_validation_audit.sql`:

```sql
-- Cari minuman yang salah tag sebagai makanan
SELECT id, name, type, origin
FROM food_items
WHERE type != 'Minuman'
  AND (LOWER(name) LIKE '%es %' OR LOWER(name) LIKE '%kopi%' OR ...)
ORDER BY name;

-- Cari makanan yang salah tag sebagai minuman  
SELECT id, name, type, origin
FROM food_items
WHERE type = 'Minuman'
  AND (LOWER(name) LIKE '%nasi%' OR LOWER(name) LIKE '%ayam%' OR ...)
ORDER BY name;
```

**Jika ada hasil**: Lanjut ke step 3
**Jika tidak ada hasil**: Skip ke step 4

---

### 3️⃣ Perbaiki Data (Jika ada masalah)
Jalankan seluruh script `scripts/data_cleaning_fix.sql` di Supabase SQL Editor.

**PERHATIAN**: Script ini akan:
- ✅ Memperbaiki tag yang salah
- ✅ Menghapus duplikat
- ⚠️ Mengubah data di database

---

### 4️⃣ Tambahkan Constraints (Pencegahan)
Jalankan seluruh script `scripts/add_database_constraints.sql` di Supabase SQL Editor.

**Hasil**: Database akan menolak data yang tidak valid di masa depan.

---

### 5️⃣ Test Constraints
Coba insert data invalid untuk memastikan constraints bekerja:

```sql
-- Test 1: Type invalid (harus GAGAL)
INSERT INTO food_items (name, type, origin, rating, description, "imageUrl")
VALUES ('Test', 'Cemilan', 'Jakarta', 4.5, 'Test', 'https://example.com');

-- Test 2: Rating invalid (harus GAGAL)
INSERT INTO food_items (name, type, origin, rating, description, "imageUrl")
VALUES ('Test', 'Makanan', 'Jakarta', 6.0, 'Test', 'https://example.com');
```

**Hasil yang diharapkan**: Kedua query GAGAL dengan error message

---

## 📊 Cheat Sheet: Kata Kunci

### Minuman 🥤
- Es, Kopi, Teh, Jus, Susu
- Wedang, Bajigur, Bandrek, Sekoteng
- Jamu, Cendol, Dawet, Cincau
- Kelapa Muda, Thai Tea, Cappuccino

### Makanan 🍽️
- Nasi, Ayam, Sate, Rendang
- Soto, Bakso, Mie, Gado-gado
- Pecel, Gudeg, Rawon, Opor
- Ikan, Tempe, Tahu, Sambal

---

## 🚨 Troubleshooting

### Error: "duplicate key value violates unique constraint"
**Penyebab**: Item dengan nama yang sama sudah ada
**Solusi**: Hapus duplikat dengan query dari `data_cleaning_fix.sql`

### Error: "new row violates check constraint"
**Penyebab**: Data tidak valid (type bukan Makanan/Minuman, rating > 5, dll)
**Solusi**: Perbaiki data sesuai aturan di `docs/KATEGORI_DATA.md`

### Data masih salah tag setelah cleaning
**Penyebab**: Nama item tidak mengandung kata kunci yang ada di script
**Solusi**: Update manual dengan query:
```sql
UPDATE food_items 
SET type = 'Minuman' 
WHERE name = 'Nama Item Yang Salah';
```

---

## ✅ Checklist Verifikasi

- [ ] Semua tipe data hanya 'Makanan' atau 'Minuman'
- [ ] Tidak ada duplikat (nama + type yang sama)
- [ ] Tidak ada item yang salah tag
- [ ] Constraints sudah ditambahkan
- [ ] Test insert data invalid berhasil GAGAL
- [ ] Rating semua item antara 0-5
- [ ] Semua field required terisi

---

## 📝 File Penting

| File | Fungsi |
|------|--------|
| `scripts/data_validation_audit.sql` | Audit & identifikasi masalah |
| `scripts/data_cleaning_fix.sql` | Perbaiki data yang salah |
| `scripts/add_database_constraints.sql` | Tambah constraints |
| `docs/KATEGORI_DATA.md` | Dokumentasi lengkap kategori |
| `scripts/insertBeverages.js` | Insert minuman (sudah ada validasi) |
