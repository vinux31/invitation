# Wedding Invitation Tema 1 "Klasik Elegan" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a cinematic full-screen wedding invitation web app — navy & gold, 9 sections, animated star particles, live countdown, gallery lightbox, dan Formspree RSVP.

**Architecture:** Single-page static HTML/CSS/JS. Setiap 9 section mengisi 100vh. JS dibagi ke modul fokus (particles, countdown, gallery, rsvp, music). Data pernikahan terpusat di `js/config.js` — satu-satunya file yang perlu diisi pasangan. Tidak ada bundler; Jest hanya untuk unit test logika JS.

**Tech Stack:** HTML5 · CSS3 Custom Properties · Vanilla JS ES Modules · Canvas API · HTML5 Audio · Formspree (RSVP) · Google Maps Embed · Jest + jsdom (unit tests)

---

## File Map

```
invitation/
├── index.html                 # Main page — semua 9 sections
├── package.json               # Jest config saja (tidak ada bundler)
├── js/
│   ├── config.js              # Data pernikahan (couple edit file ini)
│   ├── particles.js           # Canvas star particles (Cover)
│   ├── countdown.js           # Timer countdown logic
│   ├── gallery.js             # Lightbox gallery
│   ├── rsvp.js                # Form submit + shimmer success state
│   ├── music.js               # Background audio + mute button
│   └── main.js                # Init semua modul on DOMContentLoaded
├── css/
│   ├── variables.css          # CSS custom properties
│   ├── global.css             # Reset, typography, section base
│   ├── cover.css
│   ├── countdown.css
│   ├── couple.css
│   ├── story.css
│   ├── gallery.css
│   ├── event.css
│   ├── location.css
│   ├── rsvp.css
│   └── closing.css
├── assets/
│   ├── audio/
│   │   └── music.mp3          # Supplied by couple
│   └── images/
│       ├── groom.jpg          # Supplied by couple
│       ├── bride.jpg          # Supplied by couple
│       └── gallery/           # g1.jpg … gN.jpg — supplied by couple
└── tests/
    ├── countdown.test.js
    ├── rsvp.test.js
    └── gallery.test.js
```

---

## Task 1: Project Scaffold + package.json

**Files:**
- Create: `package.json`
- Create: `assets/audio/.gitkeep`
- Create: `assets/images/gallery/.gitkeep`

- [ ] **Step 1: Init package.json**

```bash
cd "C:/Users/Administrator/OneDrive - PT Pertamina (Persero)/Desktop/invitation"
npm init -y
```

- [ ] **Step 2: Install Jest + jsdom**

```bash
npm install --save-dev jest jest-environment-jsdom
```

- [ ] **Step 3: Update package.json — tambah Jest config**

Ganti isi `package.json` dengan:

```json
{
  "name": "wedding-invitation",
  "version": "1.0.0",
  "scripts": {
    "test": "jest"
  },
  "devDependencies": {
    "jest": "^29.0.0",
    "jest-environment-jsdom": "^29.0.0"
  },
  "jest": {
    "testEnvironment": "jsdom",
    "transform": {}
  }
}
```

- [ ] **Step 4: Buat asset placeholder dirs**

```bash
mkdir -p "assets/audio" "assets/images/gallery"
touch "assets/audio/.gitkeep" "assets/images/.gitkeep" "assets/images/gallery/.gitkeep"
```

- [ ] **Step 5: Verify Jest jalan**

```bash
npx jest --listTests
```
Expected: `(no tests found)` — OK, belum ada test file.

- [ ] **Step 6: Commit**

```bash
git init
git add package.json package-lock.json assets/
git commit -m "chore: init project scaffold with Jest"
```

---

## Task 2: CSS Variables + Global Styles

**Files:**
- Create: `css/variables.css`
- Create: `css/global.css`

- [ ] **Step 1: Buat `css/variables.css`**

```css
:root {
  --navy-deep:   #0d0d1f;
  --navy-mid:    #1a1a2e;
  --navy-light:  #0f3460;
  --gold:        #c9a84c;
  --gold-dim:    rgba(201, 168, 76, 0.5);
  --gold-subtle: rgba(201, 168, 76, 0.15);
  --white:       rgba(255, 255, 255, 0.85);
  --white-dim:   rgba(255, 255, 255, 0.4);

  --font-heading: 'Cormorant Garamond', Georgia, serif;
  --font-body:    'Montserrat', Arial, sans-serif;

  --section-pad: clamp(2rem, 5vw, 5rem);
  --transition:  0.4s ease;
}
```

- [ ] **Step 2: Buat `css/global.css`**

```css
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300;1,400&family=Montserrat:wght@300;400&display=swap');
@import './variables.css';

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { scroll-behavior: smooth; }

body {
  background: var(--navy-deep);
  color: var(--white);
  font-family: var(--font-body);
  overflow-x: hidden;
}

section {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--section-pad);
  position: relative;
  overflow: hidden;
}

h1, h2, h3 {
  font-family: var(--font-heading);
  font-weight: 300;
  font-style: italic;
  color: var(--gold);
}

.label {
  font-family: var(--font-body);
  font-size: 0.65rem;
  font-weight: 400;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--gold-dim);
}

.gold-line {
  width: 60px;
  height: 1px;
  background: linear-gradient(to right, transparent, var(--gold), transparent);
  margin: 1rem auto;
}

/* Scroll reveal — elements start invisible, JS adds .visible */
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
```

- [ ] **Step 3: Commit**

```bash
git add css/
git commit -m "style: add CSS variables and global base styles"
```

---

## Task 3: HTML Structure (index.html + config.js skeleton)

**Files:**
- Create: `index.html`
- Create: `js/config.js`

- [ ] **Step 1: Buat `js/config.js`**

```js
// =====================================================
// EDIT FILE INI — isi dengan data pernikahan yang asli
// =====================================================

export const CONFIG = {
  groom: {
    name: 'Nama Lengkap Pria',
    father: 'Nama Ayah Pria',
    mother: 'Nama Ibu Pria',
    photo: 'assets/images/groom.jpg',
  },
  bride: {
    name: 'Nama Lengkap Wanita',
    father: 'Nama Ayah Wanita',
    mother: 'Nama Ibu Wanita',
    photo: 'assets/images/bride.jpg',
  },
  akad: {
    date: '2025-06-12',           // ISO format YYYY-MM-DD
    time: '08:00',
    venue: 'Nama Masjid / Gedung Akad',
    address: 'Jl. Contoh No. 1, Kota',
    mapsEmbed: 'https://maps.google.com/maps?q=...&output=embed',
    mapsLink: 'https://goo.gl/maps/...',
  },
  resepsi: {
    date: '2025-06-12',
    time: '11:00',
    venue: 'Nama Gedung Resepsi',
    address: 'Jl. Contoh No. 2, Kota',
    mapsEmbed: 'https://maps.google.com/maps?q=...&output=embed',
    mapsLink: 'https://goo.gl/maps/...',
  },
  story: [
    { year: '2020', title: 'Pertama Bertemu', desc: 'Cerita singkat bagaimana kalian bertemu.' },
    { year: '2021', title: 'Jadian',           desc: 'Cerita singkat momen jadian.' },
    { year: '2024', title: 'Lamaran',          desc: 'Cerita singkat momen lamaran.' },
  ],
  gallery: [
    'assets/images/gallery/g1.jpg',
    'assets/images/gallery/g2.jpg',
    'assets/images/gallery/g3.jpg',
    'assets/images/gallery/g4.jpg',
    'assets/images/gallery/g5.jpg',
    'assets/images/gallery/g6.jpg',
  ],
  coupleQuote: 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan dari jenismu sendiri.',
  formspreeId: 'GANTI_DENGAN_ID_FORMSPREE',  // e.g. 'xpznqldw'
  musicFile: 'assets/audio/music.mp3',
};
```

- [ ] **Step 2: Buat `index.html`**

```html
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Undangan Pernikahan</title>
  <link rel="stylesheet" href="css/global.css">
  <link rel="stylesheet" href="css/cover.css">
  <link rel="stylesheet" href="css/countdown.css">
  <link rel="stylesheet" href="css/couple.css">
  <link rel="stylesheet" href="css/story.css">
  <link rel="stylesheet" href="css/gallery.css">
  <link rel="stylesheet" href="css/event.css">
  <link rel="stylesheet" href="css/location.css">
  <link rel="stylesheet" href="css/rsvp.css">
  <link rel="stylesheet" href="css/closing.css">
</head>
<body>

  <!-- Section 1: Cover -->
  <section id="cover">
    <canvas id="particles-canvas"></canvas>
    <div class="cover-content reveal">
      <p class="label">Pernikahan</p>
      <h1 id="cover-names"></h1>
      <div class="gold-line"></div>
      <p class="label" id="cover-date"></p>
    </div>
    <div class="scroll-indicator">
      <span class="label">scroll</span>
      <div class="scroll-arrow"></div>
    </div>
  </section>

  <!-- Section 2: Countdown -->
  <section id="countdown">
    <div class="reveal">
      <p class="countdown-tagline">Menghitung hari menuju hari istimewa kami</p>
      <div class="countdown-grid" id="countdown-grid">
        <div class="countdown-box"><span class="countdown-num" id="cd-days">00</span><span class="label">Hari</span></div>
        <div class="countdown-box"><span class="countdown-num" id="cd-hours">00</span><span class="label">Jam</span></div>
        <div class="countdown-box"><span class="countdown-num" id="cd-minutes">00</span><span class="label">Menit</span></div>
        <div class="countdown-box"><span class="countdown-num" id="cd-seconds">00</span><span class="label">Detik</span></div>
      </div>
      <p class="countdown-passed hidden" id="countdown-passed">Hari ini adalah hari istimewa kami ✦</p>
    </div>
  </section>

  <!-- Section 3: Pasangan & Ortu -->
  <section id="couple">
    <div class="couple-grid reveal">
      <div class="person" id="groom-block"></div>
      <div class="couple-sep">✦</div>
      <div class="person" id="bride-block"></div>
    </div>
  </section>

  <!-- Section 4: Cerita Cinta -->
  <section id="story">
    <p class="label" style="margin-bottom:2rem">Perjalanan Cinta Kami</p>
    <div class="timeline" id="timeline"></div>
  </section>

  <!-- Section 5: Galeri -->
  <section id="gallery">
    <p class="label" style="margin-bottom:2rem">Galeri</p>
    <div class="gallery-grid" id="gallery-grid"></div>
    <!-- Lightbox -->
    <div class="lightbox hidden" id="lightbox">
      <button class="lightbox-close" id="lb-close">✕</button>
      <button class="lightbox-prev" id="lb-prev">‹</button>
      <img class="lightbox-img" id="lb-img" src="" alt="">
      <button class="lightbox-next" id="lb-next">›</button>
    </div>
  </section>

  <!-- Section 6: Acara -->
  <section id="event">
    <p class="label" style="margin-bottom:2rem">Rangkaian Acara</p>
    <div class="event-grid">
      <div class="event-card reveal" id="akad-card"></div>
      <div class="event-card reveal" id="resepsi-card"></div>
    </div>
  </section>

  <!-- Section 7: Lokasi -->
  <section id="location">
    <p class="label" style="margin-bottom:1.5rem">Lokasi</p>
    <div class="location-tabs">
      <button class="loc-tab active" data-tab="akad">Akad</button>
      <button class="loc-tab" data-tab="resepsi">Resepsi</button>
    </div>
    <div class="map-wrap" id="map-akad"></div>
    <div class="map-wrap hidden" id="map-resepsi"></div>
    <div class="location-info" id="location-info"></div>
  </section>

  <!-- Section 8: RSVP -->
  <section id="rsvp">
    <p class="label" style="margin-bottom:1.5rem">Konfirmasi Kehadiran</p>
    <form class="rsvp-form reveal" id="rsvp-form">
      <input class="rsvp-input" type="text" name="name" placeholder="Nama Lengkap" required>
      <input class="rsvp-input" type="number" name="guests" min="1" max="5" placeholder="Jumlah Tamu (maks. 5)" required>
      <div class="rsvp-radio-group">
        <label><input type="radio" name="attend" value="hadir" required> Hadir</label>
        <label><input type="radio" name="attend" value="tidak-hadir"> Tidak Hadir</label>
      </div>
      <textarea class="rsvp-input" name="message" placeholder="Ucapan / Doa (opsional)" rows="3"></textarea>
      <button class="rsvp-submit" type="submit">Kirim Konfirmasi</button>
    </form>
    <div class="rsvp-success hidden" id="rsvp-success">
      <canvas id="shimmer-canvas"></canvas>
      <p class="rsvp-thanks">Terima kasih atas doa dan kehadiranmu</p>
    </div>
  </section>

  <!-- Section 9: Ucapan & Doa -->
  <section id="closing">
    <div class="closing-quote reveal">
      <p class="label" style="margin-bottom:1rem">Dengan penuh syukur,</p>
      <blockquote id="closing-verse"></blockquote>
    </div>
    <div class="closing-wishes reveal">
      <p class="label" style="margin-bottom:1rem">Ucapan Tamu</p>
      <div class="wishes-feed" id="wishes-feed">
        <!-- Static placeholder messages — real-time feed via Supabase (fase berikutnya) -->
        <div class="wish-card"><p class="wish-msg">"Semoga menjadi keluarga yang sakinah mawaddah warahmah."</p><p class="wish-name">— Tamu Undangan</p></div>
        <div class="wish-card"><p class="wish-msg">"Barakallahu lakuma wa baraka alaikuma."</p><p class="wish-name">— Tamu Undangan</p></div>
      </div>
    </div>
    <footer class="closing-footer reveal">
      <p id="footer-names"></p>
      <p class="label">♡</p>
    </footer>
  </section>

  <!-- Music player button (fixed) -->
  <button class="music-btn" id="music-btn" title="Musik">♪</button>

  <script type="module" src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 3: Buka di browser, pastikan halaman terbuka tanpa error JS**

```bash
# Buka di browser langsung (Windows)
start index.html
```

Expected: halaman kosong hitam, tidak ada error di console.

- [ ] **Step 4: Commit**

```bash
git add index.html js/config.js
git commit -m "feat: add HTML structure and config skeleton"
```

---

## Task 4: Cover Section — Animated Star Particles

**Files:**
- Create: `js/particles.js`
- Create: `css/cover.css`
- Modify: `js/main.js`

- [ ] **Step 1: Buat `css/cover.css`**

```css
#cover {
  background: radial-gradient(ellipse at center, #1a2a4a 0%, var(--navy-deep) 100%);
  padding: 0;
}

#particles-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.cover-content {
  position: relative;
  z-index: 2;
  text-align: center;
}

.cover-content h1 {
  font-size: clamp(2.5rem, 7vw, 5rem);
  line-height: 1.1;
  margin: 0.5rem 0;
}

.scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  z-index: 2;
}

.scroll-arrow {
  width: 1px;
  height: 40px;
  background: linear-gradient(to bottom, var(--gold-dim), transparent);
  animation: scrollBounce 1.8s ease-in-out infinite;
}

@keyframes scrollBounce {
  0%, 100% { transform: scaleY(1); opacity: 1; }
  50%       { transform: scaleY(0.6); opacity: 0.4; }
}
```

- [ ] **Step 2: Buat `js/particles.js`**

```js
export function initParticles(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const stars = [];

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function createStar() {
    return {
      x:       Math.random() * canvas.width,
      y:       Math.random() * canvas.height,
      radius:  Math.random() * 1.2 + 0.3,
      color:   Math.random() > 0.6 ? '#c9a84c' : 'rgba(255,255,255,0.8)',
      dx:      (Math.random() - 0.5) * 0.15,
      dy:      (Math.random() - 0.5) * 0.15,
      opacity: Math.random() * 0.5 + 0.4,
    };
  }

  function populate(count = 120) {
    stars.length = 0;
    for (let i = 0; i < count; i++) stars.push(createStar());
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const s of stars) {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fillStyle = s.color;
      ctx.globalAlpha = s.opacity;
      ctx.fill();
      ctx.globalAlpha = 1;

      s.x += s.dx;
      s.y += s.dy;

      if (s.x < -2) s.x = canvas.width + 2;
      if (s.x > canvas.width + 2) s.x = -2;
      if (s.y < -2) s.y = canvas.height + 2;
      if (s.y > canvas.height + 2) s.y = -2;
    }
    requestAnimationFrame(draw);
  }

  resize();
  populate();
  draw();
  window.addEventListener('resize', () => { resize(); populate(); });
}
```

- [ ] **Step 3: Buat `js/main.js` (minimal untuk sekarang)**

```js
import { CONFIG } from './config.js';
import { initParticles } from './particles.js';

document.addEventListener('DOMContentLoaded', () => {
  // Cover
  document.getElementById('cover-names').textContent =
    `${CONFIG.groom.name} & ${CONFIG.bride.name}`;
  const akadDate = new Date(CONFIG.akad.date);
  document.getElementById('cover-date').textContent =
    akadDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  initParticles('particles-canvas');

  // Scroll reveal
  const observer = new IntersectionObserver(
    entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')),
    { threshold: 0.15 }
  );
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});
```

- [ ] **Step 4: Buka browser, scroll ke Cover**

```bash
start index.html
```

Expected: bintang bergerak halus di background navy, nama placeholder muncul.

- [ ] **Step 5: Commit**

```bash
git add js/particles.js js/main.js css/cover.css
git commit -m "feat: Cover section with animated star particles"
```

---

## Task 5: Countdown Section (TDD)

**Files:**
- Create: `tests/countdown.test.js`
- Create: `js/countdown.js`
- Create: `css/countdown.css`
- Modify: `js/main.js`

- [ ] **Step 1: Tulis failing test**

`tests/countdown.test.js`:
```js
const { getTimeRemaining } = require('../js/countdown.js');

describe('getTimeRemaining', () => {
  test('returns zeros when target is in the past', () => {
    const past = new Date(Date.now() - 1000);
    const r = getTimeRemaining(past);
    expect(r.passed).toBe(true);
    expect(r.days).toBe(0);
  });

  test('calculates days correctly for future date', () => {
    const future = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000); // 2 hari
    const r = getTimeRemaining(future);
    expect(r.passed).toBe(false);
    expect(r.days).toBe(1); // floor, bukan round
  });

  test('calculates hours within a day', () => {
    const future = new Date(Date.now() + 5 * 60 * 60 * 1000); // 5 jam
    const r = getTimeRemaining(future);
    expect(r.passed).toBe(false);
    expect(r.days).toBe(0);
    expect(r.hours).toBeGreaterThanOrEqual(4);
  });

  test('returns seconds in range 0-59', () => {
    const future = new Date(Date.now() + 90 * 1000); // 90 detik
    const r = getTimeRemaining(future);
    expect(r.seconds).toBeGreaterThanOrEqual(0);
    expect(r.seconds).toBeLessThan(60);
  });
});
```

- [ ] **Step 2: Jalankan test, pastikan GAGAL**

```bash
npx jest tests/countdown.test.js --no-coverage
```

Expected: `Cannot find module '../js/countdown.js'`

- [ ] **Step 3: Buat `js/countdown.js`**

```js
function getTimeRemaining(targetDate) {
  const total = targetDate - Date.now();
  if (total <= 0) return { passed: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    passed:   false,
    days:     Math.floor(total / (1000 * 60 * 60 * 24)),
    hours:    Math.floor((total / (1000 * 60 * 60)) % 24),
    minutes:  Math.floor((total / (1000 * 60)) % 60),
    seconds:  Math.floor((total / 1000) % 60),
  };
}

function pad(n) { return String(n).padStart(2, '0'); }

function initCountdown(targetDateStr) {
  const target = new Date(targetDateStr);
  const grid    = document.getElementById('countdown-grid');
  const passed  = document.getElementById('countdown-passed');

  function tick() {
    const r = getTimeRemaining(target);
    if (r.passed) {
      grid.classList.add('hidden');
      passed.classList.remove('hidden');
      return;
    }
    document.getElementById('cd-days').textContent    = pad(r.days);
    document.getElementById('cd-hours').textContent   = pad(r.hours);
    document.getElementById('cd-minutes').textContent = pad(r.minutes);
    document.getElementById('cd-seconds').textContent = pad(r.seconds);
    setTimeout(tick, 1000);
  }
  tick();
}

module.exports = { getTimeRemaining, initCountdown };
```

- [ ] **Step 4: Jalankan test, pastikan LULUS**

```bash
npx jest tests/countdown.test.js --no-coverage
```

Expected: `4 passed`

- [ ] **Step 5: Buat `css/countdown.css`**

```css
#countdown {
  background: var(--navy-mid);
}

.countdown-tagline {
  font-family: var(--font-heading);
  font-style: italic;
  font-size: clamp(1.1rem, 2.5vw, 1.6rem);
  color: var(--gold-dim);
  text-align: center;
  margin-bottom: 2.5rem;
}

.countdown-grid {
  display: flex;
  gap: clamp(1rem, 3vw, 2.5rem);
  justify-content: center;
}

.countdown-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid var(--gold-dim);
  padding: 1.25rem 1.5rem;
  min-width: 80px;
}

.countdown-num {
  font-family: var(--font-heading);
  font-size: clamp(2.5rem, 6vw, 4rem);
  color: var(--gold);
  line-height: 1;
}

.countdown-passed {
  font-family: var(--font-heading);
  font-style: italic;
  font-size: clamp(1.3rem, 3vw, 2rem);
  color: var(--gold);
  text-align: center;
}

.hidden { display: none !important; }
```

- [ ] **Step 6: Tambah countdown init ke `js/main.js`**

Tambahkan import dan call di dalam `DOMContentLoaded`:

```js
// di bagian atas tambah:
import { initCountdown } from './countdown.js';

// di dalam DOMContentLoaded tambah:
initCountdown(CONFIG.akad.date);
```

Catatan: `countdown.js` menggunakan `module.exports` untuk Jest. Untuk browser, ubah baris terakhir menjadi `export { getTimeRemaining, initCountdown };` dan hapus `module.exports`. Gunakan dua baris ini di file (Jest akan menggunakan `module.exports`, browser akan skip-nya karena `export` sudah mendefinisikan binding):

```js
// Di bagian BAWAH countdown.js, ganti module.exports dengan:
export { getTimeRemaining, initCountdown };
// Hapus baris module.exports = {...}
```

Lalu update test untuk menggunakan ES import:
```js
// tests/countdown.test.js — ganti require dengan:
const { getTimeRemaining } = require('../js/countdown.js');
// Tetap pakai require di test (Jest env = CommonJS by default)
// Tambah di countdown.js SETELAH export:
if (typeof module !== 'undefined') module.exports = { getTimeRemaining, initCountdown };
```

- [ ] **Step 7: Jalankan test ulang, pastikan masih lulus**

```bash
npx jest tests/countdown.test.js --no-coverage
```

Expected: `4 passed`

- [ ] **Step 8: Commit**

```bash
git add js/countdown.js js/main.js css/countdown.css tests/countdown.test.js
git commit -m "feat: Countdown section with TDD timer logic"
```

---

## Task 6: Pasangan & Ortu Section

**Files:**
- Create: `css/couple.css`
- Modify: `js/main.js`

- [ ] **Step 1: Buat `css/couple.css`**

```css
#couple {
  background: radial-gradient(ellipse at center, #12122a 0%, var(--navy-deep) 70%);
}

.couple-grid {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 2rem;
  align-items: center;
  max-width: 800px;
  width: 100%;
}

.person {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
}

.person-photo {
  width: clamp(120px, 20vw, 180px);
  height: clamp(120px, 20vw, 180px);
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--gold-dim);
}

.person-name {
  font-family: var(--font-heading);
  font-size: clamp(1.3rem, 3vw, 1.8rem);
  color: var(--gold);
}

.person-parents {
  font-size: 0.75rem;
  color: var(--white-dim);
  line-height: 1.8;
  letter-spacing: 0.05em;
}

.couple-sep {
  font-size: 1.5rem;
  color: var(--gold-dim);
  align-self: center;
}

@media (max-width: 600px) {
  .couple-grid {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
    text-align: center;
  }
  .couple-sep { transform: rotate(90deg); }
}
```

- [ ] **Step 2: Tambah couple render ke `js/main.js`**

Di dalam `DOMContentLoaded`, tambah:

```js
function renderPerson(blockId, person) {
  const block = document.getElementById(blockId);
  block.innerHTML = `
    <img class="person-photo" src="${person.photo}" alt="${person.name}">
    <p class="person-name">${person.name}</p>
    <p class="person-parents label">
      Putra/Putri dari<br>
      Bapak ${person.father}<br>
      &amp; Ibu ${person.mother}
    </p>
  `;
}
renderPerson('groom-block', CONFIG.groom);
renderPerson('bride-block', CONFIG.bride);
```

- [ ] **Step 3: Buka browser, verifikasi Section 3 tampil**

Expected: dua kolom foto (placeholder karena gambar belum ada) dengan nama dan orang tua.

- [ ] **Step 4: Commit**

```bash
git add css/couple.css js/main.js
git commit -m "feat: Pasangan & Ortu section"
```

---

## Task 7: Cerita Cinta (Timeline) Section

**Files:**
- Create: `css/story.css`
- Modify: `js/main.js`

- [ ] **Step 1: Buat `css/story.css`**

```css
#story {
  background: #0a0a1a;
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: 0;
  max-width: 500px;
  width: 100%;
  position: relative;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 1px;
  background: repeating-linear-gradient(
    to bottom,
    var(--gold-dim) 0px,
    var(--gold-dim) 6px,
    transparent 6px,
    transparent 12px
  );
  transform: translateX(-50%);
}

.timeline-item {
  display: grid;
  grid-template-columns: 1fr 2rem 1fr;
  align-items: start;
  gap: 1rem;
  padding: 1.5rem 0;
}

.timeline-item:nth-child(odd) .timeline-year  { text-align: right; }
.timeline-item:nth-child(odd) .timeline-body  { grid-column: 3; text-align: left; }
.timeline-item:nth-child(odd) .timeline-year  { grid-column: 1; }
.timeline-item:nth-child(odd) .timeline-dot   { grid-column: 2; }

.timeline-item:nth-child(even) .timeline-body { grid-column: 1; text-align: right; }
.timeline-item:nth-child(even) .timeline-year { grid-column: 3; }
.timeline-item:nth-child(even) .timeline-dot  { grid-column: 2; grid-row: 1; }

.timeline-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--gold);
  margin: 4px auto 0;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

.timeline-year {
  font-family: var(--font-body);
  font-size: 0.7rem;
  letter-spacing: 0.3em;
  color: var(--gold);
  text-transform: uppercase;
  padding-top: 2px;
}

.timeline-title {
  font-family: var(--font-heading);
  font-size: 1.3rem;
  color: var(--gold);
  margin-bottom: 0.3rem;
}

.timeline-desc {
  font-size: 0.8rem;
  color: var(--white-dim);
  line-height: 1.7;
}

@media (max-width: 600px) {
  .timeline::before { left: 1rem; }
  .timeline-item {
    grid-template-columns: 2rem 1fr;
    grid-template-rows: auto auto;
  }
  .timeline-item:nth-child(odd) .timeline-year,
  .timeline-item:nth-child(even) .timeline-year { grid-column: 2; text-align: left; }
  .timeline-item:nth-child(odd) .timeline-body,
  .timeline-item:nth-child(even) .timeline-body { grid-column: 2; text-align: left; }
  .timeline-item:nth-child(odd) .timeline-dot,
  .timeline-item:nth-child(even) .timeline-dot  { grid-column: 1; grid-row: 1; }
}
```

- [ ] **Step 2: Tambah timeline render ke `js/main.js`**

```js
const timeline = document.getElementById('timeline');
CONFIG.story.forEach(item => {
  const el = document.createElement('div');
  el.className = 'timeline-item reveal';
  el.innerHTML = `
    <p class="timeline-year">${item.year}</p>
    <div class="timeline-dot"></div>
    <div class="timeline-body">
      <p class="timeline-title">${item.title}</p>
      <p class="timeline-desc">${item.desc}</p>
    </div>
  `;
  timeline.appendChild(el);
  observer.observe(el);
});
```

Catatan: pindahkan inisialisasi `observer` ke atas fungsi sebelum dipakai di tasks sebelumnya.

- [ ] **Step 3: Commit**

```bash
git add css/story.css js/main.js
git commit -m "feat: Cerita Cinta timeline section"
```

---

## Task 8: Galeri Section + Lightbox (TDD)

**Files:**
- Create: `tests/gallery.test.js`
- Create: `js/gallery.js`
- Create: `css/gallery.css`
- Modify: `js/main.js`

- [ ] **Step 1: Tulis failing test**

`tests/gallery.test.js`:
```js
const { createGalleryState } = require('../js/gallery.js');

describe('Gallery state', () => {
  const photos = ['a.jpg', 'b.jpg', 'c.jpg'];
  let state;
  beforeEach(() => { state = createGalleryState(photos); });

  test('opens lightbox at correct index', () => {
    state.open(1);
    expect(state.isOpen()).toBe(true);
    expect(state.current()).toBe(1);
  });

  test('next() wraps around to 0 from last', () => {
    state.open(2);
    state.next();
    expect(state.current()).toBe(0);
  });

  test('prev() wraps around to last from 0', () => {
    state.open(0);
    state.prev();
    expect(state.current()).toBe(2);
  });

  test('close() marks lightbox as closed', () => {
    state.open(0);
    state.close();
    expect(state.isOpen()).toBe(false);
  });

  test('currentPhoto() returns correct path', () => {
    state.open(1);
    expect(state.currentPhoto()).toBe('b.jpg');
  });
});
```

- [ ] **Step 2: Jalankan test, pastikan GAGAL**

```bash
npx jest tests/gallery.test.js --no-coverage
```

Expected: `Cannot find module '../js/gallery.js'`

- [ ] **Step 3: Buat `js/gallery.js`**

```js
function createGalleryState(photos) {
  let idx = 0;
  let open = false;
  return {
    open:         (i) => { idx = i; open = true; },
    close:        ()  => { open = false; },
    next:         ()  => { idx = (idx + 1) % photos.length; },
    prev:         ()  => { idx = (idx - 1 + photos.length) % photos.length; },
    isOpen:       ()  => open,
    current:      ()  => idx,
    currentPhoto: ()  => photos[idx],
  };
}

function initGallery(photos) {
  const grid    = document.getElementById('gallery-grid');
  const lightbox = document.getElementById('lightbox');
  const lbImg   = document.getElementById('lb-img');
  const state   = createGalleryState(photos);

  function render() {
    if (state.isOpen()) {
      lbImg.src = state.currentPhoto();
      lightbox.classList.remove('hidden');
    } else {
      lightbox.classList.add('hidden');
    }
  }

  photos.forEach((src, i) => {
    const img = document.createElement('img');
    img.src = src;
    img.className = 'gallery-item';
    img.alt = `Foto ${i + 1}`;
    img.addEventListener('click', () => { state.open(i); render(); });
    grid.appendChild(img);
  });

  document.getElementById('lb-close').addEventListener('click', () => { state.close(); render(); });
  document.getElementById('lb-prev').addEventListener('click',  () => { state.prev(); render(); });
  document.getElementById('lb-next').addEventListener('click',  () => { state.next(); render(); });
  document.addEventListener('keydown', e => {
    if (!state.isOpen()) return;
    if (e.key === 'ArrowRight') { state.next(); render(); }
    if (e.key === 'ArrowLeft')  { state.prev(); render(); }
    if (e.key === 'Escape')     { state.close(); render(); }
  });
}

if (typeof module !== 'undefined') module.exports = { createGalleryState, initGallery };
export { createGalleryState, initGallery };
```

- [ ] **Step 4: Jalankan test, pastikan LULUS**

```bash
npx jest tests/gallery.test.js --no-coverage
```

Expected: `5 passed`

- [ ] **Step 5: Buat `css/gallery.css`**

```css
#gallery { background: var(--navy-mid); }

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  max-width: 900px;
  width: 100%;
}

.gallery-item {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  cursor: pointer;
  filter: brightness(0.85);
  transition: filter var(--transition), transform var(--transition);
}

.gallery-item:hover {
  filter: brightness(1);
  transform: scale(1.02);
}

.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.lightbox-img {
  max-width: 85vw;
  max-height: 85vh;
  object-fit: contain;
  border: 1px solid var(--gold-dim);
}

.lightbox-close,
.lightbox-prev,
.lightbox-next {
  position: absolute;
  background: none;
  border: 1px solid var(--gold-dim);
  color: var(--gold);
  font-size: 1.5rem;
  cursor: pointer;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background var(--transition);
}

.lightbox-close { top: 1rem; right: 1rem; }
.lightbox-prev  { left: 1rem; top: 50%; transform: translateY(-50%); }
.lightbox-next  { right: 1rem; top: 50%; transform: translateY(-50%); }

.lightbox-close:hover,
.lightbox-prev:hover,
.lightbox-next:hover { background: var(--gold-subtle); }

@media (max-width: 600px) {
  .gallery-grid { grid-template-columns: repeat(2, 1fr); }
}
```

- [ ] **Step 6: Tambah gallery init ke `js/main.js`**

```js
import { initGallery } from './gallery.js';
// di dalam DOMContentLoaded:
initGallery(CONFIG.gallery);
```

- [ ] **Step 7: Commit**

```bash
git add js/gallery.js css/gallery.css tests/gallery.test.js js/main.js
git commit -m "feat: Gallery section with lightbox (TDD)"
```

---

## Task 9: Acara Section

**Files:**
- Create: `css/event.css`
- Modify: `js/main.js`

- [ ] **Step 1: Buat `css/event.css`**

```css
#event {
  background: var(--navy-deep);
  position: relative;
}

#event::before,
#event::after {
  content: '';
  position: absolute;
  width: 40px;
  height: 40px;
  border-color: var(--gold-subtle);
  border-style: solid;
}
#event::before { top: 2rem; left: 2rem; border-width: 1px 0 0 1px; }
#event::after  { bottom: 2rem; right: 2rem; border-width: 0 1px 1px 0; }

.event-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  max-width: 700px;
  width: 100%;
}

.event-card {
  border: 1px solid var(--gold-dim);
  padding: 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.event-icon { font-size: 1.8rem; }

.event-type {
  font-family: var(--font-body);
  font-size: 0.65rem;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--gold-dim);
}

.event-title {
  font-family: var(--font-heading);
  font-size: 1.6rem;
  color: var(--gold);
}

.event-detail {
  font-size: 0.8rem;
  color: var(--white-dim);
  line-height: 2;
}

.event-cal-btn {
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid var(--gold-dim);
  background: none;
  color: var(--gold);
  font-family: var(--font-body);
  font-size: 0.65rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  cursor: pointer;
  text-decoration: none;
  transition: background var(--transition);
}

.event-cal-btn:hover { background: var(--gold-subtle); }

@media (max-width: 600px) {
  .event-grid { grid-template-columns: 1fr; }
}
```

- [ ] **Step 2: Tambah event render ke `js/main.js`**

```js
function makeCalendarLink(dateStr, timeStr, title, location) {
  const dt = new Date(`${dateStr}T${timeStr}:00`);
  const fmt = d => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const end = new Date(dt.getTime() + 2 * 60 * 60 * 1000);
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${fmt(dt)}/${fmt(end)}&location=${encodeURIComponent(location)}`;
}

function renderEventCard(cardId, icon, label, data) {
  const card = document.getElementById(cardId);
  card.innerHTML = `
    <div class="event-icon">${icon}</div>
    <p class="event-type">${label}</p>
    <p class="event-title">${data.venue}</p>
    <div class="event-detail">
      ${new Date(data.date).toLocaleDateString('id-ID', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}<br>
      Pukul ${data.time} WIB<br>
      ${data.address}
    </div>
    <a class="event-cal-btn" href="${makeCalendarLink(data.date, data.time, label + ' ' + CONFIG.groom.name.split(' ')[0] + ' & ' + CONFIG.bride.name.split(' ')[0], data.venue)}" target="_blank">
      + Simpan ke Kalender
    </a>
  `;
}

renderEventCard('akad-card',    '◈', 'Akad Nikah', CONFIG.akad);
renderEventCard('resepsi-card', '❋', 'Resepsi',    CONFIG.resepsi);
```

- [ ] **Step 3: Commit**

```bash
git add css/event.css js/main.js
git commit -m "feat: Acara section with calendar links"
```

---

## Task 10: Lokasi Section

**Files:**
- Create: `css/location.css`
- Modify: `js/main.js`

- [ ] **Step 1: Buat `css/location.css`**

```css
#location { background: var(--navy-mid); gap: 1.5rem; }

.location-tabs {
  display: flex;
  gap: 1rem;
}

.loc-tab {
  background: none;
  border: 1px solid var(--gold-dim);
  color: var(--gold-dim);
  padding: 0.5rem 1.5rem;
  font-family: var(--font-body);
  font-size: 0.65rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all var(--transition);
}

.loc-tab.active,
.loc-tab:hover {
  background: var(--gold-subtle);
  color: var(--gold);
  border-color: var(--gold);
}

.map-wrap {
  width: 100%;
  max-width: 700px;
  height: 300px;
  border: 1px solid var(--gold-dim);
}

.map-wrap iframe {
  width: 100%;
  height: 100%;
  border: none;
  filter: grayscale(30%) invert(10%);
}

.location-info {
  text-align: center;
  font-size: 0.8rem;
  color: var(--white-dim);
  line-height: 2;
  max-width: 500px;
}

.location-maps-btn {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.6rem 1.5rem;
  border: 1px solid var(--gold);
  color: var(--gold);
  text-decoration: none;
  font-family: var(--font-body);
  font-size: 0.65rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  transition: background var(--transition);
}

.location-maps-btn:hover { background: var(--gold-subtle); }
```

- [ ] **Step 2: Tambah location init ke `js/main.js`**

```js
// Inject maps iframes
document.getElementById('map-akad').innerHTML =
  `<iframe src="${CONFIG.akad.mapsEmbed}" allowfullscreen loading="lazy"></iframe>`;
document.getElementById('map-resepsi').innerHTML =
  `<iframe src="${CONFIG.resepsi.mapsEmbed}" allowfullscreen loading="lazy"></iframe>`;

// Tab switching
const tabs = document.querySelectorAll('.loc-tab');
const info = document.getElementById('location-info');

function showTab(tab) {
  const isAkad = tab === 'akad';
  document.getElementById('map-akad').classList.toggle('hidden', !isAkad);
  document.getElementById('map-resepsi').classList.toggle('hidden', isAkad);
  const cfg = isAkad ? CONFIG.akad : CONFIG.resepsi;
  info.innerHTML = `
    ${cfg.venue}<br>${cfg.address}<br>
    <a class="location-maps-btn" href="${cfg.mapsLink}" target="_blank">Buka di Google Maps ↗</a>
  `;
  tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
}

tabs.forEach(t => t.addEventListener('click', () => showTab(t.dataset.tab)));
showTab('akad'); // default
```

- [ ] **Step 3: Commit**

```bash
git add css/location.css js/main.js
git commit -m "feat: Lokasi section with tabbed Maps embed"
```

---

## Task 11: RSVP Section (TDD)

**Files:**
- Create: `tests/rsvp.test.js`
- Create: `js/rsvp.js`
- Create: `css/rsvp.css`
- Modify: `js/main.js`

- [ ] **Step 1: Tulis failing test**

`tests/rsvp.test.js`:
```js
const { validateRsvp } = require('../js/rsvp.js');

describe('validateRsvp', () => {
  test('valid form data passes', () => {
    const result = validateRsvp({ name: 'Budi', guests: 2, attend: 'hadir', message: '' });
    expect(result.valid).toBe(true);
  });

  test('empty name fails', () => {
    const result = validateRsvp({ name: '', guests: 1, attend: 'hadir', message: '' });
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/nama/i);
  });

  test('guests > 5 fails', () => {
    const result = validateRsvp({ name: 'Ani', guests: 6, attend: 'hadir', message: '' });
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/tamu/i);
  });

  test('guests < 1 fails', () => {
    const result = validateRsvp({ name: 'Ani', guests: 0, attend: 'hadir', message: '' });
    expect(result.valid).toBe(false);
  });

  test('missing attend fails', () => {
    const result = validateRsvp({ name: 'Ani', guests: 1, attend: '', message: '' });
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/kehadiran/i);
  });
});
```

- [ ] **Step 2: Jalankan test, pastikan GAGAL**

```bash
npx jest tests/rsvp.test.js --no-coverage
```

Expected: `Cannot find module '../js/rsvp.js'`

- [ ] **Step 3: Buat `js/rsvp.js`**

```js
function validateRsvp({ name, guests, attend }) {
  if (!name || name.trim().length === 0)
    return { valid: false, error: 'Nama tidak boleh kosong.' };
  if (!guests || guests < 1 || guests > 5)
    return { valid: false, error: 'Jumlah tamu harus antara 1–5.' };
  if (!attend)
    return { valid: false, error: 'Konfirmasi kehadiran harus dipilih.' };
  return { valid: true };
}

function initShimmer(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  const particles = Array.from({ length: 60 }, () => ({
    x: Math.random() * canvas.width,
    y: canvas.height + Math.random() * 20,
    vy: -(Math.random() * 1.5 + 0.5),
    radius: Math.random() * 2 + 0.5,
    opacity: Math.random() * 0.6 + 0.3,
  }));

  let frame;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#c9a84c';
      ctx.globalAlpha = p.opacity;
      ctx.fill();
      ctx.globalAlpha = 1;
      p.y += p.vy;
      if (p.y < -4) p.y = canvas.height + 4;
    }
    frame = requestAnimationFrame(draw);
  }
  draw();
  return () => cancelAnimationFrame(frame);
}

function initRsvp(formspreeId) {
  const form    = document.getElementById('rsvp-form');
  const success = document.getElementById('rsvp-success');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
      name:    form.name.value,
      guests:  Number(form.guests.value),
      attend:  form.attend.value,
      message: form.message.value,
    };
    const v = validateRsvp(data);
    if (!v.valid) { alert(v.error); return; }

    try {
      const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Submit gagal');
      form.classList.add('hidden');
      success.classList.remove('hidden');
      initShimmer('shimmer-canvas');
    } catch {
      alert('Gagal mengirim. Coba lagi.');
    }
  });
}

if (typeof module !== 'undefined') module.exports = { validateRsvp, initRsvp, initShimmer };
export { validateRsvp, initRsvp, initShimmer };
```

- [ ] **Step 4: Jalankan test, pastikan LULUS**

```bash
npx jest tests/rsvp.test.js --no-coverage
```

Expected: `5 passed`

- [ ] **Step 5: Buat `css/rsvp.css`**

```css
#rsvp { background: #0a0a1a; }

.rsvp-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 480px;
  border: 1px solid var(--gold-dim);
  padding: 2.5rem;
}

.rsvp-input {
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--gold-dim);
  color: var(--white);
  font-family: var(--font-body);
  font-size: 0.85rem;
  padding: 0.6rem 0;
  outline: none;
  transition: border-color var(--transition);
  resize: none;
}

.rsvp-input::placeholder { color: var(--white-dim); }
.rsvp-input:focus { border-bottom-color: var(--gold); }

.rsvp-radio-group {
  display: flex;
  gap: 2rem;
}

.rsvp-radio-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: var(--white-dim);
  cursor: pointer;
}

.rsvp-radio-group input[type="radio"] { accent-color: var(--gold); }

.rsvp-submit {
  background: var(--gold);
  color: var(--navy-deep);
  border: none;
  padding: 0.85rem;
  font-family: var(--font-body);
  font-size: 0.7rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  cursor: pointer;
  transition: opacity var(--transition);
  margin-top: 0.5rem;
}

.rsvp-submit:hover { opacity: 0.85; }

.rsvp-success {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

#shimmer-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.rsvp-thanks {
  font-family: var(--font-heading);
  font-style: italic;
  font-size: clamp(1.3rem, 3vw, 2rem);
  color: var(--gold);
  text-align: center;
  position: relative;
  z-index: 1;
}
```

- [ ] **Step 6: Tambah RSVP init ke `js/main.js`**

```js
import { initRsvp } from './rsvp.js';
// di dalam DOMContentLoaded:
initRsvp(CONFIG.formspreeId);
```

- [ ] **Step 7: Commit**

```bash
git add js/rsvp.js css/rsvp.css tests/rsvp.test.js js/main.js
git commit -m "feat: RSVP section with Formspree and shimmer success (TDD)"
```

---

## Task 12: Ucapan & Doa Section (Closing)

**Files:**
- Create: `css/closing.css`
- Modify: `js/main.js`

- [ ] **Step 1: Buat `css/closing.css`**

```css
#closing {
  background: radial-gradient(ellipse at center, #0a0a1a 0%, #050510 100%);
  gap: 3rem;
}

.closing-quote {
  text-align: center;
  max-width: 600px;
}

.closing-quote blockquote {
  font-family: var(--font-heading);
  font-style: italic;
  font-size: clamp(1.1rem, 2.5vw, 1.5rem);
  color: var(--gold);
  line-height: 1.8;
  border: none;
}

.wishes-feed {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  max-width: 800px;
  scrollbar-width: thin;
  scrollbar-color: var(--gold-dim) transparent;
}

.wish-card {
  flex-shrink: 0;
  width: 220px;
  border: 1px solid var(--gold-dim);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.wish-msg {
  font-family: var(--font-heading);
  font-style: italic;
  font-size: 0.95rem;
  color: var(--white);
  line-height: 1.6;
}

.wish-name {
  font-size: 0.65rem;
  letter-spacing: 0.2em;
  color: var(--gold-dim);
  text-transform: uppercase;
}

.closing-footer {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.closing-footer p {
  font-family: var(--font-heading);
  font-style: italic;
  font-size: 1.2rem;
  color: var(--gold-dim);
}
```

- [ ] **Step 2: Tambah closing render ke `js/main.js`**

```js
document.getElementById('closing-verse').textContent = `"${CONFIG.coupleQuote}"`;
document.getElementById('footer-names').textContent =
  `${CONFIG.groom.name} & ${CONFIG.bride.name}`;
```

- [ ] **Step 3: Commit**

```bash
git add css/closing.css js/main.js
git commit -m "feat: Ucapan & Doa closing section"
```

---

## Task 13: Background Music Player

**Files:**
- Create: `js/music.js`
- Create: `css/music.css` (satu rule, langsung ke global.css)
- Modify: `js/main.js`

- [ ] **Step 1: Tambah music button style ke `css/global.css`**

Append ke bawah `css/global.css`:

```css
/* Music button */
.music-btn {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid var(--gold-dim);
  background: rgba(13, 13, 31, 0.8);
  color: var(--gold);
  font-size: 1.1rem;
  cursor: pointer;
  z-index: 500;
  backdrop-filter: blur(4px);
  transition: border-color var(--transition), color var(--transition);
}

.music-btn.muted { color: var(--white-dim); border-color: var(--white-dim); }
```

- [ ] **Step 2: Buat `js/music.js`**

```js
export function initMusic(musicFile) {
  const btn   = document.getElementById('music-btn');
  const audio = new Audio(musicFile);
  audio.loop   = true;
  audio.volume = 0.4;
  let started  = false;

  function start() {
    if (started) return;
    audio.play().catch(() => {}); // browser silently blocks until interaction
    started = true;
  }

  // Autoplay after first user interaction
  document.addEventListener('click', start, { once: true });
  document.addEventListener('touchstart', start, { once: true });

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    start();
    audio.muted = !audio.muted;
    btn.classList.toggle('muted', audio.muted);
    btn.textContent = audio.muted ? '♪' : '♪';
    btn.title = audio.muted ? 'Nyalakan musik' : 'Matikan musik';
  });
}
```

- [ ] **Step 3: Tambah music init ke `js/main.js`**

```js
import { initMusic } from './music.js';
// di dalam DOMContentLoaded:
initMusic(CONFIG.musicFile);
```

- [ ] **Step 4: Commit**

```bash
git add js/music.js js/main.js css/global.css
git commit -m "feat: background music player with mute button"
```

---

## Task 14: Mobile Responsiveness + Final Audit

**Files:**
- Modify: `css/global.css`

- [ ] **Step 1: Jalankan semua test — pastikan semua lulus**

```bash
npx jest --no-coverage
```

Expected: semua test `passed`, tidak ada fail.

- [ ] **Step 2: Buka di browser, resize ke 375px (iPhone)**

Buka DevTools → Toggle Device Toolbar → iPhone SE (375×667).

Cek tiap section:
- Cover: teks tidak overflow
- Countdown: 4 kotak muat dalam satu baris
- Couple: foto dan nama ter-stack vertikal
- Timeline: layout mobile single-column
- Gallery: 2-kolom
- Event: card ter-stack vertikal
- Location: tabs dan map muat
- RSVP: form muat dengan padding cukup
- Closing: wishes card bisa di-scroll horizontal

- [ ] **Step 3: Tambah media query tambahan ke `css/global.css` jika ada overflow**

```css
@media (max-width: 400px) {
  .countdown-grid { gap: 0.5rem; }
  .countdown-box  { padding: 0.75rem; min-width: 60px; }
  .countdown-num  { font-size: 2rem; }
}
```

- [ ] **Step 4: Test final — semua section lulus visual check**

Scroll dari atas ke bawah, verifikasi:
- Bintang bergerak di Cover ✓
- Countdown menghitung mundur ✓
- Foto placeholder muncul (broken img OK — foto belum disuplai) ✓
- Timeline render dari config ✓
- Gallery grid muncul ✓
- Event cards render ✓
- Maps tab switching kerja ✓
- RSVP form submit (set `formspreeId` ke ID asli dari formspree.io) ✓
- Music button ada di pojok ✓

- [ ] **Step 5: Commit final**

```bash
git add -A
git commit -m "feat: mobile responsiveness and final integration"
```

---

## Checklist Sebelum Launch

Setelah implementasi selesai, pasangan perlu:

- [ ] Edit `js/config.js` dengan semua data asli
- [ ] Upload foto ke `assets/images/` (groom.jpg, bride.jpg, gallery/g1.jpg…)
- [ ] Upload musik ke `assets/audio/music.mp3`
- [ ] Daftar di [formspree.io](https://formspree.io), buat form, isi `formspreeId` di config
- [ ] Isi `mapsEmbed` dan `mapsLink` dari Google Maps (Share → Embed a map)
- [ ] Deploy ke hosting (Netlify drag-drop, Vercel, atau GitHub Pages)

---

## Self-Review

| Spec requirement | Task |
|---|---|
| Navy + gold palette | Task 2 (CSS variables) |
| Cormorant + Montserrat | Task 2 (global.css import) |
| Cinematic 100vh sections | Task 2 (section rule) |
| Animated star particles (Cover) | Task 4 |
| Countdown dengan post-wedding state | Task 5 |
| Pasangan & Ortu dua kolom | Task 6 |
| Timeline cerita cinta | Task 7 |
| Gallery + lightbox | Task 8 |
| Acara dua card + Google Calendar | Task 9 |
| Lokasi tabbed Maps | Task 10 |
| RSVP + Formspree + shimmer | Task 11 |
| Ucapan & Doa + static feed | Task 12 |
| Background music + mute | Task 13 |
| Mobile responsive | Task 14 |
| Scroll reveal (.reveal + IntersectionObserver) | Task 3 + 4 (main.js) |
