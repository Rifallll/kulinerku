# Demo Accounts Setup Script

Script untuk membuat demo accounts (Admin & Member) secara otomatis.

## Prerequisites

1. **Dapatkan Service Role Key dari Supabase:**
   - Buka Supabase Dashboard
   - Project Settings → API
   - Copy **service_role** key (bukan anon key!)

2. **Enable Email Auth:**
   - Authentication → Providers → Email
   - Enable "Email"
   - Disable "Confirm email" (untuk demo)

## Setup

1. Buat file `.env` di root project:

```env
VITE_SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

2. Install dependencies jika belum:
```bash
npm install dotenv
```

## Run Script

### Option 1: Via tsx (Recommended)
```bash
npx tsx scripts/createDemoAccounts.ts
```

### Option 2: Compile dulu
```bash
npx tsc scripts/createDemoAccounts.ts
node scripts/createDemoAccounts.js
```

## Demo Accounts yang Akan Dibuat

| Email | Password | Role | Access |
|-------|----------|------|--------|
| admin@kulinerku.com | admin123 | Admin | Full access + /supabase-data |
| user@kulinerku.com | user123 | Member | Regular user access |

## Testing

Setelah run script:

1. Visit: http://192.168.1.100:8080/login
2. Login dengan salah satu demo account
3. Admin: Coba akses http://192.168.1.100:8080/supabase-data ✅
4. Member: Coba akses /supabase-data → Akses Ditolak ❌

## Troubleshooting

**Error: "Invalid API key"**
- Pastikan menggunakan **service_role** key, bukan anon key

**Error: "User already exists"**
- Accounts sudah dibuat sebelumnya
- Hapus dulu di Supabase Dashboard → Authentication → Users

**Login berhasil tapi role tidak terdeteksi:**
- Check user_metadata di Supabase Dashboard
- Pastikan field "role" ada di user metadata
