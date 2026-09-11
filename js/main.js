function getOrientation(src) {
  return new Promise(resolve => {
    const probe = new Image();
    probe.onload = () => resolve(probe.naturalHeight > probe.naturalWidth ? 'portrait' : 'landscape');
    probe.onerror = () => resolve('landscape');
    probe.src = src;
  });
}

function buildCard(album) {
  const link = document.createElement('a');
  link.className = 'album-card';
  link.href = `album.html?album=${encodeURIComponent(album.slug)}`;

  const thumbWrap = document.createElement('div');
  thumbWrap.className = 'thumb-wrap';
  if (album._orientation === 'portrait') {
    thumbWrap.classList.add('is-portrait');
  }

  const img = document.createElement('img');
  img.src = album.cover;
  img.alt = album.title;
  img.loading = 'lazy';
  thumbWrap.appendChild(img);

  const n = (album.photos || []).length;
  const badge = document.createElement('span');
  badge.className = 'count-badge';
  badge.textContent = `${n} photo${n === 1 ? '' : 's'}`;
  thumbWrap.appendChild(badge);

  const name = document.createElement('span');
  name.className = 'album-name';
  name.textContent = album.title;

  link.appendChild(thumbWrap);
  link.appendChild(name);
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
  const orientations = await Promise.all(albums.map(a => getOrientation(a.cover)));
  albums.forEach((a, i) => { a._orientation = orientations[i]; });

  const portraits = albums.filter(a => a._orientation === 'portrait');
  const landscapes = albums.filter(a => a._orientation === 'landscape');

  portraits.forEach(album => grid.appendChild(buildCard(album)));

  if (portraits.length && landscapes.length) {
    const rowBreak = document.createElement('div');
    rowBreak.style.flexBasis = '100%';
    rowBreak.style.height = '0';
    grid.appendChild(rowBreak);
  }

  landscapes.forEach(album => grid.appendChild(buildCard(album)));
}

init();
