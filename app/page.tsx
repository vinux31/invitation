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
