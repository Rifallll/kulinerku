# 🚀 SISTEM CERDAS OTOMATIS

## ⚡ Satu Command - Selesai!

```bash
npm run smart-heal
```

Sistem akan **otomatis**:
- ✅ Deteksi masalah data
- ✅ Klasifikasi dengan AI (confidence scoring)
- ✅ Perbaiki yang yakin (>70% confidence)
- ✅ Tandai yang perlu manual review
- ✅ Deteksi duplikat dengan fuzzy matching
- ✅ Laporan lengkap

---

## 📋 Commands

```bash
# Auto-healing (langsung fix!)
npm run smart-heal

# Preview dulu (dry-run)
npm run smart-heal:dry

# Quiet mode (tanpa detail)
npm run smart-heal:quiet

# Basic cleaning (tanpa AI)
npm run clean-data
```

---

## 🧠 Bedanya Apa?

### Basic Clean (`npm run clean-data`)
- ✅ Cepat
- ✅ Simple keyword matching
- ❌ Tidak ada confidence scoring
- ❌ Tidak deteksi duplikat fuzzy

### Smart Heal (`npm run smart-heal`) ⭐
- ✅ Intelligent classification
- ✅ Confidence scoring (0-100%)
- ✅ Fuzzy duplicate detection
- ✅ 6 quality checks
- ✅ Auto-fix hanya yang yakin
- ✅ Manual review queue
- ✅ Detailed reporting

---

## 📊 Output Example

```
🤖 INTELLIGENT AUTO-HEALING SYSTEM

📊 Quality Analysis:
   ✅ Healthy: 180 items (92.3%)
   ⚠️  Issues: 15 items

🔧 Auto-Healing:
   ✓ Fixed: Es Cendol (Makanan → Minuman, 95% confidence)
   ✓ Fixed: Kopi Susu (Makanan → Minuman, 100% confidence)
   
   ✅ Auto-fixed: 8 items
   ⚠️  Manual review: 7 items

🔍 Duplicates:
   Found 2 groups (3 items)

🎯 Data Quality Score: 96.4%
```

---

## 💡 Tips

1. **Pertama kali**: Jalankan `npm run smart-heal:dry` untuk preview
2. **Rutin**: Setup scheduled task untuk auto-healing harian
3. **Monitor**: Cek quality score, target >= 95%
4. **Review**: Periksa manual review queue secara berkala

---

## 📖 Dokumentasi Lengkap

Lihat `scripts/README_SMART_HEALING.md` untuk:
- Cara kerja sistem cerdas
- Configuration options
- Scheduled auto-healing
- Troubleshooting
- Advanced usage

---

**Sistem cerdas siap bekerja 24/7! 🤖✨**
