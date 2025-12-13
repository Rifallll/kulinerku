# 🎯 CARA CEPAT - Data Cleaning Otomatis

## ⚡ Satu Command Saja!

```bash
node scripts/autoCleanData.js
```

**SELESAI!** Script akan otomatis:
- ✅ Cek semua data di database
- ✅ Identifikasi yang salah tag
- ✅ Perbaiki semua tag yang salah
- ✅ Hapus duplikat
- ✅ Tampilkan hasil

---

## 📖 Penjelasan Singkat

Script ini akan:

1. **Audit** - Lihat kondisi data saat ini
2. **Identifikasi** - Cari yang salah tag (minuman jadi makanan, atau sebaliknya)
3. **Perbaiki** - Auto-fix semua yang salah
4. **Verifikasi** - Tampilkan hasil akhir

---

## 💡 Kapan Pakai Script Ini?

- Setelah tambah data baru
- Setelah scraping/import data
- Rutin maintenance (seminggu sekali)
- Sebelum deploy

---

## 📊 Output yang Akan Muncul

```
🚀 Starting Automated Data Cleaning...

============================================================
STEP 1: AUDIT - Kondisi Data Saat Ini
============================================================
...menampilkan statistik data...

============================================================
STEP 2: IDENTIFIKASI MASALAH
============================================================
...menampilkan item yang salah tag...

============================================================
STEP 3: PERBAIKI DATA
============================================================
...memperbaiki semua tag yang salah...

============================================================
STEP 4: VERIFIKASI HASIL
============================================================
...menampilkan hasil akhir...

============================================================
FINAL SUMMARY
============================================================
✅ Items fixed: 3
✅ Duplicates removed: 0
✅ Data cleaning completed successfully!
```

---

## 🔧 Troubleshooting

### Error: Missing Supabase credentials
Pastikan file `.env` ada dan berisi:
```
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
```

### Error: Cannot find module
Jalankan:
```bash
npm install
```

---

## 📁 File Lengkap

Untuk dokumentasi lengkap, lihat:
- `scripts/README_AUTO_CLEAN.md` - Dokumentasi lengkap
- `docs/EDGE_CASES.md` - Edge cases yang perlu manual review
- `docs/QUICK_REFERENCE.md` - Quick reference

---

**Selamat mencoba! 🚀**
