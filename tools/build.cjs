/* Build the concept sheet.
   src/page.html + src/concepts/<id>.css  ->  design/<id>/index.html
   src/chooser.html                       ->  index.html
   Tokens: {{inline:path}} {{style}} {{fonts}} {{themeColor}} {{arabicClass}}
           {{heroLayers}} {{config}} {{runtime}} {{khatam:size}} {{arch}}       */
const fs = require('fs'), path = require('path');
const P = require('./patterns.cjs');
const { concepts } = require('../src/concepts.cjs');
const root = path.resolve(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

function geometry(html) {
  html = html.replace(/\{\{khatam(?::(\d+))?\}\}/g, (_, sz) => P.khatam(sz ? +sz : undefined));
  // {{flower:name}} -> the CC0 line-art SVG from assets/flowers, cleaned so it
  // takes its colour from the page and every path can be traced.
  html = html.replace(/\{\{flower:([a-z0-9-]+)(?::([-\d. ]+))?\}\}/g, (_, name, viewBox) => {
    let d = read(`assets/flowers/${name}.svg`);
    d = d.replace(/<\?xml[\s\S]*?\?>/g, '').replace(/<!DOCTYPE[\s\S]*?>/g, '');
    d = d.replace(/<metadata>[\s\S]*?<\/metadata>/g, '');
    d = d.replace(/<!--[\s\S]*?-->/g, '');
    d = d.replace(/\s(width|height)="[^"]*"/g, '');          // let CSS size it
    d = d.replace(/stroke="#[0-9a-fA-F]{3,6}"/g, 'stroke="currentColor"');
    if (viewBox) d = d.replace(/viewBox="[^"]*"/, `viewBox="${viewBox.trim()}"`);
    d = d.replace('<svg', '<svg class="bloomline" aria-hidden="true" focusable="false"');
    return d.trim();
  });
  html = html.replace(/\{\{arch(?::([\d.]+))?\}\}/g, (_, r) => P.archPath(r ? +r : undefined));
  return html;
}
function inline(html) {
  return html.replace(/\{\{inline:([^}]+)\}\}/g, (_, f) => {
    const fp = path.join(root, f.trim());
    if (!fs.existsSync(fp)) throw new Error('missing inline target: ' + f);
    return geometry(read(f.trim()));
  });
}

/* Only the layers a concept declares are emitted, so no design carries markup
   for an effect it does not use. */
function heroLayers(c) {
  const L = c.layers || {}, out = [];
  if (L.light)  out.push('    <div class="lightwrap" aria-hidden="true"><canvas data-light></canvas></div>');
  if (L.spot)   out.push('    <div class="spot" data-spot aria-hidden="true"></div>');
  if (L.shadow) out.push('    <div class="cast" data-cast aria-hidden="true"><span></span></div>');
  if (L.nacre)  out.push('    <div class="nacre" data-nacre aria-hidden="true"></div>');
  if (L.petals) out.push('    <canvas class="petals" data-petals aria-hidden="true"></canvas>');
  return out.join('\n');
}
function runtime(c) {
  const r = c.runtime || {};
  return Object.keys(r).map((k) => `window.${k} = ${JSON.stringify(r[k])};`).join('\n');
}

/* ----------------------------------------------------------- the photo slots */
/* Drop a photograph in as assets/story/beat-1.jpg (…-2, -3, -4, in the order
   the beats appear in Kisah Kami) and it is copied next to the built page and
   wired to that beat automatically. Nothing to edit, no rebuild of anything
   else. .jpg, .jpeg, .png and .webp are all recognised. With no file, the beat
   keeps its drawn khatam plate. */
const PHOTO_EXT = ['jpg', 'jpeg', 'png', 'webp'];
function storyPhotos() {
  const dir = path.join(root, 'assets/story');
  const found = [];
  if (!fs.existsSync(dir)) return found;
  for (let i = 1; i <= 8; i++) {
    for (const ext of PHOTO_EXT) {
      const rel = `assets/story/beat-${i}.${ext}`;
      if (fs.existsSync(path.join(root, rel))) { found.push({ n: i, rel }); break; }
    }
  }
  return found;
}
function photoCss(photos) {
  if (!photos.length) return '';
  return '\n:root{' + photos.map((p) => `--img-${p.n}:url(${p.rel})`).join(';') + '}\n';
}
/* The background music travels with the page the same way. */
const AUDIO_SRC = 'assets/audio/bgm.mp3';
function hasAudio() { return fs.existsSync(path.join(root, AUDIO_SRC)); }
function copyAudio(destDir) {
  if (!hasAudio()) return;
  fs.copyFileSync(path.join(root, AUDIO_SRC), path.join(destDir, 'bgm.mp3'));
}
function copyPhotos(photos, destDir) {
  for (const p of photos) {
    const to = path.join(destDir, p.rel);
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.copyFileSync(path.join(root, p.rel), to);
  }
}

let built = 0;
for (const c of concepts) {
  /* A concept owns its own markup and its own stylesheet. Nothing about how a
     design looks is shared — only the machinery underneath it. */
  const ownPage = `src/concepts/${c.id}/page.html`;
  const ownCss  = `src/concepts/${c.id}/style.css`;
  if (!fs.existsSync(path.join(root, ownPage)) || !fs.existsSync(path.join(root, ownCss))) {
    console.log(`skip  ${c.id} (not rebuilt yet)`); continue;
  }
  const page = read(ownPage);
  const cssPath = ownCss;
  const photos = storyPhotos();
  let html = page
    .replace(/\{\{style\}\}/g, () => geometry(read('src/reset.css') + '\n' + read(cssPath)) + photoCss(photos))
    .replace(/\{\{fonts\}\}/g, c.fonts)
    .replace(/\{\{themeColor\}\}/g, c.themeColor)
    .replace(/\{\{arabicClass\}\}/g, c.arabicClass)
    .replace(/\{\{heroLayers\}\}/g, heroLayers(c))
    .replace(/\{\{config\}\}/g, JSON.stringify({
      design: c.id, countdownTo: '2026-10-10T10:00:00+08:00', endpoint: '',
      audio: hasAudio() ? 'bgm.mp3' : '', audioOnOpen: true
    }, null, 0))
    .replace(/\{\{runtime\}\}/g, runtime(c));
  html = geometry(inline(html));
  const left = html.match(/\{\{[^}]+\}\}/g);
  if (left) throw new Error(`${c.id}: unresolved ${[...new Set(left)].join(', ')}`);
  const out = path.join(root, 'design', c.id, 'index.html');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
  copyPhotos(photos, path.dirname(out));
  copyAudio(path.dirname(out));
  console.log(`built design/${c.id}/index.html  ${(html.length / 1024).toFixed(1)} kB` +
    (photos.length ? `  + ${photos.length} photo${photos.length > 1 ? 's' : ''}` : ''));
  built++;
}

if (fs.existsSync(path.join(root, 'src/chooser.html'))) {
  let ch = geometry(inline(read('src/chooser.html')));
  ch = ch.replace(/\{\{concepts\}\}/g, JSON.stringify(concepts));
  fs.writeFileSync(path.join(root, 'index.html'), ch);
  console.log(`built index.html (chooser)  ${(ch.length / 1024).toFixed(1)} kB`);
}
if (!built) console.log('nothing built');
