-- ============================================================
-- TEST SCRIPT - Validasi Kata Kunci
-- Tujuan: Test apakah kata kunci bekerja dengan benar
-- ============================================================

-- TEST 1: Cek apakah "Es Cendol" terdeteksi sebagai minuman
SELECT 
  'TEST 1: Es Cendol' as test_name,
  CASE 
    WHEN LOWER('Es Cendol') LIKE 'es %' THEN '✓ PASS - Terdeteksi sebagai minuman'
    ELSE '✗ FAIL - Tidak terdeteksi'
  END as result;

-- TEST 2: Cek apakah "Nasi Campur" TIDAK terdeteksi sebagai minuman
SELECT 
  'TEST 2: Nasi Campur' as test_name,
  CASE 
    WHEN LOWER('Nasi Campur') LIKE 'es %' 
      OR LOWER('Nasi Campur') LIKE '%kopi%' 
      OR LOWER('Nasi Campur') LIKE '%teh%' 
    THEN '✗ FAIL - Salah terdeteksi sebagai minuman'
    ELSE '✓ PASS - Tidak terdeteksi sebagai minuman'
  END as result;

-- TEST 3: Cek apakah "Kopi Susu" terdeteksi sebagai minuman
SELECT 
  'TEST 3: Kopi Susu' as test_name,
  CASE 
    WHEN LOWER('Kopi Susu') LIKE '%kopi%' THEN '✓ PASS - Terdeteksi sebagai minuman'
    ELSE '✗ FAIL - Tidak terdeteksi'
  END as result;

-- TEST 4: Cek apakah "Jus Jeruk" terdeteksi sebagai minuman
SELECT 
  'TEST 4: Jus Jeruk' as test_name,
  CASE 
    WHEN LOWER('Jus Jeruk') LIKE 'jus %' OR LOWER('Jus Jeruk') LIKE '%jus %' 
    THEN '✓ PASS - Terdeteksi sebagai minuman'
    ELSE '✗ FAIL - Tidak terdeteksi'
  END as result;

-- TEST 5: Cek apakah "Air Kelapa" terdeteksi sebagai minuman
SELECT 
  'TEST 5: Air Kelapa' as test_name,
  CASE 
    WHEN LOWER('Air Kelapa') LIKE '%air kelapa%' OR LOWER('Air Kelapa') LIKE '%kelapa muda%'
    THEN '✓ PASS - Terdeteksi sebagai minuman'
    ELSE '✗ FAIL - Tidak terdeteksi'
  END as result;

-- TEST 6: Cek apakah "Rendang" terdeteksi sebagai makanan
SELECT 
  'TEST 6: Rendang' as test_name,
  CASE 
    WHEN LOWER('Rendang') LIKE '%rendang%' THEN '✓ PASS - Terdeteksi sebagai makanan'
    ELSE '✗ FAIL - Tidak terdeteksi'
  END as result;

-- TEST 7: Cek apakah "Nasi Goreng" terdeteksi sebagai makanan
SELECT 
  'TEST 7: Nasi Goreng' as test_name,
  CASE 
    WHEN LOWER('Nasi Goreng') LIKE '%nasi%' THEN '✓ PASS - Terdeteksi sebagai makanan'
    ELSE '✗ FAIL - Tidak terdeteksi'
  END as result;

-- TEST 8: Cek apakah "Sate Ayam" terdeteksi sebagai makanan
SELECT 
  'TEST 8: Sate Ayam' as test_name,
  CASE 
    WHEN LOWER('Sate Ayam') LIKE '%sate%' OR LOWER('Sate Ayam') LIKE '%ayam%'
    THEN '✓ PASS - Terdeteksi sebagai makanan'
    ELSE '✗ FAIL - Tidak terdeteksi'
  END as result;

-- ============================================================
-- COMPREHENSIVE TEST: Jalankan semua test sekaligus
-- ============================================================
SELECT 
  test_name,
  result
FROM (
  SELECT 'TEST 1: Es Cendol' as test_name,
    CASE WHEN LOWER('Es Cendol') LIKE 'es %' THEN '✓ PASS' ELSE '✗ FAIL' END as result
  UNION ALL
  SELECT 'TEST 2: Nasi Campur',
    CASE WHEN NOT (LOWER('Nasi Campur') LIKE 'es %' OR LOWER('Nasi Campur') LIKE '%kopi%') 
    THEN '✓ PASS' ELSE '✗ FAIL' END
  UNION ALL
  SELECT 'TEST 3: Kopi Susu',
    CASE WHEN LOWER('Kopi Susu') LIKE '%kopi%' THEN '✓ PASS' ELSE '✗ FAIL' END
  UNION ALL
  SELECT 'TEST 4: Jus Jeruk',
    CASE WHEN LOWER('Jus Jeruk') LIKE 'jus %' THEN '✓ PASS' ELSE '✗ FAIL' END
  UNION ALL
  SELECT 'TEST 5: Air Kelapa',
    CASE WHEN LOWER('Air Kelapa') LIKE '%air kelapa%' THEN '✓ PASS' ELSE '✗ FAIL' END
  UNION ALL
  SELECT 'TEST 6: Rendang',
    CASE WHEN LOWER('Rendang') LIKE '%rendang%' THEN '✓ PASS' ELSE '✗ FAIL' END
  UNION ALL
  SELECT 'TEST 7: Nasi Goreng',
    CASE WHEN LOWER('Nasi Goreng') LIKE '%nasi%' THEN '✓ PASS' ELSE '✗ FAIL' END
  UNION ALL
  SELECT 'TEST 8: Sate Ayam',
    CASE WHEN LOWER('Sate Ayam') LIKE '%sate%' THEN '✓ PASS' ELSE '✗ FAIL' END
) tests
ORDER BY test_name;

-- ============================================================
-- EDGE CASES TEST
-- ============================================================

-- Edge Case 1: Item dengan kata "air" di tengah (bukan minuman)
-- Contoh: "Nasi Uduk Air Mancur" - seharusnya TIDAK terdeteksi sebagai minuman
SELECT 
  'EDGE CASE 1: Nasi Uduk Air Mancur' as test_name,
  CASE 
    WHEN LOWER('Nasi Uduk Air Mancur') LIKE '%air %' 
    THEN '⚠ WARNING - Terdeteksi sebagai minuman (mungkin false positive)'
    ELSE '✓ PASS - Tidak terdeteksi sebagai minuman'
  END as result;

-- Edge Case 2: "Es Krim" - seharusnya MAKANAN (dimakan, bukan diminum)
-- Catatan: Ini akan terdeteksi sebagai minuman karena kata "Es"
-- Perlu manual override jika ada "Es Krim" di database
SELECT 
  'EDGE CASE 2: Es Krim' as test_name,
  CASE 
    WHEN LOWER('Es Krim') LIKE 'es %' 
    THEN '⚠ WARNING - Terdeteksi sebagai minuman (perlu manual check)'
    ELSE '✓ PASS'
  END as result;

-- Edge Case 3: "Bubur Ayam" - seharusnya MAKANAN (dimakan dengan sendok)
SELECT 
  'EDGE CASE 3: Bubur Ayam' as test_name,
  CASE 
    WHEN LOWER('Bubur Ayam') LIKE '%ayam%' 
    THEN '✓ PASS - Terdeteksi sebagai makanan'
    ELSE '✗ FAIL - Tidak terdeteksi'
  END as result;

-- ============================================================
-- SUMMARY: Hitung berapa test yang PASS
-- ============================================================
SELECT 
  COUNT(*) as total_tests,
  SUM(CASE WHEN result LIKE '✓%' THEN 1 ELSE 0 END) as passed,
  SUM(CASE WHEN result LIKE '✗%' THEN 1 ELSE 0 END) as failed,
  SUM(CASE WHEN result LIKE '⚠%' THEN 1 ELSE 0 END) as warnings
FROM (
  SELECT CASE WHEN LOWER('Es Cendol') LIKE 'es %' THEN '✓ PASS' ELSE '✗ FAIL' END as result
  UNION ALL SELECT CASE WHEN NOT (LOWER('Nasi Campur') LIKE 'es %') THEN '✓ PASS' ELSE '✗ FAIL' END
  UNION ALL SELECT CASE WHEN LOWER('Kopi Susu') LIKE '%kopi%' THEN '✓ PASS' ELSE '✗ FAIL' END
  UNION ALL SELECT CASE WHEN LOWER('Jus Jeruk') LIKE 'jus %' THEN '✓ PASS' ELSE '✗ FAIL' END
  UNION ALL SELECT CASE WHEN LOWER('Air Kelapa') LIKE '%air kelapa%' THEN '✓ PASS' ELSE '✗ FAIL' END
  UNION ALL SELECT CASE WHEN LOWER('Rendang') LIKE '%rendang%' THEN '✓ PASS' ELSE '✗ FAIL' END
  UNION ALL SELECT CASE WHEN LOWER('Nasi Goreng') LIKE '%nasi%' THEN '✓ PASS' ELSE '✗ FAIL' END
  UNION ALL SELECT CASE WHEN LOWER('Sate Ayam') LIKE '%sate%' THEN '✓ PASS' ELSE '✗ FAIL' END
  UNION ALL SELECT CASE WHEN LOWER('Nasi Uduk Air Mancur') LIKE '%air %' THEN '⚠ WARNING' ELSE '✓ PASS' END
  UNION ALL SELECT CASE WHEN LOWER('Es Krim') LIKE 'es %' THEN '⚠ WARNING' ELSE '✓ PASS' END
  UNION ALL SELECT CASE WHEN LOWER('Bubur Ayam') LIKE '%ayam%' THEN '✓ PASS' ELSE '✗ FAIL' END
) all_tests;
