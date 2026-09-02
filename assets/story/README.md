# Kisah Kami — the photo slots

Each beat of the story has a photo slot. To fill one, drop a file in **this
folder** named after the beat's position:

```
assets/story/beat-1.jpg   Perkenalan   (2024)
assets/story/beat-2.jpg   Lamaran      (Januari 2026 — Gunung Kinabalu)
assets/story/beat-3.jpg   Pertunangan  (28 Mac 2026)
assets/story/beat-4.jpg   Pernikahan   (10 Oktober 2026)
```

`.jpg`, `.jpeg`, `.png` and `.webp` all work. Then run `node tools/build.cjs`.
The photo is copied next to the built page and wired to that beat; a beat with
no file keeps its drawn khatam plate, so you can fill them one at a time.

Portrait crops read best (the plate is roughly 3:4), about 1200–1600px on the
long edge, saved at around 80% quality — that keeps each file near 200–300 kB.

**These must be the couple's own photographs**, or ones taken by the wedding
photographer with permission to use. Press and social-media pictures of Syed
Saddiq and Bella are under copyright and cannot be published here.
`candidates.json` / `candidates.html` in this folder are only a record of the
freely-licensed *scenery* found while searching (Gunung Kinabalu, Merdeka 118);
nothing from it is used by the site.
