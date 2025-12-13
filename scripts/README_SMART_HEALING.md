# 🤖 Intelligent Auto-Healing System

## 🎯 Sistem Cerdas yang Benar-Benar Otomatis!

Sistem ini akan **otomatis mendeteksi dan memperbaiki** masalah data tanpa intervensi manual. Menggunakan:
- ✅ **Pattern Matching** dengan confidence scoring
- ✅ **Fuzzy Duplicate Detection** menggunakan Fuse.js
- ✅ **Auto-Healing** berdasarkan confidence threshold
- ✅ **Data Quality Monitoring**

---

## ⚡ Quick Start

### 1. Jalankan Auto-Healing (Langsung Fix!)
```bash
node scripts/smartAutoHeal.js
```

### 2. Preview Dulu (Dry Run)
```bash
node scripts/smartAutoHeal.js --dry-run
```

### 3. Quiet Mode (Tanpa Detail)
```bash
node scripts/smartAutoHeal.js --quiet
```

---

## 🧠 Cara Kerja Sistem Cerdas

### Step 1: Intelligent Classification
Sistem menggunakan **pattern matching** dengan weight untuk mengklasifikasi:

```javascript
// Contoh: "Es Cendol"
{
  type: "Minuman",
  confidence: 0.95,  // 95% yakin
  reasons: [
    { pattern: "^es\\s", weight: 1.0, category: "cold_drink" },
    { pattern: "\\bcendol\\b", weight: 1.0, category: "traditional_cold" }
  ]
}
```

**Confidence Scoring:**
- `>= 0.9` = Sangat yakin (auto-fix)
- `0.7 - 0.9` = Yakin (auto-fix dengan threshold)
- `< 0.7` = Tidak yakin (manual review)

### Step 2: Data Quality Checks
Sistem memeriksa 6 aspek quality:

1. **Invalid Rating** (< 0 atau > 5) → Auto-fix
2. **Suspicious Rating** (terlalu rendah/tinggi) → Warning
3. **Poor Description** (terlalu pendek) → Warning
4. **Missing Origin** → Error
5. **Invalid Type** (bukan Makanan/Minuman) → Auto-fix
6. **Type Mismatch** (nama vs type tidak cocok) → Auto-fix

### Step 3: Fuzzy Duplicate Detection
Menggunakan Fuse.js untuk menemukan duplikat dengan typo:

```
"Es Cendol" vs "Es Cendoll" → 95% similar (potential duplicate)
"Rendang" vs "Rendang Padang" → 85% similar (might be different)
```

### Step 4: Auto-Healing
Hanya fix jika **confidence >= 70%**:

```javascript
// Auto-fix: High confidence
"Es Cendol" (type: Makanan) → type: Minuman (95% confidence) ✅

// Manual review: Low confidence
"Ayam Susu" (type: Minuman) → ⚠️ Manual review needed (ambiguous)
```

---

## 📊 Output Example

```
🤖 INTELLIGENT AUTO-HEALING SYSTEM
   Smart Data Quality Management

======================================================================
📥 STEP 1: Fetching Data from Database
======================================================================
✅ Loaded 195 items

======================================================================
🧠 STEP 2: Intelligent Quality Analysis
======================================================================

📊 Quality Analysis Results:
   ✅ Healthy items: 180 (92.3%)
   ⚠️  Items with issues: 15
      🔴 High severity: 8
      🟡 Medium severity: 5
      🟢 Low severity: 2

======================================================================
🔧 STEP 3: Auto-Healing Process
======================================================================
   ✓ Fixed: Es Cendol
      type: Makanan → Minuman (95% confidence)
   ✓ Fixed: Kopi Susu
      type: Makanan → Minuman (100% confidence)
   ✓ Fixed: Nasi Goreng
      rating: 6.0 → 5.0 (auto-clamped)

✅ Auto-fixed: 8 items
⚠️  Manual review needed: 7 items

======================================================================
🔍 STEP 4: Fuzzy Duplicate Detection
======================================================================

⚠️  Found 2 potential duplicate groups:

   Group 1: "Rendang"
      → "Rendang Padang" (88% similar)
      → "Rendang Sapi" (85% similar)

   Group 2: "Es Cendol"
      → "Es Cendoll" (95% similar)

💡 Tip: Review these duplicates manually
   Similar names might be different dishes or regional variations

======================================================================
✅ STEP 5: Final Verification
======================================================================

📊 Current Database State:
┌─────────┬────────┐
│ Makanan │ 147    │
│ Minuman │ 48     │
└─────────┴────────┘

✅ All types are valid (Makanan or Minuman)

======================================================================
📋 FINAL REPORT
======================================================================

📊 Summary:
   Total items processed: 195
   Healthy items: 180 (92.3%)
   Auto-fixed: 8
   Manual review needed: 7
   Duplicates found: 3

🎯 Data Quality Score: 96.4%

⚠️  Action Required:
   7 items need manual review
   Run with VERBOSE=true to see details

💡 Recommendations:
   - Review 2 duplicate groups
   - Consider merging or removing duplicates

✨ Auto-healing complete!
```

---

## 🎛️ Configuration

Edit `smartAutoHeal.js` untuk customize:

```javascript
const CONFIG = {
    AUTO_FIX_THRESHOLD: 0.7,      // Min confidence untuk auto-fix (70%)
    DUPLICATE_THRESHOLD: 0.85,     // Min similarity untuk duplikat (85%)
    DRY_RUN: false,                // Preview mode
    VERBOSE: true                  // Show detailed logs
};
```

---

## 🔧 Advanced Usage

### Customize Pattern Weights
Edit `intelligentClassifier.js`:

```javascript
const BEVERAGE_PATTERNS = [
    { pattern: /^es\s/i, weight: 1.0, category: 'cold_drink' },
    { pattern: /\bkopi\b/i, weight: 1.0, category: 'coffee' },
    // Add your own patterns...
];
```

### Add Custom Quality Checks
Edit `checkDataQuality()` function:

```javascript
// Check 7: Custom check
if (item.name.length > 100) {
    issues.push({
        type: 'name_too_long',
        severity: 'medium',
        message: 'Name is too long',
        autoFix: false
    });
}
```

---

## 📅 Scheduled Auto-Healing

### Option 1: Windows Task Scheduler
1. Buka Task Scheduler
2. Create Basic Task
3. Trigger: Daily at 2 AM
4. Action: Start a program
   - Program: `node`
   - Arguments: `C:\path\to\kulinerku\scripts\smartAutoHeal.js`
   - Start in: `C:\path\to\kulinerku`

### Option 2: Node-cron (Recommended)
Install:
```bash
npm install node-cron
```

Create `scripts/scheduler.js`:
```javascript
import cron from 'node-cron';
import { exec } from 'child_process';

// Run every day at 2 AM
cron.schedule('0 2 * * *', () => {
    console.log('🤖 Running scheduled auto-healing...');
    exec('node scripts/smartAutoHeal.js', (error, stdout, stderr) => {
        if (error) {
            console.error('Error:', error);
            return;
        }
        console.log(stdout);
    });
});

console.log('📅 Scheduler started. Auto-healing will run daily at 2 AM');
```

Run scheduler:
```bash
node scripts/scheduler.js
```

---

## 🚨 Monitoring & Alerts

### Email Alerts (Coming Soon)
Sistem akan kirim email jika:
- Data quality score < 90%
- High severity issues > 10
- Duplicates found > 5

### Dashboard (Coming Soon)
Real-time dashboard untuk monitoring:
- Data quality trends
- Auto-fix history
- Manual review queue

---

## 🆚 Comparison: Basic vs Intelligent

| Feature | Basic Auto-Clean | Intelligent Auto-Heal |
|---------|------------------|----------------------|
| Pattern Matching | ✅ Simple keywords | ✅ Weighted patterns |
| Confidence Scoring | ❌ No | ✅ Yes (0-1 scale) |
| Duplicate Detection | ❌ Exact match only | ✅ Fuzzy matching |
| Data Quality Checks | ❌ Basic | ✅ Comprehensive (6 checks) |
| Auto-Fix Decision | ✅ Always fix | ✅ Confidence-based |
| Manual Review Queue | ❌ No | ✅ Yes |
| Dry Run Mode | ❌ No | ✅ Yes |
| Detailed Reporting | ✅ Basic | ✅ Advanced |

---

## 📝 Best Practices

1. **Run dry-run first** untuk preview changes
2. **Review manual queue** setelah auto-healing
3. **Check duplicate groups** - might be different dishes
4. **Monitor quality score** - target >= 95%
5. **Schedule daily runs** untuk maintenance
6. **Backup database** sebelum production run

---

## 🐛 Troubleshooting

### Issue: Too many false positives
**Solution**: Increase `AUTO_FIX_THRESHOLD` to 0.8 or 0.9

### Issue: Missing some duplicates
**Solution**: Decrease `DUPLICATE_THRESHOLD` to 0.75 or 0.80

### Issue: Wrong classifications
**Solution**: Adjust pattern weights in `intelligentClassifier.js`

---

## 🎯 Next Steps

- [ ] Setup scheduled auto-healing
- [ ] Review manual queue items
- [ ] Fine-tune confidence threshold
- [ ] Add custom patterns for your data
- [ ] Setup email alerts (optional)

---

**Selamat! Sistem cerdas Anda siap bekerja otomatis! 🚀**
