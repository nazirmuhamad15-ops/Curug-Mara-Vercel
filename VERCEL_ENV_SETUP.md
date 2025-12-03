# Environment Variables yang Harus Di-Set di Vercel

Silakan set environment variables berikut di Vercel Dashboard:
**Settings → Environment Variables**

## 1. Supabase (WAJIB)
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## 2. Database (WAJIB)
```
DATABASE_URL=your_postgres_connection_string
```

## 3. NextAuth (WAJIB)
```
NEXTAUTH_SECRET=your_nextauth_secret_key
NEXTAUTH_URL=https://your-vercel-domain.vercel.app
```

**Cara generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

## 4. Gemini AI (OPSIONAL - untuk fitur chat AI)
```
GEMINI_API_KEY=your_gemini_api_key
```

## 5. Cron Secret (OPSIONAL - untuk auto-cancel bookings)
```
CRON_SECRET=your_cron_secret
```

---

## Cara Set di Vercel:

1. Buka project di Vercel Dashboard
2. Klik **Settings** tab
3. Klik **Environment Variables** di sidebar
4. Tambahkan satu per satu environment variable di atas
5. Pilih environment: **Production**, **Preview**, dan **Development** (centang semua)
6. Klik **Save**
7. **Redeploy** project Anda

---

## Troubleshooting:

Jika masih error setelah set environment variables:
1. Pastikan semua variable sudah di-save
2. Lakukan **Redeploy** (bukan auto-deploy dari git push)
3. Cek Vercel logs untuk error spesifik: **Deployments → [latest deployment] → View Function Logs**
