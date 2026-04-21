import { CONFIG } from './config.js';
import { initParticles } from './particles.js';
import { initCountdown } from './countdown.js';
import { initGallery } from './gallery.js';
import { initRsvp } from './rsvp.js';
import { initMusic } from './music.js';

document.addEventListener('DOMContentLoaded', () => {
  // Scroll reveal observer
  const observer = new IntersectionObserver(
    entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')),
    { threshold: 0.15 }
  );
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Cover
  document.getElementById('cover-names').textContent =
    `${CONFIG.groom.name} & ${CONFIG.bride.name}`;
  const akadDate = new Date(CONFIG.akad.date);
  document.getElementById('cover-date').textContent =
    akadDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  initParticles('particles-canvas');

  // Countdown
  initCountdown(CONFIG.akad.date);

  // Pasangan & Ortu
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

  // Cerita Cinta timeline
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

  // Galeri + Lightbox
  initGallery(CONFIG.gallery);

  // Acara
  function makeCalendarLink(dateStr, timeStr, title, location) {
    const dt  = new Date(`${dateStr}T${timeStr}:00`);
    const fmt = d => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const end = new Date(dt.getTime() + 2 * 60 * 60 * 1000);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${fmt(dt)}/${fmt(end)}&location=${encodeURIComponent(location)}`;
  }
  function renderEventCard(cardId, icon, label, data) {
    const card = document.getElementById(cardId);
    const g = CONFIG.groom.name.split(' ')[0];
    const b = CONFIG.bride.name.split(' ')[0];
    card.innerHTML = `
      <div class="event-icon">${icon}</div>
      <p class="event-type">${label}</p>
      <p class="event-title">${data.venue}</p>
      <div class="event-detail">
        ${new Date(data.date).toLocaleDateString('id-ID', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}<br>
        Pukul ${data.time} WIB<br>
        ${data.address}
      </div>
      <a class="event-cal-btn" href="${makeCalendarLink(data.date, data.time, label + ' ' + g + ' & ' + b, data.venue)}" target="_blank">
        + Simpan ke Kalender
      </a>
    `;
  }
  renderEventCard('akad-card',    '◈', 'Akad Nikah', CONFIG.akad);
  renderEventCard('resepsi-card', '❋', 'Resepsi',    CONFIG.resepsi);

  // Lokasi
  document.getElementById('map-akad').innerHTML =
    `<iframe src="${CONFIG.akad.mapsEmbed}" allowfullscreen loading="lazy"></iframe>`;
  document.getElementById('map-resepsi').innerHTML =
    `<iframe src="${CONFIG.resepsi.mapsEmbed}" allowfullscreen loading="lazy"></iframe>`;

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
  showTab('akad');

  // RSVP
  initRsvp(CONFIG.formspreeId);

  // Ucapan & Doa
  document.getElementById('closing-verse').textContent = `"${CONFIG.coupleQuote}"`;
  document.getElementById('footer-names').textContent =
    `${CONFIG.groom.name} & ${CONFIG.bride.name}`;

  // Music
  initMusic(CONFIG.musicFile);
});
