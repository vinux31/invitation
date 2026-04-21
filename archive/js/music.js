export function initMusic(musicFile) {
  const btn   = document.getElementById('music-btn');
  const audio = new Audio(musicFile);
  audio.loop   = true;
  audio.volume = 0.4;
  let started  = false;

  function start() {
    if (started) return;
    audio.play().catch(() => {});
    started = true;
  }

  document.addEventListener('click', start, { once: true });
  document.addEventListener('touchstart', start, { once: true });

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    start();
    audio.muted = !audio.muted;
    btn.classList.toggle('muted', audio.muted);
    btn.title = audio.muted ? 'Nyalakan musik' : 'Matikan musik';
  });
}
