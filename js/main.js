function getRatio(src) {
  return new Promise(resolve => {
    const probe = new Image();
    probe.onload = () => {
      const r = probe.naturalWidth / probe.naturalHeight;
      resolve(isFinite(r) && r > 0 ? r : 1);
    };
    probe.onerror = () => resolve(1);
    probe.src = src;
  });
}

function buildCard(album) {
  const link = document.createElement('a');
  link.className = 'album-card';
  link.href = `album.html?album=${encodeURIComponent(album.slug)}`;

  const MIN_RATIO = 0.72;
  const MAX_RATIO = 1.5;
  const clamped = Math.min(MAX_RATIO, Math.max(MIN_RATIO, album._ratio || 1));
  link.style.aspectRatio = String(clamped);

  const img = document.createElement('img');
  img.src = album.cover;
  img.alt = album.title;
  img.loading = 'lazy';
  link.appendChild(img);

  const overlay = document.createElement('div');
  overlay.className = 'title-overlay';

  const name = document.createElement('span');
  name.className = 'name';
  name.textContent = album.title;
  overlay.appendChild(name);

  const n = (album.photos || []).length;
  const count = document.createElement('span');
  count.className = 'count';
  count.textContent = `${n} photo${n === 1 ? '' : 's'}`;
  overlay.appendChild(count);

  link.appendChild(overlay);
  return link;
}

async function init() {
  const res = await fetch('data/albums.json');
  const data = await res.json();

  document.getElementById('year').textContent = new Date().getFullYear();

  if (data.site) {
    document.getElementById('hero-bio').textContent = data.site.bio || '';
    const mail = data.site.email ? `mailto:${data.site.email}` : '#';
    document.getElementById('header-email').href = mail;
    document.getElementById('footer-email').href = mail;
    document.title = `${data.site.name} — Photography`;
  }

  const grid = document.getElementById('album-grid');
  grid.innerHTML = '';

  const albums = data.albums || [];
  const ratios = await Promise.all(albums.map(a => getRatio(a.cover)));
  albums.forEach((a, i) => { a._ratio = ratios[i]; });

  albums.forEach(album => {
    grid.appendChild(buildCard(album));
  });
}

init();
