# Mohammad Ishmam — Photography Site

A minimal, static photography portfolio. Plain HTML/CSS/JS — no build step, no framework.

## Structure

```
index.html              Homepage (hero + album grid)
album.html               Reusable template for every album page
css/style.css            All styling
js/main.js               Populates the homepage from data/albums.json
js/album.js              Populates an album page + runs the lightbox
data/albums.json         All site content lives here — edit this, not the HTML
images/albums/<slug>/    Photo folders, one per album
```

## Adding a new album

1. Create a folder under `images/albums/` named with a URL-friendly slug, e.g. `images/albums/tokyo-japan/`.
2. Drop your photos in there, named however you like (`01.jpg`, `02.jpg`, ...).
3. Open `data/albums.json` and add an entry to the `"albums"` array:

```json
{
  "slug": "tokyo-japan",
  "title": "Tokyo, Japan",
  "cover": "images/albums/tokyo-japan/01.jpg",
  "photos": [
    "images/albums/tokyo-japan/01.jpg",
    "images/albums/tokyo-japan/02.jpg"
  ]
}
```

That's it — no new HTML file needed. The homepage grid and the album page are both generated from this file.

## Replacing the placeholder photos

The `philadelphia-pennsylvania` and `new-york-city` albums currently use generated placeholder SVGs so you can see the layout working. Swap in your own photos the same way:
- Replace the files in `images/albums/<slug>/`
- Update the paths in `data/albums.json` to match your filenames (and update `.jpg`/`.png` extensions if needed)

Tip: keep photos reasonably sized for the web (long edge ~2000px, JPEG quality ~80) so the site loads fast. Full-resolution originals are usually overkill for browser viewing.

## Editing your name / bio / email

All in `data/albums.json` under `"site"`. No HTML editing required.

## Running locally

Because the site loads `data/albums.json` via `fetch()`, opening `index.html` directly by double-clicking it won't work (browsers block `fetch` on the `file://` protocol). Run a tiny local server instead:

```bash
cd photography-site
python3 -m http.server 8000
```

Then visit `http://localhost:8000` in your browser.

## Deploying to GitHub Pages

1. Create a new GitHub repo (e.g. `photography-site`, or `<your-username>.github.io` if you want it at the root of your GitHub Pages domain).
2. Push this folder's contents to the repo:
   ```bash
   git init
   git add .
   git commit -m "Initial site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
3. In the repo on GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, then pick `main` and `/ (root)`.
4. Your site will be live at `https://<your-username>.github.io/<repo-name>/` (or just `https://<your-username>.github.io/` if you named the repo `<your-username>.github.io`).

## Notes

- The lightbox supports click, arrow keys, and Escape to close.
- Colors and fonts are all defined as CSS variables at the top of `css/style.css` if you want to adjust the emerald/burgundy accents later.
