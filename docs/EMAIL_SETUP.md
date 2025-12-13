# Setup Email Untuk Registration

## 🎯 Goal:
Setiap user yang **register baru** → otomatis dapat **email welcome** di inbox mereka!

---

## 📧 Step 1: Enable Email di Supabase

### A. Authentication → Email Templates

1. **Buka Supabase Dashboard**
2. **Authentication** → **Email Templates**
3. **Confirm signup** template

**Edit template:**

```html
<h2>Selamat Datang di Kulinerku! 🍜</h2>

<p>Halo,</p>

<p>Terima kasih telah mendaftar di <strong>Kulinerku</strong>! Kami sangat senang Anda bergabung dengan kami untuk menjelajahi kekayaan kuliner Indonesia.</p>

<h3>Konfirmasi Email Anda</h3>
<p>Untuk mengaktifkan akun Anda, silakan klik tombol di bawah ini:</p>

<p>
  <a href="{{ .ConfirmationURL }}" 
     style="background-color: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
    Konfirmasi Akun Saya
  </a>
</p>

<p>Atau copy-paste link berikut ke browser:</p>
<p><a href="{{ .ConfirmationURL }}">{{ .ConfirmationURL }}</a></p>

<hr>

<h3>Apa yang bisa Anda lakukan?</h3>
<ul>
  <li>🔍 Jelajahi ribuan resep makanan Indonesia</li>
  <li>❤️ Simpan makanan favorit Anda</li>
  <li>🗺️ Temukan kuliner berdasarkan daerah</li>
  <li>📊 Lihat analytics kuliner nusantara</li>
</ul>

<p>Jika Anda tidak membuat akun ini, abaikan email ini.</p>

<p>Salam hangat,<br>
<strong>Tim Kulinerku</strong> 🇮🇩</p>

<hr>
<p style="font-size: 12px; color: #666;">
  Email ini dikirim otomatis. Jangan balas email ini.
</p>
```

---

## 📧 Step 2: Enable Confirmation Email

### B. Authentication → Providers → Email

1. **Enable Email provider**: ✅ ON
2. **Confirm email**: ✅ **ON** (PENTING!)
   - Toggle ini ON untuk kirim email konfirmasi
3. **Secure email change**: OFF
4. **Save**

---

## 📧 Step 3: Email Settings (Opsional - Production)

### C. Project Settings → Auth → Email Auth

**Default (Development):**
- Supabase menggunakan email default mereka
- Email dari: `noreply@mail.app.supabase.io`
- **Gratis, langsung bisa!** ✅

**Production (Custom Domain):**
Kalau mau email dari domain sendiri (`noreply@kulinerku.com`):
1. Setup SMTP server (Gmail, SendGrid, etc)
2. Project Settings → Auth → SMTP Settings
3. Konfigurasi server details

---

## 🧪 Test Flow:

### Register New User:

1. **Visit**: http://localhost:8080/register
2. **Isi form**:
   - Email: `test@example.com`
   - Password: `123456`
   - Confirm Password: `123456`
3. **Klik "Daftar Sekarang"**

### Yang Terjadi:

```
1. User submit form
   ↓
2. Supabase create account (status: unconfirmed)
   ↓
3. 📧 Email terkirim otomatis ke test@example.com
   ↓
4. User buka email inbox
   ↓
5. Klik "Konfirmasi Akun Saya"
   ↓
6. ✅ Account activated!
   ↓
7. Redirect ke login page
```

---

## 📋 Checklist:

- [ ] Edit email template di Supabase
- [ ] Enable "Confirm email" toggle
- [ ] Save settings
- [ ] Test register akun baru
- [ ] Check email inbox
- [ ] Klik link konfirmasi
- [ ] Login berhasil!

---

## 🎨 Custom Email Template Examples:

### Welcome Email (After Confirmation):

Bisa juga buat email ke-2 setelah konfirmasi berhasil!

**Email Templates** → **Invite user** atau custom trigger.

---

## ⚠️ Troubleshooting:

**Email tidak terkirim?**
1. Check spam folder
2. Pastikan "Confirm email" toggle ON
3. Tunggu 1-2 menit (delay email server)
4. Check Supabase Logs → Auth Logs

**Email masuk spam?**
- Normal untuk dev environment
- Production: gunakan custom SMTP + SPF/DKIM

---

## 🚀 Done!

Sekarang setiap user register → **otomatis dapat email!** 📧✨
