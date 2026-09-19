# MDMC Volunteer Management System

Sistem informasi untuk mendata dan mengelola relawan kesiapsiagaan bencana MDMC.

## Stack

- Next.js 15 App Router
- TypeScript strict mode
- Tailwind CSS 4
- shadcn/ui
- Supabase SSR client

## Menjalankan Lokal

1. Gunakan Node.js 20 atau versi LTS yang lebih baru.
2. Buat `.env.local` berdasarkan `.env.example`.
3. Isi URL dan anon key dari Supabase Dashboard.
4. Jalankan `npm install`.
5. Jalankan `npm run dev` lalu buka `http://localhost:3000`.

## Environment Variable

| Nama | Keterangan |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL project Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon/publishable key untuk client Supabase |

Jangan gunakan `service_role` key pada variable publik atau kode frontend.

## Pemeriksaan Kualitas

```bash
npm run lint
npm run type-check
npm run build
```

## Setup Database

Jalankan migration `supabase/migrations/202609170001_create_profiles.sql` melalui Supabase CLI atau SQL Editor. Setiap pengguna Supabase Auth harus memiliki satu baris `public.profiles` dengan `id` yang sama seperti `auth.users.id`.

## Status Implementasi

- Phase 1: project setup, design token, fondasi shadcn/ui, dan koneksi Supabase.
- Phase 2: email/password authentication, profil role, session SSR, proteksi route, dan placeholder dashboard.

CRUD organisasi/relawan, dashboard statistik, dan reporting belum diimplementasikan.
