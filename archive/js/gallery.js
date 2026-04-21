export function createGalleryState(photos) {
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

export function initGallery(photos) {
  const grid     = document.getElementById('gallery-grid');
  const lightbox = document.getElementById('lightbox');
  const lbImg    = document.getElementById('lb-img');
  const state    = createGalleryState(photos);

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
