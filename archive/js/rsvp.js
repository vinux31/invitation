export function validateRsvp({ name, guests, attend }) {
  if (!name || name.trim().length === 0)
    return { valid: false, error: 'Nama tidak boleh kosong.' };
  if (!guests || guests < 1 || guests > 5)
    return { valid: false, error: 'Jumlah tamu harus antara 1–5.' };
  if (!attend)
    return { valid: false, error: 'Konfirmasi kehadiran harus dipilih.' };
  return { valid: true };
}

export function initShimmer(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  const particles = Array.from({ length: 60 }, () => ({
    x:       Math.random() * canvas.width,
    y:       canvas.height + Math.random() * 20,
    vy:      -(Math.random() * 1.5 + 0.5),
    radius:  Math.random() * 2 + 0.5,
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

export function initRsvp(formspreeId) {
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
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body:    JSON.stringify(data),
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
