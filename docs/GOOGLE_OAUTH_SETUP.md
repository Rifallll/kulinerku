# Setup Google OAuth di Supabase

## Step 1: Create Google OAuth Credentials

1. **Buka Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create atau Select Project**
   - Create new project atau pilih existing project

3. **Enable Google+ API**
   - APIs & Services → Library
   - Search "Google+ API"
   - Click "Enable"

4. **Create OAuth Credentials**
   - APIs & Services → Credentials
   - Click "Create Credentials" → "OAuth client ID"
   - Application type: **Web application**
   - Name: `Kulinerku Auth`

5. **Set Authorized JavaScript Origins**
   ```
   http://localhost:5173
   http://192.168.1.100:8080
   ```

6. **Set Authorized Redirect URIs**
   - Dapatkan dari Supabase:
     - Supabase Dashboard → Authentication → Providers → Google
     - Copy "Callback URL (for OAuth)"
   - Format biasanya: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
   - Paste ke Authorized redirect URIs

7. **Copy Credentials**
   - Client ID: `xxxxx.apps.googleusercontent.com`
   - Client Secret: `xxxxxxx`

## Step 2: Configure Supabase

1. **Buka Supabase Dashboard**
   - Project Settings → Authentication → Providers

2. **Enable Google Provider**
   - Scroll ke "Google"
   - Toggle **Enabled**

3. **Paste Credentials**
   - Client ID: (dari Google Console)
   - Client Secret: (dari Google Console)

4. **Save**

## Step 3: Test Login

1. **Run Development Server**
   ```bash
   npm run dev
   ```

2. **Open Login Page**
   - Visit: http://192.168.1.100:8080/login
   - Klik "Masuk dengan Google"
   - Select Google account
   - Akan redirect ke homepage

3. **Check User Di Supabase**
   - Supabase Dashboard → Authentication → Users
   - User baru akan muncul dengan provider: `google`

## Troubleshooting

**Error: "Redirect URI mismatch"**
- Pastikan Authorized redirect URIs di Google Console sama persis dengan Callback URL di Supabase
- Hapus trailing slash jika ada

**Error: "Invalid client"**
- Check Client ID dan Client Secret sudah benar
- Pastikan Google+ API sudah enabled

**User masuk tapi role tidak tersimpan**
- Google OAuth users default role = `member`
- Untuk set admin, update manual di Supabase Dashboard:
  - Authentication → Users → Select user
  - User Metadata → Add field `role: "admin"`

## Set Default Role untuk Google Users

Untuk auto-set role Google users, bisa pakai Database Trigger atau Function di Supabase.

Contoh SQL Trigger:
```sql
CREATE OR REPLACE FUNCTION public.handle_new_google_user()
RETURNS trigger AS $$
BEGIN
  -- Set default role for Google OAuth users
  IF NEW.raw_user_meta_data->>'provider' = 'google' THEN
    NEW.raw_user_meta_data = NEW.raw_user_meta_data || '{"role": "member"}'::jsonb;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created_google
  BEFORE INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_google_user();
```

## Production Setup

Untuk production, tambahkan domain production ke:

**Google Console:**
- Authorized JavaScript origins: `https://yourdomain.com`
- Authorized redirect URIs: `https://YOUR_PROJECT.supabase.co/auth/v1/callback`

**Supabase:**
- Site URL di Project Settings → General
- Additional Redirect URLs (jika perlu)
