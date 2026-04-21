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
