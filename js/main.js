async function init() {
  const res = await fetch('data/albums.json');
  const data = await res.json();

  document.getElementById('year').textContent = new Date().getFullYear();

  if (data.site) {
    document.getElementById('hero-tagline').textContent = data.site.tagline || '';
    document.getElementById('hero-bio').textContent = data.site.bio || '';
    const mail = data.site.email ? `mailto:${data.site.email}` : '#';
    document.getElementById('header-email').href = mail;
    document.getElementById('footer-email').href = mail;
    document.title = `${data.site.name} — Photography`;
  }

  const grid = document.getElementById('album-grid');
  grid.innerHTML = '';

  (data.albums || []).forEach(album => {
    const link = document.createElement('a');
    link.className = 'album-card';
    link.href = `album.html?album=${encodeURIComponent(album.slug)}`;

    const thumbWrap = document.createElement('div');
    thumbWrap.className = 'thumb-wrap';

    const img = document.createElement('img');
    img.src = album.cover;
    img.alt = album.title;
    img.loading = 'lazy';

    thumbWrap.appendChild(img);

    const name = document.createElement('span');
    name.className = 'album-name';
    name.textContent = album.title;

    const count = document.createElement('span');
    count.className = 'photo-count';
    const n = (album.photos || []).length;
    count.textContent = `${n} photo${n === 1 ? '' : 's'}`;

    link.appendChild(thumbWrap);
    link.appendChild(name);
    link.appendChild(count);
    grid.appendChild(link);
  });
}

init();
