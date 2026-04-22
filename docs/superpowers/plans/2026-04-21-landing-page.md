# Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a public marketing landing page at `/` that converts visitors into WhatsApp inquiries for the wedding invitation service.

**Architecture:** Single server component `app/page.tsx` with no data fetching — all content is static. Styles live in a new `/* ===== LANDING ===== */` block in the existing `app/globals.css`. The WhatsApp phone number is injected from `NEXT_PUBLIC_WA_NUMBER` env var at build time.

**Tech Stack:** Next.js 16 (App Router), React 19, CSS (no Tailwind utilities — follows existing globals.css pattern in this codebase)

---

## File Map

| Action | File | Purpose |
|--------|------|---------|
| Create | `app/page.tsx` | Landing page server component — all 7 sections |
| Modify | `app/globals.css` | Add `/* ===== LANDING ===== */` CSS block + `scroll-behavior: smooth` on `html` |
| Modify | `.env.example` | Add `NEXT_PUBLIC_WA_NUMBER=` entry |
| Modify | `.env.local` | Add `NEXT_PUBLIC_WA_NUMBER=62XXXXXXXXXX` (operator fills in real number) |

---

## Task 1: Add env variable for WhatsApp number

**Files:**
- Modify: `.env.example`
- Modify: `.env.local`

- [ ] **Step 1: Add to `.env.example`**

Append after the existing last line:
```
NEXT_PUBLIC_WA_NUMBER=
```

- [ ] **Step 2: Add to `.env.local`**

Append after the existing last line:
```
NEXT_PUBLIC_WA_NUMBER=6281234567890
```
> Ganti `6281234567890` dengan nomor WhatsApp bisnis yang sebenarnya (format: kode negara tanpa `+`, tanpa spasi)

- [ ] **Step 3: Commit**

```bash
git add .env.example
git commit -m "chore: add NEXT_PUBLIC_WA_NUMBER env var"
```
> Jangan commit `.env.local` — sudah ada di `.gitignore`

---

## Task 2: Add smooth scroll and landing CSS foundation

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Add `scroll-behavior: smooth` to `html`**

Di `app/globals.css`, tambahkan rule `html` sebelum `body`:
```css
html { scroll-behavior: smooth; }
```

- [ ] **Step 2: Add landing CSS block at the end of `globals.css`**

Append setelah baris terakhir file (`admin-page-header` block):

```css
/* ===== LANDING ===== */
.landing-nav { display: flex; justify-content: space-between; align-items: center; padding: 1.25rem 3rem; border-bottom: 1px solid #f3f4f6; position: sticky; top: 0; background: #fff; z-index: 10; }
.landing-nav-brand { font-size: 1rem; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: #111827; text-decoration: none; }
.landing-nav-cta { background: #111827; color: #fff; padding: 0.5rem 1.25rem; border-radius: 4px; font-size: 0.8rem; letter-spacing: 1px; text-decoration: none; transition: background 0.2s; }
.landing-nav-cta:hover { background: #374151; }

.landing-hero { min-height: 92vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 4rem 2rem; position: relative; }
.landing-hero-label { font-size: 0.62rem; letter-spacing: 6px; text-transform: uppercase; color: #9ca3af; margin-bottom: 1.5rem; }
.landing-hero-title { font-size: clamp(2.5rem, 7vw, 5.5rem); font-weight: 200; letter-spacing: 0.06em; color: #111827; line-height: 1.1; }
.landing-hero-title strong { font-weight: 700; }
.landing-hero-divider { width: 3rem; height: 2px; background: #111827; margin: 2rem auto; }
.landing-hero-sub { font-size: 1rem; color: #6b7280; max-width: 440px; line-height: 1.7; margin-bottom: 2.5rem; }
.landing-hero-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
.landing-btn-primary { background: #111827; color: #fff; padding: 0.875rem 2rem; border-radius: 4px; font-size: 0.85rem; letter-spacing: 1px; text-decoration: none; transition: background 0.2s; }
.landing-btn-primary:hover { background: #374151; }
.landing-btn-outline { border: 1px solid #d1d5db; color: #374151; padding: 0.875rem 2rem; border-radius: 4px; font-size: 0.85rem; letter-spacing: 1px; text-decoration: none; transition: border-color 0.2s; }
.landing-btn-outline:hover { border-color: #9ca3af; }
.landing-hero-proof { margin-top: 1.5rem; font-size: 0.75rem; color: #9ca3af; letter-spacing: 0.5px; }
.landing-hero-scroll { position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%); font-size: 0.62rem; letter-spacing: 3px; text-transform: uppercase; color: #9ca3af; }

.landing-section { padding: 6rem 3rem; }
.landing-section-gray { background: #f9fafb; }
.landing-section-dark { background: #111827; }
.landing-section-label { font-size: 0.6rem; letter-spacing: 5px; text-transform: uppercase; color: #9ca3af; text-align: center; margin-bottom: 0.75rem; }
.landing-section-title { font-size: 2rem; font-weight: 300; letter-spacing: 0.04em; text-align: center; color: #111827; margin-bottom: 0.75rem; }
.landing-section-dark .landing-section-title { color: #fff; }
.landing-section-sub { text-align: center; color: #6b7280; font-size: 0.9rem; max-width: 500px; margin: 0 auto 3.5rem; line-height: 1.7; }
.landing-section-dark .landing-section-sub { color: #9ca3af; }

.landing-theme-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem; max-width: 900px; margin: 0 auto; }
.landing-theme-card { border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; transition: transform 0.2s, box-shadow 0.2s; }
.landing-theme-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.08); }
.landing-theme-preview { height: 180px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; padding: 1.5rem; }
.landing-theme-preview-elegant { background: linear-gradient(135deg, #0f1923 0%, #1a2d40 100%); }
.landing-theme-preview-floral { background: linear-gradient(135deg, #fdf6f0 0%, #fce8d8 100%); }
.landing-theme-preview-minimal { background: #ffffff; border-bottom: 1px solid #f3f4f6; }
.landing-theme-name { padding: 1rem; border-top: 1px solid #f3f4f6; }
.landing-theme-name h3 { font-size: 0.9rem; font-weight: 600; color: #111827; }
.landing-theme-name p { font-size: 0.75rem; color: #9ca3af; margin-top: 3px; }
.landing-theme-tag { font-size: 0.58rem; letter-spacing: 2px; text-transform: uppercase; padding: 2px 8px; border-radius: 2px; }

.landing-features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 2.5rem; max-width: 900px; margin: 0 auto; }
.landing-feature { text-align: center; }
.landing-feature-icon { font-size: 1.75rem; margin-bottom: 1rem; }
.landing-feature-title { font-size: 0.95rem; font-weight: 600; color: #111827; margin-bottom: 0.4rem; }
.landing-feature-desc { font-size: 0.82rem; color: #6b7280; line-height: 1.6; }

.landing-steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; max-width: 800px; margin: 0 auto; position: relative; }
.landing-steps::before { content: ''; position: absolute; top: 27px; left: 18%; right: 18%; height: 1px; background: #e5e7eb; }
.landing-step { text-align: center; }
.landing-step-num { width: 56px; height: 56px; border-radius: 50%; border: 1px solid #111827; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem; font-size: 1rem; font-weight: 300; color: #111827; background: #fff; position: relative; z-index: 1; }
.landing-step-title { font-size: 0.9rem; font-weight: 600; color: #111827; margin-bottom: 0.35rem; }
.landing-step-desc { font-size: 0.8rem; color: #6b7280; line-height: 1.6; }

.landing-cta-label { font-size: 0.6rem; letter-spacing: 5px; text-transform: uppercase; color: #4b5563; margin-bottom: 1rem; text-align: center; }
.landing-cta-title { font-size: 2.5rem; font-weight: 300; color: #fff; letter-spacing: 0.04em; text-align: center; margin-bottom: 0.75rem; }
.landing-cta-sub { color: #9ca3af; font-size: 0.9rem; max-width: 420px; margin: 0 auto 2.5rem; line-height: 1.7; text-align: center; }
.landing-btn-wa { background: #25d366; color: #fff; padding: 1rem 2.5rem; border-radius: 4px; font-size: 0.9rem; letter-spacing: 0.5px; text-decoration: none; font-weight: 600; display: inline-block; transition: background 0.2s; }
.landing-btn-wa:hover { background: #1ebe5a; }

.landing-footer { border-top: 1px solid #1f2937; background: #111827; text-align: center; padding: 1.5rem 3rem; }
.landing-footer p { font-size: 0.75rem; color: #4b5563; }
```

- [ ] **Step 3: Verify no visual regressions on existing pages**

Start dev server (`npm run dev`) and check:
- `http://localhost:3000/admin/login` — tetap normal
- `http://localhost:3000/admin` — tetap normal

- [ ] **Step 4: Commit**

```bash
git add app/globals.css
git commit -m "style: add landing page CSS + smooth scroll"
```

---

## Task 3: Build landing page component

**Files:**
- Create: `app/page.tsx`

- [ ] **Step 1: Create `app/page.tsx`**

```tsx
const WA_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER ?? ''
const WA_LINK = `https://wa.me/${WA_NUMBER}`

export const metadata = {
  title: 'Undangan Digital Pernikahan — Elegan & Personal',
  description: 'Buat undangan pernikahan digital yang indah. Tiga tema eksklusif, RSVP online, buku tamu digital, dan peta lokasi terintegrasi.',
}

export default function HomePage() {
  return (
    <>
      {/* NAV */}
      <nav className="landing-nav">
        <span className="landing-nav-brand">Undangan.id</span>
        <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="landing-nav-cta">
          Pesan Sekarang
        </a>
      </nav>

      {/* HERO */}
      <section className="landing-hero">
        <p className="landing-hero-label">Undangan Digital Pernikahan</p>
        <h1 className="landing-hero-title">
          Undangan <strong>Indah</strong>,<br />Kenangan Abadi
        </h1>
        <div className="landing-hero-divider" />
        <p className="landing-hero-sub">
          Buat undangan pernikahan digital yang elegan dan personal. Tiga tema eksklusif,
          buku tamu online, dan RSVP otomatis dalam satu link.
        </p>
        <div className="landing-hero-actions">
          <a href="#tema" className="landing-btn-primary">Lihat Koleksi Tema</a>
          <a href="#cara-pesan" className="landing-btn-outline">Cara Pesan</a>
        </div>
        <p className="landing-hero-proof">✦ Sudah dipercaya puluhan pasangan ✦</p>
        <p className="landing-hero-scroll">↓ &nbsp; scroll</p>
      </section>

      {/* THEME PREVIEW */}
      <section id="tema" className="landing-section">
        <p className="landing-section-label">Koleksi Tema</p>
        <h2 className="landing-section-title">Pilih Gaya yang Mencerminkan Kalian</h2>
        <p className="landing-section-sub">
          Setiap tema dirancang detail — tipografi, warna, hingga ornamen —
          untuk tampilan yang konsisten dan memukau.
        </p>
        <div className="landing-theme-grid">
          <div className="landing-theme-card">
            <div className="landing-theme-preview landing-theme-preview-elegant">
              <span style={{fontSize:'0.6rem',letterSpacing:'3px',color:'#c9a84c',textTransform:'uppercase'}}>Undangan Pernikahan</span>
              <span style={{fontSize:'1.25rem',fontStyle:'italic',color:'#fff',fontFamily:'Georgia,serif'}}>Rizky &amp; Aisyah</span>
              <div style={{width:'2rem',height:'1px',background:'#c9a84c'}} />
              <span className="landing-theme-tag" style={{background:'rgba(201,168,76,0.15)',color:'#c9a84c'}}>ELEGANT GOLD</span>
            </div>
            <div className="landing-theme-name">
              <h3>Elegant Gold &amp; Navy</h3>
              <p>Mewah · Romantis · Premium</p>
            </div>
          </div>
          <div className="landing-theme-card">
            <div className="landing-theme-preview landing-theme-preview-floral">
              <span style={{fontSize:'0.6rem',letterSpacing:'3px',color:'#c17f52',textTransform:'uppercase'}}>Undangan Pernikahan</span>
              <span style={{fontSize:'1.25rem',fontStyle:'italic',color:'#5c3317',fontFamily:'Georgia,serif'}}>Budi &amp; Sari</span>
              <div style={{width:'2rem',height:'1px',background:'#c17f52'}} />
              <span className="landing-theme-tag" style={{background:'rgba(193,127,82,0.1)',color:'#c17f52'}}>FLORAL SOFT</span>
            </div>
            <div className="landing-theme-name">
              <h3>Floral Soft</h3>
              <p>Hangat · Feminin · Natural</p>
            </div>
          </div>
          <div className="landing-theme-card">
            <div className="landing-theme-preview landing-theme-preview-minimal">
              <span style={{fontSize:'0.55rem',letterSpacing:'4px',color:'#9ca3af',textTransform:'uppercase'}}>Wedding Invitation</span>
              <span style={{fontSize:'1.25rem',fontWeight:300,letterSpacing:'2px',color:'#111827'}}>Andi &amp; Dewi</span>
              <div style={{width:'1.5rem',height:'2px',background:'#111827'}} />
              <span className="landing-theme-tag" style={{background:'#f3f4f6',color:'#6b7280'}}>MINIMALIST</span>
            </div>
            <div className="landing-theme-name">
              <h3>Modern Minimalist</h3>
              <p>Bersih · Modern · Universal</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="landing-section landing-section-gray">
        <p className="landing-section-label">Fitur Unggulan</p>
        <h2 className="landing-section-title">Semua yang Kamu Butuhkan</h2>
        <p className="landing-section-sub">
          Dari countdown hari-H hingga buku tamu digital — semua tersedia dalam satu link undangan.
        </p>
        <div className="landing-features-grid">
          {[
            { icon: '⏱', title: 'Countdown Otomatis', desc: 'Hitung mundur real-time menuju hari pernikahan, tampil cantik di semua device.' },
            { icon: '📍', title: 'Peta Lokasi Terintegrasi', desc: 'Google Maps langsung di undangan. Tamu tinggal klik, navigasi otomatis terbuka.' },
            { icon: '✅', title: 'RSVP Online', desc: 'Tamu konfirmasi kehadiran langsung di undangan. Rekapan tersedia di dashboard admin.' },
            { icon: '📖', title: 'Buku Tamu Digital', desc: 'Tamu kirim ucapan dan doa secara online. Semua ucapan tersimpan selamanya.' },
            { icon: '🖼', title: 'Galeri Foto', desc: 'Tampilkan momen prewedding kalian dalam galeri foto yang elegan.' },
            { icon: '🎵', title: 'Musik Latar', desc: 'Pilih lagu favorit kalian sebagai musik pengiring undangan.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="landing-feature">
              <div className="landing-feature-icon">{icon}</div>
              <div className="landing-feature-title">{title}</div>
              <div className="landing-feature-desc">{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW TO ORDER */}
      <section id="cara-pesan" className="landing-section">
        <p className="landing-section-label">Cara Pesan</p>
        <h2 className="landing-section-title">Mudah dalam 3 Langkah</h2>
        <p className="landing-section-sub">
          Proses pemesanan cepat dan sederhana. Undangan kamu siap dalam waktu singkat.
        </p>
        <div className="landing-steps">
          {[
            { num: '01', title: 'Hubungi via WhatsApp', desc: 'Kirim pesan ke nomor kami. Pilih tema dan ceritakan detail pernikahan kalian.' },
            { num: '02', title: 'Kirim Data & Foto', desc: 'Kami akan memandu pengisian data — nama, tanggal, lokasi, foto, dan kisah cinta kalian.' },
            { num: '03', title: 'Undangan Siap Disebarkan', desc: 'Terima link undangan unik kalian. Bagikan ke semua tamu langsung dari WhatsApp.' },
          ].map(({ num, title, desc }) => (
            <div key={num} className="landing-step">
              <div className="landing-step-num">{num}</div>
              <div className="landing-step-title">{title}</div>
              <div className="landing-step-desc">{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="landing-section landing-section-dark">
        <p className="landing-cta-label">Siap Memulai?</p>
        <h2 className="landing-cta-title">Buat Undangan Impian Kalian</h2>
        <p className="landing-cta-sub">
          Hubungi kami sekarang dan wujudkan undangan digital yang berkesan untuk hari istimewa kalian.
        </p>
        <div style={{textAlign:'center'}}>
          <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="landing-btn-wa">
            💬 &nbsp; Chat WhatsApp Sekarang
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer">
        <p>© {new Date().getFullYear()} Undangan.id — Undangan Digital Pernikahan</p>
      </footer>
    </>
  )
}
```

- [ ] **Step 2: Verify page renders at root**

```bash
npm run dev
```

Buka `http://localhost:3000` — pastikan semua 7 section tampil:
- Nav sticky ✓
- Hero dengan headline dan 2 tombol ✓
- Section #tema dengan 3 kartu tema ✓
- Section fitur dengan 6 item ✓
- Section cara pesan dengan 3 langkah ✓
- CTA section gelap dengan tombol WhatsApp hijau ✓
- Footer ✓

- [ ] **Step 3: Test smooth scroll**

Klik "Lihat Koleksi Tema" → halaman scroll smooth ke section #tema  
Klik "Cara Pesan" → halaman scroll smooth ke section #cara-pesan

- [ ] **Step 4: Test WhatsApp links**

Klik "Pesan Sekarang" di nav dan "Chat WhatsApp Sekarang" di CTA — keduanya harus buka `https://wa.me/{nomor}` di tab baru.

- [ ] **Step 5: Test responsive**

Resize browser ke lebar 375px (mobile). Cek:
- Headline font size menyesuaikan (clamp) ✓
- Theme grid jadi 1 kolom ✓
- Features grid jadi 1-2 kolom ✓
- Steps grid jadi 1 kolom (connector line hilang — normal) ✓
- Tombol hero tidak overflow ✓

- [ ] **Step 6: Commit**

```bash
git add app/page.tsx
git commit -m "feat: add landing page with theme preview, features, and WhatsApp CTA"
```

---

## Task 4: Update existing pages to not conflict

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Check root layout doesn't add unwanted wrapper**

Buka `app/layout.tsx`. Pastikan tidak ada `<main>` atau container wrapper yang membungkus `{children}` dengan padding/margin yang merusak full-bleed landing page.

Jika ada class wrapper seperti `className="container"` atau `style={{padding: '...'}}` di `{children}`, hapus atau pindahkan ke halaman yang membutuhkannya saja.

- [ ] **Step 2: Verify admin pages unaffected**

```bash
# Dev server harus sudah jalan
```

Cek `http://localhost:3000/admin/login` — layout admin tetap normal (tidak kena CSS landing).

- [ ] **Step 3: Commit jika ada perubahan**

```bash
git add app/layout.tsx
git commit -m "fix: ensure root layout doesn't wrap landing page content"
```

---

## Self-Review Checklist

**Spec coverage:**
- [x] Sticky nav dengan brand + CTA → Task 3
- [x] Hero fullscreen dengan headline, divider, sub, 2 CTA, social proof, scroll hint → Task 3
- [x] Theme preview 3 kartu dengan hover effect → Task 3
- [x] Features 6 item grid → Task 3
- [x] How-to-order 3 langkah dengan connector line → Task 3
- [x] CTA section gelap dengan WhatsApp button → Task 3
- [x] Footer → Task 3
- [x] `NEXT_PUBLIC_WA_NUMBER` env var → Task 1
- [x] Smooth scroll → Task 2
- [x] CSS di globals.css → Task 2
- [x] Layout conflict check → Task 4

**Placeholder scan:** Clean — semua task berisi kode lengkap.

**Type consistency:** Pure JSX/HTML, tidak ada type dependencies antar task.
