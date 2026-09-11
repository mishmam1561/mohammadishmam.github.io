function buildCard(album) {
  const link = document.createElement('a');
  link.className = 'album-card';
  link.href = `album.html?album=${encodeURIComponent(album.slug)}`;

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

  (data.albums || []).forEach(album => {
    grid.appendChild(buildCard(album));
  });
}

init();
