# Kulinerku Authentication System

## Login Credentials

### 👨‍💼 Admin Account
**Email:** `admin123@gmail.com`  
**Password:** `112233`  
**Access:** Full access + Data Management (`/supabase-data`)

### 👤 Member Account
**Email:** `user@kulinerku.com`  
**Password:** `user123`  
**Access:** Regular user features (Browse, Favorites, etc.)

**Alternative:** Member bisa login dengan **Google OAuth**

---

## Quick Setup

### 1. Create Demo Accounts

```bash
npm install dotenv
node scripts/createDemoAccounts.js
```

### 2. Login

Visit: http://192.168.1.100:8080/login

**Admin:**
- Email/Password only: admin123@gmail.com / 112233
- NO Google login untuk admin

**Member:**
- Email/Password: user@kulinerku.com / user123  
- OR Google OAuth

---

## Role Permissions

| Feature | Member | Admin |
|---------|--------|-------|
| Browse Foods | ✅ | ✅ |
| Favorites | ✅ | ✅ |
| Food Details | ✅ | ✅ |
| Google Login | ✅ | ❌ |
| `/supabase-data` | ❌ | ✅ |
| Data Management | ❌ | ✅ |

---

## Google OAuth Setup

Member dapat login dengan Google:
1. Lihat `docs/GOOGLE_OAUTH_SETUP.md` untuk setup
2. Enable Google Provider di Supabase
3. Configure Google Cloud Console

Admin **HARUS** login dengan email/password.
