# Landing Page Design — Undangan Digital

**Date:** 2026-04-21  
**Status:** Approved

---

## Overview

A public marketing landing page at `/` (currently 404) for the wedding invitation platform. Target audience: couples looking for a digital wedding invitation service. Goal: convert visitors into WhatsApp inquiries.

---

## Visual Style

- **Theme:** Modern Minimalist — white background, dark (`#111827`) typography, clean spacing
- **Font:** Helvetica Neue / Arial (already in use across the codebase)
- **Accent:** No color accent — relies on typography weight contrast and whitespace
- **Tone:** Premium, calm, trustworthy

---

## Page Structure

### 1. Sticky Navigation
- Left: brand name — uppercase, letter-spaced. Placeholder: "UNDANGAN.ID" (ganti sesuai nama bisnis sebelum launch)
- Right: "Pesan Sekarang" CTA button → `href="https://wa.me/{NEXT_PUBLIC_WA_NUMBER}"` (langsung ke WhatsApp, bukan scroll)
- Sticky on scroll, `border-bottom: 1px solid #f3f4f6`

### 2. Hero Section (full viewport height)
- Small label: "UNDANGAN DIGITAL PERNIKAHAN" (uppercase, letter-spaced, gray)
- Large headline: `font-weight: 200` with one bold word for contrast
  - e.g. "Undangan **Indah**, Kenangan Abadi"
- Thin horizontal divider (2px, 3rem wide)
- Subtitle paragraph: 1–2 sentences describing the product (max 440px wide)
- Two CTAs:
  - Primary: "Lihat Koleksi Tema" → scrolls to #tema
  - Outline: "Cara Pesan" → scrolls to #cara-pesan
- Social proof line: "✦ Sudah dipercaya puluhan pasangan ✦" (small, gray)
- Scroll hint at bottom: "↓ scroll"

### 3. Theme Preview Section (`#tema`)
- Label + title + subtitle
- 3-column card grid (max-width 900px, centered)
- Each card:
  - Top: mini visual preview of the theme (color, typography sample, tag)
  - Bottom: theme name + 3-word descriptor
  - Hover: `translateY(-4px)` lift + soft shadow
- Themes: Elegant Gold & Navy · Floral Soft · Modern Minimalist
- Cards are visual only (not clickable links — no demo page yet)

### 4. Features Section (gray `#f9fafb` background)
- Label + title + subtitle
- 3×2 grid of feature items (max-width 900px)
- Each item: emoji icon + bold title + 1-sentence description
- Features:
  1. Countdown Otomatis
  2. Peta Lokasi Terintegrasi
  3. RSVP Online
  4. Buku Tamu Digital
  5. Galeri Foto
  6. Musik Latar

### 5. How to Order Section (`#cara-pesan`)
- Label + title + subtitle
- 3-column step layout with numbered circles (01, 02, 03)
- Horizontal connector line behind the circles (CSS `::before`)
- Steps:
  1. Hubungi via WhatsApp
  2. Kirim Data & Foto
  3. Undangan Siap Disebarkan

### 6. CTA Section (dark `#111827` background)
- Label + large heading + subtitle
- Single prominent WhatsApp button: `background: #25d366`
- Button text: "💬 Chat WhatsApp Sekarang"
- Links to `https://wa.me/{phone}` — phone number from env variable `NEXT_PUBLIC_WA_NUMBER`

### 7. Footer
- Simple single line: copyright + brand name
- Dark background matching CTA section

---

## Implementation Notes

- New file: `app/page.tsx` — server component, no data fetching needed
- WhatsApp number from `process.env.NEXT_PUBLIC_WA_NUMBER`
  - Add `NEXT_PUBLIC_WA_NUMBER=62XXXXXXXXXX` to `.env.local` (nomor tanpa `+`, contoh: `6281234567890`)
  - Add `NEXT_PUBLIC_WA_NUMBER=` to `.env.example`
- All styles added to `app/globals.css` under a `/* ===== LANDING ===== */` block
- No new dependencies required
- Smooth scroll: add `scroll-behavior: smooth` to `html` in globals.css
- Sections use anchor IDs: `#tema`, `#cara-pesan`
- Brand name "UNDANGAN.ID" adalah placeholder — ganti sebelum launch

---

## Out of Scope

- Demo/preview links on theme cards (no demo page yet)
- Pricing table (business model not yet decided)
- Customer registration/login
- Blog or FAQ section
