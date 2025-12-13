# 🚀 Automated Data Cleaning Script

## Quick Start - Cara Tercepat!

Jalankan satu command ini untuk membersihkan semua data otomatis:

```bash
node scripts/autoCleanData.js
```

**That's it!** Script akan otomatis:
- ✅ Audit data saat ini
- ✅ Identifikasi masalah (minuman salah tag, makanan salah tag)
- ✅ Perbaiki semua tag yang salah
- ✅ Hapus duplikat
- ✅ Verifikasi hasil

---

## 📋 Apa yang Script Ini Lakukan?

### Step 1: Audit Data
- Lihat semua tipe data yang ada (Makanan, Minuman, dll)
- Hitung statistik per kategori (total items, avg rating, jumlah daerah)
- Deteksi duplikat

### Step 2: Identifikasi Masalah
- Cari item yang seharusnya "Minuman" tapi salah tag
  - Contoh: "Es Cendol" tapi type-nya "Makanan"
- Cari item yang seharusnya "Makanan" tapi salah tag
  - Contoh: "Nasi Goreng" tapi type-nya "Minuman"

### Step 3: Perbaiki Data
- Update semua minuman yang salah tag → type = "Minuman"
- Update semua makanan yang salah tag → type = "Makanan"
- Hapus duplikat (keep yang pertama)

### Step 4: Verifikasi Hasil
- Tampilkan total per kategori setelah cleaning
- Cek apakah masih ada tipe yang tidak valid

---

## 📊 Output Example

```
🚀 Starting Automated Data Cleaning...

============================================================
STEP 1: AUDIT - Kondisi Data Saat Ini
============================================================

1.1: Tipe data yang ada
────────────────────────────────────────────────────────────
┌─────────┬────────┐
│ Makanan │ 150    │
│ Minuman │ 45     │
└─────────┴────────┘

1.2: Statistik per kategori
────────────────────────────────────────────────────────────
Makanan:
  Total items: 150
  Avg rating: 4.52
  Jumlah daerah: 25

Minuman:
  Total items: 45
  Avg rating: 4.68
  Jumlah daerah: 15

1.3: Cek duplikat
────────────────────────────────────────────────────────────
✅ No duplicates found

============================================================
STEP 2: IDENTIFIKASI MASALAH
============================================================

2.1: Item yang seharusnya MINUMAN tapi salah tag
────────────────────────────────────────────────────────────
⚠️  Found 3 items that should be Minuman:
  - Es Cendol (currently: Makanan)
  - Kopi Susu (currently: Makanan)
  - Teh Tarik (currently: Makanan)

2.2: Item yang seharusnya MAKANAN tapi salah tag
────────────────────────────────────────────────────────────
✅ No mistagged foods found

============================================================
STEP 3: PERBAIKI DATA
============================================================

3.1: Memperbaiki tag minuman...
────────────────────────────────────────────────────────────
  ✓ Updated Es Cendol → Minuman
  ✓ Updated Kopi Susu → Minuman
  ✓ Updated Teh Tarik → Minuman

3.2: Memperbaiki tag makanan...
────────────────────────────────────────────────────────────
✅ No foods to fix

3.3: Menghapus duplikat...
────────────────────────────────────────────────────────────
✅ No duplicates to delete

✅ Total items fixed: 3
✅ Total duplicates removed: 0

============================================================
STEP 4: VERIFIKASI HASIL
============================================================

Total per kategori:
┌─────────┬────────┐
│ Makanan │ 147    │
│ Minuman │ 48     │
└─────────┴────────┘

✅ All types are valid (Makanan or Minuman)

============================================================
FINAL SUMMARY
============================================================
✅ Items fixed: 3
✅ Duplicates removed: 0
✅ Data cleaning completed successfully!

📝 Next steps:
  1. Review the results above
  2. Check docs/EDGE_CASES.md for manual review items
  3. Run constraints script if needed (add_database_constraints.sql)
```

---

## 🔍 Kata Kunci yang Digunakan

### Minuman Keywords:
- `es `, `kopi`, `teh`, `jus `, `susu`
- `wedang`, `bajigur`, `bandrek`, `sekoteng`
- `jamu`, `bir pletok`, `lahang`
- `cendol`, `dawet`, `teler`, `doger`
- `selendang mayang`, `ronde`, `cincau`
- `kelapa muda`, `air kelapa`, `timun serut`
- `thai tea`, `cappuccino`, `latte`
- `smoothie`, `milkshake`, `sari `

### Makanan Keywords:
- `nasi`, `ayam`, `sate`, `rendang`
- `soto`, `bakso`, `mie`, `gado`
- `pecel`, `gudeg`, `rawon`, `opor`
- `sambal`, `ikan`, `tempe`, `tahu`
- `perkedel`, `kerupuk`, `empal`, `dendeng`

---

## ⚠️ Catatan Penting

### Data yang Sudah Bersih
Jika data sudah bersih, script akan menampilkan:
```
✅ Data is already clean! No fixes needed.
✅ All items are correctly tagged.
```

### Edge Cases
Beberapa item mungkin perlu manual review:
- **Es Krim** - Terdeteksi sebagai Minuman, tapi seharusnya Makanan
- **Es Puter** - Terdeteksi sebagai Minuman, tapi seharusnya Makanan
- **Bubur** - Sudah benar sebagai Makanan
- **Sup/Sop** - Sudah benar sebagai Makanan

Lihat `docs/EDGE_CASES.md` untuk detail lengkap.

---

## 🛠️ Troubleshooting

### Error: Missing Supabase credentials
```
❌ Missing Supabase credentials in .env
```
**Solusi**: Pastikan file `.env` ada dan berisi:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

### Error: Cannot find module
```
Error: Cannot find module '@supabase/supabase-js'
```
**Solusi**: Install dependencies:
```bash
npm install
```

---

## 📁 Files Terkait

| File | Deskripsi |
|------|-----------|
| `scripts/autoCleanData.js` | **Script otomatis ini** |
| `scripts/data_validation_audit.sql` | SQL manual untuk audit |
| `scripts/data_cleaning_fix.sql` | SQL manual untuk cleaning |
| `scripts/add_database_constraints.sql` | SQL untuk constraints |
| `docs/EDGE_CASES.md` | Dokumentasi edge cases |
| `docs/KATEGORI_DATA.md` | Dokumentasi kategori lengkap |
| `docs/QUICK_REFERENCE.md` | Quick reference guide |

---

## 🎯 Kapan Menggunakan Script Ini?

Gunakan script ini ketika:
- ✅ Ada data baru yang mungkin salah tag
- ✅ Setelah scraping data dari sumber eksternal
- ✅ Setelah import data manual
- ✅ Rutin maintenance (misal: seminggu sekali)
- ✅ Sebelum deploy ke production

---

## 🚀 Next Steps Setelah Running Script

1. **Review output** - Lihat berapa item yang diperbaiki
2. **Check edge cases** - Baca `docs/EDGE_CASES.md`
3. **Manual review** - Cek item yang perlu review manual (Es Krim, dll)
4. **Add constraints** - Jalankan `add_database_constraints.sql` untuk mencegah masalah di masa depan
5. **Test** - Coba insert data invalid untuk test constraints

---

## ✨ Keuntungan Script Otomatis

- ⚡ **Cepat** - 1 command, selesai!
- 🎯 **Akurat** - Menggunakan keyword pattern yang sudah ditest
- 📊 **Informative** - Output detail di setiap step
- 🔒 **Safe** - Tidak menghapus data, hanya update type
- 🔄 **Repeatable** - Bisa dijalankan berkali-kali

---

**Happy Cleaning! 🧹✨**
