# Kategori Data Kuliner - Dokumentasi

## Tipe Data Valid

Database `food_items` hanya menerima 2 tipe data:

### 1. **Makanan**
Semua jenis makanan padat, hidangan utama, lauk, camilan, kue, dll.

**Kata kunci umum untuk Makanan:**
- Nasi (Nasi Goreng, Nasi Uduk, Nasi Kuning, dll)
- Ayam (Ayam Goreng, Ayam Bakar, Ayam Betutu, dll)
- Sate (Sate Ayam, Sate Kambing, Sate Lilit, dll)
- Rendang
- Soto (Soto Ayam, Soto Betawi, Soto Banjar, dll)
- Bakso
- Mie/Mi (Mie Ayam, Mie Goreng, Mie Aceh, dll)
- Gado-gado
- Pecel
- Gudeg
- Rawon
- Opor
- Sambal
- Ikan (Ikan Bakar, Ikan Pepes, dll)
- Tempe (Tempe Goreng, Tempe Mendoan, dll)
- Tahu (Tahu Gejrot, Tahu Sumedang, dll)
- Perkedel
- Kerupuk
- Empal
- Dendeng
- Gulai
- Pempek
- Siomay
- Batagor
- Lumpia
- Martabak (Martabak Telur/Mesir)
- Risoles
- Lemper
- Onde-onde
- Klepon
- Kue (Kue Lapis, Kue Putu, dll)
- Serabi
- Pisang Goreng
- Bakwan
- Gorengan

### 2. **Minuman**
Semua jenis minuman, baik panas maupun dingin, tradisional maupun modern.

**Kata kunci umum untuk Minuman:**
- Es (Es Cendol, Es Teler, Es Campur, Es Doger, dll)
- Kopi (Kopi Tubruk, Kopi Susu, Kopi Jahe, dll)
- Teh (Teh Tarik, Teh Poci, Es Teh Manis, dll)
- Jus (Jus Alpukat, Jus Jeruk, dll)
- Susu (Susu Jahe, dll)
- Wedang (Wedang Jahe, Wedang Ronde, Wedang Uwuh, dll)
- Bajigur
- Bandrek
- Sekoteng
- Jamu (Jamu Kunyit Asam, dll)
- Bir Pletok
- Lahang
- Cendol/Dawet
- Teler (Es Teler)
- Campur (Es Campur)
- Doger (Es Doger)
- Selendang Mayang
- Ronde (Wedang Ronde)
- Cincau (Es Cincau, Es Cappuccino Cincau)
- Kelapa Muda
- Jeruk (Es Jeruk)
- Alpukat (Jus Alpukat)
- Buah (Es Buah)
- Timun Serut
- Thai Tea
- Cappuccino
- Markisa
- Sirsak

## Kasus Khusus

### Martabak
- **Martabak Telur / Martabak Mesir** → `type: "Makanan"` (karena padat, dimakan)
- **Martabak Manis** → `type: "Makanan"` (karena padat, dimakan)

### Es Krim
- **Es Krim** → `type: "Makanan"` (meskipun dingin, tapi dimakan bukan diminum)

### Bubur
- **Bubur Ayam, Bubur Kacang Hijau** → `type: "Makanan"` (meskipun cair, tapi dimakan dengan sendok)

### Sup/Sop
- **Sup Ayam, Sop Buntut** → `type: "Makanan"` (hidangan berkuah tapi termasuk makanan)

## Validasi Data

### Field Required
Semua field berikut HARUS diisi:
- `name` (string, tidak boleh kosong)
- `type` (string, harus "Makanan" atau "Minuman")
- `origin` (string, tidak boleh kosong)
- `rating` (number, 0-5)
- `description` (string, tidak boleh kosong)
- `imageUrl` (string, harus URL valid)

### Field Optional
- `mostIconic` (string, nullable)

### Constraints
1. **Type Constraint**: `type` hanya boleh "Makanan" atau "Minuman"
2. **Rating Constraint**: `rating` harus antara 0 dan 5
3. **Unique Constraint**: Kombinasi `name` + `type` harus unik (tidak boleh duplikat)
4. **Not Empty**: `name` dan `origin` tidak boleh string kosong

## Contoh Data Valid

### Makanan
```javascript
{
  name: "Rendang",
  type: "Makanan",
  origin: "Sumatera Barat",
  rating: 4.9,
  description: "Daging sapi yang dimasak dengan santan dan rempah-rempah khas Minangkabau.",
  imageUrl: "https://images.unsplash.com/photo-1234567890",
  mostIconic: "Padang"
}
```

### Minuman
```javascript
{
  name: "Es Cendol",
  type: "Minuman",
  origin: "Jawa Tengah",
  rating: 4.9,
  description: "Minuman es manis dengan cendol hijau dari tepung beras, santan, dan gula merah.",
  imageUrl: "https://images.unsplash.com/photo-1234567890"
}
```

## Contoh Data TIDAK Valid

### ❌ Type salah
```javascript
{
  name: "Rendang",
  type: "Lauk", // SALAH! Harus "Makanan" atau "Minuman"
  origin: "Sumatera Barat",
  rating: 4.9,
  description: "...",
  imageUrl: "..."
}
```

### ❌ Rating di luar range
```javascript
{
  name: "Rendang",
  type: "Makanan",
  origin: "Sumatera Barat",
  rating: 6.0, // SALAH! Harus 0-5
  description: "...",
  imageUrl: "..."
}
```

### ❌ Duplikat
```javascript
// Jika sudah ada "Rendang" dengan type "Makanan", tidak boleh insert lagi
{
  name: "Rendang", // SALAH! Sudah ada
  type: "Makanan",
  origin: "Jakarta", // Meskipun origin berbeda
  rating: 4.5,
  description: "...",
  imageUrl: "..."
}
```

## Tips Menentukan Type

1. **Pertanyaan kunci**: "Apakah ini diminum atau dimakan?"
   - Diminum → `type: "Minuman"`
   - Dimakan → `type: "Makanan"`

2. **Cek kata kunci**: Lihat daftar kata kunci di atas

3. **Jika ragu**:
   - Jika mengandung "Es", "Kopi", "Teh", "Jus" → kemungkinan besar Minuman
   - Jika mengandung "Nasi", "Ayam", "Sate", "Mie" → kemungkinan besar Makanan
   - Jika masih ragu, tanyakan atau cari referensi

4. **Konsistensi**: Pastikan item yang sama selalu menggunakan type yang sama
