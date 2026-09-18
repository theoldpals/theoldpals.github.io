# The Old Pals — Menu (free, permanent, no Canva subscription)

Live URL (this is what the QR points to):

    https://theoldpals.github.io

---

## Why this setup

The old QR pointed at `https://canva.link/the-old-pals-menu`, which stopped
working when the Canva subscription lapsed. GitHub Pages is free forever, has
no plan to lapse, and serves the page from a URL you control — so the printed
QR never has to change again, no matter how many times you update the menu.

---

## One-time setup (about 10 minutes)

1. **Create the account** — go to github.com and sign up.
   Username must be exactly: `theoldpals`
   (If it's taken, pick another one and tell me — the QR has to be regenerated.)

2. **Create the repository**
   - Click **+** (top right) → **New repository**
   - Repository name must be exactly: `theoldpals.github.io`
   - Set it to **Public**
   - Tick **Add a README file**
   - Click **Create repository**

3. **Upload these files**
   - On the repo page: **Add file** → **Upload files**
   - Drag in `index.html` from this folder
   - Click **Commit changes**

4. **Upload the menu images**
   - **Add file** → **Create new file**
   - Type `images/.gitkeep` in the name box, then **Commit changes**
     (this creates the `images` folder)
   - Open the `images` folder → **Add file** → **Upload files**
   - Drag in your menu pages named `menu-1.jpg`, `menu-2.jpg`, `menu-3.jpg` …
   - **Commit changes**

5. **Turn on GitHub Pages**
   - **Settings** → **Pages** (left sidebar)
   - Source: **Deploy from a branch**
   - Branch: **main**, folder: **/ (root)** → **Save**
   - Wait 1–2 minutes, then open https://theoldpals.github.io

6. **Scan the QR on the new card to confirm.**

---

## How to update the menu from now on

This is the whole workflow — no code, no design tool required:

1. Edit the menu in Canva as usual (free plan is fine for editing).
2. **Share** → **Download** → **JPG** → download all pages.
3. Rename them `menu-1.jpg`, `menu-2.jpg`, `menu-3.jpg` … in order.
4. Go to your repo → `images` folder → **Add file** → **Upload files**
   → drag them in → **Commit changes**.

Files with the same name overwrite the old ones. The page picks up the change
within a minute. **The QR code never changes.**

To *add* a page: upload `menu-9.jpg` — it appears automatically.
To *remove* a page: delete that file, and renumber the ones after it so there
is no gap (the page stops scanning after two missing numbers in a row).

`.jpg`, `.jpeg`, `.png` and `.webp` all work.

---

## Notes

- Keep each image under about 1 MB so it loads fast on phone data.
  In Canva, JPG at the default quality is usually fine.
- Portrait images work best — customers hold the phone upright.
- Tapping an image opens it full screen so they can pinch to zoom.
- The repo is public, which is required for free GitHub Pages. Only put the
  menu in it — nothing internal, no price lists you don't want public.

## Files in this folder

| File | What it is |
|---|---|
| `index.html` | The menu page itself. Upload once, never touch again. |
| `images/` | Where the menu images go. |
| `QR-theoldpals.png` | The new QR, 1640px — for reprinting or stickers. |
| `QR-theoldpals.svg` | Same QR as vector — for any print size, no blur. |
