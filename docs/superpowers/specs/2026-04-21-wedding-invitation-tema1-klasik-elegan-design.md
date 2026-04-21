# Design Spec: Wedding Invitation — Tema 1 "Klasik Elegan"

**Tanggal**: 2026-04-21  
**Status**: Approved — siap implementasi  
**Konteks**: Bagian dari multi-tema (Option C). Spec ini mencakup Tema 1 saja.

---

## 1. Identitas Visual

| Aspek | Nilai |
|-------|-------|
| Nama tema | Klasik Elegan |
| Palet warna | Navy deep `#0d0d1f` → `#0f3460` (background) · Gold `#c9a84c` (accent) · White `rgba(255,255,255,0.85)` (body text) |
| Font heading | **Cormorant Garamond** — italic, weight 300 (Google Fonts) |
| Font label/body | **Montserrat** — weight 300–400, uppercase, wide letter-spacing (Google Fonts) |
| Mood | Mewah, formal, romantis — nuansa ballroom malam hari |

---

## 2. Arsitektur Layout

- **Tipe**: Cinematic Full-Screen Single Page
- **Struktur**: Setiap section mengisi 100vh (full viewport height)
- **Scroll**: Smooth parallax scroll antar section
- **Navigasi**: Tidak ada nav bar permanen — tamu scroll linear dari atas ke bawah
- **Responsif**: Mobile-first; section tetap full-screen di mobile dengan konten di-reflow vertikal

---

## 3. Fitur Global

### Background Musik
- Musik instrumen (genre: classical/romantic piano/strings) autoplay saat halaman dimuat
- Browser policy: autoplay dimulai setelah interaksi pertama pengguna (tap/klik)
- Tombol mute/unmute fixed di pojok kanan bawah layar — ikon not musik emas

### Cover Hero — Animated Star Particles
- Background: radial gradient navy (`#1a2a4a` center → `#0d0d1f` edge)
- Partikel bintang gold (`#c9a84c`) dan putih — bergerak sangat lambat (drift acak)
- Implementasi: Canvas API atau library ringan (tsParticles / particles.js)
- Tidak mengganggu keterbacaan teks

---

## 4. Urutan & Konten 9 Sections

### Section 1 — Cover
- Background: animated star particles (lihat §3)
- Konten tengah (vertikal center):
  - Label kecil: `PERNIKAHAN` (Montserrat uppercase, gold tipis)
  - Nama pasangan: `[Nama Pria] & [Nama Wanita]` (Cormorant italic besar, gold)
  - Garis pemisah: gradient line emas
  - Tanggal: `DD · Bulan · YYYY` (Montserrat uppercase, gold redup)
  - Scroll indicator: teks `scroll` + panah animasi bounce ke bawah

### Section 2 — Countdown
- Background: navy solid dengan bintang statis halus
- Konten tengah:
  - Teks atas: *"Menghitung hari menuju hari istimewa kami"* (Cormorant italic)
  - Timer live: 4 kotak emas — `HARI · JAM · MENIT · DETIK`
  - Kotak timer: border gold, angka Cormorant besar, label Montserrat kecil
  - Setelah hari-H lewat: timer diganti teks *"Hari ini adalah hari istimewa kami"*

### Section 3 — Pasangan & Ortu
- Background: navy dengan subtle vignette
- Layout: dua kolom (kiri = pria, kanan = wanita)
- Tiap kolom: foto bulat (circle crop) · nama lengkap · nama ayah & ibu
- Separator tengah: ornamen emas tipis (✦ atau garis vertikal)

### Section 4 — Cerita Cinta
- Background: navy lebih gelap
- Format: timeline vertikal — 3 hingga 4 milestone
- Tiap milestone: tahun (Montserrat gold) · judul (Cormorant italic) · deskripsi singkat (Montserrat kecil)
- Milestone wajib: Pertama bertemu · Jadian · Lamaran · (opsional: momen lainnya)
- Connector: garis vertikal emas putus-putus antar milestone

### Section 5 — Galeri
- Background: navy
- Layout: masonry grid atau 3-kolom seragam
- Foto: pre-wedding photos (disuplai pasangan)
- Interaksi: klik foto → lightbox fullscreen dengan navigasi panah
- Mobile: 2-kolom atau swipe carousel

### Section 6 — Acara
- Background: navy dengan ornamen corner emas samar
- Layout: dua card berdampingan — **Akad** (kiri) dan **Resepsi** (kanan)
- Tiap card: ikon (cincin / bunga) · label acara · hari & tanggal · jam · nama venue · alamat singkat
- Tombol: "Simpan ke Kalender" (Google Calendar link)

### Section 7 — Lokasi
- Background: navy
- Konten: embed Google Maps interaktif (iframe)
- Jika lokasi Akad ≠ Resepsi: dua tab Maps yang bisa diswitch
- Tombol: "Buka di Google Maps" (deep link)
- Teks alamat lengkap di bawah maps

### Section 8 — RSVP
- Background: navy dengan garis border emas di sekeliling form
- Form fields:
  - Nama lengkap (text input)
  - Jumlah tamu (number input, min 1 max 5)
  - Konfirmasi hadir (radio: Hadir / Tidak Hadir)
  - Pesan / ucapan (textarea, opsional)
- Tombol submit: gold filled, teks navy — *"Kirim Konfirmasi"*
- Backend: form submission ke spreadsheet (Google Sheets via API) atau service (Formspree/EmailJS)
- Success state: shimmer partikel emas halus (konsisten dengan mood elegan) + teks ucapan terima kasih (Cormorant italic)

### Section 9 — Ucapan & Doa
- Background: navy paling gelap, bintang statis
- Konten atas: ucapan dari pasangan (Cormorant italic, gold)
- Konten bawah: feed ucapan tamu dari RSVP — kartu kecil scrollable horizontal (bergantung pada backend RSVP yang sama di Section 8)
- Footer: nama pasangan + tanggal + ikon hati kecil

---

## 5. Detail Teknis

| Aspek | Keputusan |
|-------|-----------|
| Platform | Web app (HTML/CSS/JS) — diakses via link/QR code |
| Font loading | Google Fonts (Cormorant Garamond + Montserrat) |
| Animasi | CSS transitions + minimal JS (particles, countdown, lightbox) |
| Maps | Google Maps Embed API |
| RSVP backend | TBD — Google Sheets API / Formspree / Supabase |
| Hosting | TBD |
| Multi-tema | Tema ini (Klasik Elegan) adalah Tema 1 dari total tema yang belum ditentukan |

---

## 6. Informasi yang Belum Dikonfirmasi

Diisi oleh pasangan sebelum implementasi dimulai:

- [ ] Nama lengkap mempelai pria & wanita
- [ ] Nama orang tua masing-masing
- [ ] Tanggal & jam acara (Akad dan Resepsi)
- [ ] Nama & alamat venue
- [ ] Foto pasangan & pre-wedding
- [ ] Pilihan musik latar (lagu spesifik atau genre)
- [ ] Milestone cerita cinta (tahun + deskripsi)
- [ ] Total jumlah tema di multi-tema

---

## 7. Out of Scope (Tema 1 ini)

- Tema 2, 3, dst — akan di-spec terpisah
- Fitur admin panel untuk pasangan
- Animasi 3D berat (WebGL)
- Integrasi pembayaran amplop digital (bisa ditambah di fase berikutnya)
