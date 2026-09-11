async function init() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('album');

  const res = await fetch('data/albums.json');
  const data = await res.json();

  document.getElementById('year').textContent = new Date().getFullYear();

  const album = (data.albums || []).find(a => a.slug === slug);

  if (!album) {
    document.getElementById('album-title').textContent = 'Album not found';
    document.getElementById('page-title').textContent = 'Album not found — Photography';
    return;
  }

  document.getElementById('album-title').textContent = album.title;
  document.getElementById('page-title').textContent = `${album.title} — Photography`;

  const stack = document.getElementById('photo-stack');
  stack.innerHTML = '';

  const photos = album.photos || [];

  photos.forEach((src, index) => {
    const btn = document.createElement('button');
    btn.className = 'photo-item';
    btn.type = 'button';
    btn.setAttribute('aria-label', `Open photo ${index + 1} of ${photos.length}`);

    const img = document.createElement('img');
    img.src = src;
    img.alt = `${album.title} — photo ${index + 1}`;
    img.loading = 'lazy';

    btn.appendChild(img);
    btn.addEventListener('click', () => openLightbox(photos, index, album.title));
    stack.appendChild(btn);
  });

  setupLightboxControls();
}

let currentPhotos = [];
let currentIndex = 0;
let currentAlbumTitle = '';

function openLightbox(photos, index, albumTitle) {
  currentPhotos = photos;
  currentIndex = index;
  currentAlbumTitle = albumTitle;
  renderLightboxImage();

  const lightbox = document.getElementById('lightbox');
  lightbox.classList.add('is-open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function renderLightboxImage() {
  const img = document.getElementById('lightbox-image');
  img.src = currentPhotos[currentIndex];
  img.alt = `${currentAlbumTitle} — photo ${currentIndex + 1} of ${currentPhotos.length}`;
}

function showNext() {
  if (!currentPhotos.length) return;
  currentIndex = (currentIndex + 1) % currentPhotos.length;
  renderLightboxImage();
}

function showPrev() {
  if (!currentPhotos.length) return;
  currentIndex = (currentIndex - 1 + currentPhotos.length) % currentPhotos.length;
  renderLightboxImage();
}

function setupLightboxControls() {
  document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
  document.getElementById('lightbox-next').addEventListener('click', showNext);
  document.getElementById('lightbox-prev').addEventListener('click', showPrev);

  const lightbox = document.getElementById('lightbox');
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });
}

init();
