# Wedding Invitation Platform — Design Spec
**Date:** 2026-04-21
**Status:** Approved

---

## Overview

Platform bisnis undangan pernikahan digital berbasis web. Admin (pemilik bisnis) menginput data pelanggan melalui panel, sistem menghasilkan link undangan unik yang dapat langsung dibagikan. Platform juga digunakan untuk undangan pernikahan pribadi pemilik.

---

## Stack Teknologi

| Layer | Teknologi |
|---|---|
| Frontend + Backend | Next.js (App Router) |
| Database | Supabase (PostgreSQL) |
| Storage (foto/musik) | Supabase Storage |
| Auth (admin login) | Supabase Auth |
| Hosting | Vercel |
| Bahasa | TypeScript |

---

## Model Bisnis

**Admin-input model:** Pemilik bisnis menginput semua data pelanggan via admin panel, kemudian mengirimkan link hasil ke pelanggan. Pelanggan tidak perlu mendaftar atau login.

---

## Fitur Per Undangan

### Data Wajib
- Nama pengantin pria & wanita
- Nama orang tua pengantin pria & wanita
- Foto pengantin pria & wanita
- Tanggal, waktu, venue, alamat, link peta — akad & resepsi
- Slug URL (contoh: `rizky-aisyah`)
- Pilihan tema

### Data Opsional
- Love story timeline (tahun, judul, deskripsi — bisa banyak item)
- Galeri foto (bisa banyak)
- Kutipan/quote pasangan
- Musik background (URL atau upload)

### Fitur Interaktif (ditampilkan di halaman undangan)
- Countdown timer menuju hari H
- RSVP — tamu konfirmasi kehadiran (nama, jumlah tamu, pesan)
- Buku tamu digital — tamu kirim ucapan/doa
- Tombol share WhatsApp
- Tombol tambah ke kalender
- Integrasi peta (Google Maps embed)

---

## Halaman Aplikasi

### Public (dapat diakses siapa saja)
| Route | Deskripsi |
|---|---|
| `/[slug]` | Halaman undangan pelanggan. Fetch data dari Supabase berdasarkan slug. |

### Admin (hanya pemilik, login required)
| Route | Deskripsi |
|---|---|
| `/admin/login` | Halaman login admin |
| `/admin` | Dashboard — daftar semua undangan + status + link |
| `/admin/new` | Form buat undangan baru |
| `/admin/[id]/edit` | Edit undangan yang sudah ada |
| `/admin/[id]/rsvp` | Lihat data RSVP & buku tamu per undangan |

---

## Sistem Tema

3 tema tersedia (bisa ditambah di masa depan). Setiap tema adalah komponen React tersendiri dengan CSS-nya.

| ID | Nama | Deskripsi |
|---|---|---|
| `elegant` | Elegant Gold & Navy | Latar gelap, aksen emas. Mewah & formal. |
| `floral` | Floral Soft | Pastel krem/rose. Romantis & feminin. |
| `minimalist` | Modern Minimalist | Putih bersih, tipografi kuat. Urban & kontemporer. |

Tema dipilih admin saat membuat/mengedit undangan. Halaman publik merender tema yang sesuai berdasarkan field `theme` di database.

---

## Database Schema (Supabase)

### `invitations`
```
id             uuid PRIMARY KEY
slug           text UNIQUE NOT NULL       -- URL identifier
theme          text NOT NULL              -- 'elegant' | 'floral' | 'minimalist'
status         text DEFAULT 'active'      -- 'active' | 'inactive'

groom_name     text NOT NULL
groom_father   text
groom_mother   text
groom_photo_url text

bride_name     text NOT NULL
bride_father   text
bride_mother   text
bride_photo_url text

akad_date      date
akad_time      time
akad_venue     text
akad_address   text
akad_maps_link text

resepsi_date   date
resepsi_time   time
resepsi_venue  text
resepsi_address text
resepsi_maps_link text

couple_quote   text
music_url      text

created_at     timestamptz DEFAULT now()
updated_at     timestamptz DEFAULT now()
```

### `story_items`
```
id             uuid PRIMARY KEY
invitation_id  uuid REFERENCES invitations(id) ON DELETE CASCADE
year           text
title          text
description    text
sort_order     int DEFAULT 0
```

### `gallery_items`
```
id             uuid PRIMARY KEY
invitation_id  uuid REFERENCES invitations(id) ON DELETE CASCADE
image_url      text NOT NULL
sort_order     int DEFAULT 0
```

### `rsvp_responses`
```
id             uuid PRIMARY KEY
invitation_id  uuid REFERENCES invitations(id) ON DELETE CASCADE
guest_name     text NOT NULL
attendance     text NOT NULL   -- 'hadir' | 'tidak_hadir'
guest_count    int DEFAULT 1
message        text
created_at     timestamptz DEFAULT now()
```

### `guest_book`
```
id             uuid PRIMARY KEY
invitation_id  uuid REFERENCES invitations(id) ON DELETE CASCADE
name           text NOT NULL
message        text NOT NULL
created_at     timestamptz DEFAULT now()
```

---

## Struktur Project Next.js

```
/
├── app/
│   ├── [slug]/
│   │   └── page.tsx              # Halaman undangan publik
│   ├── admin/
│   │   ├── login/page.tsx
│   │   ├── page.tsx              # Dashboard
│   │   ├── new/page.tsx
│   │   └── [id]/
│   │       ├── edit/page.tsx
│   │       └── rsvp/page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── themes/
│   │   ├── ElegantTheme.tsx
│   │   ├── FloralTheme.tsx
│   │   └── MinimalistTheme.tsx
│   ├── invitation/               # Section components (cover, countdown, dll)
│   └── admin/                    # Admin UI components
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Browser client
│   │   └── server.ts             # Server client
│   └── types.ts                  # TypeScript types
└── middleware.ts                 # Auth guard untuk /admin routes
```

---

## Alur Kerja Bisnis

1. Pelanggan order & bayar (di luar sistem — WhatsApp/transfer manual)
2. Admin buka `/admin/new`, isi semua data pelanggan
3. Upload foto ke Supabase Storage
4. Pilih tema, set slug URL
5. Klik Simpan → link otomatis aktif: `domain.com/rizky-aisyah`
6. Admin kirim link ke pelanggan via WhatsApp
7. Tamu buka link → lihat undangan, bisa RSVP & isi buku tamu

---

## Security

- Admin panel dilindungi Supabase Auth (email + password)
- `middleware.ts` redirect ke login kalau belum auth
- Row Level Security (RLS) di Supabase: tabel RSVP & guest_book hanya bisa INSERT dari public, SELECT hanya dari admin
- Slug validation: hanya huruf kecil, angka, dan tanda hubung

---

## Out of Scope (MVP)

- Program reseller
- Self-service pelanggan (input sendiri)
- Amplop digital / wedding fund
- Notifikasi WhatsApp otomatis ke tamu
- Custom domain per undangan
- Analytics (berapa kali dibuka)
